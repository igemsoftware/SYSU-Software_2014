/**
The GPL License (GPL)

Copyright (c) 2012 Andreas Herz

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation; either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details. You should
have received a copy of the GNU General Public License along with this program; if
not, write to the Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston,
MA 02111-1307 USA

**/



/**
 * @class graphiti.shape.basic.PolyLine
 * 
 * A PolyLine is a line with more than 2 points.
 *
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.basic.Line
 */
graphiti.shape.basic.PolyLine = graphiti.shape.basic.Line.extend({
    
	NAME : "graphiti.shape.basic.PolyLine",

    BRIDE_HORIZONTAL_LR : " r 0 0 3 -4 7 -4 10 0 13 0 ", // Left to right
    BRIDE_HORIZONTAL_RL : " r 0 0 -3 -4 -7 -4 -10 0 -13 0 ", // right to left

    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     */
    init: function( ) {
        
      // internal status handling for performance reasons
      //
      this.svgPathString = null;
      this.oldPoint=null;
    
      // all line segments with start/end as simple object member
      this.lineSegments = new graphiti.util.ArrayList();
      this.basePoints = new graphiti.util.ArrayList();
      
      // all possible brides (line crossings)
      this.bridges = new graphiti.util.ArrayList();

      this._super();
      
      
      this.setColor(new  graphiti.util.Color(0,0,115));
      this.setStroke(1);
    },
    
    /**
     * @method
     * Set the start point of the line.
     *
     * @param {Number} x the x coordinate of the start point
     * @param {Number} y the y coordinate of the start point
     **/
    setStartPoint:function( x, y){
        this.repaintBlocked=true;
        this._super(x,y);
        this.calculatePath();
        
        this.repaintBlocked=false;
        this.repaint();
    },

    /**
     * Set the end point of the line.
     *
     * @param {Number} x the x coordinate of the end point
     * @param {Number} y the y coordinate of the end point
     **/
    setEndPoint:function(x,  y){
        this.repaintBlocked=true;
        this._super(x,y);
        this.calculatePath();
        
        this.repaintBlocked=false;
        this.repaint();
    },

    /**
     * @method
     * Calculate the path of the polyline
     * 
     * @private
     */
    calculatePath: function(){
        
        if(this.shape===null){
            return;
        }
    
        this.svgPathString = null;
        
        // cleanup the routing cache
        //
        this.oldPoint=null;
        this.lineSegments = new graphiti.util.ArrayList();
        this.basePoints = new graphiti.util.ArrayList();
    
        // Use the internal router
        //
        this.router.route(this);
    },
    
    /**
     * @private
     **/
    repaint : function()
    {
      if(this.repaintBlocked===true || this.shape===null){
          return;
      }
      
      if(this.svgPathString===null){
          if(this.lineSegments.getSize()==0){
              this.calculatePath();
          }
          
          var intersections = this.getCanvas().getIntersection(this);
          
          var i=0;

          var ps = this.getPoints();
          var p = ps.get(0);
          var path = ["M",p.x," ",p.y];
          var oldP = p;
          for( i=1;i<ps.getSize();i++){
                p = ps.get(i);
                
                intersections.sort("x");
                
                // check for intersection and paint a bridge if required
                // line goes from left to right
                //
                var bridgeWidth = 5;
                var bridgeCode = this.BRIDE_HORIZONTAL_LR;
                
                // line goes from right->left. Inverse the bridge and the bridgeWidth
                //
                if (oldP.x > p.x) {
                    intersections = intersections.reverse();
                    bridgeCode =this.BRIDE_HORIZONTAL_RL;
                    bridgeWidth = -bridgeWidth;
                }
                
                intersections.each($.proxy(function(ii, interP)
                {
                    if (graphiti.shape.basic.Line.hit(1, oldP.x, oldP.y, p.x, p.y, interP.x, interP.y) === true) {
                        // we draw only horizontal bridges. Just a design issue
                        if (p.y === interP.y) {
                            path.push("L", (interP.x - bridgeWidth), " ", interP.y);
                            path.push(bridgeCode);
                        }
                    }

                }, this));

                path.push("L", p.x, " ", p.y);
                oldP = p;
            }
          this.svgPathString = path.join("");
      }
      
      this._super({path:this.svgPathString});
    },
    

    /**
     * @method
     * Called by the framework during drag&drop operations.
     * 
     * @param {graphiti.Figure} draggedFigure The figure which is currently dragging
     * 
     * @return {Boolean} true if this port accepts the dragging port for a drop operation
     * @template
     **/
    onDragEnter : function( draggedFigure ){
    	this.setGlow(true);
    	return true;
    },
 
    /**
     * @method
     * Called if the DragDrop object leaving the current hover figure.
     * 
     * @param {graphiti.Figure} draggedFigure The figure which is currently dragging
     * @template
     **/
    onDragLeave:function( draggedFigure ){
    	this.setGlow(false);
    },


    /**
     * @method
     * Returns the fulcrums of the connection
     *
     * @return {graphiti.util.ArrayList} an graphiti.util.ArrayList of type graphiti.Point
     **/
    getPoints:function()
    {
        return this.basePoints;
    },
    
    /**
     * @method
     * Return all line segments of the polyline.
     * 
     * @returns {graphiti.util.ArrayList}
     */
    getSegments: function(){
        return this.lineSegments;
    },
    
    /**
     * @method
     * used for the router to add the calculated points
     * 
     * @private
     *
     **/
    addPoint:function(/*:graphiti.geo.Point*/ p)
    {
      p = new graphiti.geo.Point(p.x, p.y);
      this.basePoints.add(p);
      if(this.oldPoint!==null){
        // store the painted line segment for the "mouse selection test"
        // (required for user interaction)
        this.lineSegments.add({start: this.oldPoint, end:p});
      }
      
      this.oldPoint = p;
    },

    /**
     * @see graphiti.Figure#onOtherFigureHasMoved
     **/
    onOtherFigureIsMoving:function(/*:graphiti.Figure*/ figure)
    {
      this.repaintBlocked=true;
      this._super(figure);
      this.calculatePath();
      
      this.repaintBlocked=false;
      this.repaint();
    },
    
    /**
     * @method
    * Checks if the hands over coordinate close to the line. The 'corona' is considered
    * for this test. This means the point isn't direct on the line. Is it only close to the
    * line!
    *
    * @param {Number} px the x coordinate of the test point
    * @param {Number} py the y coordinate of the test point
    * @return {boolean}
     **/
    hitTest:function( px, py)
    {
      for(var i = 0; i< this.lineSegments.getSize();i++){
         var line = this.lineSegments.get(i);
         if(graphiti.shape.basic.Line.hit(this.corona, line.start.x,line.start.y,line.end.x, line.end.y, px,py)){
           return true;
         }
      }
      return false;
    },

    /**
     * @method
     * Returns the Command to perform the specified Request or null.
      *
     * @param {graphiti.command.CommandType} request describes the Command being requested
     * @return {graphiti.command.Command}
     **/
    createCommand:function(request) 
    {
 
      if(request.getPolicy() === graphiti.command.CommandType.DELETE){
        if(this.isDeleteable()===true){
          return new graphiti.command.CommandDelete(this);
        }
      }
    
      return null;
    }
});

