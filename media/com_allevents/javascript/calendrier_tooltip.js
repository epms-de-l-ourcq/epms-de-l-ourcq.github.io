//
// Code JS dérivé de Hot!Ajax Tooltips (http://www.hotajax.org/mootools/tooltips-rating.html)
//
// Ce code va créer dynamiquement la DIV qui servira  à l'affichage du tooltip dans le module AllEvents - Calendrier
//

var ToolTip = new Class({

   initialize: function (trigger, content_name, options) {
	
	  // trigger est le ID de la zone à l'écran sur laquelle le tooltip doit s'afficher.   C'est le ID de la cellule du tableau qui affiche
	  // le numéro du jour
	
      // content_name est un nom.   Il s'agit d'un ID unique qui désigne un élément HTML de la page
	  // exemple : si content_name="content_name"; cela veut dire que dans le code de la page HTML, j'ai quelque chose comme ceci :
  	  //           <span id='mod_803_tooltip_DISPLAY_3'>bla bla</span>
 	  // Le type d'élément (span, div, ...) n'a aucune importance. 

	  if (obj=getElementById(content_name)) {
         content = obj.innerHTML;
         bContinue = true;
	  } else {		  
	     // La DIV associée au tooltip n'existe pas ==> il n'y a rien à afficher 	  
		 //msg = 'calendrier_tooltip.js - ERROR : HTML ELEMENT WITH ID ['+content_name+'] NOT DEFINED IN YOUR PAGE.  REVIEW HOW YOU HAVE BUILT THE DrawTooltips() FUNCTION IN F.I. THE ALLEVENTS MODULE.';
	     //content = '<div style="text-align:center;background-color:#F5A9A9;color:#DF0101;">'+msg+'</div>';
	     bContinue = false;
	  }
	  
      this.setOptions({
         duration     : 300,
         transition   : Fx.Transitions.linear,
         wait         : false,
         tooltipClass : "se-tooltip",
         style        : "default",
         width        : "250",
         display      : "inline",
         mode         : "cursor",
         sticky       : 0
      }, options);
      
      if (bContinue==true) {
    	
         this.open = false;
         this.trigger = getElementById(trigger);
      
         this.tooltip= (new Element("div",
            {'class': this.options.tooltipClass,
               styles:{position: "absolute", top: 0, left: 0, "z-index": 50, visibility: "hidden", width: this.options.width}
            })).injectTop(document.body);

         this.tooltip_style = (new Element("div", {'class': this.options.style})).injectInside(this.tooltip);
         this.tooltip_tl    = (new Element("div", {'class': "tooltip-tl", styles: {width: this.options.width}})).injectInside(this.tooltip_style);
         this.tooltip_tr    = (new Element("div", {'class': "tooltip-tr"})).injectInside(this.tooltip_tl);
         this.tooltip_t     = (new Element("div", {'class': "tooltip-t", styles: {height: 15}})).injectInside(this.tooltip_tr);
         this.tooltip_l     = (new Element("div", {'class': "tooltip-l", styles: {width: this.options.width}})).injectAfter(this.tooltip_tl);
         this.tooltip_r     = (new Element("div", {'class': "tooltip-r"})).injectInside(this.tooltip_l);
         this.tooltip_m     = (new Element("div", {'class': "tooltip-m"})).injectInside(this.tooltip_r).setHTML(content);
         this.tooltip_bl    = (new Element("div", {'class': "tooltip-bl", styles: {width: this.options.width}})).injectAfter(this.tooltip_l);
         this.tooltip_br    = (new Element("div", {'class': "tooltip-br"})).injectInside(this.tooltip_bl);
         this.tooltip_b     = (new Element("div", {'class': "tooltip-b"})).injectInside(this.tooltip_br);
         this.tooltip_arrow = (new Element("div", {'class': "tooltip-arrow", styles: {height: 23}})).injectInside(this.tooltip_b);
      
         if (this.options.sticky) {this.close = (new Element("div", {'class': "tooltip-close"})).injectInside(this.tooltip_tl);}

         this.fx = new (Fx.Styles)(this.tooltip, this.options);
      
         this.trigger.addEvent("mouseenter", this.show.bindWithEvent(this));
      
         if (this.options.sticky) {
            this.close.addEvent("mouseenter", this.hide.bindWithEvent(this));
         } else {
            this.trigger.addEvent("mouseleave", this.hide.bindWithEvent(this));
         }
      } // if (bContinue==true)

   },

   show: function (event) {

      if (!this.open) {    	  
         this.pos = this.position(event);
         
         // Left est peut-être négatif lorsque le tooltip s'affiche trop à gauche
         if (this.pos.left<0)this.pos.left=0;
         
         this.tooltip.setStyles({opacity: 0, top: this.pos.top + "px", left: this.pos.left + "px"});
         this.fx.start({opacity: 1, top: this.pos.top - 10 + "px"});
         this.open = true;

         /* Ce code vise � remplacer les signes &lt; et &gt; par leurs correspondant HTML.   Cette astuce permet d'�viter */
         /* des erreurs de compatibilit� W3C.   this.tooltip_m.innerHTML �tant le code HTML du tooltip (_m pour message)  */
         
         var s=this.tooltip_m.innerHTML;
         s=s.replace(/&lt;/gi, "<");
         s=s.replace(/&gt;/gi, ">");
         this.tooltip_m.innerHTML=s;         
      }
   },

   hide: function (event) {
      if (!(this.pos==undefined)) {
         this.fx.start({opacity: 0, top: this.pos.top - 20 + "px"});
      }
      this.open = false;
   },

   position: function (event) {
      var trg = this.trigger.getCoordinates();
      var tip = this.tooltip.getCoordinates();

      if (this.options.mode == "cursor") {
         var event = new Event(event);
         trg = $extend(trg, {top: event.page.y, left: event.page.x, width: 0});
      }
      return {top: trg.top - tip.height, left: trg.left - tip.width / 2 + trg.width / 2};
   }

   } // initialize: function (trigger, content, options) {

); // var ToolTip = new Class({

ToolTip.implement(new Options);

 