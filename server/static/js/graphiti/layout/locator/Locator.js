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
 * @class graphiti.layout.locator.Locator
 * 
 * Controls the location of an IFigure. 
 *
 * @author Andreas Herz
 */
graphiti.layout.locator.Locator= Class.extend({
    NAME : "graphiti.layout.locator.Locator",
   
    /**
     * @constructor
     * Initial Constructor
     * 
     * @param {graphiti.Figure} [parentShape] the parent or owner of the child 
     */
    init:function(parentShape )
    {
        this.parent = parentShape;
    },
    
    /**
     * @method
     * Returns the associated owner of the locator
     *
     * @return {graphiti.Figure}
     **/
    getParent:function()
    {
       return this.parent;
    },
    
    
    /**
     * @method
     * Set the associated owner of the locator
     *
     * @param {graphiti.Figure} parentShape
     **/
    setParent:function(parentShape)
    {
        this.parent= parentShape;
    },
    
    /**
     * @method
     * Controls the location of an I{@link graphiti.Figure} 
     *
     * @param {Number} index child index of the figure
     * @param {graphiti.Figure} figure the figure to control
     * 
     * @template
     **/
    relocate:function(index, figure)
    {
    	
    }
});