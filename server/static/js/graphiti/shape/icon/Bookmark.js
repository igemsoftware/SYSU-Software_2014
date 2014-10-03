
/**
 * @class graphiti.shape.icon.Bookmark

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Bookmark();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Bookmark = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Bookmark",

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
        return this.canvas.paper.path("M17.396,1.841L6.076,25.986l7.341-4.566l1.186,8.564l11.32-24.146L17.396,1.841zM19.131,9.234c-0.562-0.264-0.805-0.933-0.541-1.495c0.265-0.562,0.934-0.805,1.496-0.541s0.805,0.934,0.541,1.496S19.694,9.498,19.131,9.234z");
    }
});

