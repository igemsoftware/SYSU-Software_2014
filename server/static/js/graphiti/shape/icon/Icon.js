
/**
 * @class graphiti.shape.icon.Icon
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.VectorFigure
 */
graphiti.shape.icon.Icon = graphiti.SetFigure.extend({
    NAME : "graphiti.shape.icon.Icon",

    /**
     * 
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width, height) {
      this._super(width, height);
      this.setBackgroundColor("#333333");
    },

    /**
     * @method
     * propagate all attributes like color, stroke,... to the shape element
     **/
    repaint : function(attributes)
    {
        if(this.repaintBlocked===true || this.shape===null){
            return;
        }

        if (typeof attributes === "undefined") {
            attributes = {};
        }
        
        // redirect the bgColor to the inner set and not to the outer container
        //
        attributes.fill="none";
        if(this.svgNodes!==null) {
            this.svgNodes.attr({fill: this.bgColor.getHashStyle(), stroke:"none"});
        }
        
        this._super(attributes);
    },

    
    /**
     * @method
     * It is not possible to set different values width and height for a circle. The 
     * greater value of w and h will be used only.
     * 
     * @param {Number} w The new width of the circle.
     * @param {Number} h The new height of the circle.
     **/
    setDimension:function( w,  h)
    {
      if(w>h){
         this._super(w,w);
      }
      else{
         this._super(h,h);
      }
    }
    
});

