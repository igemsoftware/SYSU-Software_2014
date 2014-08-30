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


﻿/**
 * @class graphiti.Canvas
 * Interactive paint area of the graphiti library.
 * <br>
 * <strong>Usage</strong>
 * <pre>

$(document).ready(function() {

    document.ontouchmove = function(e) {
        e.preventDefault();
    };
    
    var canvas = new graphiti.Canvas("gfx_holder");

    var figure1 = new graphiti.shape.basic.Oval();
    var figure2 = new graphiti.shape.basic.Rectangle();
    canvas.addFigure(figure1,100,100);
    canvas.addFigure(figure2,120,150);

});

 * </pre>
 * @inheritable
 * @author Andreas Herz
 */
graphiti.Canvas = Class.extend(
{
    NAME : "graphiti.Canvas",

    /**
     * @constructor
     * Create a new canvas with the given HTML dom references.
     * 
     * @param {String} canvasId the id of the DOM element to use a parent container
     */
    init : function(canvasId)
    {
        this.setScrollArea(document.body);
        this.canvasId = canvasId;
        this.html = $("#"+canvasId);
        this.initialWidth = this.getWidth();
        this.initialHeight = this.getHeight();
        
        // avoid the "highlighting" in iPad, iPhone if the user tab/touch on the canvas.
        // iOS highlight per default all elements which register an "onClick, onMouseDown" event.
        // .... I don't like these.
        this.html.css({"-webkit-tap-highlight-color": "rgba(0,0,0,0)"});
        
        // Drag&Drop Handling from foreign DIV into the Canvas
        //
        // Create the droppable area for the css class "graphiti_droppable"
        // This can be done by a palette of toolbar or something else.
        // For more information see : http://jqueryui.com/demos/droppable/
        //
        this.html.droppable({
            accept: '.graphiti_droppable',
            over: $.proxy(function(event, ui) {
                this.onDragEnter(ui.draggable);
            },this),
            out: $.proxy(function(event, ui) {
                this.onDragLeave(ui.draggable);
            },this),
            drop:$.proxy(function(event, ui){
                event = this._getEvent(event);
                var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                this.onDrop(ui.draggable, pos.getX(), pos.getY());
            },this)
        });
        
        // Create the jQuery-Draggable for the palette -> canvas drag&drop interaction
        //
        $(".graphiti_droppable").draggable({
            appendTo:"body",
            stack:"body",
            zIndex: 27000,
            helper:"clone",
            drag: $.proxy(function(event, ui){
                event = this._getEvent(event);
                var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                this.onDrag(ui.draggable, pos.getX(), pos.getY());
            },this),
            stop: function(e, ui){
                this.isInExternalDragOperation=false;
            },
            start: function(e, ui){
                this.isInExternalDragOperation=true;
                $(ui.helper).addClass("shadow");
            }
       });

        // painting stuff
        //
        this.paper = Raphael(canvasId, this.getWidth(), this.getHeight());

        // Status handling
        //
        this.zoomFactor = 1.0; // range [0.001..10]
        
        this.currentSelection  = null;
        this.currentDropTarget = null;
        this.isInExternalDragOperation=false;
                
        // the line between the dragging port and its origin position
        this.connectionLine    = new graphiti.shape.basic.Line();
      
        this.resizeHandle1 = new graphiti.ResizeHandle(this,1); // 1 = LEFT TOP
        this.resizeHandle2 = new graphiti.ResizeHandle(this,2); // 2 = CENTER_TOP
        this.resizeHandle3 = new graphiti.ResizeHandle(this,3); // 3 = RIGHT_TOP
        this.resizeHandle4 = new graphiti.ResizeHandle(this,4); // 4 = RIGHT_MIDDLE
        this.resizeHandle5 = new graphiti.ResizeHandle(this,5); // 5 = RIGHT_BOTTOM
        this.resizeHandle6 = new graphiti.ResizeHandle(this,6); // 6 = CENTER_BOTTOM
        this.resizeHandle7 = new graphiti.ResizeHandle(this,7); // 7 = LEFT_BOTTOM
        this.resizeHandle8 = new graphiti.ResizeHandle(this,8); // 8 = LEFT_MIDDLE

        this.resizeHandleStart = new graphiti.shape.basic.LineStartResizeHandle(this);
        this.resizeHandleEnd   = new graphiti.shape.basic.LineEndResizeHandle(this);
        
        this.resizeHandles = new graphiti.util.ArrayList();
        this.resizeHandles.add(this.resizeHandle1);
        this.resizeHandles.add(this.resizeHandle2);
        this.resizeHandles.add(this.resizeHandle3);
        this.resizeHandles.add(this.resizeHandle4);
        this.resizeHandles.add(this.resizeHandle5);
        this.resizeHandles.add(this.resizeHandle6);
        this.resizeHandles.add(this.resizeHandle7);
        this.resizeHandles.add(this.resizeHandle8);
        this.resizeHandles.add(this.resizeHandleStart);
        this.resizeHandles.add(this.resizeHandleEnd);

        this.resizeHandleHalfWidth = this.resizeHandle2.getWidth()/2;
       
        // SnapTo status var's
        //
        this.snapToGridFlag = null;
        this.snapToGeometryFlag = null;

        this.verticalSnapToHelperLine = null;
        this.horizontalSnapToHelperLine = null;

        // internal document with all figures, ports, ....
        //
        this.figures = new graphiti.util.ArrayList();
        this.lines = new graphiti.util.ArrayList();
        this.commonPorts = new graphiti.util.ArrayList();
        this.dropTargets = new graphiti.util.ArrayList();
       
        // listener for selection handling
        this.selectionListeners = new graphiti.util.ArrayList();

        // The CommandStack for undo/redo ooperations
        this.commandStack = new graphiti.command.CommandStack();
       
        
        // INTERSECTION/CROSSING handling for connections and lines
        //
        
        this.linesToRepaintAfterDragDrop =  new graphiti.util.ArrayList();;
        
        this.lineIntersections = new graphiti.util.ArrayList();
        
        // Calculate all intersection between the different lines
        //
        this.commandStack.addEventListener($.proxy(function(event){
        	if(event.isPostChangeEvent()===true){
        	    this.lineIntersections = new graphiti.util.ArrayList();
                var lines = this.getLines().clone();
                while(lines.getSize()>0){
                    var l1 = lines.removeElementAt(0);
                    lines.each($.proxy(function(ii,l2){
                        var partInter =l1.intersection(l2);
                        if(partInter.getSize()>0){
                           this.lineIntersections.add({line:l1, other:l2, intersection:partInter});
                           this.lineIntersections.add({line:l2, other:l1, intersection:partInter});
                        }
                    },this));
                }
                this.linesToRepaintAfterDragDrop.each(function(i,line){
                    line.svgPathString=null;
                    line.repaint();
                });
                this.linesToRepaintAfterDragDrop =  new graphiti.util.ArrayList();;
        	}
        },this));
        
        // DragDrop handling
        //
        this.mouseDown  = false;
        this.mouseDownX = 0;
        this.mouseDownY = 0;
        this.mouseDraggingElement = null;
        this.mouseDownElement = null;
        
        this.html.bind("mouseup touchend", $.proxy(function(event)
        {
            if (this.mouseDown === false)
                return;

            event = this._getEvent(event);

            this.mouseDown = false;
            this.onMouseUp();
        }, this));

        this.html.bind("mousemove touchmove", $.proxy(function(event)
        {
            event = this._getEvent(event);
            if (this.mouseDown === false){
               var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
               this.onMouseMove(pos.x, pos.y);
            }
            else{
               var diffX = (event.clientX - this.mouseDownX)*this.zoomFactor;
               var diffY = (event.clientY - this.mouseDownY)*this.zoomFactor;
               this.onMouseDrag(diffX, diffY);
           }
        }, this));
        
        this.html.bind("mousedown touchstart", $.proxy(function(event)
        {
            event.preventDefault();
            event = this._getEvent(event);

            this.mouseDownX = event.clientX;
            this.mouseDownY = event.clientY;
            var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
            this.mouseDown = true;
            this.onMouseDown(pos.x, pos.y);
        }, this));
        
        
        // Catch the keyDown and CTRL-key and route them to the Canvas hook.
        //
        $(document).bind("dblclick",$.proxy(function(event)
        {
            event = this._getEvent(event);

            this.mouseDownX = event.clientX;
            this.mouseDownY = event.clientY;
            var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
            this.onDoubleClick(pos.x, pos.y);
        },this));

        
        // Catch the keyDown and CTRL-key and route them to the Canvas hook.
        //
        $(document).bind("click",$.proxy(function(event)
        {
            event = this._getEvent(event);

            if(this.mouseDownX === event.clientX ||  this.mouseDownY === event.clientY){
                var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                this.onClick(pos.x, pos.y);
            }
        },this));

        // Catch the keyDown and CTRL-key and route them to the Canvas hook.
        //
        $(document).bind("keydown",$.proxy(function(event)
        {
     	  // don't initiate the delete command if the event comes from an INPUT field. In this case the user want delete
      	  // a character in the input field and not the related shape
      	  if(!$(event.target).is("input")){
             var ctrl = event.ctrlKey;
             this.onKeyDown(event.keyCode, ctrl);
           }
        },this));

    },
    


    /**
     * @method
     * Set the new zoom factor for the canvas. The value must be between [0.01--10]
     * 
     * @param {Number} zoomFactor new zoom factor.
     */
    setZoom : function(zoomFactor)
    {
       this.zoomFactor = Math.min(Math.max(0.01,zoomFactor),10);
        
        var viewBoxWidth  = parseInt(this.initialWidth*this.zoomFactor);
        var viewBoxHeight = parseInt(this.initialHeight*this.zoomFactor);
        
// BUG: raphael didn't handle setViewBox AND setSize correct
//        this.paper.setSize(this.html.width(), this.html.height());
        this.paper.setViewBox(0, 0, viewBoxWidth, viewBoxHeight);
        
        this.html.width(this.initialWidth / this.zoomFactor);
        this.html.height(this.initialHeight / this.zoomFactor);
    },

    /**
     * @method
     * Return the current zoom factor of the canvas.
     * 
     * @returns {Number}
     */
    getZoom: function(){
        return this.zoomFactor;
    },
    
    /**
     * @method
     * Transforms a document coordinate to canvas coordinate.
     * 
     * @param {Number} x the x coordinate relative to the window 
     * @param {Number} y the y coordinate relative to the window
     * @returns {graphiti.geo.Point}
     */
	fromDocumentToCanvasCoordinate : function(x,y) {
		return new graphiti.geo.Point(
				(x - this.getAbsoluteX() + this.getScrollLeft())*this.zoomFactor,
				(y - this.getAbsoluteY() + this.getScrollTop())*this.zoomFactor);
	},
	
    /**
     * @method
     * Transforms a canvas coordinate to document coordinate.
     * 
     * @param {Number} x the x coordinate in the canvas 
     * @param {Number} y the y coordinate in the canvas
     * @returns {graphiti.geo.Point} the document coordinate
     */
	fromCanvasToDocumentCoordinate : function(x,y) {
		return new graphiti.geo.Point(
				(x + this.getAbsoluteX() - this.getScrollLeft())*this.zoomFactor,
				(y + this.getAbsoluteY() - this.getScrollTop())*this.zoomFactor);
	},
	
	getHtmlContainer: function(){
       return this.html; 
    },
    
    
    /**
     * @private
     * @param event
     * @returns
     */
    _getEvent:function(event){
      if(event.originalEvent.touches && event.originalEvent.touches.length) {
           return event.originalEvent.touches[0];
      } else if(event.originalEvent.changedTouches && event.originalEvent.changedTouches.length) {
           return event.originalEvent.changedTouches[0];
      }
      return event;
    },

    /**
     * @method
     * 
     * Set the area which are scrolling the canvas.
     * 
     * @param 
     **/
    setScrollArea:function(elementSelector)
    {
       this.scrollArea= $(elementSelector);
    },

    /**
     * @method
     * 
     * return the scrolling area of the canvas. This is jQuery object
     * 
     * @return {Number} 
     **/
    getScrollArea:function()
    {
       return this.scrollArea;
    },

    /**
     * @method
     * The left scroll position.
     * 
     * @return {Number} the left scroll offset of the canvas
     **/
    getScrollLeft:function()
    {
      return this.scrollArea.scrollLeft();
    },

    /**
     * @method
     * The top scroll position
     * 
     * @return {Number} the top scroll offset of the cnavas.
     **/
    getScrollTop:function()
    {
      return this.scrollArea.scrollTop();
    },

    /**
     * @method
     * The absolute document x offset.
     *
     * @return {Number}
     **/
    getAbsoluteX:function()
    {
        return this.html.offset().left;
    },

    /**
     * @method
     * The absolute document y offset.
     * 
     * @return {Number} 
     **/
    getAbsoluteY:function()
    {
      return this.html.offset().top;
    },


    /**
     * @method
     * Return the width of the canvas
     * 
     * @return {Number}
     **/
    getWidth : function(){
        return this.html.width();
    },


    /**
     * @method
     * Return the height of the canvas.
     * 
     * @return {Number}
     **/
    getHeight:function() {
      return this.html.height();
    },
 

    /**
     * @method
     * Add a figure at the hands over x/y position.
     *
     * @param {graphiti.Figure} figure The figure to add.
     * @param {Number} [x] The x position.
     * @param {Number} [y] The y position.
     **/
    addFigure:function( figure , x,  y)
    {   
        if(figure.getCanvas()===this){
            return;
        }
        
      figure.setCanvas(this);

      // important inital 
      figure.getShapeElement();
      
     
      if(figure instanceof graphiti.shape.basic.Line){
        this.lines.add(figure);
        this.connections.push(figure.getId());
        this.connections.counter++;
        this.linesToRepaintAfterDragDrop = this.lines;
      }
      else{
        this.figures.add(figure);
        this.collection.push(figure.getId());
        this.collection.counter++;

        if(typeof y !== "undefined"){
        	figure.setPosition(x,y);
        }
      }
      
      // init a repaint of the figure. This enforce that all properties
      // ( color, dim, stroke,...) will be set.
      figure.repaint();
      figure.fireMoveEvent();
    },

    /**
     * @method
     * Remove a figure from the Canvas.
     *
     * @param {graphiti.Figure} figure The figure to remove
     **/
    removeFigure:function(figure){
        if(figure instanceof graphiti.shape.basic.Line){
           this.lines.remove(figure);
           this.connections.remove(figure);
           this.connections.counter--;
         }
        else {
           this.figures.remove(figure);
           this.collection.remove(figure.getId());
           this.collection.counter--;
        }

        figure.setCanvas(null);

        if(figure instanceof graphiti.Connection){
           figure.disconnect();
        }

        if(this.currentSelection === figure){
          this.setCurrentSelection(null);
        }
    },
    
    /**
     * @method
     * Returns all lines/connections in this workflow/canvas.<br>
     *
     * @protected
     * @return {graphiti.util.ArrayList}
     **/
    getLines:function()
    {
      return this.lines;
    },

    /**
     * @method
     * Returns the internal figures container.<br>
     *
     * @protected
     * @return {graphiti.util.ArrayList}
     **/
    getFigures:function()
    {
      return this.figures;
    },

    /**
     * @method
     * Returns the line with the given id.
     *
     * @param {String} id The id of the line.
     * @type draw2d.Line
     **/
    getLine:function( id)
    {
      var count = this.lines.getSize();
      for(var i=0; i<count;i++)
      {
         var line = this.lines.get(i);
         if(line.getId()===id)
            return line;
      }
      return null;
    },

    /**
     * @method
     * Returns the figure with the given id. 
     *
     * @param {String} id The id of the figure.
     * @return {graphiti.Figure}
     **/
    getFigure:function(/*:String*/ id)
    {
      for(var i=0; i<this.figures.getSize();i++)
      {
         var figure = this.figures.get(i);
         if(figure.id==id)
            return figure;
      }
      return null;
    },

    /**
     * @method
     * Return all intersections between the given line and all other
     * lines in the canvas
     * 
     * @param {graphiti.shape.basic.Line} line the line for the intersection test
     * @return {graphiti.util.ArrayList} 
     */
    getIntersection:function(line){
       var result = new graphiti.util.ArrayList();
       this.lineIntersections.each($.proxy(function(i, entry){
           if(entry.line ===line){
               result.addAll(entry.intersection);
           }
       },this));
       return result;
    },
    
    /**
     * Enable/disable the snap to grid behavior of the canvas. All figures will snap to the grid during the
     * the drag and drop operation.
     * 
     * @param {boolean} flag true if you want snap to the grid.
     **/
    setSnapToGrid:function( flag)
    {
      this.snapToGridFlag = flag;
    },

    /**
     * @method
     * <b>true</b> if snap to the grid enabled.
     * 
     * @return {Boolean}
     **/
    getSnapToGrid:function()
    {
      return this.snapToGridFlag;
    },

    /**
     * @method
     * Used to perform snapping to existing elements. Snapping is based on the existing children of a container. 
     * When snapping a rectangle, the edges of the rectangle will snap to edges of other rectangles generated from 
     * the children of the given container/canvas. Similarly, the centers and middles of rectangles will snap to each other.
     *
     * @param {boolean} flag true if you want snap to the geometry.
     */
    setSnapToGeometry:function( flag)
    {
      this.snapToGeometryFlag = flag;
    },

    /**
     * @method
     * <b>true</b> if snap to the grid enabled.
     * 
     * @return {boolean}
     **/
    getSnapToGeometry:function()
    {
      return this.snapToGeometryFlag;
    },

    /** 
     * @method
     *  Adjust the x to the next grid line.
     *
     * @param  {graphiti.Figure} figure The related figure
     * @param  {graphiti.geo.Point} pos The position to adjust
     * 
     * @return {graphiti.geo.Point} the adjusted position
     **/
    snapToHelper:function(figure,  pos)
    {
       var snapDirections=0;
       var snapPoint = null;
       var result =null;
       if(this.snapToGeometryFlag)
       {
          // The user drag&drop a ResizeHandle
          //
          if(figure instanceof graphiti.ResizeHandle)
          {
             snapPoint = figure.getSnapToGridAnchor();
             pos.x+= snapPoint.x;
             pos.y+= snapPoint.y;
             var result1 = new graphiti.geo.Point(pos.x,pos.y);
             var result2 = new graphiti.geo.Point(pos.x,pos.y);
             if(figure.supportsSnapToHelper())
             {
                snapDirections = figure.getSnapToDirection();
                var direction1 = this.snapToGeometryHelper.snapPoint(graphiti.SnapToHelper.EAST_WEST, pos,result1);
                var direction2 = this.snapToGeometryHelper.snapPoint(graphiti.SnapToHelper.NORTH_SOUTH, pos,result2);
                // Show a vertical line if the snapper has modified the inputPoint
                //
                if((snapDirections & graphiti.SnapToHelper.EAST_WEST) && !(direction1 & graphiti.SnapToHelper.EAST_WEST)){
                   this.showSnapToHelperLineVertical(result1.x);
                }
                else{
                   this.hideSnapToHelperLineVertical();
                }

                // Show a horizontal line if the snapper has modified the inputPoint
                //
                if((snapDirections & graphiti.SnapToHelper.NORTH_SOUTH) && !(direction2 & graphiti.SnapToHelper.NORTH_SOUTH)){
                   this.showSnapToHelperLineHorizontal(result2.y);
                }
                else{
                   this.hideSnapToHelperLineHorizontal();
                }

             }
             result1.x-= snapPoint.x;
             result2.y-= snapPoint.y;
             return new graphiti.geo.Point(result1.x,result2.y);
          }
          // The user drag&drop a normal figure
          else
          {
             var inputBounds = new graphiti.geo.Rectangle(pos.x,pos.y, figure.getWidth(), figure.getHeight());
             result = new graphiti.geo.Rectangle(pos.x,pos.y, figure.getWidth(), figure.getHeight());

             snapDirections = graphiti.SnapToHelper.NSEW;
             var direction = this.snapToGeometryHelper.snapRectangle( inputBounds, result);

             // Show a vertical line if the snapper has modified the inputPoint
             //
             if((snapDirections & graphiti.SnapToHelper.WEST) && !(direction & graphiti.SnapToHelper.WEST)){
                this.showSnapToHelperLineVertical(result.x);
             }
             else if((snapDirections & graphiti.SnapToHelper.EAST) && !(direction & graphiti.SnapToHelper.EAST)){
                this.showSnapToHelperLineVertical(result.getX()+result.getWidth());
             }
             else{
                this.hideSnapToHelperLineVertical();
             }

             // Show a horizontal line if the snapper has modified the inputPoint
             //
             if((snapDirections & graphiti.SnapToHelper.NORTH) && !(direction & graphiti.SnapToHelper.NORTH)){
                this.showSnapToHelperLineHorizontal(result.y);
             }
             else if((snapDirections & graphiti.SnapToHelper.SOUTH) && !(direction & graphiti.SnapToHelper.SOUTH)){
                this.showSnapToHelperLineHorizontal(result.getY()+result.getHeight());
             }
             else{
                this.hideSnapToHelperLineHorizontal();
             }

             return result.getTopLeft();
          }
       }
       
       if(this.snapToGridFlag) {
          pos.x = Raphael.snapTo(20, pos.x);
          pos.y = Raphael.snapTo(20, pos.y);
       }

       return pos;
    },


    /**
     * @private
     **/
    showConnectionLine:function(/*:int*/ x1  ,/*:int*/ y1 ,/*:int*/ x2,/*:int*/ y2 )
    {
      this.connectionLine.setStartPoint(x1,y1);
      this.connectionLine.setEndPoint(x2,y2);
      
      this.connectionLine.setCanvas(this);
      this.connectionLine.getShapeElement();
    },

    /**
     * @private
     **/
    hideConnectionLine:function()
    {
       this.connectionLine.setCanvas(null);
    },

    /**
     * @method
     * Register a port to the canvas. This is required for other ports to find a valid drop target.
     * 
     * @param {graphiti.Port} port The new port which has been added to the Canvas.
     **/
    registerPort:function(port )
    {
      // All elements have the same drop targets.
      //
      port.targets= this.dropTargets;
      
      this.commonPorts.add(port);
      this.dropTargets.add(port);
    },

    /**
     * @method
     * Remove a port from the internal cnavas registration. Now other ports can't find the
     * port anymore as drop target. The port itself is still visible.
     * 
     * @param {graphiti.Port} p The port to unregister as potential drop target
     * @private
     **/
    unregisterPort:function(port )
    {
      port.targets=null;

      this.commonPorts.remove(port);
      this.dropTargets.remove(port);
    },

    /**
     * @method
     * Returns the command stack for the Canvas. Required for undo/redo support.
     *
     * @return {graphiti.command.CommandStack}
     **/
    getCommandStack:function()
    {
      return this.commandStack;
    },

    /**
     * @method
     * Returns the current selected figure in the Canvas.
     *
     * @return {graphiti.Figure}
     **/
    getCurrentSelection:function()
    {
      return this.currentSelection;
    },

    /**
     * @method
     * Set the current selected figure in the workflow Canvas.
     *
     * @param {graphiti.Figure} figure The new selection.
     **/
    setCurrentSelection:function( figure )
    {
      if(figure===null)
      {
        this.hideResizeHandles();
        this.hideLineResizeHandles();
      }

      
      if(figure instanceof graphiti.shape.basic.Line)
      {
          this.showLineResizeHandles(figure);
      }
      else if(figure instanceof graphiti.Figure)
      {
          this.showResizeHandles(figure);
      }
      
      this.currentSelection = figure;

      // inform all selection listeners about the new selection.
      //
      for(var i=0;i < this.selectionListeners.getSize();i++)
      {
        var w = this.selectionListeners.get(i);
        if(typeof w.onSelectionChanged === "function"){
          w.onSelectionChanged(this.currentSelection);
        }
      }

    },

    /**
     * @method
     * Register a listener to the Canvas. The listener must provide a function "onSelectionChanged".
     * 
     * @param {Object|Function} w an object which implements the 'onSelectionChanged' method or a callback function
     **/
    addSelectionListener:function(w)
    {
      if(w!==null)
      {
        if(typeof w ==="function"){
            var obj = {};
            obj.onSelectionChanged = w;
            this.selectionListeners.add(obj);
        } 
        else if(typeof w.onSelectionChanged==="function"){
          this.selectionListeners.add(w);
        }
        else{
          throw "Object doesn't implement required callback method [onSelectionChanged]";
        }
      }
    },

    /**
     * @method
     * unregister the listener from the canvas.
     * 
     * @param {Object} w The object which will be removed from the selection eventing
     **/
    removeSelectionListener:function(/*:Object*/ w )
    {
      this.selectionListeners.remove(w);
    },


    /**
     * @method
     * Returns the best figure at the location [x,y]. It is a simple hit test.
     *
     * @param {Number} x The x position.
     * @param {Number} y The y position.
     * @param {graphiti.Figure} figureToIgnore The figure which should be ignored.
     **/
    getBestFigure : function(x, y, figureToIgnore)
    {
        var result = null;
        var testFigure = null;
        

        // ResizeHandles first
        for ( var i = 0, len = this.resizeHandles.getSize(); i < len; i++)
        {
            testFigure = this.resizeHandles.get(i);
            if (testFigure.isVisible()===true && testFigure.hitTest(x, y) === true && testFigure !== figureToIgnore) { 
                return testFigure; 
            }
        }

        // Checking ports
        //
        for ( var i = 0, len = this.commonPorts.getSize(); i < len; i++)
        {
            testFigure = this.commonPorts.get(i);
            if(testFigure !== figureToIgnore){
 	            if (testFigure.hitTest(x, y) === true) { 
	                return testFigure; 
	            }
            }
        }

        // 2.) A line is the next option in the priority queue for a "Best" figure
        //
        result = this.getBestLine(x,y,figureToIgnore);
        if(result !==null)
            return result;
        
        // 3.) Check now the common objects
        //
        for ( var i = 0; i < this.figures.getSize(); i++)
        {
            var figure = this.figures.get(i);
            if (figure.hitTest(x, y) === true && figure !== figureToIgnore)
            {
                if (result === null)
                {
                    result = figure;
                }
                else if(result.getZOrder()< figure.getZOrder())
                {
                    result = figure;
                }
            }
            else{
                var children= figure.getChildren();
                children.each(function(i,e){
                    if(e.hitTest(x,y)===true){
                        result = e;
                        return false; // break the each-loop
                    }
                });
            }
        }
        if(result !==null)
            return result;
        
        // 4.) Check the children of the lines as well
        //     Not selectable/draggable. But should receive onClick/onDoubleClick events 
       //      as well.
        var count = this.lines.getSize();
        for(var i=0;i< count;i++)
        {
          var line = this.lines.get(i);
          var children= line.getChildren();
          children.each(function(i,e){
              if(e.hitTest(x,y)===true){
                  result = e;
                  return false;
              }
          });
        }
        
        return result;
    },


    /**
     * @method
     * Return the line which match the hands over coordinate
     *
     * @param {Number} x the x-coordinate for the hit test
     * @param {Number} y the x-coordinate for the hit test
     * @param {graphiti.shape.basic.Line} lineToIgnore a possible line which should be ignored for the hit test
     *
     * @private
     * @return {graphiti.shape.basic.Line}
     **/
    getBestLine:function( x,  y,  lineToIgnore)
    {
      var result = null;
      var count = this.lines.getSize();

      for(var i=0;i< count;i++)
      {
        var line = this.lines.get(i);
        if(line.hitTest(x,y)===true && line!==lineToIgnore)
        {
            if(result===null){
               result = line;
               break;
            }
        }
      }
      return result;
    }, 

    /**
     * @param {graphiti.shape.basic.Line} line The line for the resize handles.
     * @private
     **/
    showLineResizeHandles:function( line )
    {
      var resizeWidthHalf = this.resizeHandleStart.getWidth()/2;
      var resizeHeightHalf= this.resizeHandleStart.getHeight()/2;
      
      var startPoint = line.getStartPoint();
      var endPoint   = line.getEndPoint();
      
      this.resizeHandleStart.show(this,startPoint.x-resizeWidthHalf,startPoint.y-resizeHeightHalf);
      this.resizeHandleEnd.show(this,endPoint.x-resizeWidthHalf,endPoint.y-resizeHeightHalf);

      this.resizeHandleStart.setDraggable(line.isResizeable());
      this.resizeHandleEnd.setDraggable(line.isResizeable());
    },

    /**
     * @private
     **/
    hideLineResizeHandles:function()
    {
        this.resizeHandleStart.hide();
        this.resizeHandleEnd.hide();
    },
    
    /**
     * @method
     * @private
     **/
    showResizeHandles:function(figure)
    {
     
      if( this.getCurrentSelection()!==figure)
      {
        this.hideLineResizeHandles();
        this.hideResizeHandles();
      }

      var resizeWidth = this.resizeHandle1.getWidth();
      var resizeHeight= this.resizeHandle1.getHeight();
      var objHeight   = figure.getHeight();
      var objWidth    = figure.getWidth();
      var xPos = figure.getX();
      var yPos = figure.getY();

      this.resizeHandle1.show(this,xPos-resizeWidth,yPos-resizeHeight);
      this.resizeHandle3.show(this,xPos+objWidth,yPos-resizeHeight);
      this.resizeHandle5.show(this,xPos+objWidth,yPos+objHeight);
      this.resizeHandle7.show(this,xPos-resizeWidth,yPos+objHeight);

      this.resizeHandle1.setDraggable(figure.isResizeable());
      this.resizeHandle3.setDraggable(figure.isResizeable());
      this.resizeHandle5.setDraggable(figure.isResizeable());
      this.resizeHandle7.setDraggable(figure.isResizeable());

      if(figure.isResizeable()===true)
      {
        this.resizeHandle1.setBackgroundColor(this.resizeHandle1.DEFAULT_COLOR);
        this.resizeHandle3.setBackgroundColor(this.resizeHandle3.DEFAULT_COLOR);
        this.resizeHandle5.setBackgroundColor(this.resizeHandle5.DEFAULT_COLOR);
        this.resizeHandle7.setBackgroundColor(this.resizeHandle7.DEFAULT_COLOR);
      }
      else
      {
        this.resizeHandle1.setBackgroundColor(null);
        this.resizeHandle3.setBackgroundColor(null);
        this.resizeHandle5.setBackgroundColor(null);
        this.resizeHandle7.setBackgroundColor(null);
      }

      if(figure.isStrechable() && figure.isResizeable())
      {
        this.resizeHandle2.setDraggable(figure.isResizeable());
        this.resizeHandle4.setDraggable(figure.isResizeable());
        this.resizeHandle6.setDraggable(figure.isResizeable());
        this.resizeHandle8.setDraggable(figure.isResizeable());
        this.resizeHandle2.show(this,xPos+(objWidth/2)-this.resizeHandleHalfWidth,yPos-resizeHeight);
        this.resizeHandle4.show(this,xPos+objWidth,yPos+(objHeight/2)-(resizeHeight/2));
        this.resizeHandle6.show(this,xPos+(objWidth/2)-this.resizeHandleHalfWidth,yPos+objHeight);
        this.resizeHandle8.show(this,xPos-resizeWidth,yPos+(objHeight/2)-(resizeHeight/2));
      }
    },

    /**
     * @method
     * @private
     **/
    hideResizeHandles:function()
    {
       this.resizeHandle1.hide();
       this.resizeHandle2.hide();
       this.resizeHandle3.hide();
       this.resizeHandle4.hide();
       this.resizeHandle5.hide();
       this.resizeHandle6.hide();
       this.resizeHandle7.hide();
       this.resizeHandle8.hide();
    },

    /**
     * @method
     * Move the ResizeHandles to the handsover figure.
     *
     * @param {graphiti.Figure} figure
     * @private
     **/
    moveResizeHandles:function( figure)
    {
      var resizeWidth = this.resizeHandle1.getWidth();
      var resizeHeight= this.resizeHandle1.getHeight();
      var objHeight   = figure.getHeight();
      var objWidth    = figure.getWidth();
      var xPos = figure.getX();
      var yPos = figure.getY();
      this.resizeHandle1.setPosition(xPos-resizeWidth,yPos-resizeHeight);
      this.resizeHandle3.setPosition(xPos+objWidth,yPos-resizeHeight);
      this.resizeHandle5.setPosition(xPos+objWidth,yPos+objHeight);
      this.resizeHandle7.setPosition(xPos-resizeWidth,yPos+objHeight);
      if(figure.isStrechable())
      {
        this.resizeHandle2.setPosition(xPos+(objWidth/2)-this.resizeHandleHalfWidth,yPos-resizeHeight);
        this.resizeHandle4.setPosition(xPos+objWidth,yPos+(objHeight/2)-(resizeHeight/2));
        this.resizeHandle6.setPosition(xPos+(objWidth/2)-this.resizeHandleHalfWidth,yPos+objHeight);
        this.resizeHandle8.setPosition(xPos-resizeWidth,yPos+(objHeight/2)-(resizeHeight/2));
      }
    },

    /**
     * @private
     **/
    hideSnapToHelperLines:function()
    {
      this.hideSnapToHelperLineHorizontal();
      this.hideSnapToHelperLineVertical();
    },

    /**
     * @private
     **/
    hideSnapToHelperLineHorizontal:function()
    {
       if(this.horizontalSnapToHelperLine!==null)
       {
          this.removeFigure(this.horizontalSnapToHelperLine);
          this.horizontalSnapToHelperLine = null;
       }
    },

    /**
     * @private
     **/
    hideSnapToHelperLineVertical:function()
    {
       if(this.verticalSnapToHelperLine!==null)
       {
          this.removeFigure(this.verticalSnapToHelperLine);
          this.verticalSnapToHelperLine = null;
       }
    },


    /**
     * @method
     * Called by the framework during drag&drop operations.<br>
     * Droppable can be setup with:
     * <pre>
     *     $(".graphiti_droppable").draggable({
     *          appendTo:"#container",
     *          stack:"#container",
     *          zIndex: 27000,
     *          helper:"clone",
     *          start: function(e, ui){$(ui.helper).addClass("shadow");}
     *     });
     * </pre>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} draggedDomNode The DOM element which is currently dragging
     * 
    * @template
     **/
    onDragEnter : function( draggedDomNode )
    {
    },
 
    
    /**
     * @method
     * Called if the DragDrop object is moving around.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} draggedDomNode The dragged DOM element.
     * @param {Number} x the x coordinate of the drag
     * @param {Number} y the y coordinate of the drag
     * 
     * @template
     **/
    onDrag:function(draggedDomNode, x, y )
    {
    },

        
    /**
     * @method
     * Called if the DragDrop object leaving the current hover figure.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} draggedDomNode The figure which is currently dragging
     * 
     * @template
     **/
    onDragLeave:function( draggedDomNode )
    {
    },

    
    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     * 
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * 
     * @template
     **/
    onDrop:function(droppedDomNode, x, y)
    {
    },
    
    /**
     * @private
     **/
    onKeyDown:function( /*:int*/ keyCode, /*:boolean*/ ctrl)
    {
      // Figure löscht sich selbst, da dies den KeyDown Event empfangen
      // kann. Bei einer Linie geht dies leider nicht, und muss hier abgehandelt werden.
      //
      if(keyCode==46 && this.currentSelection!==null)
         this.commandStack.execute(this.currentSelection.createCommand(new graphiti.command.CommandType(graphiti.command.CommandType.DELETE)));
      else if(keyCode==90 && ctrl)
         this.commandStack.undo();
      else if(keyCode==89 && ctrl)
         this.commandStack.redo();
      else if(keyCode ===107)
          this.setZoom(this.zoomFactor*0.95);
      else if(keyCode ===109)
          this.setZoom(this.zoomFactor*1.05);
    },

    /**
     * @private
     **/
    onDoubleClick : function(/* :int */x, /* :int */y)
    {
        // check if a line has been hit
        //
        var figure = this.getBestFigure(x, y);

        if(figure!==null){
        	figure.onDoubleClick();
        }

    },

    /**
     * @private
     **/
    onClick : function(/* :int */x, /* :int */y)
    {
        // check if a line has been hit
        //
        var figure = this.getBestFigure(x, y);

        if(figure!==null){
            if (figure.TYPE == "Container") {
                figure.onClick(x, y);
            } else {
                figure.onClick();
            }
        }
    },

    /**
     * @private
     **/
    onMouseDown : function(/* :int */x, /* :int */y)
    {
        var canDragStart = true;

        var figure = this.getBestFigure(x, y);

        // check if the user click on a child shape. DragDrop and movement must redirect
        // to the parent
        // Exception: Port's
        if((figure!==null && figure.getParent()!==null) && !(figure instanceof graphiti.Port)){
            figure = figure.getParent();
        }
        
        if (figure !== null && figure.isDraggable()) {
            canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY());
            // Element send a veto about the drag&drop operation
            if (canDragStart === false) {
                this.mouseDraggingElement = null;
                this.mouseDownElement = figure;
            }
            else {
                this.mouseDraggingElement = figure;
                this.mouseDownElement = figure;
            }
        }

        if (figure !== this.currentSelection && figure !== null && figure.isSelectable() === true) {

            this.hideResizeHandles();
            this.setCurrentSelection(figure);

            // its a line
            if (figure instanceof graphiti.shape.basic.Line) {
                // you can move a line with Drag&Drop...but not a connection.
                // A Connection is fixed linked with the corresponding ports.
                //
                if (!(figure instanceof graphiti.Connection)) {
                    this.draggingLineCommand = figure.createCommand(new graphiti.command.CommandType(graphiti.command.CommandType.MOVE));
                    if (this.draggingLineCommand !== null) {
                        this.draggingLine = figure;
                    }
                }
            }
            else if (canDragStart === false) {
                this.setCurrentSelection(null);
            }
        }
        else if (figure === null) {
            this.setCurrentSelection(null);
        }
    },
    
    /**
     * @private
     */
    onMouseMove : function(/* :int */dx,/* :int */dy)
    {
    },
    
    /**
     * @private
     */
    onMouseDrag : function(/* :int */dx,/* :int */dy)
    {
       if (this.mouseDraggingElement !== null) {
            // it is only neccessary to repaint all connections if we change the layout of any connection
            // This can only happen if we:
            //    - at least one intersection
            //    - we move a "Node. Only a node can have ports ans connections
            if(this.linesToRepaintAfterDragDrop.isEmpty()===true && (this.mouseDraggingElement instanceof graphiti.shape.node.Node)){
                var nodeConnections = this.mouseDraggingElement.getConnections();
                var newLineIntersections = this.lineIntersections.clone();
                this.lineIntersections.each($.proxy(function(i, inter){
                    
                    if(nodeConnections.contains(inter.line) || nodeConnections.contains(inter.other)){
                        newLineIntersections.remove(inter);
                        this.linesToRepaintAfterDragDrop.add(inter.line);
                        this.linesToRepaintAfterDragDrop.add(inter.other);
                    }
                },this));
                this.lineIntersections = newLineIntersections;
                this.linesToRepaintAfterDragDrop.each(function(i, line){
                    line.svgPathString=null;
                    line.repaint();
                });
            }
            
            this.mouseDraggingElement.onDrag(dx, dy);
            var p = this.fromDocumentToCanvasCoordinate(this.mouseDownX + (dx/this.zoomFactor), this.mouseDownY + (dy/this.zoomFactor));
            
            var target = this.getBestFigure(p.x, p.y,this.mouseDraggingElement);
            
            // the hovering element has been changed
            if (target !== this.currentDropTarget) {
                if (this.currentDropTarget !== null) {
                    this.currentDropTarget.onDragLeave(this.mouseDraggingElement);
                    this.currentDropTarget = null;
                }
                if (target !== null) {
                    var isDropTarget = target.onDragEnter(this.mouseDraggingElement);
                    if(isDropTarget===true){
                    	this.currentDropTarget = target;
                    }
                    else{
                    	this.currentDropTarget = null;
                    }
                }
            }
       }
       else if(this.mouseDownElement!==null){
           this.mouseDownElement.onPanning(dx, dy);
       }
    },


    /**
     * @private
     **/
    onMouseUp : function()
    {
        if (this.mouseDraggingElement !== null) {
            this.mouseDraggingElement.onDragEnd();
            if(this.currentDropTarget!==null){
               this.mouseDraggingElement.onDrop(this.currentDropTarget);
               this.currentDropTarget.onDragLeave(this.mouseDraggingElement);
               this.currentDropTarget = null;
            }
            this.mouseDraggingElement = null;
        }
        this.mouseDownElement = null;
    } 

});

