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
 * @class graphiti.decoration.connection.Decorator 
 * 
 * 
 * @inheritable
 * @author Andreas Herz
 */
graphiti.decoration.connection.Decorator = Class.extend({

	NAME : "graphiti.decoration.connection.Decorator",

	/**
	 * @constructor 
	 */
	init : function(width, heigth) {

        if(typeof width === "undefined" || width<1)
          this.width  = 20;
        
        if(typeof height === "undefined" || height<1)
          this.height = 15;
        
		this.color = new graphiti.util.Color(0, 0, 0);
		this.backgroundColor = new  graphiti.util.Color(250, 250, 250);
	},

	/**
	 * @method
	 * Paint the decoration for a connector. The Connector starts always in
	 * [0,0] and ends in [x,0]
	 * 
	 * <pre>
	 *                | -Y
	 *                |
	 *                |
	 *  --------------+-----------------------------&gt; +X
	 *                |
	 *                |
	 *                |
	 *                V +Y
	 * 
	 * 
	 * </pre>
	 * 
	 * See in ArrowConnectionDecorator for example implementation.
	 * @param {Raphael} paper
	 */
	paint : function(paper) {
		// do nothing per default
	},

	/**
	 * @method
	 * Set the stroke color for the decoration
	 * 
	 * @param {graphiti.util.Color} c
	 */
	setColor : function(c) {
		this.color = c;
	},

	/**
	 * @method
	 * Set the background color for the decoration
	 * 
	 * @param {graphiti.util.Color} c
	 */
	setBackgroundColor : function(c) {
		this.backgroundColor = c;
	},
	
	/**
	 * @method
     * Change the dimension of the decoration shape
     *
     * @param {Number} width  The new width of the decoration
     * @param {Number} height The new height of the decoration
     **/
    setDimension:function( width, height)
    {
        this.width=width;
        this.height=height;
    }
	
});