
/**
 * @class graphiti.shape.icon.NoMagnet

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.NoMagnet();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.NoMagnet = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.NoMagnet",

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
        return this.canvas.paper.path("M10.59,17.857v-5.225c-0.027-0.376,0.303-1.789,1.099-2.748c0.819-0.979,1.849-1.748,4.014-1.778c1.704,0.026,2.699,0.508,3.447,1.189l3.539-3.539c-1.616-1.526-4.01-2.679-6.986-2.652C12.077,3.073,9.3,4.779,7.762,6.793C6.2,8.826,5.617,10.928,5.59,12.634V19.5h3.357L10.59,17.857zM5.59,20.5v2.357L7.947,20.5H5.59zM20.812,13.29v6.21h5.002v-6.866c-0.021-1.064-0.252-2.283-0.803-3.542L20.812,13.29zM25.339,4.522L4.652,25.209l1.415,1.416L26.753,5.937L25.339,4.522zM20.812,25.58h5.002c0,0,0-2.354,0-5.08h-5.002C20.812,23.227,20.812,25.58,20.812,25.58zM10.59,25.58c0,0,0-0.827,0-2.064L8.525,25.58H10.59z");
    }
});

