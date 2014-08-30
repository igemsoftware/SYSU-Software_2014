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
 * @class graphiti.policy.RegionConstraintPolicy
 * 
 * An EditPolicy for use with Figures. The constraint for RegionContraintPolicy is a Rectangle. It is
 * not possible to move the related figure outside this contrained area.
 * 
 * 
 * @author Andreas Herz
 * 
 * @extends graphiti.policy.DragDropEditPolicy
 */
graphiti.policy.RegionEditPolicy = graphiti.policy.DragDropEditPolicy.extend({

    /**
     * @constructor 
     * Creates a new constraint object
     * 
     * @param {Number|graphiti.geo.Rectangle} x x coordinate or a rectangle as constraint for the assigned figure.
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    init: function( x,y,w,h){
        this._super();
        if(x instanceof graphiti.geo.Rectangle){
            this.constRect = x;
        }
        else if(typeof h === "number"){
            this.constRect = new graphiti.geo.Rectangle(x,y,w,h);
        }
        else{
            throw "Invalid parameter. RegionConstraintPolicy need a rectangle as parameter in the constructor";
        }
    },


    /**
     * @method
     * Adjust the coordinates to the rectangle/region of this contraint.
     * 
     * @param figure
     * @param {Number|graphiti.geo.Point} x
     * @param {number} [y]
     * @returns {graphiti.geo.Point} the contraint position of th efigure
     */
    apply : function(figure, x, y)
    {
        var r = null;
        if (x instanceof graphiti.geo.Point) {
            r = new graphiti.geo.Rectangle(x.x, x.y, figure.getWidth(), figure.getHeight());
        }
        else {
            r = new graphiti.geo.Rectangle(x, y, figure.getWidth(), figure.getHeight());
        }
        r = this.constRect.moveInside(r);
        return r.getTopLeft();
    }
    
});