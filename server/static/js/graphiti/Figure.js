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
 * @class graphiti.Figure
 * A lightweight graphical object. Figures are rendered to a {graphiti.Canvas} object.
 * 
 * @inheritable
 * @author Andreas Herz
 */
graphiti.Figure = Class.extend({
    
	NAME : "graphiti.Figure",
    
	MIN_TIMER_INTERVAL: 50, // minimum timer interval in milliseconds
	
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     */
    init: function( ) {
        this.id = graphiti.util.UUID.create();

        // for undo/redo operation. It holds the command during a drag/drop operation
        // and execute it on the CommandStack if the user drop the figure.
        this.command = null;
        
        this.canvas = null;
        this.shape  = null;
        
        // possible decorations ( e.g. a Label) of the Connection
        this.children = new graphiti.util.ArrayList();
            
        // behavior flags
        //
        this.selectable = true;
        this.deleteable = true;
        this.resizeable = true;
        this.draggable = true;
        this.canSnapToHelper = true;
        this.snapToGridAnchor = new graphiti.geo.Point(0,0);    // hot spot for snap to grid  
        this.editPolicy = new graphiti.util.ArrayList(); // List<graphiti.layout.constraint.EditPolicy)
        
        // timer for animation or automatic update
        this.timerId = -1;
        this.timerInterval = 0;
        
        // possible parent of the figure. 
        //
        this.parent = null;
        
        // appearance, position and dim properties
        //
        this.x = 0;
        this.y = 0;
        
        this.minHeight = 5;
        this.minWidth = 5;
        
        this.width  = this.getMinWidth();
        this.height = this.getMinHeight();
        this.alpha = 1.0;
        
        // status flags for the Drag&Drop operation handling
        //
        this.isInDragDrop =false;
        this.isMoving = false;
        this.originalAlpha = this.alpha;
        this.ox = 0;
        this.oy = 0;
         
        // listener for movement. required for Ports or property panes in the UI
        //
        this.moveListener = new graphiti.util.ArrayList();
    },
    
    /**
     * @method
     * Return the UUID of this element. 
     * 
     * @return {String}
     */
    getId: function(){
       return this.id; 
    },
    
    /**
     * @method
     * Set the id of this element. 
     * 
     * @param {String} id the new id for this figure
     */
    setId: function(id){
        this.id = id; 
    },
    
    /**
     * @method
     * Set the canvas element of this figures.
     * 
     * @param {graphiti.Canvas} canvas the new parent of the figure or null
     */
    setCanvas: function( canvas )
    {
      // remove the shape if we reset the canvas and the element
      // was already drawn
      if(canvas===null && this.shape!==null)
      {
         this.shape.remove();
         this.shape=null;
      }
     
      this.canvas = canvas;
      
      if(this.canvas!==null){
          this.getShapeElement();
      }

      if(canvas === null){
    	  this.stopTimer();
      }
      else{
    	  if(this.timerInterval>0){
              this.startTimer(this.timerInterval);
    	  }
      }
      
      for(var i=0; i<this.children.getSize();i++){
          var entry = this.children.get(i);
          entry.figure.setCanvas(canvas);
      }

     },
     
     /**
      * @method
      * Return the current assigned canvas container.
      * 
      * @return {graphiti.Canvas}
      */
     getCanvas:function()
     {
         return this.canvas;
     },
     
    
     /**
      * @method
      * Start a timer which calles the onTimer method in the given interval.
      * 
      * @param {Number} milliSeconds
      */
     startTimer: function(milliSeconds){
    	 this.stopTimer();
    	 this.timerInterval = Math.max(this.MIN_TIMER_INTERVAL, milliSeconds);
    	 
    	 if(this.canvas!==null){
    		 this.timerId = window.setInterval($.proxy(this.onTimer,this), this.timerInterval);
    	 }
     },

     /**
      * @method
      * Stop the internal timer.
      * 
      */
     stopTimer: function(){
    	if(this.timerId>=0){
  		  window.clearInterval(this.timerId);
		  this.timerId=-1;
    	} 
     },

     /**
      * @method
      * Callback method for the internal timer handling<br>
      * Inherit classes must override this method if they want use the timer feature.
      * 
      * @template
      */
     onTimer: function(){
    	
     },
     
     /**
      * Install a new edit policy to the figure. Each editpolicy is able to focus on a single editing 
      * task or group of related tasks. This also allows editing behavior to be selectively reused across 
      * different figure implementations. Also, behavior can change dynamically, such as when the layouts 
      * or routing methods change.
      * Example for limited DragDrop behaviour can be a graphiti.layout.constraint.RegionConstriantPolicy.
      * 
      * @param {graphiti.policy.EditPolicy} policy
      */
     installEditPolicy: function(policy){
         this.editPolicy.add(policy);
     },
     
     /**
      * @method
      * Add a child figure to the figure. The hands over figure doesn't support drag&drop 
      * operations. It's only a decorator for the connection.<br>
      * Mainly for labels or other fancy decorations :-)
      *
      * @param {graphiti.Figure} figure the figure to add as decoration to the connection.
      * @param {graphiti.layout.locator.Locator} locator the locator for the child. 
     **/
     addFigure : function(child, locator)
     {
         // the child is now a slave of the parent
         //
         child.setDraggable(false);
         child.setSelectable(false);
         child.setParent(this);
         
         var entry = {};
         entry.figure = child;
         entry.locator = locator;

         this.children.add(entry);
         
         if(this.canvas!==null){
             child.setCanvas(this.canvas);
         }
         
         this.repaint();
     },

     /**
      * @method
      * Return all children/decorations of this shape
      */
     getChildren : function(){
         var shapes = new graphiti.util.ArrayList();
         this.children.each(function(i,e){
             shapes.add(e.figure);
         });
         return shapes;
     },
     

     /**
      * @method
      * Remove all children/decorations of this shape
      * 
      */
     resetChildren : function(){
         this.children.each(function(i,e){
             e.figure.setCanvas(null);
         });
         this.children= new graphiti.util.ArrayList();
         this.repaint();
     },
     

     /**
     * @method
     * return the current SVG shape element or create it on demand.
     * 
     * @final
     */
    getShapeElement:function()
    {
       if(this.shape!==null){
         return this.shape;
       }

      this.shape=this.createShapeElement();
      
      return this.shape;
    },


    /**
     * @method
     * Inherited classes must override this method to implement it's own draw functionality.
     * 
     * @template
     * @abstract
     */
    createShapeElement : function()
    {
        throw "Inherited class ["+this.NAME+"] must override the abstract method createShapeElement";
    },


    /**
     * @method
     * propagate all attributes like color, stroke,... to the shape element
     * 
     **/
     repaint : function(attributes)
     {
         if (this.repaintBlocked===true || this.shape === null){
             return;
         }

         if(typeof attributes === "undefined" ){
             attributes = {};
         }

         // enrich with common properties
         attributes.opacity = this.alpha;
         
        this.shape.attr(attributes);
        
        // Relocate all children of the figure.
        // This means that the Locater can calculate the new Position of the child.
        //
        for(var i=0; i<this.children.getSize();i++) {
            var entry = this.children.get(i);
            entry.locator.relocate(i, entry.figure);
        }
     },
     
     /**
      * @method
      * Highlight the element or remove the highlighting
      * 
      * @param {Boolean} flag indicates glow/noGlow
      * @template
      */
     setGlow: function(flag){
    	 // do nothing in the base class. 
    	 // Subclasses must implement this method.
     },
     

    /**
     * @method
     * Will be called if the drag and drop action begins. You can return [false] if you
     * want avoid that the figure can be move.
     * 
     * @param {Number} relativeX the x coordinate within the figure
     * @param {Number} relativeY the y-coordinate within the figure.
     * 
     * @return {boolean} true if the figure accepts dragging
     **/
    onDragStart : function(relativeX, relativeY )
    {
      this.isInDragDrop =false;
      this.isMoving = false;
      this.originalAlpha = this.getAlpha();

      this.command = this.createCommand(new graphiti.command.CommandType(graphiti.command.CommandType.MOVE));

      if(this.command!==null){
         this.ox = this.x;
         this.oy = this.y;
         this.isInDragDrop =true;
         return true;
      }
      
      return false;
    },

    /**
     * @method
     * Don't call them manually. This will be done by the framework.<br>
     * Will be called if the object are moved via drag and drop.
     * Sub classes can override this method to implement additional stuff. Don't forget to call
     * the super implementation via <code>Figure.prototype.onDrag.call(this);</code>
     * @private
     * @param {Number} dx the x difference between the start of the drag drop operation and now
     * @param {Number} dy the y difference between the start of the drag drop operation and now
     **/
    onDrag : function( dx,  dy)
    {
      // apply all EditPolicy for DragDrop Operations
      //
      this.editPolicy.each($.proxy(function(i,e){
            if(e.getRole()===graphiti.policy.EditPolicy.Role.PRIMARY_DRAG_ROLE){
                var newPos = e.apply(this,this.ox+dx,this.oy+dy);
                dx = newPos.x-this.ox;
                dy = newPos.y-this.oy;
            }
      },this));
        
      this.x = this.ox+dx;
      this.y = this.oy+dy;

      // Adjust the new location if the object can snap to a helper
      // like grid, geometry, ruler,...
      //
      if(this.getCanSnapToHelper())
      {
        var p = new graphiti.geo.Point(this.x,this.y);
        p = this.getCanvas().snapToHelper(this, p);
        this.x = p.x;
        this.y = p.y;
      }

      
      this.setPosition(this.x, this.y);
      

      // enable the alpha blending of the first real move of the object
      //
      if(this.isMoving===false)
      {
       this.isMoving = true;
       this.setAlpha(this.originalAlpha*0.7);
      }
    },

    /**
     * @method
     * Called by the framework if the figure returns false for the drag operation. In this
     * case we send a "panning" event - mouseDown + mouseMove. This is very useful for
     * UI-Widget like slider, spinner,...
     * 
     * @param {Number} dx the x difference between the mouse down operation and now
     * @param {Number} dy the y difference between the mouse down operation and now
     * @template
     */
    onPanning: function(dx, dy){
        
    },
    
    /**
     * @method
     * Will be called after a drag and drop action.<br>
     * Sub classes can override this method to implement additional stuff. Don't forget to call
     * the super implementation via <code>this._super();</code>
     * 
     * @private
     **/
    onDragEnd : function()
    {
      this.setAlpha(this.originalAlpha);
  
      // Element ist zwar schon an seine Position, das Command muss aber trotzdem
      // in dem CommandStack gelegt werden damit das Undo funktioniert.
      //
      this.command.setPosition(this.x, this.y);
      this.isInDragDrop = false;

      this.canvas.commandStack.execute(this.command);
      this.command = null;
      this.isMoving = false;
      this.fireMoveEvent();      
    },

    /**
     * @method
     * Called by the framework during drag&drop operations.
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * 
     * @return {Boolean} true if this port accepts the dragging port for a drop operation
     * @template
     **/
    onDragEnter : function( draggedFigure )
    {
    	return false;
    },
 
    /**
     * @method
     * Called if the DragDrop object leaving the current hover figure.
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * @template
     **/
    onDragLeave:function( draggedFigure )
    {
    },

    
    /**
     * @method
     * Called if the user drop this element onto the dropTarget
     * 
     * @param {graphiti.Figure} dropTarget The drop target.
     * @private
     **/
    onDrop:function(dropTarget)
    {
    },
   

    /**
     * @method
     * Callback method for the mouse enter event. Usefull for mouse hover-effects.
     * Override this method for yourown effects. Don't call them manually.
     *
     * @template
     **/
    onMouseEnter:function()
    {
    },
    
    
    /**
     * @method
     * Callback method for the mouse leave event. Usefull for mouse hover-effects.
     * 
     * @template
     **/
    onMouseLeave:function()
    {
    },

    /**
     * @method
     * Called when a user dbl clicks on the element
     * 
     * @template
     */
    onDoubleClick: function(){
    },
    
    
    /**
     * @method
     * Called when a user clicks on the element.
     * 
     * @template
     */
    onClick: function(){
    },
   
    /**
     * @method
     * Set the alpha blending of this figure. 
     *
     * @template
     * @param {Number} percent Value between [0..1].
     **/
    setAlpha:function( percent)
    {
      if(percent===this.alpha){
         return;
      }

      this.alpha = percent;
      this.repaint();
    },

        
    /**
     * @method Return the alpha blending of the figure
     * @return {Number}
     */
    getAlpha : function()
    {
        return this.alpha;
    },
    
    /**
     * @method
     * Return true if the figure visible and part of the canvas.
     * 
     * @return {Boolean}
     */
    isVisible: function(){
        return this.shape!==null;
    },
    
    /**
     * @method
     * Return the current z-index of the element. Currently this is an expensive method. The index will be calculated
     * all the time. Cacheing is not implemented at the moment.
     * 
     * @return {Number}
     */
    getZOrder: function(){
        if(this.shape==null){
            return -1;
        }
        
        var i = 0;
        var child = this.shape.node;
        while( (child = child.previousSibling) != null ) {
          i++;
        }
        return i;
    },
    
    /**
     * @method
     * Set the flag if this object can snap to grid or geometry.
     * A window of dialog should set this flag to false.
     * 
     * @param {boolean} flag The snap to grid/geometry enable flag.
     *
     **/
    setCanSnapToHelper:function(/*:boolean */flag)
    {
      this.canSnapToHelper = flag;
    },

    /**
     * @method
     * Returns true if the figure can snap to any helper like a grid, guide, geometrie
     * or something else.
     *
     * @return {boolean}
     **/
    getCanSnapToHelper:function()
    {
      return this.canSnapToHelper;
    },

    /**
     *
     * @return {graphiti.geo.Point}
     **/
    getSnapToGridAnchor:function()
    {
      return this.snapToGridAnchor;
    },

    /**
     * @method
     * Set the hot spot for all snapTo### operations.
     * 
     * @param {graphiti.geo.Point} point
     **/
    setSnapToGridAnchor:function(point)
    {
      this.snapToGridAnchor = point;
    },

    /**
     * @method
     * The current width of the figure.
     * 
     * @type {Number}
     **/
    getWidth:function()
    {
      return this.width;
    },

    /**
     * @method 
     * The current height of the figure.
     * 
     * @type {Number}
     **/
    getHeight:function()
    {
      return this.height;
    },


    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. width of this object.
     */
    getMinWidth:function()
    {
      return this.minWidth;
    },

    /**
     * @method
     * Set the minimum width of this figure
     * 
     * @param {Number} w
     */
    setMinWidth: function(w){
      this.minWidth = w;
    },
    
    /**
     * @method
     * This value is relevant for the interactive resize of the figure.
     *
     * @return {Number} Returns the min. height of this object.
     */
    getMinHeight:function()
    {
      return this.minHeight;
    },

    /**
     * @method
     * Set the minimum heigth of the figure.
     * 
     * @param {Number} h
     */
    setMinHeight:function(h){
        this.minHeight = h;
    },
    
    /**
     * @method
     * The x-offset related to the parent figure or canvas.
     * 
     * @return {Number} the x-offset to the parent figure
     **/
    getX :function()
    {
        return this.x;
    },

    /**
     * @method
     * The y-offset related to the parent figure or canvas.
     * 
     * @return {Number} The y-offset to the parent figure.
     **/
    getY :function()
    {
        return this.y;
    },

    
    /**
     * @method
     * The x-offset related to the canvas.
     * 
     * @return {Number} the x-offset to the parent figure
     **/
    getAbsoluteX :function()
    {
        if(this.parent===null){
            return this.x;
        }
        return this.x + this.parent.getAbsoluteX();  
    },


    /**
     * @method
     * The y-offset related to the canvas.
     * 
     * @return {Number} The y-offset to the parent figure.
     **/
    getAbsoluteY :function()
    {
        if(this.parent ===null){
            return this.y;
        }
        return this.y + this.parent.getAbsoluteY();  
    },


    
    /**
     * @method
     * Returns the absolute y-position of the port.
     *
     * @type {graphiti.geo.Point}
     **/
    getAbsolutePosition:function()
    {
      return new graphiti.geo.Point(this.getAbsoluteX(), this.getAbsoluteY());
    },
    
    /**
     * @method
     * Returns the absolute y-position of the port.
     *
     * @return {graphiti.geo.Rectangle}
     **/
    getAbsoluteBounds:function()
    {
      return new graphiti.geo.Rectangle(this.getAbsoluteX(), this.getAbsoluteY(),this.getWidth(),this.getHeight());
    },
    

    /**
     * @method
     * Set the position of the object.
     *
     * @param {Number} x The new x coordinate of the figure
     * @param {Number} y The new y coordinate of the figure 
     **/
    setPosition:function(x , y )
    {
      this.x= x;
      this.y= y;

      this.repaint();

      // Update the resize handles if the user change the position of the element via an API call.
      //
      if(this.canvas!==null && this.canvas.getCurrentSelection()===this){
         this.canvas.moveResizeHandles(this);
      }
      this.fireMoveEvent();
    },
    
    /**
     * @method
     * Translate the figure with the given x/y offset.
     *
     * @param {Number} dx The new x translate offset
     * @param {Number} dy The new y translate offset
     **/
    translate:function(dx , dy )
    {
    	this.setPosition(this.x+dx,this.y+dy);
    },
    
    
    /**
     * @method
     * Set the new width and height of the figure. 
     *
     * @param {Number} w The new width of the figure
     * @param {Number} h The new height of the figure
     **/
    setDimension:function(w, h)
    {
      this.width = Math.max(this.getMinWidth(),w);
      this.height= Math.max(this.getMinHeight(),h);
      
      this.repaint();
      
      this.fireMoveEvent();

      // Update the resize handles if the user change the dimension via an API call
      //
      if(this.canvas!==null && this.canvas.getCurrentSelection()===this)  {
         this.canvas.moveResizeHandles(this);
      }
    },


    /**
     * @method
     * Return the bounding box of the figure in absolute position to the canvas.
     * 
     * @return {graphiti.geo.Rectangle}
     **/
    getBoundingBox:function()
    {
      return new graphiti.geo.Rectangle(this.getAbsoluteX(),this.getAbsoluteY(),this.getWidth(),this.getHeight());
    },

    /**
     * @method
     * Detect whenever the hands over coordinate is inside the figure.
     *
     * @param {Number} iX
     * @param {Number} iY
     * @returns {Boolean}
     */
    hitTest : function ( iX , iY)
    {
        var x = this.getAbsoluteX();
        var y = this.getAbsoluteY();
        var iX2 = x + this.getWidth();
        var iY2 = y + this.getHeight();
        return (iX >= x && iX <= iX2 && iY >= y && iY <= iY2);
    },


    /**
     * @method
     * Switch on/off the drag drop behaviour of this object
     *
     * @param {Boolean} flag The new drag drop indicator
     **/
    setDraggable:function(flag)
    {
      this.draggable= flag;
    },

    /**
     * @method
     * Get the Drag drop enable flag
     *
     * @return {boolean} The new drag drop indicator
     **/
    isDraggable:function()
    {
      return this.draggable;
    },


    /**
     * @method
     * Returns the true if the figure can be resized.
     *
     * @return {boolean}
     **/
    isResizeable:function()
    {
      return this.resizeable;
    },

    /**
     * @method
     * You can change the resizeable behaviour of this object. Hands over [false] and
     * the figure has no resizehandles if you select them with the mouse.<br>
     *
     * @param {boolean} flag The resizeable flag.
     **/
    setResizeable:function(flag)
    {
      this.resizeable=flag;
    },

    /**
     * @method
     * Indicates whenever the element is selectable by user interaction or API.
     * 
     * @return {boolean}
     **/
    isSelectable:function()
    {
      return this.selectable;
    },


    /**
     * @method
     * You can change the selectable behavior of this object. Hands over [false] and
     * the figure has no selection handles if you try to select them with the mouse.<br>
     *
     * @param {boolean} flag The selectable flag.
     **/
    setSelectable:function(flag)
    {
      this.selectable=flag;
    },

    /**
     * @method
     * Return true if the object doesn't care about the aspect ratio.
     * You can change the height and width independent.
     * 
     * @return {boolean}
     */
    isStrechable:function()
    {
      return true;
    },

    /**
     * @method
     * Return false if you avoid that the user can delete your figure.
     * Sub class can override this method.
     * 
     * @return {boolean}
     **/
    isDeleteable:function()
    {
      return this.deleteable;
    },

    /**
     * @method
     * Return false if you avoid that the user can delete your figure.
     * 
     * @param {boolean} flag Enable or disable flag for the delete operation
     **/
    setDeleteable:function(flag)
    {
      this.deleteable = flag;
    },

    /**
     * @method
     * Set the parent of this figure.
     * Don't call them manually.

     * @param {graphiti.Figure} parent The new parent of this figure
     * @private
     **/
    setParent:function( parent)
    {
      this.parent = parent;
    },

    /**
     * @method
     * Get the parent of this figure.
     *
     * @return {graphiti.Figure}
     **/
    getParent:function()
    {
      return this.parent;
    },

    /**
     * @method
     * Register the hands over object as a moveListener of this figure.<br>
     * All position changes will be broadcast to all move listener. This is
     * useful for Connectors and Layouter for router handling.
     *
     * @param {Object} listener the listener to call
     *
     **/
     attachMoveListener:function(listener) {
		if (listener === null) {
			return;
		}

		this.moveListener.add(listener);
 	 },
 

    /**
     * @method
     * Remove the hands over figure from notification queue.
     *
     * @param {graphiti.Figure} figure The figure to remove the monitor
     *
     **/
    detachMoveListener:function(figure) 
    {
      if(figure===null || this.moveListener===null){
        return;
      }

      this.moveListener.remove(figure);
    },

    /**
     * @method
     * Called from the figure itself when any position changes happens. All listener
     * will be informed.
     * 
     * @private
     **/
    fireMoveEvent: function()
    {
        // first call. Reured for connections to update the routing,...
        //
        this.moveListener.each($.proxy(function(i, item){
            item.onOtherFigureIsMoving(this);
        },this));
        
    },
    
    /**
     * @method
     * Fired if a figure is moving.
     *
     * @param {graphiti.Figure} figure The figure which has changed its position
     * @template
     */
    onOtherFigureIsMoving:function(figure){
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
      if(request===null){
          return null;
      }
      
      if(request.getPolicy() === graphiti.command.CommandType.MOVE)
      {
        if(!this.isDraggable()){
          return null;
        }
        return new graphiti.command.CommandMove(this);
      }

      if(request.getPolicy() === graphiti.command.CommandType.DELETE)
      {
        if(!this.isDeleteable()){
           return null;
        }
        return new graphiti.command.CommandDelete(this);
      }
      
      if(request.getPolicy() === graphiti.command.CommandType.RESIZE)
      {
        if(!this.isResizeable()){
           return null;
        }
        return new graphiti.command.CommandResize(this);
      }
      
      return null;
    },
    
    
    /**
     * @method 
     * Return an objects with all important attributes for XML or JSON serialization
     * 
     * @returns {Object}
     */
    getPersistentAttributes : function()
    {
        var memento= {
            type  : this.NAME,
            id    : this.id,
            x     : this.x,
            y     : this.y,
            width : this.width,
            height: this.height
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
        this.id    = memento.id;
        this.x     = memento.x;
        this.y     = memento.y;
        
        // width and height are optional parameter for the JSON stuff.
        // We use the defaults if the attributes not present
        if(typeof memento.width !== "undefined"){
            this.width = memento.width;
        }
        
        if(typeof memento.height !== "undefined"){
            this.height= memento.height;
        }
    }
    

});

