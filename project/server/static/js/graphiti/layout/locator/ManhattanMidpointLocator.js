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
 * @class graphiti.layout.locator.ManhattanMidpointLocator
 * 
 * A ManhattanMidpointLocator that is used to place figures at the midpoint of a Manhatten routed
 * connection.
 *
 * @author Andreas Herz
 * @extend graphiti.layout.locator.ConnectionLocator
 */
graphiti.layout.locator.ManhattanMidpointLocator= graphiti.layout.locator.ConnectionLocator.extend({
    NAME : "graphiti.layout.locator.ManhattanMidpointLocator",
    
    /**
     * @constructor
     * Constructs a ManhattanMidpointLocator with associated Connection c.
     * 
     * @param {graphiti.Connection} c the connection associated with the locator
     */
    init: function(c)
    {
      this._super(c);
    },
    
    
    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {graphiti.Figure} target The figure to relocate
     **/
    relocate:function(index, target)
    {
       var conn = this.getParent();
       var points = conn.getPoints();
       
       var index = Math.floor((points.getSize() -2) / 2);
       if (points.getSize() <= index+1)
          return; 
    
       var p1 = points.get(index);
       var p2 = points.get(index + 1);
    
       var x = parseInt((p2.x - p1.x) / 2 + p1.x +5);
       var y = parseInt((p2.y - p1.y) / 2 + p1.y +5);
    
       target.setPosition(x,y);
    }
});


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
 * @class graphiti.layout.locator.ManhattanMidpointLocator
 * 
 * A ManhattanMidpointLocator that is used to place figures at the midpoint of a Manhatten routed
 * connection.
 *
 * @author Andreas Herz
 * @extend graphiti.layout.locator.ConnectionLocator
 */
graphiti.layout.locator.MidpointLocator= graphiti.layout.locator.ConnectionLocator.extend({
    NAME : "graphiti.layout.locator.MidpointLocator",
    
    /**
     * @constructor
     * Constructs a ManhattanMidpointLocator with associated Connection c.
     * 
     * @param {graphiti.Connection} c the connection associated with the locator
     */
    init: function(c)
    {
      this._super(c);
    },
    
    
    /**
     * @method
     * Relocates the given Figure.
     *
     * @param {Number} index child index of the target
     * @param {graphiti.Figure} target The figure to relocate
     **/
    relocate:function(index, target)
    {
       var conn = this.getParent();
       var points = conn.getPoints();
       
       var index = Math.floor((points.getSize() -2) / 2);
       if (points.getSize() <= index+1)
          return; 
    
       var p1 = points.get(index);
       var p2 = points.get(index + 1);
    
       var x = parseInt((p2.x - p1.x) / 2 + p1.x +25);
       var y = parseInt((p2.y - p1.y) / 2 + p1.y +5);
    
       target.setPosition(x,y);
    }
});
