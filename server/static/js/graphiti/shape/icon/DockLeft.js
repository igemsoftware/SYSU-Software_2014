
/**
 * @class graphiti.shape.icon.DockLeft

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.DockLeft();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.DockLeft = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.DockLeft",

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
        return this.canvas.paper.path("M3.084,7.333v16.334h24.832V7.333H3.084z M11.667,10.332h13.251v10.336H11.667V10.332z");
    }
});

