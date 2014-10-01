
/**
 * @class graphiti.shape.icon.End

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.End();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.End = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.End",

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
        return this.canvas.paper.path("M21.167,5.5,21.167,13.681,6.684,5.318,6.684,25.682,21.167,17.318,21.167,25.5,25.5,25.5,25.5,5.5z");
    }
});

