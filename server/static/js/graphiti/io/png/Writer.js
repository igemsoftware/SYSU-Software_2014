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
 * @class graphiti.io.png.Writer
 * Convert the canvas document into a PNG Image.
 * 
 *     // example how to create a PNG image and set an 
 *     // image src attribute.
 *     //
 *     var writer = new graphiti.io.png.Writer();
 *     var png = writer.marshal(canvas);
 *     $("#preview").attr("src",png);
 *
 * @author Andreas Herz
 * @extends graphiti.io.Writer
 */
graphiti.io.png.Writer = graphiti.io.Writer.extend({
    
    init:function(){
        this._super();
    },
    
    /**
     * @method
     * Export the content to the implemented data format. Inherit class implements
     * content specific writer.
     * 
     * @param {graphiti.Canvas} canvas
     * @returns {String} base64 formated image in the format <strong><code>data:image/png;base64,iVBORw0KGg...</code></strong>
     */
    marshal: function(canvas){
        
        var svg = canvas.getHtmlContainer().html().replace(/>\s+/g, ">").replace(/\s+</g, "<");

        var canvas = $('<canvas id="canvas2" width="1000px" height="600px"></canvas>');
        $('body').append(canvas);
        canvg('canvas2', svg, { ignoreMouse: true, ignoreAnimation: true});

        var img = document.getElementById('canvas2').toDataURL("image/png");
        canvas.remove();
        return img;
    }
});