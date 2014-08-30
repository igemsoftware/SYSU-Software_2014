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
 * @class graphiti.shape.basic.Rectangle
 * A Rectangle Figure.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var rect1 =  new graphiti.shape.basic.Rectangle();
 *     var rect2 =  new graphiti.shape.basic.Rectangle();
 *     
 *     canvas.addFigure(rect1,10,10);
 *     canvas.addFigure(rect2,100,10);
 *     
 *     rect2.setBackgroundColor("#f0f000");
 *     rect2.setAlpha(0.7);
 *     rect2.setDimension(100,60);
 *     rect2.setRadius(10);
 *     
 *     canvas.setCurrentSelection(rect2);
 *     
 * @author Andreas Herz
 * @extends graphiti.VectorFigure
 */
graphiti.shape.basic.Rectangle = graphiti.VectorFigure.extend({
    NAME : "graphiti.shape.basic.Rectangle",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     */
    init: function( width, height) {
       // corner radius
       this.radius = 2;
        
      this._super();

      this.setBackgroundColor( new graphiti.util.Color(100,100,100));
      this.setColor(new graphiti.util.Color(50,50,50));

      // set some good defaults
      //
      if(typeof width === "undefined"){
        this.setDimension(50, 90);
      }
      else{
        this.setDimension(width, height);
      }
    },

    /**
     * @inheritdoc
     **/
    repaint : function(attributes)
    {
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }

        attributes.width = this.getWidth();
        attributes.height = this.getHeight();
        attributes.r = this.radius;
        this._super(attributes);
    },

    /**
     * @method
     * 
     * @inheritdoc
     */
    createShapeElement : function()
    {
       return this.canvas.paper.rect(this.getX(),this.getY(),this.getWidth(), this.getHeight());
    },

    /**
     * @method
     * Sets the corner radius for rectangles with round corners. 
     * 
     * @param {Number} radius
     */
     setRadius: function(radius){
        this.radius = radius;
        this.repaint();
    },
    
    /**
     * @method
     * Indicates the corner radius for rectangles with round corners. The default is 2. 
     * 
     * @return {Number}
     */
    getRadius:function(){
        return this.radius;
    },
    
    
    
    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento = this._super();
        
        memento.radius = this.radius;
        
        return memento;
    },
    
    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     * 
     * @param {Object} memento
     * @returns 
     */
    setPersistentAttributes : function(memento)
    {
        this._super(memento);
        
        if(typeof memento.radius ==="number"){
            this.radius = memento.radius;
        }
    }    
});