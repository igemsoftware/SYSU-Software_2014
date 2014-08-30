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
 * @class graphiti.shape.basic.Line
 * The base class for all visible elements inside a canvas.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     // Create the line and modify the start/end after inserting them into 
 *     // the canvas
 *     var line1 =  new graphiti.shape.basic.Line();
 *     line1.setStartPoint(30,30);
 *     line1.setEndPoint(100,80);
 *       
 *     canvas.addFigure(line1);
 *     
 *     // Create the line with a given start/end coordinate in the constructor
 *     //
 *     var line2 = new graphiti.shape.basic.Line(20,80,200,150);
 *     line2.setStroke(3);
 *     line2.setColor("#1d1dff");
 *     canvas.addFigure(line2);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.Figure
 */
graphiti.shape.basic.Line = graphiti.Figure.extend({
    NAME : "graphiti.shape.basic.Line",

    DEFAULT_COLOR : new graphiti.util.Color(0,0,0),
    
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * 
     * @param {Number} startX the x-coordinate of the start
     * @param {Number} startY the y-coordinate of the start
     * @param {Number} endX   the x-coordinate of the end
     * @param {Number} endY   the y-coordinate of the end
     * 
     */
    init: function(startX, startY, endX, endY ) {
        // for performance reasons if we made some bulk changes to the object
        // For this case we can block the repaint and enable it after the bulk
        // Update of the properties
        this.repaintBlocked = false;
        
        // click area for the line hit test
        this.corona = 10;
        this.isGlowing = false;
        this.lineColor = this.DEFAULT_COLOR;
        this.stroke=1;
        
        if(typeof endY ==="number"){
            this.startX = startX;
            this.startY = startY;
            
            this.endX   = endX;
            this.endY   = endY;
        }
        else{
            this.startX = 30;
            this.startY = 30;
            
            this.endX   = 100;
            this.endY   = 100;
        }

        this._super();
        

        this.setSelectable(true);
        this.setDeleteable(true);
   },
      

   /**
    * @method
    * Set the width for the click hit test of this line.
    *
    * @param {Number} width the width of the line hit test.
    **/
   setCoronaWidth:function( width)
   {
      this.corona = width;
   },


   /**
    * @method
    * Called by the framework. Don't call them manually.
    * 
    * @private
    **/
   createShapeElement:function()
   {
     return this.canvas.paper.path("M"+this.getStartX()+" "+this.getStartY()+"L"+this.getEndX()+" "+this.getEndY());
   },

   /**
    * @method
    * Trigger the repaint of the element.
    * 
    */
   repaint:function(attributes)
   {
       if(this.repaintBlocked===true || this.shape===null){
           return;
       }

       // don't override existing values
       //
       if(typeof attributes === "undefined"){
           attributes = {"stroke":"#"+this.lineColor.hex(),
                         "stroke-width":this.stroke,
                         "path":"M"+this.getStartX()+" "+this.getStartY()+"L"+this.getEndX()+" "+this.getEndY()};
       }
       else{
    	   if(typeof attributes.path ==="undefined"){
    		   attributes.path ="M"+this.getStartX()+" "+this.getStartY()+"L"+this.getEndX()+" "+this.getEndY();
    	   }
    	   attributes.stroke = "#"+this.lineColor.hex();
    	   attributes["stroke-width"]=this.stroke;
       }
       
        this._super(attributes);
   },
   
   /**
    * @method
    * Highlight the element or remove the highlighting
    * 
    * @param {Boolean} flag indicates glow/noGlow
    * @template
    */
   setGlow: function(flag){
	   if(this.isGlowing===flag){
		   return;
	   }
	   
	   if(flag===true){
		   // store old values for restore
		   this._lineColor = this.lineColor;
		   this._stroke = this.stroke;
		   
	       this.setColor(new graphiti.util.Color("#3f72bf"));
	       this.setStroke(parseInt(this.stroke*4));
	   }
	   else{
	       this.setColor(this._lineColor);
	       this.setStroke(this._stroke);
	   }
	   
	   this.isGlowing = flag;
   },


   /**
    * You can't drag&drop the resize handles if the line not resizeable.
    * @type boolean
    **/
   isResizeable:function()
   {
     return true;
   },


   /**
    * Set the line width. This enforce a repaint of the line.
    * This method fires a <i>document dirty</i> event.
    *
    * @param {Number} w The new line width of the figure.
    **/
   setStroke:function(w)
   {
     this.stroke=w;
     
     this.repaint();
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
         this.lineColor = color;
     }
     else if(typeof color === "string"){
         this.lineColor = new graphiti.util.Color(color);
     }
     else{
         // set good default
         this.lineColor = this.DEFAULT_COLOR;
     }
     this.repaint();
   },

   /**
    * @method
    * Return the current paint color.
    * 
    * @return {graphiti.util.Color} The paint color of the line.
    **/
   getColor:function()
   {
     return this.lineColor;
   },

   /**
    * @method
    * Set the start point of the line.
    * This method fires a <i>document dirty</i> event.
    *
    * @param {Number} x the x coordinate of the start point
    * @param {Number} y the y coordinate of the start point
    **/
   setStartPoint:function( x, y)
   {
     if(this.startX===x && this.startY===y){
        return;
     }

     this.startX = x;
     this.startY = y;
     this.repaint();
   },

   /**
    * Set the end point of the line.
    * This method fires a <i>document dirty</i> event.
    *
    * @param {Number} x the x coordinate of the end point
    * @param {Number} y the y coordinate of the end point
    **/
   setEndPoint:function(x, y)
   {
     if(this.endX===x && this.endY===y){
        return;
     }

     this.endX = x;
     this.endY = y;
     this.repaint();
   },

   /**
    * @method
    * Return the x coordinate of the start.
    * 
    * @return {Number}
    **/
   getStartX:function()
   {
     return this.startX;
   },

   /**
    * @method
    * Return the y coordinate of the start.
    * 
    * @return {Number}
    **/
   getStartY:function()
   {
     return this.startY;
   },

   /**
    * @method
    * Return the start point.
    * 
    * @return {graphiti.geo.Point}
    **/
   getStartPoint:function()
   {
     return new graphiti.geo.Point(this.startX,this.startY);
   },


   /**
    * @method
    * Return the x coordinate of the end point
    * 
    * @return {Number}
    **/
   getEndX:function()
   {
     return this.endX;
   },

   /**
    * @method
    * Return the y coordinate of the end point.
    * 
    * @return {Number}
    **/
   getEndY:function()
   {
     return this.endY;
   },

   /**
    * @method
    * Return the end point.
    * 
    * @return {graphiti.geo.Point}
    **/
   getEndPoint:function()
   {
     return new graphiti.geo.Point(this.endX,this.endY);
   },

   
   getSegments: function(){
       var result = new graphiti.util.ArrayList();
       result.add({start: this.getStartPoint(), end: this.getendPoint()});
       return result;
   },
   
   
   /**
    * @method
    * Returns the length of the line.
    * 
    * @return {Number}
    **/
   getLength:function()
   {
     // call native path method if possible
     if(this.shape!==null){
       return this.shape.getTotalLength();
     }
       
     return Math.sqrt((this.startX-this.endX)*(this.startX-this.endX)+(this.startY-this.endY)*(this.startY-this.endY));
   },

   /**
    * @method
    * Returns the angle of the line in degree
    *
    * <pre>
    *                                 270°
    *                               |
    *                               |
    *                               |
    *                               |
    * 180° -------------------------+------------------------> +X
    *                               |                        0°
    *                               |
    *                               |
    *                               |
    *                               V +Y
    *                              90°
    * </pre>
    * @return {Number}
    **/
   getAngle:function()
   {
     var length = this.getLength();
     var angle = -(180/Math.PI) *Math.asin((this.startY-this.endY)/length);

     if(angle<0)
     {
        if(this.endX<this.startX){
          angle = Math.abs(angle) + 180;
        }
        else{
          angle = 360- Math.abs(angle);
        }
     }
     else
     {
        if(this.endX<this.startX){
          angle = 180-angle;
        }
     }
     return angle;
   },

   /**
    * @method
    * Returns the Command to perform the specified Request or null.
    *
    * @param {graphiti.command.CommandType} request describes the Command being requested
    * @return {graphiti.command.Command} null or a Command
    **/
   createCommand:function( request)
   {
     if(request.getPolicy() === graphiti.command.CommandType.MOVE)
     {
       var x1 = this.getStartX();
       var y1 = this.getStartY();
       var x2 = this.getEndX();
       var y2 = this.getEndY();
       return new graphiti.command.CommandMoveLine(this,x1,y1,x2,y2);
     }
     if(request.getPolicy() === graphiti.command.CommandType.DELETE)
     {
        if(this.isDeleteable()===false){
           return null;
        }
        return new graphiti.command.CommandDelete(this);
     }
     return null;
   },

   /**
    * @method
    * Checks if the hands over coordinate close to the line. The 'corona' is considered
    * for this test. This means the point isn't direct on the line. Is it only close to the
    * line!
    *
    * @param {Number} px the x coordinate of the test point
    * @param {Number} py the y coordinate of the test point
    * @return {boolean}
    **/
   hitTest: function( px, py)
   {
     return graphiti.shape.basic.Line.hit(this.corona, this.startX,this.startY, this.endX, this.endY, px,py);
   },
   
   intersection: function (other){
       var result = new graphiti.util.ArrayList();
       
       // empty result. the lines are equal...infinit array
       if(other === this){
           return result;
       }
       
       var segments1= this.getSegments();
       var segments2= other.getSegments();
       
       segments1.each(function(i, s1){
           segments2.each(function(j, s2){
               var p= graphiti.shape.basic.Line.intersection(s1.start, s1.end, s2.start, s2.end);
               if(p!==null){
                   result.add(p);
               }
           });
       });
       return result;
   }
});


