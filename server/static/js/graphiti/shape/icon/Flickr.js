
/**
 * @class graphiti.shape.icon.Flickr

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Flickr();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Flickr = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Flickr",

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
        return this.canvas.paper.path("M21.77,8.895c-2.379,0-4.479,1.174-5.77,2.969c-1.289-1.795-3.39-2.969-5.77-2.969c-3.924,0-7.105,3.181-7.105,7.105c0,3.924,3.181,7.105,7.105,7.105c2.379,0,4.48-1.175,5.77-2.97c1.29,1.795,3.391,2.97,5.77,2.97c3.925,0,7.105-3.182,7.105-7.105C28.875,12.075,25.694,8.895,21.77,8.895zM21.769,21.822c-3.211,0-5.821-2.61-5.821-5.821c0-3.213,2.61-5.824,5.821-5.824c3.213,0,5.824,2.611,5.824,5.824C27.593,19.212,24.981,21.822,21.769,21.822z");
    }
});

