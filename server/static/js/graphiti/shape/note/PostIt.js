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
 * @class graphiti.shape.note.PostIt
 * 
 * Simple Post-it like figure with text. Can be used for annotations or documentation.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var shape =  new graphiti.shape.note.PostIt("This is a simple sticky note");
 *     shape.setColor("#000000");
 *     shape.setPadding(20);
 *          
 *     canvas.addFigure(shape,40,10);
 *     
 * @author Andreas Herz
 * @extends graphiti.shape.basic.Label
 */
graphiti.shape.note.PostIt= graphiti.shape.basic.Label.extend({

	NAME : "graphiti.shape.note.PostIt",

    /**
     * @constructor
     * Creates a new PostIt element.
     * 
     * @param {String} [text] the text to display
     */
    init : function(text)
    {
        this._super(text);
         
        this.setStroke(1);
        this.setBackgroundColor("#3d3d3d");
        this.setColor("#FFFFFF");
        this.setFontColor("#f0f0f0");
        this.setFontSize(18);
        this.setPadding(5);
        this.setRadius(5);
       
    }
});



