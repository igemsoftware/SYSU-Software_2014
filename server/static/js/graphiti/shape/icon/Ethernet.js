
/**
 * @class graphiti.shape.icon.Ethernet

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Ethernet();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Ethernet = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Ethernet",

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
        return this.canvas.paper.path("M22.5,8.5v3.168l3.832,3.832L22.5,19.332V22.5l7-7L22.5,8.5zM8.5,22.5v-3.168L4.667,15.5L8.5,11.668V8.5l-7,7L8.5,22.5zM15.5,14.101c-0.928,0-1.68,0.751-1.68,1.68c0,0.927,0.752,1.681,1.68,1.681c0.927,0,1.68-0.754,1.68-1.681C17.18,14.852,16.427,14.101,15.5,14.101zM10.46,14.101c-0.928,0-1.68,0.751-1.68,1.68c0,0.927,0.752,1.681,1.68,1.681s1.68-0.754,1.68-1.681C12.14,14.852,11.388,14.101,10.46,14.101zM20.541,14.101c-0.928,0-1.682,0.751-1.682,1.68c0,0.927,0.754,1.681,1.682,1.681s1.68-0.754,1.68-1.681C22.221,14.852,21.469,14.101,20.541,14.101z");
    }
});

