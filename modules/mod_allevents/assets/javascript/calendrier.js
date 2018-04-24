/**
 * Gestion de l'ajax lors du changement de mois dans le module AllEvents
 */
window.addEvent('domready', function() {
   mod_calendar_change_month();
});

/* 
 * Récupère le code JS dans la portion de page mise-à-jour par Ajax afin de l'exécuter
 */
function getTooltips() {
	
   // La fonction getToolTips est appelée à chaque mise-à-jour du calendrier (par exemple lors d'un changement de mois depuis 
   // le module.    La mise-à-jour Ajax génère le calendrier pour le mois sélectionné ainsi qu'un élément de type span dont la classe est
   // se_script_tooltips et qui contient le code JS pour qu'un tooltip s'affiche lors du survol de la souris.
   // Il faut récupérer le code JS et l'évaluer afin que le tooltip puisse être associé au jour du calendrier.   Le code ci-dessous s'en charge	
		
   document.getElements('.se_script_tooltips').each(function(el) {
		
      try {
	     eval(el.innerHTML);		
      } catch(err) {
    	// Si une erreur intervient, c'est que le code JS qui a été généré par la fonction ajax_Calendrier()
    	// est incorrect. 
        console.error('AllEvents - GetTooltips() : '+err.message+' ===> Please review AllEventsAjaxController::ajax_Calendrier()');
	  }	   
	   
   });	
   
   return;
   
} // function getTooltips()
/*
 * La fonction calendar_updated() est appellée par la fonction Ajaxify lorsque le module calendrier a été mis à jour.
 * Ajaxify appelle cette fonction parce que le paramètre fctOnSuccess a été initialisé dans la fonction mod_calendar_change_month
 */
function calendar_updated() {
	
   // Une fois le calendrier à jour, initialise le code JS qui permettra de faire d'autres mises-à-jour	
   mod_calendar_change_month();
   
   // Interprète et exécute le code JS pour les tooltips   
   getTooltips();
   
   return;
   
} // function calendar_updated()

function getText(n) {
	alert(n);
  if('textContent' in n) {
	  return 'textContent '+n.textContent;
  } else if('innerHTML' in n) {
	    return 'innerHTML '+n.innerHTML;
  } else if('innerText' in n) {
	    return n.innerText;
	  } else {
    // Call a custom collecting function, throw an error, something like that.
  }
}
/*
 * Insère le code JS nécessaire afin de permettre la mise-à-jour du module calendrier.
 */
function mod_calendar_change_month() {
	   
   // Parce que le module calendrier peut être utilisé plus d'une fois sur la même page, utilise une boucle
   // afin de récupérer toutes les valeurs .se_calendar_id.     

	document.getElements('.se_calendar_ID').each(function(el){
	   
	  // "el" est normallement un span (exemple : <span title='se_calendar_ID' class='se_calendar_ID'>803</span>) 
	  // "el" est construit par la function Module_Calendar() du module AllEvents
	   
      var ID = el.innerHTML;
      
      var obj=null;    	  
      var sParams = "&modid="+ID;         
         
      // Obligatoire !  Il faut transmettre le Itemid de la page afin que le module puisse retrouver ses paramètres.
         
      if (typeof se_Itemid !== 'undefined') sParams += '&Itemid='+se_Itemid;

      var sTask   = "ajax_Calendrier";

      // Le code ci-dessous va vérifier si les éléments HTML prevYear_999, prevMonth_999, nextMonth_999 et nextYear_999 existent
      // (999 est le numéro du module).   Si présent, attache un code Javascript afin de permettre la mise-à-jour du calendrier
   
      if (obj=document.getElementById('prevYear_'+ID)) {
     	 obj.onclick = function () {
            sParams=sParams+"&y="+document.getElementById('prevYear_year_'+ID).innerHTML+"&m="+document.getElementById('prevYear_month_'+ID).innerHTML;
            Ajaxify(sTask, sParams, 'se_module_calendrier_'+ID,true,'calendar_updated()');
       	 }
      }; // document.getElementById('prevYear_'+ID).onclick = function ()
          
      if (obj=document.getElementById('prevMonth_'+ID)) {               
         obj.onclick = function () {
    	   sParams=sParams+"&y="+document.getElementById('prevMonth_year_'+ID).innerHTML+"&m="+document.getElementById('prevMonth_month_'+ID).innerHTML;
 	       Ajaxify(sTask, sParams, 'se_module_calendrier_'+ID,true,'calendar_updated()');   
         }; // document.getElementById('prevMonth_'+ID).onclick = function ()
      }
         
      // Code pour la mise à jour "Mois suivant"
      if (obj=document.getElementById('nextMonth_'+ID)) {
         obj.onclick = function () {
            sParams=sParams+"&y="+document.getElementById('nextMonth_year_'+ID).innerHTML+"&m="+document.getElementById('nextMonth_month_'+ID).innerHTML;
  	        Ajaxify(sTask, sParams, 'se_module_calendrier_'+ID,true,'calendar_updated()');      
         }; // document.getElementById('nextMonth_'+ID).onclick = function ()
      }
   
      // Code pour la mise à jour "Mois suivant"
      if (obj=document.getElementById('nextYear_'+ID)) {
         obj.onclick = function () {
            sParams=sParams+"&y="+document.getElementById('nextYear_year_'+ID).innerHTML+"&m="+document.getElementById('nextYear_month_'+ID).innerHTML;
  	        Ajaxify(sTask, sParams, 'se_module_calendrier_'+ID,true,'calendar_updated()');      
         }; // document.getElementById('nextYear_'+ID).onclick = function ()
      }
       	  
      // Une fois la barre de navigation traitée, traite chaque entrée dans le calendrier.
      
      try {
    	 
    	 // L'immonde explorateur n'aime pas getElements.   
    	  
         if (obj=document.getElementById('se_CalendarTable_'+ID)) {
    	 
            obj.getElements('td').each(function(item) {
        	 
                  item.addEvent('click', function(e) {
   	        	
                  var sURL = null;
               
                  if (item.getElement('span.se_link')) {
            	   
            	     sURL=item.getElement('span.se_link').innerHTML;
            	  
                     if (sURL!=null) {
            	   
                        // Pour la beauté de l'URL, remplace les &amp; par &
                        sURL = sURL.replace(/\&amp;/g,'&');
            
                        document.location.href=sURL;
                     
                     } // if (sURL!=null)
                  
                  } // if (item.getElement('span.se_link'))
               
               }); // item.addEvent('click', function(e)
   	  
            }); // obj.getElements('td').each(function(item) 
            
         } // if (obj=document.getElementById('se_CalendarTable_'+ID)) {
      } catch (err) {
    	  
      }
      
   }); // document.getElements('.se_calendar_ID').each(function(el)

}; // function calendar_change_month() {
