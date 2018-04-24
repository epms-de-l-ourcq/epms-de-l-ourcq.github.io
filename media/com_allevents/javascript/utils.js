/**
 * Sous IE8 et inférieur, l'instruction  document.getElementById('un_ID').addEvent génère une erreur "Method not found"
 * 
 * Sous ces versions, il faut utiliser $ et non pas document.getElementById comme mentionné dans le post suivant 
 *     http://mootools-users.660466.n2.nabble.com/Moo-IE7-problem-Object-doesn-t-support-this-property-or-method-td4616204.html
 *     
 * La fonction getElementById ci-dessous doit donc être utillisée à la place de document.getElementByID afin de gérer ce problème IE    
 *     
 * @param sID     ID d'un élément de la page
 * @return        objet de type HTMLxxxxElement (p.e. HTMLSpanElement si sID réfère à un span)
 */
function getElementById(sID) {
   if (document.getElementById(sID)) {	  
      //if (window.ie==false) {
	  if (navigator.appName != 'Microsoft Internet Explorer') {
         return document.getElementById(sID);
      } else {
         // C'est l'Immonde Explorateur, capable de détecter document.getElementByID(...) mais pas foutu de gérer 
         // document.getElementByID(...).addEvent sous IE8 et inférieur.  Il faut pour ces versions-là utiliser $(...)
         return $(sID);
      } // if (window.ie==false)
   } else {
      return false;
   } // if (document.getElementById(sID))	    
} // function getElementById(sID)
/* 
 * Masque une DIV et en affiche une autre (principe du toggle).
 */
function se_toggle(sDiv1, sDiv2) {

  var div1;
   if (div1 = getElementById('se_div_'+sDiv1)) {
      var img1 = getElementById('se_img_'+sDiv1);
      var div2 = getElementById('se_div_'+sDiv2);

      if (div1.style.display=='none') {
         div1.style.display='inline';
         div2.style.display='none';
         img1.src = se_img_collapse;
      } else {
         div1.style.display='none';
         div2.style.display='inline';
         img1.src = se_img_expand;
      }
      return true;
   } else {
      return false;
   }
} // function se_toggle(sDiv1, sDiv2)
/*
 * Cette fonction va permettre de "d�plier/fermer" une DIV.   Ainsi, dans l'�cran de cr�ation d'un �v�nement, certaines rubriques sont par d�faut "ferm�es".
 * C'est le cas de la zone Commentaire qui est une zone optionnelle.   Donc, afin de ne pas surcharger l'�cran, cette zone ne sera d�pli�e que si l'utilisateur
 * le souhaite; ceci apr�s avoir cliqu� sur un bouton "+"
 */
function expand(sName, sExpand, sCollapse) {

   var div;	
   if (div = document.getElementById('se_div'+sName)) {
      var img = document.getElementById('se_imgExpand'+sName);

      if (div.style.display=='none') {
         if (img!=undefined) img.src=sCollapse;
         div.style.display='inline';
      } else {
         if (img!=undefined) img.src=sExpand;
         div.style.display='none';
      }
      return true;
   } else {
      return false;
   }
}
/* 
 * Cette fonction va charger l'image dont l'URL a �t� encod�e.
 * 
 * Le premier param�tre est le nom de l'image (c�d le nom d�fini dans l'attribut ID du tag IMG) tandis que le second param�tre le nom du champs INPUT (c�d l'ID) o� 
 * se trouve l'adresse URL de l'image.
 * 
 * example:
 * 
 *    <img id="imgVignette" [...] />
 *    <input id="photo" onchange="loadimg('imgVignette','photo');"  [...] />
 */
function loadimg(sImgName, sLocation) {
  var img;	
  if (img = getElementById(sImgName) ) img.setAttribute("src", getElementById(sLocation).value);
}
/*
 * Cette fonction est p.e. utilis�e dans l'�cran backend de gestion des param�tres.
 * 
 * Permet d'afficher / cacher un "sous-�cran".
 */
