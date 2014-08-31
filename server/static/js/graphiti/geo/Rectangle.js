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
 * @class graphiti.geo.Rectangle
 * 
 * Util class for geometrie handling.
 * 
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends graphiti.geo.Point
 */
graphiti.geo.Rectangle = graphiti.geo.Point.extend({

    NAME : "graphiti.geo.Rectangle",
    
    /**
     * @constructor 
     * Creates a new Point object with the hands over coordinates.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    init : function( x, y,  w, h)
    {
    	this._super(x,y);
        this.w = w;
        this.h = h;
    },


    /**
     * @method
     * @private
     */
    adjustBoundary:function(){
        if(this.bx===null){
            return;
        }
        this.x = Math.min(Math.max(this.bx, this.x), this.bw-this.w);
        this.y = Math.min(Math.max(this.by, this.y), this.bh-this.h);
        this.w = Math.min(this.w, this.bw);
        this.h = Math.min(this.h, this.bh);
    },
    
	/**
	 * @method
	 * Resizes this Rectangle by the values supplied as input and returns this for 
	 * convenience. This Rectangle's width will become this.width + dw. This 
	 * Rectangle's height will become this.height + dh.
	 * <br>
	 * The method return the object itself. This allows you to do command chaining, where 
	 * you can perform multiple methods on the same elements.
	 *
	 *
	 * @param {Number} dw  Amount by which width is to be resized
	 * @param {Number} dh  Amount by which height is to be resized
	 * 
	 * @return  {graphiti.geo.Rectangle} The method return the object itself
	 **/
	resize:function(/*:int*/ dw, /*:int*/ dh)
	{
	  this.w +=dw;
	  this.h +=dh;
      this.adjustBoundary();
	  return this;
	},
	
	/**
	 * Sets the parameters of this Rectangle from the Rectangle passed in and
	 * returns this for convenience.<br>
	 * <br>
	 * The method return the object itself. This allows you to do command chaining, where 
	 * you can perform multiple methods on the same elements.
	 *
	 * @param {graphiti.geo.Rectangle} Rectangle providing the bounding values
	 * 
	 * @return  {graphiti.geo.Rectangle} The method return the object itself
	 */
	setBounds:function( rect)
	{
	    this.setPosition(rect,x,rect,y);

	    this.w = rect.w;
	    this.h = rect.h;
	    
  	   return this;
	},
	
	/**
	 * @method
	 * Returns <code>true</code> if this Rectangle's width or height is less than or
	 * equal to 0.
	 * 
	 * @return {Boolean}
	 */
	isEmpty:function()
	{
	  return this.w <= 0 || this.h <= 0;
	},
	
	/**
	 * @method
	 * The width of the dimension element.
	 * 
	 * @return {Number}
	 **/
	getWidth:function()
	{
	  return this.w;
	},
	
	/**
	 * @method
	 * Set the new width of the rectangle.
	 * 
	 * @param {Number} w the new width of the rectangle
	 */
	setWidth: function(w){
      this.w = w;
      this.adjustBoundary();
      return this;
	},
	
	/**
	 * @method
	 * The height of the dimension element.
	 * 
	 * @return {Number}
	 **/
	getHeight:function()
	{
	  return this.h;
	},
    /**
     * @method
     * Set the new height of the rectangle.
     * 
     * @param {Number} h the new height of the rectangle
     */
    setHeight: function(h){
      this.h = h;
      this.adjustBoundary();
      return this;
    },	
	
	/**
	 * @method
	 * The x coordinate of the right corner.
	 * 
	 * @return {Number}
	 **/
	getRight:function()
	{
	  return this.x+this.w;
	},
	
	/**
	 * @method
	 * The y coordinate of the bottom.
	 * 
	 *@return {Number}
	 **/
	getBottom:function()
	{
	  return this.y+this.h;
	},
	
	/**
	 * @method
	 * The top left corner of the dimension object.
	 * 
	 * @return {graphiti.geo.Point} a new point objects which holds the coordinates
	 **/
	getTopLeft:function()
	{
	  return new graphiti.geo.Point(this.x,this.y);
	},
	
    /**
     * @method
     * The top center coordinate of the dimension object.
     * 
     * @return {graphiti.geo.Point} a new point objects which holds the coordinates
     **/
    getTopCenter:function()
    {
      return new graphiti.geo.Point(this.x+(this.w/2),this.y);
    },

    /**
	 * @method
	 * The top right corner of the dimension object.
	 * 
	 * @return {graphiti.geo.Point} a new point objects which holds the coordinates
	 **/
	getTopRight:function()
	{
	  return new graphiti.geo.Point(this.x+this.w,this.y);
	},
		
	/**
	 * @method
	 * The bottom left corner of the dimension object.
	 * 
	 * @return {graphiti.geo.Point} a new point objects which holds the coordinates
	 **/
	getBottomLeft:function()
	{
	  return new graphiti.geo.Point(this.x,this.y+this.h);
	},
	
	/**
     * @method
     * The bottom center coordinate of the dimension object.
     * 
     * @return {graphiti.geo.Point} a new point objects which holds the coordinates
     **/
    getBottomCenter:function()
    {
      return new graphiti.geo.Point(this.x+(this.w/2),this.y+this.h);
    },
    
	/**
	 * @method
	 * The center of the dimension object
	 * 
	 * @return {graphiti.geo.Point} a new point which holds the center of the object
	 **/
	getCenter:function()
	{
	  return new graphiti.geo.Point(this.x+this.w/2,this.y+this.h/2);
	},
	
	
	/**
	 * @method
	 * Bottom right corner of the object
	 * 
	 * @return {graphiti.geo.Point} a new point which holds the bottom right corner
	 **/
	getBottomRight:function()
	{
	  return new graphiti.geo.Point(this.x+this.w,this.y+this.h);
	},
	
	
	/**
	 * @method
	 * Return a new rectangle which fits into this rectangle. <b>ONLY</b> the x/y coordinates
	 * will be changed. Not the dimension of the given rectangle.
	 * 
	 * @param {graphiti.geo.Rectangle} rect the rectangle to adjust
	 * @return the new shifted rectangle
	 */
	moveInside: function(rect){
	    var newRect = new graphiti.geo.Rectangle(rect.x,rect.y,rect.w,rect.h);
	    // shift the coordinate right/down if coordinate not inside the rect
	    //
	    newRect.x= Math.max(newRect.x,this.x);
	    newRect.y= Math.max(newRect.y,this.y);
	    
	    // ensure that the right border is inside this rect (if possible). 
	    //
	    if(newRect.w<this.w){
	        newRect.x = Math.min(newRect.x+newRect.w, this.x+this.w)-newRect.w; 
	    }
	    else{
	        newRect.x = this.x;
	    }
	    
	    // ensure that the bottom is inside this rectangle
	    //
        if(newRect.h<this.h){
            newRect.y = Math.min(newRect.y+newRect.h, this.y+this.h)-newRect.h; 
        }
        else{
            newRect.y = this.y;
        }

        return newRect;
	},
	
	/**
	 * @method
	 * Return the minimum distance of this rectangle to the given {@link graphiti.geo.Point} or 
	 * {link graphiti.geo.Rectangle}.
	 * 
	 * @param {graphiti.geo.Point} pointOrRectangle the reference point/rectangle for the distance calculation
	 */
	getDistance: function (pointOrRectangle){
		var cx = this.x;
		var cy = this.y;
		var cw = this.w;
		var ch = this.h;
		
		var ox = pointOrRectangle.getX();
		var oy = pointOrRectangle.getY();
		var ow = 1;
		var oh = 1;
		
		if(pointOrRectangle instanceof graphiti.geo.Rectangle){
			ow = pointOrRectangle.getWidth();
			oh = pointOrRectangle.getHeight();
		}
		var oct=9;

		// Determin Octant
		//
		// 0 | 1 | 2
		// __|___|__
		// 7 | 9 | 3
		// __|___|__
		// 6 | 5 | 4

		if(cx + cw <= ox){
			if((cy + ch) <= oy){
				oct = 0;
			}
			else if(cy >= (oy + oh)){
				oct = 6;
			}
			else{
				oct = 7;
			}
	    }
		else if(cx >= ox + ow){
			if(cy + ch <= oy){
				oct = 2;
			}
			else if(cy >= oy + oh){
				oct = 4;
			}
			else{
				oct = 3;
			}
		}
		else if(cy + ch <= oy){
			oct = 1;
		}
		else if(cy >= oy + oh){
			oct = 5;
		}
		else{
			return 0;
		}


		// Determin Distance based on Quad
		//
		switch( oct){
			case 0:
				cx = (cx + cw) - ox;
				cy = (cy + ch) - oy;
				return -(cx + cy) ;
			case 1:
				return -((cy + ch) - oy);
			case 2:
				cx = (ox + ow) - cx;
				cy = (cy + ch) - oy;
				return -(cx + cy);
			case 3:
				return -((ox + ow) - cx);
			case 4:
				cx = (ox + ow) - cx;
				cy = (oy + oh) - cy;
				return -(cx + cy);
			case 5:
				return -((oy + oh) - cy);
			case 6:
				cx = (cx + cw) - ox;
				cy = (oy + oh) - cy;
				return -(cx + cy);
			case 7:
				return -((cx + cw) - ox);
		}

		throw "Unknown data type of parameter for distance calculation in graphiti.geo.Rectangle.getDistnace(..)";
	},
	
	/**
	 * @method
	 * Compares two Dimension objects
	 * 
	 * @param {graphiti.geo.Rectangle} o
	 *@return {Boolean}
	 **/
	equals:function( o)
	{
	  return this.x==o.x && this.y==o.y && this.w==o.w && this.h==o.h;
	},
	
    /**
     * @method
     * Detect whenever the hands over coordinate is inside the figure.
     *
     * @param {Number} iX
     * @param {Number} iY
     * @returns {Boolean}
     */
    hitTest : function ( iX , iY)
    {
        var iX2 = this.x + this.getWidth();
        var iY2 = this.y + this.getHeight();
        return (iX >= this.x && iX <= iX2 && iY >= this.y && iY <= iY2);
    },
    
    toJSON : function(){
        return  { 
              width:this.w,
              height:this.h,
              x : this.x,
              y :this.y
          };
      }


});
