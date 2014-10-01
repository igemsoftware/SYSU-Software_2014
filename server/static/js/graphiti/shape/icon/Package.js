
/**
 * @class graphiti.shape.icon.Package

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Package();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Package = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Package",

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
        return this.canvas.paper.path("M17.078,22.004l-1.758-4.129l-2.007,4.752l-7.519-3.289l0.174,3.905l9.437,4.374l10.909-5.365l-0.149-4.989L17.078,22.004zM29.454,6.619L18.521,3.383l-3.006,2.671l-3.091-2.359L1.546,8.199l3.795,3.048l-3.433,5.302l10.879,4.757l2.53-5.998l2.257,5.308l11.393-5.942l-3.105-4.709L29.454,6.619zM15.277,14.579l-9.059-3.83l9.275-4.101l9.608,3.255L15.277,14.579z");
    }
});

