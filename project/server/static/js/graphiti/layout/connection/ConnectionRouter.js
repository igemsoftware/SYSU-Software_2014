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
 * @class graphiti.layout.connection.ConnectionRouter
 * Routes a {@link graphiti.Connection}, possibly using a constraint.
 *
 * @author Andreas Herz
 */
graphiti.layout.connection.ConnectionRouter = Class.extend({

	/**
	 * @constructor 
	 * Creates a new Router object
	 */
    init: function(){
    },
    
    /**
     * @method
     * Returns the direction the point <i>p</i> is in relation to the given rectangle.
     * Util method for inherit router implementations.
     * 
     * <p>
     * Possible values:
     * <ul>
     *   <li>up -&gt; 0</li>
     *   <li>right -&gt; 1</li>
     *   <li>down -&gt; 2</li>
     *   <li>left -&gt; 3</li>
     * </ul>
     * <p>
     * 
     * @param {graphiti.geo.Rectangle} r the rectangle
     * @param {graphiti.geo.Point} p the point in relation to the given rectangle
     * 
     * @return {Number} the direction from <i>r</i> to <i>p</i>
     */
    getDirection:function( r,  p) 
    {
        //  up     -> 0
        //  right  -> 1
        //  down   -> 2
        //  left   -> 3
       var distance = Math.abs(r.x - p.x);
       var direction = 3;
    
       var i=Math.abs(r.y - p.y);
       if (i <= distance) 
       {
          distance = i;
          direction = 0;
       }
    
       i = Math.abs(r.getBottom() - p.y);
       if (i <= distance) 
       {
          distance = i;
          direction = 2;
       }
    
       i = Math.abs(r.getRight() - p.x);
       if (i < distance) 
       {
          distance = i;
          direction = 1;
       }
    
       return direction;
    },
    
    /**
     * @method
     * Returns the direction for the connection in relation to the given port and it's parent.
     * 
     * <p>
     * Possible values:
     * <ul>
     *   <li>up -&gt; 0</li>
     *   <li>right -&gt; 1</li>
     *   <li>down -&gt; 2</li>
     *   <li>left -&gt; 3</li>
     * </ul>
     * <p>
     * 
     * @param {graphiti.Connection} conn the connection with the end port to examine
     * 
     * @return {Number} the direction
     */
    getEndDirection:function( conn)
    {
       var p = conn.getEndPoint();
       var rect = conn.getTarget().getParent().getBoundingBox();
       
       return this.getDirection(rect, p);
    },
    
    
    /**
     * @method
     * Returns the **direction** for the connection in relation to the given port and it's parent.
     * 
     * <p>
     * Possible values:
     * <ul>
     *   <li>up -&gt; 0</li>
     *   <li>right -&gt; 1</li>
     *   <li>down -&gt; 2</li>
     *   <li>left -&gt; 3</li>
     * </ul>
     * <p>
     * 
     * @param {graphiti.Connection} conn the connection with the start port to examine
     * 
     * @return {Number} the direction.
     */
    getStartDirection:function( conn)
    {
       var p = conn.getStartPoint();
       var rect = conn.getSource().getParent().getBoundingBox();
       return this.getDirection(rect, p);
    },
    
    /**
     * @method
     * Routes the Connection.
     * 
     * @param {graphiti.Connection} connection The Connection to route
     * @template
     */
    route:function( connection)
    {
    	throw "subclasses must implement the method [ConnectionRouter.route]";
    }   
});