
/**
 * @class graphiti.shape.icon.Vim

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Vim();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Vim = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Vim",

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
        return this.canvas.paper.path("M25.012,10.44l4.571-4.645c0.11-0.113,0.173-0.264,0.173-0.423V3.134c0-0.159-0.064-0.314-0.177-0.427l-0.604-0.602c-0.111-0.112-0.261-0.176-0.42-0.177l-9.646-0.086C18.71,1.84,18.523,1.935,18.41,2.099L17.807,2.96c-0.033,0.047-0.059,0.099-0.076,0.154l-2.144-2.156l0,0l-1.646,1.666l-0.447-0.497c-0.112-0.125-0.27-0.197-0.438-0.199L3.324,1.756c-0.163-0.003-0.322,0.06-0.437,0.176L2.284,2.535C2.171,2.647,2.107,2.803,2.107,2.962v2.325c0,0.164,0.066,0.32,0.183,0.434l0.657,0.635C3.056,6.461,3.2,6.521,3.352,6.525l0.285,0.007l0.007,6.512l-2.527,2.557l2.533,2.533l0.008,8.084c0,0.159,0.065,0.314,0.177,0.427l0.861,0.861c0.112,0.111,0.268,0.176,0.427,0.176h2.67c0.161,0,0.317-0.064,0.43-0.181l2.378-2.417l4.9,4.9l14.47-14.558L25.012,10.44zM9.747,24.232l-2.208,2.242H5.372l-0.509-0.509L4.856,19.34l-0.008-7.515L4.842,5.943c0-0.328-0.261-0.594-0.588-0.603L3.617,5.326L3.313,5.031v-1.82l0.245-0.245l9.215,0.163l0.319,0.354l0.126,0.141v1.419l-0.352,0.362H12.26c-0.331,0-0.6,0.266-0.603,0.597l-0.076,7.203c-0.002,0.244,0.141,0.463,0.365,0.56c0.224,0.096,0.482,0.049,0.657-0.12l7.495-7.235c0.174-0.171,0.23-0.432,0.139-0.66c-0.09-0.228-0.312-0.377-0.56-0.377h-0.479l-0.296-0.379V3.496l0.312-0.445l9.083,0.081l0.252,0.252v1.743l-4.388,4.458L9.747,24.232z");
    }
});

