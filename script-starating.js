//<![CDATA[

	/* ============================================ STAR RATING ============================================ *\

		plugin that open & manage a star rating. No intermediary values (ie. only 1, 2, ... not 1.5)
		
		USE -
			to use it, considering the following html :
			<div id="foo"></div>

			var sr = $("#foo").staRating({
				numStar	: 5,
				widthBorder : 2,
				heightStar : 30,
				value : 4,
				callBack : "myFunction"
			});
			-or-
			var sr = $("#foo").staRating();
			list of available methods
			sr.val(3);	// set 3 as a new value of the staRating
			
		
		CREDIT -
			Sebastien Pipet (https://www.facebook.com/sebastien.pipet)
		VERSION -
			0.2
		DISCLAIMER -
			All this code is free : you can use, redistribute and/or modify it without any consentement.
			Please just leave my name on it ;-)
		DEFAULT VALUES -
			you can customise the defaults values below :

	/* ========================================= DEFAULT VALUES ============================================ */

	var	numberDefaultStar = 5;							// number of stars
	var	heightStarDefault = 30;							// height/width of star (INCLUDING the border)
	var	widthBorderDefault = 2;							// width of the border of the star
	var	defaultValue = 0;							// default selected value
	var	defaultCallBack = "alert";						// function called when any update of the value
	var	linkCSS = "starating.css";						// link of the attached CSS file

	/* =================================================================================================== */


(function ( $ ) {

	// loading CSS file
	if(!document.getElementById("staRating")){
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.id   = "staRating";
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = linkCSS;
		link.media = 'all';
		head.appendChild(link);
	}
	// loading all occurs of the plugin into an object
	var listStaRating = {};

	$.fn.staRating = function(params) {

		// if multiple elements, we split them. Only once they are "alone", we keep doing further
		if (this.length > 1){
			this.each(function() { $(this).staRating(params) });
			return this;
		}


		// ================= PRIVATE PROPERTIES =================


		var staRating = this;

		// customizable parameters available, with the default values
		params = $.extend({
			numStar		: numberDefaultStar,
			widthBorder	: widthBorderDefault,
			heightStar	: heightStarDefault,
			value		: defaultValue,
			callback	: defaultCallBack
		}, params);

		var	numStar 	= Math.min(1,Math.max(params.numStar,20)),					// numStar = nombre d'etoiles possibles	(1-20)
			iname		= '',										// unique class name (will be setted later)
			widthBorder	= Math.max(0,Math.min(50,params.widthBorder)),					// 0 < border < 50
			heightStar	= Math.max(widthBorder,Math.max(1,Math.min(400,params.heightStar))),		// 1 < star height < 400, avec star height > star border width
			value		= Math.max(0,params.value),							// 0 < value. value > numStar is handeled
			callback	= params.callback;								// function called once the value is updated


		// ================= PUBLIC PROPERTIES =================


		staRating.credit = 'sebastien pipet';


		// ================= PRIVATE FUNCTIONS =================


		// init the plugin : instanciation
		var SR_intialize = function() {

			SR_setUniqueName();
			staRating.attr("class", iname+' staRating_conteneur');

			// the plugin HAS TO BE used on div (that we will clear). We first check it.
			if(! $("."+iname).is('div') ){
				console.log("staRating plugin : fail, it has to be used on a div.");
				return false;
			}else{
				// we store the element into the staRatingList
				listStaRating[SR_countItems()] = staRating;

				// we first clear what is inside
				staRating.html("");
				
				// we calcul the dimentions of the star
				var valMax = 0;
				// coords for a star of 500px height/width
				var dots=[250,12,311,193,500,193,349,306,403,487,250,380,97,487,151,306,0,193,189,193];
				var result="";
				widthBorder = widthBorder*10;
				for(i = 0; i < dots.length; i+=2) {
					var x = Math.round(dots[i]/50*heightStar+2*widthBorder);
					var y = Math.round(dots[i+1]/50*heightStar+2*widthBorder);
					result+= ((i==0)?"":" ")+x+","+y;
					valMax=Math.max(valMax,(Math.max(x,y)));
				}
				// we add the stars
				for(i = 1; i <= params.numStar; i++) {
					staRating.append('<!-- SVG code --><svg id="'+iname+'_'+i+'" class="staRating_star'+((value>=i)?' staRating_selected':'')+'" data-value="'+i+'"width="'+heightStar+'px" height="'+heightStar+'px" viewBox="0 0 '+(valMax+widthBorder*2)+' '+(valMax+widthBorder*2)+'"xmlns="http://www.w3.org/2000/svg" version="1.1"><title>'+i+'</title><polygon stroke-width="'+widthBorder+'" points="'+result+'" /></svg>');
					$("#"+iname+'_'+i).hover(function(){
						SR_StarHover($(this));
					}, function(){
						SR_StarRelease($(this));
					});
					$("#"+iname+'_'+i).click(function() {
						SR_setSelection($(this));
					});
				}

				return staRating;
			}
		};
		// function dealing with the hover of the stars
		var SR_StarHover = function(star){
			$("."+iname+' .staRating_star').each(function() {
				if($(this).data('value')<=star.data('value')){
					$(this).addClass('staRating_star_hover');
				}else{
					$(this).removeClass('staRating_star_hover');
				}
			});
		};
		// function reseting the hover of the stars
		var SR_StarRelease = function(star){
			$("."+iname+' .staRating_star').each(function() {
				$(this).removeClass('staRating_star_hover');
			});
		};
		// function called once we click on a star
		var SR_setSelection = function(star){
			$("."+iname+' .staRating_star').each(function() {
				if($(this).data('value')<=star.data('value')){
					$(this).addClass('staRating_selected');
				}else{
					$(this).removeClass('staRating_selected');
				}
			});
			SR_callback(star.data('value'));
		};
		// called function in case of value update
		var SR_callback = function(newVal){
			if(callback=="alert"){
				newVal="(default callback method)\n new value = "+newVal+"\n please add \"callback\" value to the instantiation of the .staRating() script";
			}
			window[callback](newVal,$('.'+iname));
		};
		// function that counts the number of items (for old browsers)
		var SR_countItems = function() {
			var count = 0;
			for (var i in listStaRating) {
				if (listStaRating.hasOwnProperty(i)) {
					count++;
				}
			}
			return count;
		};
		// fonction who returns an unique class name
		var SR_setUniqueName = function(){
			iname = "staRating_"+SR_countItems();
		};


		// ================= PUBLIC FUNCTIONS =================


		// when the input get the focus, we display the clock if she's not here yet
		staRating.focus(function() {
		});
		// we can set a value to the staRating
		staRating.val = function(i) {
			var conteneur = $("."+iname);
			if($.isNumeric(i)){
				i = Math.max(0,Math.min(conteneur.find("svg").length,parseInt(i,10)));
				if(i==0){
					conteneur.find("svg").removeClass('staRating_selected');
					SR_callback(0);
				}else{
					SR_setSelection($("."+iname+" svg:eq("+(i-1)+")"));
				}
			}else{
				console.log("staRating.val("+i+"); unvalid");
				return false;
			}
			return true;
		};
		
		return SR_intialize();
	}
}( jQuery ));


 // ]]>