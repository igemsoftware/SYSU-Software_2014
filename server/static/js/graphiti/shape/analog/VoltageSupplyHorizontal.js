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
 * @class graphiti.shape.analog.VoltageSupplyHorizontal
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new graphiti.shape.analog.VoltageSupplyHorizontal();
 *     canvas.addFigure(figure,10,10);
 *     
 *     
 * @extends graphiti.SVGFigure
 */
graphiti.shape.analog.VoltageSupplyHorizontal = graphiti.SVGFigure.extend({

    NAME:"graphiti.shape.analog.VoltageSupplyHorizontal",
    
    // custom locator for the special design of the Input area
    MyInputPortLocator : graphiti.layout.locator.Locator.extend({
        init:function( ){
          this._super();
        },    
        relocate:function(index, figure){
            var h = figure.getParent().getHeight();
            figure.setPosition(0, h/2);
        }
    }),
    
    // custom locator for the special design of the Output area
    MyOutputPortLocator : graphiti.layout.locator.Locator.extend({
        init:function( ){
          this._super();
        },    
        relocate:function(index, figure){
            var w = figure.getParent().getWidth();
            var h = figure.getParent().getHeight();
            figure.setPosition(w, h/2);
        }
    }),

    /**
     * @constructor
     * Create a new instance
     */
    init:function(width, height){
        if(typeof width === "undefined"){
            width = 50;
            height= 30;
        }
        
        this._super(width,height);
        
        this.createPort("hybrid", new this.MyInputPortLocator());  // GND
        this.createPort("hybrid", new this.MyOutputPortLocator()); // VCC
    },
    

    getSVG: function(){
         return '<svg width="49" height="28" xmlns="http://www.w3.org/2000/svg" version="1.1">'+
                '<path d="m24.99933,18.95592l0,-9.54576m-5.78374,-9.40907l0,28.35939m-5.78718,-9.40457l0,-9.54576m-5.78374,-9.40907l0,28.35939" id="path10566" stroke-miterlimit="14.3" stroke="#010101" fill="none"/>'+
                '<path d="m26.79878,14.13039l6.90583,0m-33.22691,0l6.90583,0" id="path10568" stroke-miterlimit="14.3" stroke-linecap="square" stroke="#010101" fill="none"/>'+
                '</svg>';
    }
});