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
 * @class graphiti.layout.mesh.MeshLayouter
 * Layouter for a mesh or grid. 
 *
 * @author Andreas Herz
 */
graphiti.layout.mesh.MeshLayouter = Class.extend({

	/**
	 * @constructor 
	 * Creates a new layouter object.
	 */
    init: function(){
    },
    
    /**
     * @method
     * Return a changes list for an existing mesh/canvas to ensure that the element to insert 
     * did have enough space.
     * 
     * @param {graphiti.Canvas} canvas the canvas to use for the analytic
     * @param {graphiti.Figure} figure The figure to add to the exising canvas
     * 
     * 
     * @return {graphiti.util.ArrayList} a list of changes to apply if the user want to insert he figure.
     */
    add:function( canvas, figure)
    {
    	return new graphiti.util.ArrayList();
    }
});