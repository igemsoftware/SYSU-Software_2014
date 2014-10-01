
/**
 * @class graphiti.shape.icon.No

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.No();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.No = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.No",

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
        return this.canvas.paper.path("M16,2.939C9.006,2.942,3.338,8.61,3.335,15.605C3.335,22.6,9.005,28.268,16,28.27c6.994-0.002,12.662-5.67,12.664-12.664C28.663,8.61,22.995,2.939,16,2.939zM25.663,15.605c-0.003,1.943-0.583,3.748-1.569,5.264L10.736,7.513c1.515-0.988,3.32-1.569,5.265-1.573C21.337,5.951,25.654,10.269,25.663,15.605zM6.335,15.605c0.004-1.943,0.584-3.75,1.573-5.266l13.355,13.357c-1.516,0.986-3.32,1.566-5.264,1.569C10.664,25.26,6.346,20.941,6.335,15.605z");
    }
});

