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
 * @class graphiti.io.json.Writer
 * Serialize the canvas document into a JSON object which can be read from the corresponding
 * {@link graphiti.io.json.Reader}.
 * 
 *      // Create a JSON writer and convert it into a JSON-String representation.
 *      //
 *      var writer = new graphiti.io.json.Writer();
 *      var json = writer.marshal(canvas);
 *      
 *      // convert the json object into string repesentation
 *      var jsonTxt = JSON.stringify(json,null,2);
 *      
 *      // insert the json string into a DIV for preview or post
 *      // it via ajax to the server....
 *      $("#json").text(jsonTxt);
 *
 * 
 * @author Andreas Herz
 * @extends graphiti.io.Writer
 */
graphiti.io.json.Writer = graphiti.io.Writer.extend({
    
    init:function(){
        this._super();
    },
    
    /**
     * @method
     * Export the content to the implemented data format. Inherit class implements
     * content specific writer.
     * 
      * @param {graphiti.Canvas} canvas
     * @returns {Object}
     */
    marshal: function(canvas){
        
        var result = [];
        var figures = canvas.getFigures();
        var i =0;
        var f= null;
        
        // conventional iteration over an array
        //
        for(i=0; i< figures.getSize(); i++){
            f = figures.get(i);
            result.push(f.getPersistentAttributes());
        }
        
        // jQuery style to iterate
        //
        var lines = canvas.getLines();
        lines.each(function(i, element){
            result.push(element.getPersistentAttributes());
        });
        
        return result;
    }
});