
/**
 * @class graphiti.shape.icon.List

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.List();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.List = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.List",

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
        return this.canvas.paper.path("M4.082,4.083v2.999h22.835V4.083H4.082zM4.082,20.306h22.835v-2.999H4.082V20.306zM4.082,13.694h22.835v-2.999H4.082V13.694zM4.082,26.917h22.835v-2.999H4.082V26.917z");
    }
});

