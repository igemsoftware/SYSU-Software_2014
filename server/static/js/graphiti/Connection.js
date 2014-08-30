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
 * @class graphiti.Connection
 *  A Connection is the line between two {@link graphiti.Port}s.
 *
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.shape.basic.Line
 */
graphiti.Connection = graphiti.shape.basic.PolyLine.extend({
    NAME : "graphiti.Connection",

//    DEFAULT_ROUTER: new graphiti.layout.connection.DirectRouter(),
    DEFAULT_ROUTER: new graphiti.layout.connection.ManhattanConnectionRouter(),
        
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     */
    init: function() {
      this._super();
      
      this.sourcePort = null;
      this.targetPort = null;
    
      this.oldPoint=null;
      
      this.sourceDecorator = null; /*:graphiti.ConnectionDecorator*/
      this.targetDecorator = null; /*:graphiti.ConnectionDecorator*/
      
      // decoration of the polyline
      //
      this.startDecoSet = null;
      this.endDecoSet=null;
  
      this.regulated = false;
      this.Activator = new g.Buttons.Activate();
      this.Repressor = new g.Buttons.Inhibit();

      this.sourceAnchor = new graphiti.ConnectionAnchor(this);
      this.targetAnchor = new graphiti.ConnectionAnchor(this);
    
      this.router = this.DEFAULT_ROUTER;

      this.setColor("#4cbf2f");
      this.setStroke(3);
    },
    

    /**
     * @private
     **/
    disconnect : function()
    {
        if (this.sourcePort !== null) {
            this.sourcePort.detachMoveListener(this);
            this.fireSourcePortRouteEvent();
        }

        if (this.targetPort !== null) {
            this.targetPort.detachMoveListener(this);
            this.fireTargetPortRouteEvent();
        }
    },
    
    
    /**
     * @private
     **/
    reconnect : function()
    {
        if (this.sourcePort !== null) {
            this.sourcePort.attachMoveListener(this);
            this.fireSourcePortRouteEvent();
        }

        if (this.targetPort !== null) {
            this.targetPort.attachMoveListener(this);
            this.fireTargetPortRouteEvent();
        }
        this.routingRequired =true;
        this.repaint();
    },
    
    
    /**
     * You can't drag&drop the resize handles of a connector.
     * @type boolean
     **/
    isResizeable : function()
    {
        return this.isDraggable();
    },
    
   
    /**
     * @method
     * Add a child figure to the Connection. The hands over figure doesn't support drag&drop 
     * operations. It's only a decorator for the connection.<br>
     * Mainly for labels or other fancy decorations :-)
     *
     * @param {graphiti.Figure} figure the figure to add as decoration to the connection.
     * @param {graphiti.layout.locator.ConnectionLocator} locator the locator for the child. 
    **/
    addFigure : function(child, locator)
    {
        // just to ensure the right interface for the locator.
        // The base class needs only 'graphiti.layout.locator.Locator'.
        if(!(locator instanceof graphiti.layout.locator.ConnectionLocator)){
           throw "Locator must implement the class graphiti.layout.locator.ConnectionLocator"; 
        }
        
        this._super(child, locator);
    },
    

    /**
     * @method
     * Set the ConnectionDecorator for this object.
     *
     * @param {graphiti.decoration.connection.Decorator} the new source decorator for the connection
     **/
    setSourceDecorator:function( decorator)
    {
      this.sourceDecorator = decorator;
      this.routingRequired = true;
      this.repaint();
    },
    
    /**
     * @method
     * Get the current source ConnectionDecorator for this object.
     *
     * @type graphiti.ConnectionDecorator
     **/
    getSourceDecorator:function()
    {
      return this.sourceDecorator;
    },
    
    /**
     * @method
     * Set the ConnectionDecorator for this object.
     *
     * @param {graphiti.decoration.connection.Decorator} the new target decorator for the connection
     **/
    setTargetDecorator:function( decorator)
    {
      this.targetDecorator = decorator;
      this.routingRequired =true;
      
      this.repaint();
    },
    
    /**
     * @method
     * Get the current target ConnectionDecorator for this object.
     *
     * @type graphiti.ConnectionDecorator
     **/
    getTargetDecorator:function()
    {
      return this.targetDecorator;
    },
    
    /**
     * @method
     * Set the ConnectionAnchor for this object. An anchor is responsible for the endpoint calculation
     * of an connection.
     *
     * @param {graphiti.ConnectionAnchor} the new source anchor for the connection
     **/
    setSourceAnchor:function(/*:graphiti.ConnectionAnchor*/ anchor)
    {
      this.sourceAnchor = anchor;
      this.sourceAnchor.setOwner(this.sourcePort);
      this.routingRequired =true;
      
      this.repaint();
    },
    
    /**
     * @method
     * Set the ConnectionAnchor for this object.
     *
     * @param {graphiti.ConnectionAnchor} the new target anchor for the connection
     **/
    setTargetAnchor:function(/*:graphiti.ConnectionAnchor*/ anchor)
    {
      this.targetAnchor = anchor;
      this.targetAnchor.setOwner(this.targetPort);
      this.routingRequired =true;
      
      this.repaint();
    },
    
    
    /**
     * @method
     * Set the ConnectionRouter.
     *
     **/
    setRouter:function(/*:graphiti.ConnectionRouter*/ router)
    {
      if(router !==null){
       this.router = router;
      }
      else{
       this.router = new graphiti.layout.connection.NullRouter();
      }
      this.routingRequired =true;
    
      // repaint the connection with the new router
      this.repaint();
    },
    
    /**
     * @method
     * Return the current active router of this connection.
     *
     * @type graphiti.ConnectionRouter
     **/
    getRouter:function()
    {
      return this.router;
    },
    
    /**
     * @method
     * Calculate the path of the polyline
     * 
     * @private
     */
    calculatePath: function(){
        
        if(this.sourcePort===null || this.targetPort===null){
            return;
        }
        
        this._super();
    },
    
    /**
     * @private
     **/
    repaint:function(attributes)
    {
      if(this.repaintBlocked===true || this.shape===null){
          return;
      }
      
      if(this.sourcePort===null || this.targetPort===null){
          return;
      }

      this._super(attributes);

	    // paint the decorator if any exists
	    //
	    if(this.getSource().getParent().isMoving===false && this.getTarget().getParent().isMoving===false )
	    {
	      if(this.targetDecorator!==null && this.endDecoSet===null){
	      	this.endDecoSet= this.targetDecorator.paint(this.getCanvas().paper);
	      }
	
	      if(this.sourceDecorator!==null && this.startDecoSet===null){
	      	this.startDecoSet= this.sourceDecorator.paint(this.getCanvas().paper);
	      }
	    }
	    
	    // translate/transform the decorations to the end/start of the connection 
	    // and rotate them as well
	    //
	    if(this.startDecoSet!==null){
	  	  this.startDecoSet.transform("r"+this.getStartAngle()+"," + this.getStartX() + "," + this.getStartY()+" t" + this.getStartX() + "," + this.getStartY());
	    }
        if(this.endDecoSet!==null){
            this.endDecoSet.transform("r"+this.getEndAngle()+"," + this.getEndX() + "," + this.getEndY()+" t" + this.getEndX() + "," + this.getEndY());
        }

    },
    

    postProcess: function(postPorcessCache){
    	this.router.postProcess(this, this.getCanvas(), postPorcessCache);
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
    onDragEnter : function( draggedFigure )
    {
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
    onDragLeave:function( draggedFigure )
    {
    	this.setGlow(false);
    },


    /**
     * Return the recalculated position of the start point if we have set an anchor.
     * 
     * @return graphiti.geo.Point
     **/
     getStartPoint:function()
     {
      if(this.isMoving===false){
         return this.sourceAnchor.getLocation(this.targetAnchor.getReferencePoint());
      }
      else{
         return this._super();
      }
     },
    
    
    /**
     * Return the recalculated position of the start point if we have set an anchor.
     *
     * @return graphiti.geo.Point
     **/
     getEndPoint:function()
     {
      if(this.isMoving===false){
         return this.targetAnchor.getLocation(this.sourceAnchor.getReferencePoint());
      }
      else{
         return this._super();
      }
     },
    
    /**
     * @method
     * Set the new source port of this connection. This enforce a repaint of the connection.
     *
     * @param {graphiti.Port} port The new source port of this connection.
     * 
     **/
    setSource:function( port)
    {
      if(this.sourcePort!==null){
        this.sourcePort.detachMoveListener(this);
      }
    
      this.sourcePort = port;
      if(this.sourcePort===null){
        return;
      }
      this.routingRequired = true;
      this.sourceAnchor.setOwner(this.sourcePort);
      this.fireSourcePortRouteEvent();
      this.sourcePort.attachMoveListener(this);
      this.setStartPoint(port.getAbsoluteX(), port.getAbsoluteY());
    },
    
    /**
     * @method
     * Returns the source port of this connection.
     *
     * @type graphiti.Port
     **/
    getSource:function()
    {
      return this.sourcePort;
    },
    
    /**
     * @method
     * Set the target port of this connection. This enforce a repaint of the connection.
     * 
     * @param {graphiti.Port} port The new target port of this connection
     **/
    setTarget:function( port)
    {
      if(this.targetPort!==null){
        this.targetPort.detachMoveListener(this);
      }
    
      this.targetPort = port;
      if(this.targetPort===null){
        return;
      }
      
      this.routingRequired = true;
      this.targetAnchor.setOwner(this.targetPort);
      this.fireTargetPortRouteEvent();
      this.targetPort.attachMoveListener(this);
      this.setEndPoint(port.getAbsoluteX(), port.getAbsoluteY());
    },
    
    /**
     * @method
     * Returns the target port of this connection.
     *
     * @type graphiti.Port
     **/
    getTarget:function()
    {
      return this.targetPort;
    },
    
    /**
     * 
     **/
    onOtherFigureIsMoving:function(/*:graphiti.Figure*/ figure)
    {
      if(figure===this.sourcePort){
        this.setStartPoint(this.sourcePort.getAbsoluteX(), this.sourcePort.getAbsoluteY());
      }
      else{
        this.setEndPoint(this.targetPort.getAbsoluteX(), this.targetPort.getAbsoluteY());
      }
      this._super(figure);
    },
    

    /**
     * Returns the angle of the connection at the output port (source)
     *
     **/
    getStartAngle:function()
    {
    	// return a good default value if the connection is not routed at the 
    	//  moment
    	if( this.lineSegments.getSize()===0){
    		return 0;
    	}
    	
      var p1 = this.lineSegments.get(0).start;
      var p2 = this.lineSegments.get(0).end;
      // if(this.router instanceof graphiti.layout.connection.BezierConnectionRouter)
      // {
      //  p2 = this.lineSegments.get(5).end;
      // }
      var length = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
      var angle = -(180/Math.PI) *Math.asin((p1.y-p2.y)/length);
    
      if(angle<0)
      {
         if(p2.x<p1.x){
           angle = Math.abs(angle) + 180;
         }
         else{
           angle = 360- Math.abs(angle);
         }
      }
      else
      {
         if(p2.x<p1.x){
           angle = 180-angle;
         }
      }
      return angle;
    },
    
    getEndAngle:function()
    {
      // return a good default value if the connection is not routed at the 
      //  moment
      if (this.lineSegments.getSize() === 0) {
        return 90;
      }
    
      var p1 = this.lineSegments.get(this.lineSegments.getSize()-1).end;
      var p2 = this.lineSegments.get(this.lineSegments.getSize()-1).start;
      // if(this.router instanceof graphiti.layout.connection.BezierConnectionRouter)
      // {
      //  p2 = this.lineSegments.get(this.lineSegments.getSize()-5).end;
      // }
      var length = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y));
      var angle = -(180/Math.PI) *Math.asin((p1.y-p2.y)/length);
    
      if(angle<0)
      {
         if(p2.x<p1.x){
           angle = Math.abs(angle) + 180;
         }
         else{
           angle = 360- Math.abs(angle);
         }
      }
      else
      {
         if(p2.x<p1.x){
           angle = 180-angle;
         }
      }
      return angle;
    },
    
    
    /**
     * @private
     **/
    fireSourcePortRouteEvent:function()
    {
        // enforce a repaint of all connections which are related to this port
        // this is required for a "FanConnectionRouter" or "ShortesPathConnectionRouter"
        //
       var connections = this.sourcePort.getConnections();
       for(var i=0; i<connections.getSize();i++)
       {
          connections.get(i).repaint();
       }
    },
    
    /**
     * @private
     **/
    fireTargetPortRouteEvent:function()
    {
        // enforce a repaint of all connections which are related to this port
        // this is required for a "FanConnectionRouter" or "ShortesPathConnectionRouter"
        //
       var connections = this.targetPort.getConnections();
       for(var i=0; i<connections.getSize();i++)
       {
          connections.get(i).repaint();
       }
    },
    
    
    /**
     * @method
     * Returns the Command to perform the specified Request or null.
      *
     * @param {graphiti.command.CommandType} request describes the Command being requested
     * @return {graphiti.command.Command} null or a Command
     **/
    createCommand:function( request)
    {
      if(request.getPolicy() === graphiti.command.CommandType.MOVE_BASEPOINT)
      {
        // DragDrop of a connection doesn't create a undo command at this point. This will be done in
        // the onDrop method
        return new graphiti.command.CommandReconnect(this);
      }

      return this._super(request);
    },
    
    
    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento = this._super();
        delete memento.x;
        delete memento.y;
        delete memento.width;
        delete memento.height;

        memento.source = {
                  node:this.getSource().getParent().getId(),
                  port: this.getSource().getName()
                };
        
        memento.target = {
                  node:this.getTarget().getParent().getId(),
                  port:this.getTarget().getName()
                };
               
        return memento;
    },
    
    /**
     * @method 
     * Read all attributes from the serialized properties and transfer them into the shape.
     * 
     * @param {Object} memento
     * @returns 
     */
    setPersistentAttributes : function(memento)
    {
        this._super(memento);
        // no extra param to read.
        // Reason: done by the Layoute/Router
    },


    onClick: function() {
        // wait to be implemented
        $("#right-container").css({right: '0px'});
        var hasClassIn = $("#collapseTwo").hasClass('in');
        if(!hasClassIn) {
          $("#collapseOne").toggleClass('in');
          $("#collapseOne").css({height: '0'});
          $("#collapseTwo").toggleClass('in');
          $("#collapseTwo").css({height: "auto"});
        }

        $("#exogenous-factors-config").css({"display": "none"});
        $("#protein-config").css({"display": "none"});
        $("#component-config").css({"display": "none"});
        $("#arrow-config").css({"display": "block"});
    }   

});