
/**
 * @class graphiti.shape.icon.Exchange

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Exchange();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Exchange = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Exchange",

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
        return this.canvas.paper.path("M21.786,12.876l7.556-4.363l-7.556-4.363v2.598H2.813v3.5h18.973V12.876zM10.368,18.124l-7.556,4.362l7.556,4.362V24.25h18.974v-3.501H10.368V18.124z");
    }
});