/**
 * 
 * @param {graphiti.geo.Point} a1
 * @param {graphiti.geo.Point} a2
 * @param {graphiti.geo.Point} b1
 * @param {graphiti.geo.Point} b2
 * @returns
 */
graphiti.shape.basic.Line.intersection = function(a1, a2, b1, b2) {
    var result;
    
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);

    if ( u_b != 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

//        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
        if ( 0 < ua && ua < 1 && 0 < ub && ub < 1 ) {
            result = new graphiti.geo.Point(parseInt(a1.x + ua * (a2.x - a1.x)), parseInt(a1.y + ua * (a2.y - a1.y)));
        } else {
            result = null;// No Intersection;
        }
    } else {
        if ( ua_t == 0 || ub_t == 0 ) {
            result = null;// Coincident
        } else {
            result = null; // Parallel
        }
    }

    return result;
};

/**
 * Static util function to determine is a point(px,py) on the line(x1,y1,x2,y2)
 * A simple hit test.
 * 
 * @return {boolean}
 * @static
 * @private
 * @param {Number} coronaWidth the accepted corona for the hit test
 * @param {Number} X1 x coordinate of the start point of the line
 * @param {Number} Y1 y coordinate of the start point of the line
 * @param {Number} X2 x coordinate of the end point of the line
 * @param {Number} Y2 y coordinate of the end point of the line
 * @param {Number} px x coordinate of the point to test
 * @param {Number} py y coordinate of the point to test
 **/
