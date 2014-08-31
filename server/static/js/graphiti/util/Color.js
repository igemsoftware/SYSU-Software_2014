/**
The GPL License (GPL)

Copyright (c) 2012 Andreas Herz

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details. You should
have received a copy of the GNU General Public License along with this program; if
not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
MA 02111-1307 USA

**/



/**
 * @class
 * Util class to handle colors in the graphiti enviroment.
 * 
 *      // Create a new Color with RGB values
 *      var color = new graphiti.util.Color(127,0,0);
 * 
 *      // of from a hex string
 *      var color2 = new graphiti.util.Color("#f00000");
 *     
 *      // Create a little bit darker color 
 *      var darkerColor = color.darker(0.2); // 20% darker
 *     
 *      // create a optimal text color if 'color' the background color
 *      // (best in meaning of contrast and readability)
 *      var fontColor = color.getIdealTextColor();
 *     
 */
graphiti.util.Color = Class.extend({

    /**
     * @constructor
     * Create a new Color object
     * 
     * @param {Number} red 
     * @param {Number} green 
     * @param {Number} blue 
     */
    init: function( red, green, blue) {

      if(typeof green == "undefined")
      {
        var rgb = this.hex2rgb(red);
        this.red= rgb[0];
        this.green = rgb[1];
        this.blue = rgb[2];
      }
      else
      {
        this.red= red;
        this.green = green;
        this.blue = blue;
      }
    },
    

    /**
     * @method
     * Convert the color object into a HTML CSS representation
     * @return {String} the color in rgb(##,##,##) representation
     **/
    getHTMLStyle:function()
    {
      return "rgb("+this.red+","+this.green+","+this.blue+")";
    },
    
    /**
     * @method
     * Convert the color object into a HTML CSS representation
     * @return {String} the color in rgb(##,##,##) representation
     **/
    getHashStyle:function()
    {
      return "#"+this.hex();
    },
    
    
    /**
     * @method
     * The red part of the color.
     * 
     * @return {Number} the [red] part of the color.
     **/
    getRed:function()
    {
      return this.red;
    },
    
    
    /**
     * @method
     * The green part of the color.
     * 
     * @return {Number} the [green] part of the color.
     **/
    getGreen:function()
    {
      return this.green;
    },
    
    
    /**
     * @method
     * The blue part of the color
     * 
     * @return {Number} the [blue] part of the color.
     **/
    getBlue:function()
    {
      return this.blue;
    },
    
    /**
     * @method
     * Returns the ideal Text Color. Useful for font color selection by a given background color.
     *
     * @return {graphiti.util.Color} The <i>ideal</i> inverse color.
     **/
    getIdealTextColor:function()
    {
       var nThreshold = 105;
       var bgDelta = (this.red * 0.299) + (this.green * 0.587) + (this.blue * 0.114);
       return (255 - bgDelta < nThreshold) ? new  graphiti.util.Color(0,0,0) : new  graphiti.util.Color(255,255,255);
    },
    
    
    /**
     * @private
     */
    hex2rgb:function(/*:String */hexcolor)
    {
      hexcolor = hexcolor.replace("#","");
      return(
             {0:parseInt(hexcolor.substr(0,2),16),
              1:parseInt(hexcolor.substr(2,2),16),
              2:parseInt(hexcolor.substr(4,2),16)}
             );
    },
    
    /**
     * @private
     **/
    hex:function()
    { 
      return(this.int2hex(this.red)+this.int2hex(this.green)+this.int2hex(this.blue)); 
    },
    
    /**
     * @private
     */
    int2hex:function(v) 
    {
      v=Math.round(Math.min(Math.max(0,v),255));
      return("0123456789ABCDEF".charAt((v-v%16)/16)+"0123456789ABCDEF".charAt(v%16));
    },
    
    /**
     * @method
     * Returns a darker color of the given one. The original color is unchanged.
     * 
     * @param {Number} fraction  Darkness fraction between [0..1].
     * @return{graphiti.util.Color}        Darker color.
     */
    darker:function(fraction)
    {
       var red   = parseInt(Math.round (this.getRed()   * (1.0 - fraction)));
       var green = parseInt(Math.round (this.getGreen() * (1.0 - fraction)));
       var blue  = parseInt(Math.round (this.getBlue()  * (1.0 - fraction)));
    
       if (red   < 0) red   = 0; else if (red   > 255) red   = 255;
       if (green < 0) green = 0; else if (green > 255) green = 255;
       if (blue  < 0) blue  = 0; else if (blue  > 255) blue  = 255;
    
       return new graphiti.util.Color(red, green, blue);
    },
    
    
    /**
     * @method
     * Make a color lighter. The original color is unchanged.
     * 
     * @param {Number} fraction  Darkness fraction between [0..1].
     * @return {graphiti.util.Color} Lighter color.
     */
    lighter:function( fraction)
    {
        var red   = parseInt(Math.round (this.getRed()   * (1.0 + fraction)));
        var green = parseInt(Math.round (this.getGreen() * (1.0 + fraction)));
        var blue  = parseInt(Math.round (this.getBlue()  * (1.0 + fraction)));
    
        if (red   < 0) red   = 0; else if (red   > 255) red   = 255;
        if (green < 0) green = 0; else if (green > 255) green = 255;
        if (blue  < 0) blue  = 0; else if (blue  > 255) blue  = 255;
    
        return new graphiti.util.Color(red, green, blue);
    }
});