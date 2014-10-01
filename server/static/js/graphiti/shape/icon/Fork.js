
/**
 * @class graphiti.shape.icon.Fork

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Fork();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Fork = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Fork",

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
        return this.canvas.paper.path("M13.741,10.249h8.045v2.627l7.556-4.363l-7.556-4.363v2.598H9.826C11.369,7.612,12.616,8.922,13.741,10.249zM21.786,20.654c-0.618-0.195-1.407-0.703-2.291-1.587c-1.79-1.756-3.712-4.675-5.731-7.227c-2.049-2.486-4.159-4.972-7.451-5.091h-3.5v3.5h3.5c0.656-0.027,1.683,0.486,2.879,1.683c1.788,1.753,3.712,4.674,5.731,7.226c1.921,2.331,3.907,4.639,6.863,5.016v2.702l7.556-4.362l-7.556-4.362V20.654z");
    }
});