graphiti.shape.basic.Line.hit= function( coronaWidth, X1, Y1,  X2,  Y2, px, py)
{
  // Adjust vectors relative to X1,Y1
  // X2,Y2 becomes relative vector from X1,Y1 to end of segment
  X2 -= X1;
  Y2 -= Y1;
  // px,py becomes relative vector from X1,Y1 to test point
  px -= X1;
  py -= Y1;
  var dotprod = px * X2 + py * Y2;
  var projlenSq;
  if (dotprod <= 0.0) {
      // px,py is on the side of X1,Y1 away from X2,Y2
      // distance to segment is length of px,py vector
      // "length of its (clipped) projection" is now 0.0
      projlenSq = 0.0;
  } else {
      // switch to backwards vectors relative to X2,Y2
      // X2,Y2 are already the negative of X1,Y1=>X2,Y2
      // to get px,py to be the negative of px,py=>X2,Y2
      // the dot product of two negated vectors is the same
      // as the dot product of the two normal vectors
      px = X2 - px;
      py = Y2 - py;
      dotprod = px * X2 + py * Y2;
      if (dotprod <= 0.0) {
          // px,py is on the side of X2,Y2 away from X1,Y1
          // distance to segment is length of (backwards) px,py vector
          // "length of its (clipped) projection" is now 0.0
          projlenSq = 0.0;
      } else {
          // px,py is between X1,Y1 and X2,Y2
          // dotprod is the length of the px,py vector
          // projected on the X2,Y2=>X1,Y1 vector times the
          // length of the X2,Y2=>X1,Y1 vector
          projlenSq = dotprod * dotprod / (X2 * X2 + Y2 * Y2);
      }
  }
    // Distance to line is now the length of the relative point
    // vector minus the length of its projection onto the line
    // (which is zero if the projection falls outside the range
    //  of the line segment).
    var lenSq = px * px + py * py - projlenSq;
    if (lenSq < 0) {
        lenSq = 0;
    }
    return Math.sqrt(lenSq)<coronaWidth;
};

