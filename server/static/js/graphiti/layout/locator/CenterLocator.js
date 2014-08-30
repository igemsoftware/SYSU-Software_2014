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
 * @class graphiti.layout.locator.CenterLocator
 * 
 * A CenterLocator is used to place figures in the center of a parent shape.
 *
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *
 *     // create a basic figure and add a Label/child via API call
 *     //
 *     var circle = new graphiti.shape.basic.Circle(120);
 *     circle.setStroke(3);
 *     circle.setColor("#A63343");
 *     circle.setBackgroundColor("#E65159");
 *     circle.addFigure(new graphiti.shape.basic.Label("Center Label"), new graphiti.layout.locator.CenterLocator(circle));	
 *     canvas.addFigure( circle, 100,50);
 *
 *     
 * @author Andreas Herz
 * @extend graphiti.layout.locator.Locator
 */
graphiti.layout.locator.CenterLocator= graphiti.layout.locator.Locator.extend({
    NAME : "graphiti.layout.locator.CenterLocator",
    
    /**
     * @constructor
     * Constructs a locator with associated parent.
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
       target.setPosition(boundingBox.w/2-targetBoundingBox.w/2,boundingBox.h/2-(targetBoundingBox.h/2));
    }
});
