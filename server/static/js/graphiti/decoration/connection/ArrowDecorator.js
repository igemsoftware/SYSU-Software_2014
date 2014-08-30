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
 * @class graphiti.decoration.connection.ArrowDecorator
 * 
 * 
 * @inheritable
 * @author Andreas Herz
 * @extend graphiti.decoration.connection.Decorator
 */
graphiti.decoration.connection.ArrowDecorator = graphiti.decoration.connection.Decorator.extend({

	NAME : "graphiti.decoration.connection.ArrowDecorator",

	/**
	 * @constructor 
	 * 
	 * @param {Number} [width] the width of the arrow
	 * @param {Number} [height] the height of the arrow
	 */
    init : function(width, height)
    {   
        this._super( width, height);
        this.color = new graphiti.util.Color(67, 185, 103);
    },

	/**
	 * Draw a filled arrow decoration.
	 * It's not your work to rotate the arrow. The graphiti do this job for you.
	 * 
	 * <pre>
	 *                        ---+ [length , width/2]
	 *                 -------   |
	 * [3,0]   --------          |
	 *     +---                  |==========================
	 *         --------          |
	 *                 -------   |
	 *                        ---+ [length ,-width/2]
	 * 
	 *</pre>
	 * @param {Raphael} paper the raphael paper object for the paint operation 
	 **/
	paint:function(paper)
	{
		var st = paper.set();
		var path = ["M0 0"];
		path.push(  "L", this.width/2, " ", -this.height/2);
		path.push(  "M0 0");
		path.push(  "L", this.width/2, " ", this.height/2);
		path.push(  "L0 0");
		path.push(  "M1 0");
		path.push(  "L", this.width/2, " ", -this.height/2);
		path.push(  "M1 0");
		path.push(  "L", this.width/2, " ", this.height/2);
		path.push(  "L1 0");
		path.push(  "M2 0");
		path.push(  "L", this.width/2, " ", -this.height/2);
		path.push(  "M2 0");
		path.push(  "L", this.width/2, " ", this.height/2);
		path.push(  "L2 0");
		path.push(  "M3 0");
		path.push(  "L", this.width/2, " ", -this.height/2);
		path.push(  "M3 0");
		path.push(  "L", this.width/2, " ", this.height/2);
		path.push(  "L3 0");
		path.push(  "M4 0");
		path.push(  "L", this.width/2, " ", -this.height/2);
		path.push(  "M4 0");
		path.push(  "L", this.width/2, " ", this.height/2);
		path.push(  "L4 0");
		path.push(  "M5 0");
		path.push(  "L", this.width/2, " ", -this.height/2);
		path.push(  "M5 0");
		path.push(  "L", this.width/2, " ", this.height/2);
		path.push(  "L5 0");

		st.push(
	        paper.path(path.join(""))
		);
        st.attr({fill:this.backgroundColor.getHashStyle(), stroke: this.color.getHashStyle()});
		return st;
	}
});

