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
 * @class graphiti.layout.mesh.ProposedMeshChange
 * Change proposal for grid/mesh layout changes.
 *
 * @author Andreas Herz
 */
graphiti.layout.mesh.ProposedMeshChange = Class.extend({

	/**
	 * @constructor 
	 * Createschange object.
	 */
    init: function(figure, x, y){
    	this.figure = figure;
    	this.x = x;
    	this.y = y;
    },
    
    /**
     * @method
     * Return the related figure.
     * 
     * @return {graphiti.Figure} the figure to the related change proposal
     */
    getFigure:function( )
    {
    	return this.figure;
    },
    
    /**
     * @method
     * The proposed x-coordinate.
     * 
     * @return {Number}
     */
    getX: function(){
    	return this.x;
    },
    
    /**
     * @method
     * The proposed y-coordinate
     * 
     * @return {Number}
     */
    getY: function(){
    	return this.y;
    }
    
});