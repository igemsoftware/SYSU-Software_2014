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
 * @class graphiti.SetFigure
 * 
 * A SetFigure is a composition of different SVG elements.
 * 
 * @author Andreas Herz
 * @extends graphiti.shape.basic.Rectangle
 */
graphiti.SetFigure = graphiti.shape.basic.Rectangle.extend({
    
    NAME : "graphiti.SetFigure",

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     */
    init: function( width, height) {
      // collection of SVG DOM nodes
      this.svgNodes=null;
      
      this.originalWidth = null;
      this.originalHeight= null;
      
      this.scaleX = 1;
      this.scaleY = 1;
      
      this._super( width, height);

      this.setStroke(0);
      this.setBackgroundColor(null); 
    },
    
    /**
     * @method
     * Set/Reset the canvas for the element.
     * 
     * @param {graphiti.Canvas} canvas the canvas to use
     */
    setCanvas: function( canvas )
    {
      // remove the shape if we reset the canvas and the element
      // was already drawn
      if(canvas===null && this.svgNodes!==null){
         this.svgNodes.remove();
         this.svgNodes=null;
      }
      
      this._super(canvas);
     },
 
    /**
     * @method
     * propagate all attributes like color, stroke,... to the shape element and
     * repaint them.
     * 
     **/
    repaint : function(attributes)
    {
        // repaint can be blocked during deserialization and if the shape
        // not part of any canvas.
        //
        if (this.repaintBlocked === true || this.shape === null) {
            return;
        }

        if (this.originalWidth !== null) {
        	this.scaleX = this.width / this.originalWidth;
        	this.scaleY = this.height / this.originalHeight;
        }
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }

        if (this.svgNodes !== null) {
            if (this.automaticResizeInnerContent() === true && this.isResizeable()===true) {
                this.svgNodes.transform("s"+this.scaleX+","+this.scaleY+","+this.getAbsoluteX()+","+this.getAbsoluteY()+ " t"
                        + this.getAbsoluteX() + "," + this.getAbsoluteY());
            }
            else {
                this.svgNodes.transform("t" + this.getAbsoluteX() + "," + this.getAbsoluteY());
            }
        }

        this._super(attributes);
    },

    /**
     * @method
     * Indicates whenever a SetFigure should automaticly resize the inner set/svg with a transformation
     * if the user resize the shape. This is not always the wante behaviour (see Slider).
     * 
     * @returns {Boolean}
     */
    automaticResizeInnerContent:function()
    {
      return true;
    },
    
    
    /**
     * @private
     */
    createShapeElement : function()
    {
       // NOTE: don't change the order of the two calls. This defines the z-oder in the canvas.
       // The "set" must always be on top.
       var shape= this.canvas.paper.rect(this.getX(),this.getY(),this.getWidth(), this.getHeight());
       this.svgNodes = this.createSet();
       
       this.originalWidth = this.svgNodes.getBBox().width;
       this.originalHeight= this.svgNodes.getBBox().height;

       return shape;
    },
    
    /**
     * @method
     * Override this method to add your own SVG elements. Ssee {@link graphiti.shape.basic.Label} as example.
     * 
     * @template
     */
    createSet: function()
    {
    	return this.canvas.paper.set(); // return empty set as default;
    }
   
});