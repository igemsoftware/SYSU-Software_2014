
/**
 * @class graphiti.shape.icon.Mic

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Mic();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Mic = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Mic",

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
        return this.canvas.paper.path("M15.5,21.125c2.682,0,4.875-2.25,4.875-5V5.875c0-2.75-2.193-5-4.875-5s-4.875,2.25-4.875,5v10.25C10.625,18.875,12.818,21.125,15.5,21.125zM21.376,11v5.125c0,3.308-2.636,6-5.876,6s-5.875-2.691-5.875-6V11H6.626v5.125c0,4.443,3.194,8.132,7.372,8.861v2.139h-3.372v3h9.749v-3h-3.376v-2.139c4.181-0.727,7.375-4.418,7.375-8.861V11H21.376z");
    }
});

