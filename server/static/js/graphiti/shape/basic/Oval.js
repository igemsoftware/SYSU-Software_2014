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
 * @class graphiti.shape.basic.Oval
 * Oval figure.
 * 
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var oval =  new graphiti.shape.basic.Oval();
 *     oval.setDimension(150,100);
 *     canvas.addFigure(oval,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.VectorFigure
 */
graphiti.shape.basic.Oval = graphiti.VectorFigure.extend({
    NAME : "graphiti.shape.basic.Oval",

    
    /**
     * 
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width,height ) {
        this._super( );
        this.setBackgroundColor(new graphiti.util.Color(200,255,120));
        
        if((typeof height ==="number") &&(typeof width === "number")){
            this.setDimension(width,height);
        }
        else{
            this.setDimension(50,50);
        }
    },
      

   /** 
    * @template
    **/
   createShapeElement : function()
   {
     var halfW = this.getWidth()/2;
     var halfH = this.getHeight()/2;
     return this.canvas.paper.ellipse(this.getAbsoluteX()+halfW, this.getAbsoluteY()+halfH, halfW, halfH);
   },

   /**
    * @inheritdoc
    * 
    * @template
    **/
   repaint: function(attributes)
   {
       if(this.repaintBlocked===true || this.shape===null){
           return;
       }

       if(typeof attributes === "undefined"){
           attributes = {};
       }
       
       
       // don't override cx/cy if inherited class has set the center already.
       if(typeof attributes.rx === "undefined"){
           attributes.rx = this.width/2;
           attributes.ry = this.height/2;
       }
 
       // don't override cx/cy if inherited class has set the center already.
       if(typeof attributes.cx === "undefined"){
           attributes.cx = this.getAbsoluteX()+attributes.rx;
           attributes.cy = this.getAbsoluteY()+attributes.ry;
       }
      
       this._super(attributes);
   }
    
});

