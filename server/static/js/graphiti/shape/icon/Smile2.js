
/**
 * @class graphiti.shape.icon.Smile2

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Smile2();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Smile2 = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Smile2",

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
        return this.canvas.paper.path("M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM16,29.534C8.539,29.534,2.466,23.462,2.466,16C2.466,8.539,8.539,2.466,16,2.466c7.462,0,13.535,6.072,13.535,13.533C29.534,23.462,23.462,29.534,16,29.534zM11.104,14c0.932,0,1.688-1.483,1.688-3.312s-0.755-3.312-1.688-3.312s-1.688,1.483-1.688,3.312S10.172,14,11.104,14zM20.729,14c0.934,0,1.688-1.483,1.688-3.312s-0.756-3.312-1.688-3.312c-0.932,0-1.688,1.483-1.688,3.312S19.798,14,20.729,14zM8.143,21.189C10.458,24.243,13.148,26,16.021,26c2.969,0,5.745-1.868,8.11-5.109c-2.515,1.754-5.292,2.734-8.215,2.734C13.164,23.625,10.54,22.756,8.143,21.189z");
    }
});

