/*
 * La fonction ajax demande deux param�tres : la t�che qui doit �tre ex�cut�e et le ID du container (div / span) qui doit �tre mis-�-jour avec le code HTML retourn� par le controlleur
 * apr�s l'ex�cution de la t�che.
 */
//window.addEvent('domready', function() {
//});


/*
 * Cette fonction peut remplacer, � terme, se_ajax.   Il faut juste faire le travail de r��criture
 * 
 * Ajaxify demande quelques param�tres :
 * 
 *    * sTask        = La t�che a ex�cuter
 *    * sParams      = Une liste de param�tres (optionel); cette liste sera ajout�e au querystring
 *    * sDivname     = Le nom de la DIV qui sera mise-�-jour avec le HTML retourn� par le contr�lleur
 *    * bAsync       = Bool�en.  True par d�faut.   Indique si la requ�te Ajax est synchrone ou pas
 *    * fctOnSuccess = Si indiqu�, reprend un code JS valide (p.e. "alert('DONE');").  Ce code sera ex�cut� lorsque la requ�te Ajax est achev�e avec succ�s
 *    * msg          = Si indiqu�, ce message de confirmation sera affich�
 *    * bLoadingMode = Par d�faut 0.   Affiche l'ic�ne ajax loading en surimpression de la DIV en cours de rafra�chissement (0) ou uniquement
 *                     l'ic�ne (1).   Mis sur 1 lors du rafra�chissement des listes d�roulantes ce qui provoque un effet "flash" pour bien
 *                     mettre en �vidence quelle est la liste d�roulante qui a �t� mise-�-jour. 
 *    
 * Exemples :
 *  
 * 1) Ajaxify ('admin_ajax_accesspublic', '&cid[]=28&screen=events', 'se_ShowTable');
 *    
 *    Cet appel va ex�cuter la t�che admin_ajax_accesspublic.   L'URL sera construite en ajoutant le param�tre &cid[]=28&screen=events.
 *    L'URL va ressembler � "http://localhost/administrator/index2.php?option=com_allevents&task=admin_ajax_accesspublic&cid[]=28&screen=events&598625e08a54ef7b6faf315e82ba843e=1".
 *    
 *    Le code HTML retourn� par le contr�lleur sera inject� dans la DIV nomm�e se_ShowTable.
 *    
 * 2) Ajaxify ("ajax_enrol", "&enrolment_id=364&event_id=76&contact_id=0&user_id=62&enroltype=0", "se_ajax_participants", true, "if (document.getElementById('se_enrolment_id').value) form.enrolment_id.value=document.getElementById('se_enrolment_id').value;");
 * 
 *    L'utilisateur 62 (admin) a cliqu� sur sa participation � l'�v�nement 76 pour la faire passer au statut "Je viendrais".
 *    Une fois l'inscription modifi�e, la div se_ajax_participants sera mise-�-jour avec la liste des participants.
 *    La requ�te Ajax est asynchrone.
 *    Une fois la requ�te successfull, la ligne de code "if (document.getElementById('se_enrolment_id').value) form.enrolment_id.value=document.getElementById('se_enrolment_id').value;" 
 *    devra �tre ex�cut�e dans le onSuccess de la requ�te Ajax
 *    
 */
