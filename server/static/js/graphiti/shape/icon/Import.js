
/**
 * @class graphiti.shape.icon.Import

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Import();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Import = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Import",

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
        return this.canvas.paper.path("M15.067,2.25c-5.979,0-11.035,3.91-12.778,9.309h3.213c1.602-3.705,5.271-6.301,9.565-6.309c5.764,0.01,10.428,4.674,10.437,10.437c-0.009,5.764-4.673,10.428-10.437,10.438c-4.294-0.007-7.964-2.605-9.566-6.311H2.289c1.744,5.399,6.799,9.31,12.779,9.312c7.419-0.002,13.437-6.016,13.438-13.438C28.504,8.265,22.486,2.252,15.067,2.25zM10.918,19.813l7.15-4.126l-7.15-4.129v2.297H-0.057v3.661h10.975V19.813z");
    }
});

