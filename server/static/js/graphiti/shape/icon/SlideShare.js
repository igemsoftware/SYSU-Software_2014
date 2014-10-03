
/**
 * @class graphiti.shape.icon.SlideShare

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.SlideShare();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.SlideShare = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.SlideShare",

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
        return this.canvas.paper.path("M28.952,12.795c-0.956,1.062-5.073,2.409-5.604,2.409h-4.513c-0.749,0-1.877,0.147-2.408,0.484c0.061,0.054,0.122,0.108,0.181,0.163c0.408,0.379,1.362,0.913,2.206,0.913c0.397,0,0.723-0.115,1-0.354c1.178-1.007,1.79-1.125,2.145-1.125c0.421,0,0.783,0.193,0.996,0.531c0.4,0.626,0.106,1.445-0.194,2.087c-0.718,1.524-3.058,3.171-5.595,3.171c-0.002,0-0.002,0-0.004,0c-0.354,0-0.701-0.033-1.033-0.099v3.251c0,0.742,1.033,2.533,4.167,2.533s3.955-3.701,3.955-4.338v-4.512c2.23-1.169,4.512-1.805,5.604-3.895C30.882,12.05,29.907,11.733,28.952,12.795zM21.942,17.521c0.796-1.699-0.053-1.699-1.54-0.425s-3.665,0.105-4.408-0.585c-0.743-0.689-1.486-1.22-2.814-1.167c-1.328,0.053-4.46-0.161-6.267-0.585c-1.805-0.425-4.895-3-5.15-2.335c-0.266,0.69,0.211,1.168,1.168,2.335c0.955,1.169,5.075,2.778,5.075,2.778s0,3.453,0,4.886c0,1.435,2.973,3.61,4.512,3.61s2.708-1.062,2.708-1.806v-4.512C17.775,21.045,21.146,19.221,21.942,17.521zM20.342,13.73c1.744,0,3.159-1.414,3.159-3.158c0-1.745-1.415-3.159-3.159-3.159s-3.158,1.414-3.158,3.159C17.184,12.316,18.598,13.73,20.342,13.73zM12.019,13.73c1.744,0,3.158-1.414,3.158-3.158c0-1.745-1.414-3.159-3.158-3.159c-1.745,0-3.159,1.414-3.159,3.159C8.86,12.316,10.273,13.73,12.019,13.73z");
    }
});

