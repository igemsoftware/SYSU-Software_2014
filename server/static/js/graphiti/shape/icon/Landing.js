
/**
 * @class graphiti.shape.icon.Landing

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Landing();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Landing = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Landing",

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
        return this.canvas.paper.path("M23.322,19.491c0,0,1.903,0.342,0.299-1.869c-1.353-1.866-5.261-3.104-5.261-3.104l-4.213-8.229l-2.47-0.394l0.973,5.449L9.241,10.11L8.772,7.273L7.008,6.302c0,0-0.496,2.742-0.149,5.271C6.859,11.573,13.965,17.999,23.322,19.491zM3.251,23.106v1.998h24.498v-1.998H3.251zM14,17.94c0,0.414,0.336,0.75,0.75,0.75s0.75-0.336,0.75-0.75s-0.336-0.75-0.75-0.75S14,17.526,14,17.94z");
    }
});

