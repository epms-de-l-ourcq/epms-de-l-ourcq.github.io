/*
 * Fonctions de débogage JS pour AllEvents
 */

window.addEvent('domready', function(){

   // Si le browser utilisé ne supporte par la fonction "log", crée une fonction "log" bidon qui ne fait rien.
   // Cela permettra d'éviter des erreurs lorsque des appels à console.log() seront exécutés
	
   if (typeof console == "undefined") { this.console = {log: function() {}}; }

});
/**
 * Ecrit une ligne dans la console du browser.
 * 
 * @param type  Peut être une des valeurs suivantes : "error" / "warning" / "info" / "log" / "debug"
 * @param msg   Le message à afficher.  Cela peut être du texte "blablabla" ou un objet encodé au format json.
 * @return
 */
function log(type, msg) {
	
   // Cette pourriture de IE ne connait que console.log.  Stupid thing!	
   if (getInternetExplorerVersion()!='-1') type='log';	
	
   // Il est possiblque que le texte contienne un nom de fichier Windows tel que C:\dossier\dossier\fichier.
   // Afin que la console affiche le slash, il faut le doubler.
	
   if (typeof(msg)!='object') {
	   
      msg = msg.replace(/\\/gi,'\\\\');
      msg = msg.replace(/\"/gi,'\\\'');
      msg='"AllEvents - '+msg+'"';
      
   } else {
      // Si le message est en fait un objet (encodé en json), il faut en récupérer le source afin de l'afficher
	  // correctement au travers de la console
	  var object= eval(msg);
	  
	  try {
	     msg = (object.toSource) ? object.toSource() : object.toString();
	  } catch(err) {	   
		 console.error('AllEvents - Debug.js::log() : '+err.message);
	  }
   }
	
   try {
	   var sLog="console."+type+"("+msg+");";
	   eval(sLog);
   } catch(err) {	 
	   if (getInternetExplorerVersion()!='-1') {
	      // Immonde Explorateur qui ne connait pas console.error()
	      console.log('AllEvents - Debug.js::log() - ERROR : '+err.message);
	   } else {
		  // Navigateur intelligent 
		  console.error('AllEvents - Debug.js::log() : '+err.message);
	   }
   } // try 
   
   return;
   
} // function log(type, msg)