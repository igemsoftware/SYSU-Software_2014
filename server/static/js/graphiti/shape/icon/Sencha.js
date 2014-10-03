
/**
 * @class graphiti.shape.icon.Sencha

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Sencha();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Sencha = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Sencha",

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
        return this.canvas.paper.path("M18.265,22.734c1.365,0.662,2.309,2.062,2.309,3.682c0,1.566-0.881,2.928-2.176,3.615l1.922-0.98c3.16-1.58,5.332-4.846,5.332-8.617c0-3.719-2.109-6.945-5.195-8.547l-6.272-3.144c-1.366-0.662-2.308-2.062-2.308-3.682c0-1.567,0.881-2.928,2.175-3.614L12.13,2.428c-3.161,1.578-5.332,4.843-5.332,8.616c0,3.718,2.108,6.944,5.195,8.546L18.265,22.734z");
    }
});

