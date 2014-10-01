
/**
 * @class graphiti.shape.icon.SettingsAlt

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.SettingsAlt();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.SettingsAlt = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.SettingsAlt",

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
        return this.canvas.paper.path("M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM24.386,14.968c-1.451,1.669-3.706,2.221-5.685,1.586l-7.188,8.266c-0.766,0.88-2.099,0.97-2.979,0.205s-0.973-2.099-0.208-2.979l7.198-8.275c-0.893-1.865-0.657-4.164,0.787-5.824c1.367-1.575,3.453-2.151,5.348-1.674l-2.754,3.212l0.901,2.621l2.722,0.529l2.761-3.22C26.037,11.229,25.762,13.387,24.386,14.968z");
    }
});

