
/**
 * @class graphiti.shape.icon.Attention

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Attention();
 *     icon.setDimension(150,100);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Attention = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Attention",

    /**
     * 
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
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
        return this.canvas.paper.path("M26.711,14.086L16.914,4.29c-0.778-0.778-2.051-0.778-2.829,0L4.29,14.086c-0.778,0.778-0.778,2.05,0,2.829l9.796,9.796c0.778,0.777,2.051,0.777,2.829,0l9.797-9.797C27.488,16.136,27.488,14.864,26.711,14.086zM14.702,8.981c0.22-0.238,0.501-0.357,0.844-0.357s0.624,0.118,0.844,0.353c0.221,0.235,0.33,0.531,0.33,0.885c0,0.306-0.101,1.333-0.303,3.082c-0.201,1.749-0.379,3.439-0.531,5.072H15.17c-0.135-1.633-0.301-3.323-0.5-5.072c-0.198-1.749-0.298-2.776-0.298-3.082C14.372,9.513,14.482,9.22,14.702,8.981zM16.431,21.799c-0.247,0.241-0.542,0.362-0.885,0.362s-0.638-0.121-0.885-0.362c-0.248-0.241-0.372-0.533-0.372-0.876s0.124-0.638,0.372-0.885c0.247-0.248,0.542-0.372,0.885-0.372s0.638,0.124,0.885,0.372c0.248,0.247,0.372,0.542,0.372,0.885S16.679,21.558,16.431,21.799z");
    }
});

