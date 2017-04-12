# jQuery-staRating

**jQuery** plugin that create stars allowing a user to "vote"/choose a number. 

online-example : http://www.clamart-natation.com/starating/

Please consider the following html :

    <div id="foo"</div>

To force this div to receive the stars, just insert :

    <script type="text/javascript" src="script-starating.js"></script>
    <script type="text/javascript">
        var staRating = $("#foo").staRating();
        // or (with all options)
        var staRating = $("#foo").staRating({
            numStar	: 10,
            widthBorder : 10,
            heightStar : 100,
            value : 3,
            callback : 'mySuperFunction'
      	});
        function mySuperFunction(newValue,divParent){
          console.log("my new value is "+newValue);
        }
    </script>
for a quick explaination,

    numStar     : the number of stars the plugin will display (1 <= x <= 20)
    widthBorder : the width (in pixels) of the border of each stars (0 <= x <= 50)
    heightStar  : the height/width of each stars (1 <= x <= 400). Note that this value is including the widthBorder already.
    value       : the default value of the plugin (0 <= x <= numStar).

once the plugin is launched, at any moment you can access to this method :

    staRating.val(4);	// gives the value 4 to the stars
    staRating.getVal();	// return the current calue of the stars

The rating don't allows half measures, only values from 1 (not 0) to numStar. I know there is a lot of plugins already for this, but I wanted an easy way to personalise the colors/size. Even the star (have to modify the polygon value). Please also note than the .CSS file is loaded in the script you can modify the link inside (but loading the CSS file normaly is working too !)


### Ideas of upgrade :

 - allows half rating
 - be able to change the values (1 becomes "very bad", 2 becomes "bad", etc.)
 - be able to vote 0

Any comments or suggestions are welcome !
Cheers
