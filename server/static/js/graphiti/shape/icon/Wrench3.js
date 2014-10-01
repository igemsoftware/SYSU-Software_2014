
/**
 * @class graphiti.shape.icon.Wrench3

 * See the example:
 *
 *     @example preview small frame
 *     
 *     var icon =  new graphiti.shape.icon.Wrench3();
 *     icon.setDimension(50,50);
 *     canvas.addFigure(icon,50,10);
 *     
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.icon.Icon
 */
graphiti.shape.icon.Wrench3 = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.shape.icon.Wrench3",

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
        return this.canvas.paper.path("M27.839,6.775l-3.197,3.239L21.77,9.246l-0.771-2.874l3.188-3.231c-1.992-0.653-4.268-0.192-5.848,1.391c-1.668,1.668-2.095,4.111-1.279,6.172L7.42,20.344c-0.204-0.032-0.408-0.062-0.621-0.062c-2.173,0-3.933,1.759-3.933,3.933c0,2.173,1.76,3.933,3.933,3.933c2.171,0,3.931-1.76,3.933-3.933c0-0.24-0.03-0.473-0.071-0.7l9.592-9.59c2.069,0.828,4.523,0.406,6.202-1.272C28.047,11.062,28.504,8.772,27.839,6.775zM6.799,25.146c-0.517,0-0.933-0.418-0.935-0.933c0.002-0.515,0.418-0.933,0.935-0.933c0.514,0,0.932,0.418,0.932,0.933S7.313,25.146,6.799,25.146z");
    }
});

