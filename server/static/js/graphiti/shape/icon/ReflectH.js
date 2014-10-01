
/**
 * @class graphiti.shape.icon.ReflectH

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.ReflectH();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.ReflectH = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.ReflectH",

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
        return this.canvas.paper.path("M15.57,20.273h0.854v-1.705H15.57V20.273zM15.57,23.686h0.854V21.98H15.57V23.686zM15.57,27.096h0.854v-1.705H15.57V27.096zM15.57,29.689h0.854V28.8H15.57V29.689zM15.57,16.865h0.854V15.16H15.57V16.865zM15.57,3.225h0.854V1.52H15.57V3.225zM15.57,6.635h0.854V4.93H15.57V6.635zM15.57,10.045h0.854V8.34H15.57V10.045zM15.57,13.455h0.854V11.75H15.57V13.455zM18.41,3.327V25.46h12.015L18.41,3.327zM19.264,6.68l9.729,17.93h-9.729V6.68zM13.535,25.46V3.327L1.521,25.46H13.535z");
    }
});

