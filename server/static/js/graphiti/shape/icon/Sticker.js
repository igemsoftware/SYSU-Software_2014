
/**
 * @class graphiti.shape.icon.Sticker

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Sticker();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Sticker = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Sticker",

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
        return this.canvas.paper.path("M15.5,1.999c-1.042,0-1.916,0.377-2.57,1.088L2.895,13.138C2.302,13.784,1.999,14.58,1.999,15.5C1.999,22.943,8.057,29,15.5,29S29,22.943,29,15.5S22.943,1.999,15.5,1.999zM15.5,28C8.596,28,3,22.404,3,15.5c0-3.452,5.239-2.737,7.501-4.999C12.762,8.239,12.048,3,15.5,3C22.404,3,28,8.597,28,15.5S22.404,28,15.5,28z");
    }
});