function showframe(sDivName) {

   if ((sDivName != "") && ("se_frm_"+sDivName != se_old_active_frame)) {

      sURLName = "se_url_"+sDivName;
      sDivName = "se_frm_"+sDivName;

      var div = null;

      // Masque la pr�c�dente frame et affiche la nouvelle

     if (!(se_old_active_frame=='')) div = getElementById(se_old_active_frame);

     if (div != null) {
        div.style.display="none";

        div = document.getElementById(sDivName);
        if (div != null) div.style.display="inline";
     }

     se_old_active_frame = sDivName;

     // D�sactive la pr�c�dente URL et active la nouvelle

     div = document.getElementById(se_old_active_url);

     if (div != null) {

        div.className="inactive";

        div = document.getElementById(sURLName);
        if (div != null) div.className="active";

     }

     se_old_active_url   = sURLName;

   } // if ((sDivName != "") && ("se_frm_"+sDivName != se_old_active_frame))

} // function showframe(sDivName)
/*
 * La fonction load_image est utilis�e dans la fonction php DrawFields qui se trouve dans Utils.php.   L'objectif est de visualiser
 * l'image qui a �t� cliqu�e depuis une liste d�roulante.
 * 
 * Trois param�tres :
 * 
 *    Le folder o� se situent les images
 *    Le nom de la combobox sur laquelle l'utilisateur a cliqu�
 *    Le nom de l'image <img> afin de pouvoir en modifier le src
 */
function load_image(sFolder, sCbx, sImg) {

   var cbx = document.getElementById(sCbx);
   var ndx = cbx.selectedIndex;

   var imgsrc = '';

   if (ndx!=0) imgsrc = cbx.options[ndx].value;

   if (imgsrc!='') {

      img = document.getElementById(sImg);
      img.src = sFolder + imgsrc;

   } else {

      img.src = '';
   }

} // function load_image(sFolder, sCbx, sImg)
function to_lower(str) { return str.toLowerCase(); }
/* 
 * Retrouve un param�tre depuis le querystring
 * 
 * http://www.bloggingdeveloper.com/post/JavaScript-QueryString-ParseGet-QueryString-with-Client-Side-JavaScript.aspx
 * 
 * Exemple : alert(getQuerystring('debug'));
 */
function getQuerystring(key, default_) {
  if (default_==null) default_="";
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
} // function getQuerystring(key, default_) {

function replaceQueryString(url,param,value) {
    var re = new RegExp("([?|&])" + param + "=.*?(&|$)","i");
    if (url.match(re))
        return url.replace(re,'$1' + param + "=" + value + '$2');
    else
        return url + '&' + param + "=" + value;
}

/*
 * Gestionnaire g�n�rique pour afficher un message d'erreur
 */
function show_failure(sTitle, sResponse) {

   // Affichage de l'erreur d�s lors que le param�tre d'activation des erreurs est initialis�
	
   bDisplay = ( (getQuerystring('showerror',-1)>0) ? true : false);
   if (!(bDisplay)) bDisplay = ( ((typeof(se_ShowError)!='undefined') && (se_ShowError>0)) ? true : false); 

   if (bDisplay===true) {

      j = sTitle.length + 10;
      var str = "";
      for (var i = 0; i < j; i++){ str += "-"; }

      if (sTitle!='') { sTitle = str+'\n- '+sTitle+' -\n'+str+'\n\n'; }

      if ((sResponse!=undefined) && (sResponse.responseText!=undefined)) { sMsg = sResponse.responseText; } else { sMsg = sResponse; }

      alert('======> ERROR <======\n' + sTitle + sMsg);
      
   }

   return true;

} // function show_failure(response)
/* 
 * Utilis� dans ImageGallery.js
 * 
 * Detecting Internet Explorer More Effectively
 * http://msdn.microsoft.com/en-us/library/ms537509%28VS.85%29.aspx
 * 
 * Returns the version of Internet Explorer or a -1 (indicating the use of another browser).
 */
function getInternetExplorerVersion() {

   var rv = -1; // Return value assumes failure.

   if (navigator.appName == 'Microsoft Internet Explorer') {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
   } //if (navigator.appName == 'Microsoft Internet Explorer')

   return rv;

} // function getInternetExplorerVersion()