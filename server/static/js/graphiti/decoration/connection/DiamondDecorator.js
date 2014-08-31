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
 * @class graphiti.decoration.connection.DiamondDecorator
 * 
 * 
 * @inheritable
 * @author Andreas Herz
 * @extend graphiti.decoration.connection.Decorator
 */
graphiti.decoration.connection.DiamondDecorator = graphiti.decoration.connection.Decorator.extend({

	NAME : "graphiti.decoration.connection.DiamondDecorator",

	/**
	 * @constructor 
	 * 
	 * @param {Number} [width] the width of the arrow
	 * @param {Number} [height] the height of the arrow
	 */
	init : function(width, height)
	{	
        this._super( width, height);
	},

	/**
	 * Draw a filled diamond decoration.
	 * 
	 * It's not your work to rotate the arrow. The graphiti do this job for you.
	 * 
	 * @param {Raphael} paper the raphael paper object for the paint operation 
	 **/
	paint:function(paper)
	{
		var st = paper.set();
		var path = ["M", this.width/2," " , -this.height/2];  // Go to the top center..
		path.push(  "L", this.width  , " ", 0);               // ...draw line to the right middle
		path.push(  "L", this.width/2, " ", this.height/2);   // ...bottom center...
		path.push(  "L", 0           , " ", 0);               // ...left middle...
		path.push(  "L", this.width/2, " ", -this.height/2);  // and close the path
		path.push(  "Z");
		st.push(
	        paper.path(path.join(""))
		);
		st.attr({fill:this.backgroundColor.getHashStyle()});
		return st;
	}
	
});

