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
 * @class graphiti.io.svg.Writer
 * 
 * Serialize the canvas document into a SVG document.
 * 
 *      // Create a SVG writer and convert the canvas into a SVG document.
 *      //
 *      var writer = new graphiti.io.svg.Writer();
 *      var svg = writer.marshal(canvas);
 *      
 *      // insert the svg string into a DIV for preview or post
 *      // it via ajax to the server....
 *      $("#svg").text(svg);
 *
 * 
 * @author Andreas Herz
 * @extends graphiti.io.Writer
 */
graphiti.io.svg.Writer = graphiti.io.Writer.extend({
    
    init:function(){
        this._super();
    },
    
    /**
     * @method
     * Export the content of the canvas into SVG. The SVG document can be loaded with Inkscape or any other SVG Editor.
     * 
      * @param {graphiti.Canvas} canvas
     * @returns {String} the SVG document
     */
    marshal: function(canvas){
        var s =canvas.getCurrentSelection();
        canvas.setCurrentSelection(null);
        var svg = canvas.getHtmlContainer().html()
                     .replace(/>\s+/g, ">")
                     .replace(/\s+</g, "<");
        svg = this.formatXml(svg);
        svg = svg.replace(/<desc>.*<\/desc>/g,"<desc>Create with graphiti JS graph library and RaphaelJS</desc>");
        
        canvas.setCurrentSelection(s);
        return svg;
    }
});