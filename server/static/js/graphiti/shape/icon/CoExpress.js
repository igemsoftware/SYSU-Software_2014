// 
/**
 * @class graphiti.shape.icon.CoExpress

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.CoExpress();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Rathinho
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.CoExpress = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.CoExpress",

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
        return this.canvas.paper.image("../static/img/coexpress.png", 0, 0, 30, 30);
    }
});

