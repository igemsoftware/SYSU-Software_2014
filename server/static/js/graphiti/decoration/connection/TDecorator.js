/**
 * @class graphiti.decoration.connection.TDecorator
 * 
 * 
 * @inheritable
 * @author Rathinho
 * @extend graphiti.decoration.connection.Decorator
 */
graphiti.decoration.connection.TDecorator = graphiti.decoration.connection.Decorator.extend({

	NAME : "graphiti.decoration.connection.TDecorator",

	/**
	 * @constructor 
	 * 
	 * @param {Number} [width] the width of the arrow
	 * @param {Number} [height] the height of the arrow
	 */
    init : function(width, height)
    {   
        this._super( width, height);
        this.color = new graphiti.util.Color(225, 69, 69);
    },

	/**
	 * Draw a filled arrow decoration.
	 * It's not your work to rotate the arrow. The graphiti do this job for you.
	 * 
	 * <pre>
	 * 		+ [length , width/2]
	 * 		|
	 * 		|
	 * 		|==========================
	 * 		|
	 * 		|
	 * 		+ [length ,-width/2]
	 * 
	 *</pre>
	 * @param {Raphael} paper the raphael paper object for the paint operation 
	 **/
	paint:function(paper)
	{
		var st = paper.set();
		var path = ["M0 0"];  
		path.push(  "L", 0, " ", -this.height/2); 
		path.push(  "L", 0, " ", this.height/2);
		path.push(  "L0 0");
		path.push(  "M1 0");
		path.push(  "L", 1, " ", -this.height/2); 
		path.push(  "L", 1, " ", this.height/2);
		path.push(  "L1 0");
		path.push(  "M2 0");
		path.push(  "L", 2, " ", -this.height/2); 
		path.push(  "L", 2, " ", this.height/2);
		path.push(  "L2 0");
		path.push(  "M3 0");
		path.push(  "L", 3, " ", -this.height/2); 
		path.push(  "L", 3, " ", this.height/2);
		path.push(  "L3 0");
		path.push(  "Z");
		st.push(
	        paper.path(path.join(""))
		);
        st.attr({fill:this.backgroundColor.getHashStyle(), stroke: this.color.getHashStyle()});
		return st;
	}
});

