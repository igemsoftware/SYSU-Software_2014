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
 * @class graphiti.shape.diagram.Diagram
 * Base class for all digrams.
 * 
 * @extends graphiti.SetFigure
 */
graphiti.shape.diagram.Diagram = graphiti.SetFigure.extend({
    
    init: function( width, height){
        
        this.data = [];
        this.padding = 5;
        this.cache = {}; 
        
        this._super( width, height);
        
        this.setBackgroundColor("#8dabf2");
        this.setStroke(1);
        this.setColor("#f0f0f0");
        this.setRadius(2);
        this.setResizeable(true);
    },
    
    /**
     * @method
     * Set the data for the chart/diagram element
     * 
     * @param {Array} data
     */
    setData:function( data){
        this.data = data;
        this.cache={};
        

       if (this.svgNodes !== null) {
            this.svgNodes.remove();
            this.svgNodes = this.createSet();
        }
        
        this.repaint();
    },

    setDimension:function(w,h){
        this.cache={};
        this._super(w,h);
    },

    /**
     * @method
     * Return the calculate width of the set. This calculates the bounding box of all elements.
     * 
     * @return {Number} the calculated width of the label
     **/
    getWidth:function() {
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
    },
    
    /**
     * 
     * @param attributes
     */
    repaint:function(attributes){
        if(this.repaintBlocked===true || this.shape==null){
            return;
        }
        
        if (typeof attributes === "undefined") {
            attributes = {};
        }

        if(typeof attributes.fill ==="undefined"){
            attributes.fill= "none";
        }
         
        this._super(attributes);
    }
});