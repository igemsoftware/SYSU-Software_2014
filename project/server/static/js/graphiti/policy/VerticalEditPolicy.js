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
 * @class graphiti.policy.VerticalEditPolicy
 * 
 * An EditPolicy for use with Figures. The constraint for RegionContraintPolicy is a Rectangle. It is
 * not possible to move the related figure outside this contrained area.
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends graphiti.policy.DragDropEditPolicy
 */
graphiti.policy.VerticalEditPolicy = graphiti.policy.DragDropEditPolicy.extend({

    /**
     * @constructor 
     * Creates a new constraint object
     */
    init: function(){
        this._super();
    },


    /**
     * @method
     * It is only possible to drag&drop the element in a vertical line
     * 
     * @param figure
     * @param {Number|graphiti.geo.Point} x
     * @param {number} [y]
     * @returns {graphiti.geo.Point} the constraint position of the figure
     */
    apply : function(figure, x, y)
    {
        return new graphiti.geo.Point(figure.getX(),y);
    }
    
});