function Ajaxify(sTask, sParams, sDivName, bAsync, fctOnSuccess, msg, bLoadingMode) {

   // La t�che est un param�tre obligatoire
   var bContinue = (((sTask==null) || (typeof(sTask)==='undefined') || (sTask==='')) ? 0 : 1);
   
   // Car sinon la requ�te ajax �chouera.
   if (sParams.indexOf('&amp;')>-1) sParams=sParams.replace(/&amp;/g,'&');
      
   // DivName est le nom de la DIV qui doit �tre mise-�-jour avec les donn�es r�cup�r�es via la t�che ajax   
   if ((sDivName==null) || (typeof(sDivName)==='undefined') || (sDivName==='')) sDivName='se_ShowTable';

   // bAsync indique si la requ�te Ajax doit �tre synchrone ou pas.   Par d�faut, asynchrone
   if ((bAsync!=0) || (bAsync!=false)) bAsync=true;
 
   // fctOnSuccess
   if ((fctOnSuccess==null) || (typeof(fctOnSuccess)==='undefined')) fctOnSuccess='';
   
   if ((msg==null) || (typeof(msg)==='undefined')) msg='';
   if ((bLoadingMode==null) || (typeof(bLoadingMode)==='undefined')) bLoadingMode=0;

//alert("ajax.js::Ajaxify() - sTask="+sTask+"\nsParams="+sParams+"\nsDivName="+sDivName+"\nbAsync="+bAsync+"\nfctOnSuccess="+fctOnSuccess);

   // Si le param�tre msg est non vide, demande une confirmation.   Par exemple "Etes-vous s�r de vouloir ... ?"

   if ((bContinue==1) && (msg!='')) bContinue = confirm(msg);
	
   if (bContinue==1) {	
      	   
      sTask = "&task="+sTask;
 
      // DivName est le nom de la DIV qui doit �tre mise-�-jour avec les donn�es r�cup�r�es via la t�che ajax

      //if (sDivName=="") sDivName = "se_ShowTable";
	  
      // Affiche l'image de chargement qui est d�finie dans la classe ajaxLoading

      if (obj = document.getElementById(sDivName)) {

    	  obj.innerHTML =  "<span class='ajaxLoading'>&#160;</span>"+ ((bLoadingMode==0) ? getElementById(sDivName).innerHTML : "");
          
         // Frontend ou backend ?
		  
		 var sSite = (((typeof se_UserIsSeetingSite !== 'undefined') && (se_UserIsSeetingSite=="backend")) ? "administrator/" : "");

         // Debug ?
		   
	     var dbg  = ((getQuerystring('debug',-1)!=-1) ? "&debug="+getQuerystring('debug') : "");
	      
   	     // Showerror ?

	     var showerr  = ((getQuerystring('showerror',-1)!=-1) ? "&showerror="+getQuerystring('showerror') : "");
		  
	     if ((typeof se_token !== 'undefined')  && (sParams.indexOf('&'+se_token)<0)) sParams += '&'+se_token+'=1';
	     
	     if ((typeof se_Itemid !== 'undefined') && (sParams.indexOf('&'+se_token)<0)) sParams += '&Itemid='+se_Itemid;
	    
//         if (typeof se_Itemid !== 'undefined') sParams += '&Itemid='+se_Itemid;
	     
	     // ----------------------------------------------------------------------------------------------------------------
	     //
	     // se_form_event_baseurl est une variable JS créée par AllEvents et existe.   Pourtant, il se peut qu'une erreur JS 
	     // provoquée par p.e. un module tiers interfère et amène au browser à croire que la variable n'existe pas.
	     //
	     // Dans ce cas, et ce cas seulement, la variable est "recréée" ci-dessous.   Cette ligne est donc présente pour
	     // contourner un soucis.
         //if (typeof se_form_event_baseurl=='undefined') var se_form_event_baseurl=window.location.hostname+'/';	     
         // ----------------------------------------------------------------------------------------------------------------
         
	     var url = se_form_event_baseurl+sSite+"index2.php?option=com_allevents&tmpl=component"+sTask+sParams+dbg+showerr;
//alert('ajax.js::Ajaxify()\n\n'+url);
	     if (getQuerystring('debug',0)>=10) alert('ajax.js::Ajaxify()\n\n'+url);

         var options = {
            async     : bAsync,
            update    : $(sDivName), //getElementById(sDivName),
            encoding  : 'uft-8',
		    onFailure : function(response) { show_failure(url, response);},
            // La requête ajax a reçu une réponse valide de la part du serveur web
		    onSuccess : function(response) { if (fctOnSuccess!='') eval(fctOnSuccess); },
            // La mise-à-jour est terminée
	        //onComplete: function(response) { alert('onComplete '+$(sDivName).innerHTML); }		    	
         }; // var options

	     var objRequest= new Ajax(url, options);
         objRequest.request();
		 
	  } else { // if (getElementById(sDivName)!= undefined) {
		  
	     //show_failure("Ajaxify", "Parameter DivName not specified and the default DIV '"+ sDivName + "' doesn's exists.");
	     
      } // if (document.getElementById(sDivName)!= undefined) {	  
	
   } else { // if (sTask!="")

	   if (sTask=="") show_failure("Ajaxify", "Parameter Task is mandatory");
      
   } // if (bContinue==1)	
	
   return;

} // function Ajaxify(sTask, sParams, sDivName)
/*
 * Cette fonction va permettre de mettre � jour une combobox sur base de ce qui est encod� dans une autre; li�e.
 * 
 * Par exemple : lorsqu'on change de pays, il faut mettre � jour la liste des villes.
 *    
 * Trois param�tres :
 * 
 *    master  : Master est p.e. agenda_id soit le nom de la combobox reprennant les sports
 *    child   : Child, p.e. public_id, doit �tre initialis� avec le nom de la liste d�roulante qu'il faut mettre � jour.
 *    tbl     : Uniquement pour le plugin AllEvents - Formulaires : nom du composant de gestion de formulaires (p.e. ckforms) 
 *    
 */
