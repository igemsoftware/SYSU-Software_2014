
/**
 * @class graphiti.shape.icon.Rotate

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Rotate();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Rotate = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Rotate",

    /**
     * 
     * @constructor
     * Creates a new icon element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width, height) {
      this._super(width, height);
    },

    /**
     * @private
     * @returns
     */
    createSet : function() {
        return this.canvas.paper.path("M15.5,5.27c1.914,0,3.666,0.629,5.089,1.686l-1.781,1.783l8.428,2.256l-2.26-8.427l-1.889,1.89C21.016,2.781,18.371,1.77,15.5,1.77C8.827,1.773,3.418,7.181,3.417,13.855c0.001,4.063,2.012,7.647,5.084,9.838v-4.887c-0.993-1.4-1.583-3.105-1.585-4.952C6.923,9.114,10.759,5.278,15.5,5.27zM9.5,29.23h12V12.355h-12V29.23z");
    }
});

