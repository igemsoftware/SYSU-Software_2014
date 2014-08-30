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
 * @class graphiti.io.Reader
 * Template class for general import of a document into the canvas.
 * 
 * @author andreas Herz
 */

graphiti.io.Reader = Class.extend({
    
    /**
     * @constructor
     * @private
     */
    init: function(){
        
    },
    
    /**
     * @method
     * 
     * Restore the canvas from a given String.
     * 
     * @param {graphiti.Canvas} canvas the canvas to restore
     * @param {Object} document the document to read
     * @template
     */
    unmarshal: function(canvas, document){
        // do nothing. Inherit classes must implement this method
    }
});