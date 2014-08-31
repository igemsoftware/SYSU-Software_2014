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
 * @class graphiti.layout.locator.TopRightLocator
 * 
 * A TopRightLocator  is used to place figures at the top/right of a parent shape.
 *
 * @author Rathinho
 * @extend graphiti.layout.locator.Locator
 */
graphiti.layout.locator.TopRightLocator= graphiti.layout.locator.Locator.extend({
    NAME : "graphiti.layout.locator.TopRightLocator",
    
    /**
     * @constructor
     * Constructs a ManhattanMidpointLocator with associated Connection c.
     * 
     * @param {graphiti.Figure} parent the parent associated with the locator
     */
    init: function(parent)
    {
      this._super(parent);
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

       var parent = this.getParent();
       var boundingBox = parent.getBoundingBox();
    
       var targetBoundingBox = target.getBoundingBox();
       target.setPosition(boundingBox.w/2+2*(targetBoundingBox.w/2),-(targetBoundingBox.h+2));
    }
});
