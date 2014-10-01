
/**
 * @class graphiti.shape.icon.Merge

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Merge();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Merge = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Merge",

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
        return this.canvas.paper.path("M29.342,15.5l-7.556-4.363v2.613h-1.411c-0.788-0.01-1.331-0.241-2.019-0.743c-1.021-0.745-2.094-2.181-3.551-3.568C13.367,8.06,11.291,6.73,8.5,6.749H2.812v3.5H8.5c2.231,0.012,3.441,1.185,5.07,2.934c0.697,0.753,1.428,1.58,2.324,2.323c-1.396,1.165-2.412,2.516-3.484,3.501c-1.183,1.081-2.202,1.723-3.912,1.741H2.813v3.5h5.716c3.752,0.001,6.035-2.319,7.619-4.066c0.817-0.895,1.537-1.691,2.209-2.191c0.686-0.502,1.23-0.732,2.017-0.742h1.412v2.614L29.342,15.5z");
    }
});

