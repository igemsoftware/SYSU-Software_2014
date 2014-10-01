
/**
 * @class graphiti.shape.icon.Employee

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Employee();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Employee = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Employee",

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
        return this.canvas.paper.path("M28.523,23.813c-0.518-0.51-6.795-2.938-7.934-3.396c-1.132-0.451-1.584-1.697-1.584-1.697s-0.51,0.282-0.51-0.51c0-0.793,0.51,0.51,1.021-2.548c0,0,1.414-0.397,1.133-3.68l-0.338,0.001c0,0,0.85-3.511,0-4.699c-0.854-1.188-1.188-1.981-3.062-2.548c-1.869-0.567-1.188-0.454-2.547-0.396c-1.359,0.057-2.492,0.793-2.492,1.188c0,0-0.849,0.057-1.188,0.397c-0.34,0.34-0.906,1.924-0.906,2.32s0.283,3.059,0.566,3.624l-0.337,0.112c-0.283,3.283,1.132,3.681,1.132,3.681c0.509,3.058,1.019,1.755,1.019,2.548c0,0.792-0.51,0.51-0.51,0.51s-0.452,1.246-1.584,1.697c-1.132,0.453-7.416,2.887-7.927,3.396c-0.511,0.521-0.453,2.896-0.453,2.896h26.954C28.977,26.709,29.039,24.332,28.523,23.813zM22.188,26.062h-4.562v-1.25h4.562V26.062z");
    }
});

