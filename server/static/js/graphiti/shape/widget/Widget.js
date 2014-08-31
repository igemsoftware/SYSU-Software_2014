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
 * @class graphiti.shape.widget.Widget
 * Base class for all diagrams.
 * 
 * @extends graphiti.SetFigure
 */
graphiti.shape.widget.Widget = graphiti.SetFigure.extend({
    
    init: function( width, height){
        this._super( width, height);
    },
    

    /**
     * @method
     * Return the calculate width of the set. This calculates the bounding box of all elements.
     * 
     * @return {Number} the calculated width of the label
     **/
    getWidth : function() {
        return this.width;
    },
    
    /**
     * @method
     * Return the calculated height of the set. This calculates the bounding box of all elements.
     * 
     * @return {Number} the calculated height of the label
     */
    getHeight:function(){
       return this.height;
    }
});