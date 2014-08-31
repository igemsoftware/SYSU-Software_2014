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
 * @class graphiti.ui.LabelEditor
 * Base class for all graphiti.shape.basic.Label editors. The default implementation is to open
 * a simple javascript prompt dialog.<br>
 * Use LabelInplaceEditor or your own implementation if you need more comfort. 
 * 
 * @author Andreas Herz
 */

graphiti.ui.LabelEditor = Class.extend({
    
    /**
     * @constructor
     * @private
     */
    init: function(){
        
    },
    
    /**
     * @method
     * Trigger the edit of the label text.
     * 
     * @param {graphiti.shape.basic.Label} label the label to edit
     */
    start: function( label){
        var newText = prompt("Label: ", label.getText());
        if(newText){
            label.setText(newText);
        }
    }
    
});