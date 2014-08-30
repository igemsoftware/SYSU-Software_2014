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
 * @class graphiti.shape.diagram.Sparkline
 * 
 * Small data line diagram.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var testData = [];
 *     for(var i=0;i<100;i++) {
 *       testData.push(Math.floor(Math.random() * 100));
 *     }
 *     
 *     var sparkline = new graphiti.shape.diagram.Sparkline();
 *     sparkline.setData(testData);
 *   
 *     canvas.addFigure( sparkline,100,60);
 *     
 * @extends graphiti.shape.diagram.Diagram
 */
graphiti.shape.diagram.Sparkline = graphiti.shape.diagram.Diagram.extend({
    
    init: function( width, height){
        this.min = 0;
        this.max = 10;

        // set some feasible default values
        //
        if(typeof width === "undefined"){
            width=180;
            height=50;
        }
        
        this._super( width, height);
    },
    
    
    setData:function( data){
        this.min = Math.min.apply(Math, data);
        this.max = Math.max.apply(Math, data);

        if(this.max==this.min){
            this.max = this.min+1;
        }
        
        this._super(data);
    },
    
    /**
     * @method
     * Create the additional elements for the figure
     * 
     */
    createSet: function(){
        return this.canvas.paper.path("M0 0 l0 0");
    },
     
    /**
     * 
     * @param attributes
     */
    repaint: function(attributes){
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }

        attributes.fill= "90-#000:5-#4d4d4d:95";
        
        var padding = this.padding;
        var width = this.getWidth()- 2*+this.padding;
        var height= this.getHeight()- 2*+this.padding;
        var length= this.data.length;
        var min = this.min;
        var max = this.max;
        var toCoords = function(value, idx) {
            var step =1;
            // avoid divisionByZero
            if(length>1){
                step = (width/ (length-1));
            }

            return {
                y:  -((value-min)/(max-min) * height) + height+padding,
                x: padding+idx*step
            };
        };

        if(this.svgNodes!==null && (typeof this.cache.pathString ==="undefined")){
            var prev_pt=null;
            $.each(this.data, $.proxy(function(idx, item) {
                var pt = toCoords(item, idx);
                if(prev_pt===null) {
                    this.cache.pathString = [ "M", pt.x, pt.y].join(" ");
                }
                else{
                    this.cache.pathString = [ this.cache.pathString,"L", pt.x, pt.y].join(" ");
                }
                prev_pt = pt;
            },this));

            this.svgNodes.attr({path:this.cache.pathString, stroke: "#f0f0f0"});
            
        }
        this._super(attributes);
    }
});