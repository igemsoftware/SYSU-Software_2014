
/**
 * @class graphiti.shape.icon.Smile

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Smile();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Smile = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Smile",

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
        return this.canvas.paper.path("M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM20.729,7.375c0.934,0,1.688,1.483,1.688,3.312S21.661,14,20.729,14c-0.932,0-1.688-1.483-1.688-3.312S19.798,7.375,20.729,7.375zM11.104,7.375c0.932,0,1.688,1.483,1.688,3.312S12.037,14,11.104,14s-1.688-1.483-1.688-3.312S10.172,7.375,11.104,7.375zM16.021,26c-2.873,0-5.563-1.757-7.879-4.811c2.397,1.564,5.021,2.436,7.774,2.436c2.923,0,5.701-0.98,8.215-2.734C21.766,24.132,18.99,26,16.021,26z");
    }
});

