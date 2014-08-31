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
 * @class graphiti.VectorFigure
 * The base class for all vector based figures like {@link graphiti.shape.basic.Rectangle}  or {@link graphiti.shape.basic.Oval} 
 * inside a canvas.
 * 
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.node.Node
 */
graphiti.VectorFigure = graphiti.shape.node.Node.extend({
    NAME : "graphiti.VectorFigure",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     */
    init : function()
    {
        this.bgColor =  new graphiti.util.Color(100, 100, 100);
        this.color = new graphiti.util.Color(0, 0, 0);
        this.stroke = 1;

        this._super();
    },
      

   /**
    * @method
    * propagate all attributes like color, stroke,... to the shape element
    **/
    repaint : function(attributes)
    {
        if (this.repaintBlocked===true || this.shape === null){
            return;
        }

        if(typeof attributes === "undefined" ){
            attributes = {};
        }

        attributes.x = this.getAbsoluteX();
        attributes.y = this.getAbsoluteY();
        
        if(typeof attributes.stroke==="undefined"){
            if(this.color === null || this.stroke ===0){
                attributes.stroke = "none";
            }
            else {
                attributes.stroke = "#" + this.color.hex();
            }
        }
        
        attributes["stroke-width"] = this.stroke;
        
        if(typeof attributes.fill === "undefined"){
           if(this.bgColor!==null){
        	   attributes.fill = "#" + this.bgColor.hex();
           }
           else{
               attributes.fill ="none";
           }
        }

        this._super(attributes);
    },


   /**
    * @method
    * Set the new background color of the figure. It is possible to hands over
    * <code>null</code> to set the background transparent.
    *
    * @param {graphiti.util.Color} color The new background color of the figure
    **/
    setBackgroundColor : function(color)
    {
        if (color instanceof graphiti.util.Color) {
            this.bgColor = color;
        }
        else if (typeof color === "string") {
            this.bgColor = new graphiti.util.Color(color);
        }
        else {
            this.bgColor = null;
        }

        this.repaint();
    },

   /**
    * @method
    * The current used background color.
    * 
    * @return {graphiti.util.Color}
    */
   getBackgroundColor:function()
   {
     return this.bgColor;
   },

   /**
    * @method
    * Set the stroke to use.
    * 
    * @param {Number} w The new line width of the figure
    **/
   setStroke:function( w )
   {
     this.stroke=w;
     this.repaint();
   },

   /**
    * @method
    * The current use line width.
    * 
    * @type {Number}
    **/
   getLineWidth:function( )
   {
     return this.stroke;
   },

   /**
    * @mehod
    * Set the color of the line.
    * This method fires a <i>document dirty</i> event.
    * 
    * @param {graphiti.util.Color} color The new color of the line.
    **/
   setColor:function( color)
   {
     if(color instanceof graphiti.util.Color){
         this.color = color;
     }
     else if(typeof color === "string"){
         this.color = new graphiti.util.Color(color);
     }
     else{
         // set good default
         this.color = new graphiti.util.Color(0,0,0);
     }
     this.repaint();
   },

   /**
    * @method
    * The current used forground color
    * 
    * @returns {graphiti.util.Color}
    */
   getColor:function()
   {
     return this.color;
   }    
});

