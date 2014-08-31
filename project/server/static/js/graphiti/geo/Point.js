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
 * @class graphiti.geo.Point Util class for geometrie handling.
 */
graphiti.geo.Point = Class.extend({

    NAME : "graphiti.geo.Point",
    
    /**
     * @constructor 
     * Creates a new Point object with the hands over coordinates.
     * @param {Number} x
     * @param {Number} y
     */
    init : function(x, y)
    {
        this.x = parseInt(x);
        this.y = parseInt(y);

        // limit for the maxi/minimum boundary of this rectangle
        // It is not possible that the rect leave the boundary if set.
        this.bx = null;
        this.by = null;
        this.bw = null;
        this.bh = null;
    },

    
    /**
     * @method
     * Set the boundary of the rectangle. If set, the rectangle is always inside
     * the boundary. A setX or setY will always be adjusted.
     */
    setBoundary:function(bx, by, bw, bh){
        if(bx instanceof graphiti.geo.Rectangle){
            this.bx = bx.x;
            this.by = bx.y;
            this.bw = bx.w;
            this.bh = bx.h;
        }else
        {
            this.bx = bx;
            this.by = by;
            this.bw = bw;
            this.bh = bh;
        }
        this.adjustBoundary();
    },
    

    /**
     * @method
     * @private
     */
    adjustBoundary:function(){
        if(this.bx===null){
            return;
        }
        this.x = Math.min(Math.max(this.bx, this.x), this.bw);
        this.y = Math.min(Math.max(this.by, this.y), this.bh);
    },
    
    /**
     * @method
     * Moves this Rectangle horizontally by dx and vertically by dy, then returns 
     * this Rectangle for convenience.<br>
     * <br>
     * The method return the object itself. This allows you to do command chaining, where 
     * you can perform multiple methods on the same elements.
     *
     * @param {Number} dx  Shift along X axis
     * @param {Number} dy  Shift along Y axis
     * 
     * @return  {graphiti.geo.Rectangle} The method return the object itself
     **/
    translate:function( dx,  dy)
    {
      this.x +=dx;
      this.y +=dy;
      this.adjustBoundary();
      return this;
    },
        
    /**
     * @method 
     * The X value of the point
     * @since 0.1
     * @return {Number}
     */
    getX : function()
    {
        return this.x;
    },

    /**
     * @method 
     * The y value of the point
     * 
     * @return {Number}
     */
    getY : function()
    {
        return this.y;
    },

    /**
     * @method 
     * Set the new X value of the point
     * 
     * @param {Number} x the new value
     */
    setX : function(x)
    {
        this.x = x;
        this.adjustBoundary();
    },

    /**
     * @method 
     * Set the new Y value of the point
     * 
     * @param {Number}y the new value
     */
    setY : function(y)
    {
        this.y = y;
        this.adjustBoundary();
    },

    /**
     * @method
     * Set the new x/y coordinates of this point
     * 
     * @param {Number|graphiti.geo.Point} x
     * @param {Number} [y]
     */
    setPosition:function(x,y){
    	if(x instanceof graphiti.geo.Point){
     	   this.x=x.x;
    	   this.y=x.y;
    	}
    	else{
    	   this.x=x;
    	   this.y=y;
    	}
        this.adjustBoundary();
    },
    
    /**
     * @method 
     * Calculates the relative position of the specified Point to this Point.
     * 
     * @param {graphiti.geo.Point} p The reference Point
     * @return {graphiti.geo.PositionConstants} NORTH, SOUTH, EAST, or WEST, as defined in {@link graphiti.geo.PositionConstants}
     */
    getPosition : function(p)
    {
        var dx = p.x - this.x;
        var dy = p.y - this.y;
        if (Math.abs(dx) > Math.abs(dy))
        {
            if (dx < 0)
                return graphiti.geo.PositionConstants.WEST;
            return graphiti.geo.PositionConstants.EAST;
        }
        if (dy < 0)
            return graphiti.geo.PositionConstants.NORTH;
        return graphiti.geo.PositionConstants.SOUTH;
    },

    /**
     * @method 
     * Compares two points and return [true] if x and y are equals.
     * 
     * @param {graphiti.geo.Point} p the point to compare with
     * @return boolean
     */
    equals : function(p)
    {
        return this.x === p.x && this.y === p.y;
    },

    /**
     * @method 
     * Return the distance between this point and the hands over.
     * 
     * @param {graphiti.geo.Point}
     *            p the point to use
     * @return {Number}
     */
    getDistance : function(other)
    {
        return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
    },

    /**
     * @method 
     * Return a new Point translated with the x/y values of the hands over point.
     * 
     * @param {graphiti.geo.Point} other the offset to add for the new point.
     * @return {graphiti.geo.Point} The new translated point.
     */
    getTranslated : function(other)
    {
        return new graphiti.geo.Point(this.x + other.x, this.y + other.y);
    },

    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        return {
            x : this.x,
            y : this.y
        };
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
        this.x    = memento.x;
        this.y    = memento.y;
    }
    
});