function ajxRefreshCombo(master, child, tbl) {

var cbxMaster = null;
var cbxChild  = null;
var bContinue = false;

   bContinue = false;

   // Retrouve la valeur du master.

   if (cbxMaster=document.getElementById(master)) {

      if (cbxMaster==null) {

         show_failure('Error in ajax.js::ajxRefreshCombo','The master combobox '+master+' doesn\'t exists in the form.  Please verify the call to the ajxRefreshCombo function in the source code of the form.');
      
      } else {
	   	   
         cbxChild=document.getElementById(child);
      
         // Il se pourrait bien que la liste d�roulante d�pendante n'est pas affich�e.   Ainsi, si on change de type d'agenda, il faut
         // rafra�chir la liste des localisations puisque les localisations peuvent �tre d�pendantes du type d'agenda.  Toutefois, la liste
         // d�roulante "Localisation" pourrait ne pas �tre affich�e.   Dans ce cas, on ne fait rien.
      
         bContinue = (cbxChild!=null);
      
      } // if (cbxMaster==null)
   
      if (bContinue==true) {

         var sParams = "&field="+child+"&master="+master+"&id="+cbxMaster.value;
//alert('ajxRefreshCombo '+master+'___'+child+'---'+sParams);
         if (typeof(se_view)!='undefined') sParams+= '&view='+se_view;
      
         // Ajout d'un param�tre suppl�mentaire qui est la liste des ID des options � s�lectionner par d�faut dans la liste d�roulante qui sera mise-�-jour par la fonction Ajax.
         // Ce param�tre est n�cessaire pour le pluging plg_allevents_form

         default_id = getElementById('form_comp_fields_id');
         if ((default_id!=false) && (default_id!=null)) sParams += '&default_id='+default_id.value;

         // Ajout d'un param�tre suppl�mentaire qui est le nom de la table.   Ce param�tre est n�cessaire pour le pluging plg_allevents_form

         if (tbl!=null) sParams += "&tbl="+tbl;
      
         //(sTask, sParams, sDivName, bAsync, fctOnSuccess, msg, bLoadingMode)
         Ajaxify('ajax_refresh_combo', sParams, child, null, null, null, 1);
      
      } // if (bContinue==true)
      
   } // if (cbxMaster =document.getElementById(master))

} // function ajxRefreshCombo(master, child)
/*
 * Cette fonction est appel�e depuis le backend, depuis les �crans type "Liste de ..." et permet de changer plusieurs propri�t�s comme
 *    - le niveau d'acc�s (public -> enregistr� -> sp�cial -> public)
 *    - hot / unhot
 *    - publi� / d�publi�
 *    - ...
 */
function update_ajax(sTask, sDivName, sParams, wLimit, wLimitstart) {

   if (typeof(se_view)!=='undefined') {
   //if (se_view!=undefined) {

      if ((sDivName==undefined) || (sDivName==null) || (sDivName=='')) sDivName = 'se_ShowTable';

      if (getElementById(sDivName)) {

         // Lorsqu'on clique p.e. sur l'ic�ne pour d�publier un record, il faut faire une boucle afin de scanner les checkboxes du formulaire.  La checkbox qui est coch�e est celle correspond
         // au record � mettre � jour

         sName = '';
         sIDs  = '';

         j=document.adminForm.elements.length;

         for(i=0; i<j; i++) {

             obj = document.adminForm.elements[i];

             if ((obj.name=='cid[]') && (obj.checked==true)) {

                sName =obj.name;
                
                // Partie 1 : Dans un formulaire de type Liste (des �v�nements, des sections, ...), l'objet est une checkbox ==> il faut qu'elle soit coch�e.
                // Partie 2 : Dans le panneau de contr�le, l'objet est de type hidden et il convient alors de v�rifier sa classe

                if (((obj.type=='checkbox') && (obj.checked==true)) ||
                   ((obj.type=='hidden') && (obj.className==sDivName))) sIDs += '&'+sName+'='+obj.value ;

             } // if (document.adminForm.elements[i].type == 'checkbox')

          } // for(i=0; i<j; i++)

          // Si le dernier caract�re est une virgule, retire ce caract�re
       
          sParams=sParams+sIDs+'&view='+se_view;
       
          if (wLimit!=undefined) sParams+='&limit='+wLimit;
          if (wLimitstart!=undefined) sParams+='&limitstart='+wLimitstart;

          // Ajoute les param�tres extra pour autant que les variables existent.   Ces variables sont ajout�es par le script admin.allevents.php

         //if (typeof(se_parent_id)!='undefined') { if (se_parent_id!='0') sParams+='&parent_id='+se_parent_id; }
         //if (se_event_id!=undefined)  { if (se_event_id!='0')  sParams+='&event_id=' +se_event_id; }

         Ajaxify(sTask, sParams, sDivName);            

      } else { // if (getElementById('se_ShowTable')!=undefined)

         show_failure('ajax.js::update_ajax()', 'div '+sDivName+' is missing.  Should be impossible.');

      } // if (getElementById('se_ShowTable')!=undefined)

   } else { // if (se_view!=undefined)
     
      show_failure('ajax.js::update_ajax()', 'se_view JS variable is missing.  Should be impossible.  It\'s ok if the page shouldn\'t use the Ajaxif function; not otherwise.');

   } // if (se_view!=undefined)
   
   return;

} // function update_ajax(sTask)









function se_ajax(task, divname) {	
alert('!!! AJAX.JS - Function se_ajax called.   Please consider Ajax.js::Ajaxify!!!');
}; // function ajax() {
function ajaxGetFolder(sParams, msg) {
alert('ajax.js::ajaxGetFolder ---  SHOULD NO MORE BE USED.   Directly used Ajaxify with the msg param');
} // function ajaxGetFolder(url)