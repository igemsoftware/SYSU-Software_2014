
/**
 * @class graphiti.shape.icon.Undo

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Undo();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Undo = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Undo",

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
        return this.canvas.paper.path("M12.981,9.073V6.817l-12.106,6.99l12.106,6.99v-2.422c3.285-0.002,9.052,0.28,9.052,2.269c0,2.78-6.023,4.263-6.023,4.263v2.132c0,0,13.53,0.463,13.53-9.823C29.54,9.134,17.952,8.831,12.981,9.073z");
    }
});

