// 
/**
 * @class graphiti.shape.icon.PandR

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.PandR();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Rathinho
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.PandR = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.PandR",

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
        return this.canvas.paper.image("../static/img/PandR.png", 0, 0, 45, 30);
    }
});

