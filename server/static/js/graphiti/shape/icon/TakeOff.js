
/**
 * @class graphiti.shape.icon.TakeOff

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.TakeOff();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.TakeOff = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.TakeOff",

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
        return this.canvas.paper.path("M10.27,19.267c0,0,9.375-1.981,16.074-8.681c0,0,1.395-1.339-1.338-1.339c-2.305,0-5.6,2.438-5.6,2.438l-9.137-1.42l-1.769,1.769l4.983,2.411l-3.001,2.035l-2.571-1.285L6.09,16.052C6.09,16.052,8.02,18.062,10.27,19.267zM3.251,23.106v1.998h24.498v-1.998H3.251z");
    }
});

