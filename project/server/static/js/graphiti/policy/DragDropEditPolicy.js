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
 * @class graphiti.policy.DragDropEditPolicy
 * 
 * Called by the framework if the user edit the position of a figure with a drag drop operation.
 *
 * @author  Andreas Herz
 * @extends graphiti.policy.EditPolicy
 */
graphiti.policy.DragDropEditPolicy = graphiti.policy.EditPolicy.extend({

    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },
    
    /**
     * @method
     * Return the role of the edit policy
     * 
     * @template
     * @return the role of the policy.
     */
    getRole:function(){
        return graphiti.policy.EditPolicy.Role.PRIMARY_DRAG_ROLE;
    },
    
    /**
     * @method
     * Adjust the coordinates to the rectangle/region of this constraint.
     * 
     * @param figure
     * @param {Number|graphiti.geo.Point} x
     * @param {number} [y]
     * @returns {graphiti.geo.Point} the constraint position of the figure
     * 
     * @template
     */
    apply: function(figure, x,y){
        // do nothing per default implementation
        if(x instanceof graphiti.geo.Point){
            return x;
        }
        
        return new graphiti.geo.Point(x,y);
    }


});