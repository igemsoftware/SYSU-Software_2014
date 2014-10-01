graphiti.shape.icon.ProteinArrow = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.ProteinArrow",

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
        var path = this.canvas.paper.path("M0,14.5L6,14.5L6,12L18,12L18,9L24,14.5L30,14.5L30,15.5L24,15.5L18,21L18,18L6,18L6,15.5L0,15.5Z");
        path.matrix.d = 2.5;
        //M0,20L4,20L4,16L12,16L12,12L16,20L20,20L16,20L12,28L12,24L4,24L4,20Z
        //M0,14.5L6,15L6,12L18,12L18,9L24,14.5L30,14.5L30,15.5L24,15.5L18,21L18,18L6,18L0,15,5Z;
        return path;
    }
});