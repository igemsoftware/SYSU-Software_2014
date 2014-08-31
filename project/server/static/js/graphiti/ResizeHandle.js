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
 * @class graphiti.ResizeHandle
 * The Resizehandles for Figures.

 * <pre>
 * Possible Type:
 * 
 *     1             2               3
 *     O-----------O-------------O
 *     |                         |
 *     |                         |
 *   8 O           + 9           O 4
 *     |                         |
 *     |                         |
 *     O-----------O-------------O
 *   7             6               5
 * </pre>
 * 
 * @author Andreas Herz
 * @extends graphiti.shape.basic.Rectangle
 */
graphiti.ResizeHandle = graphiti.shape.basic.Rectangle.extend({
    NAME : "graphiti.ResizeHandle",

    DEFAULT_COLOR : "#99ccff",
    
    /**
     * @constructor
     * Creates a new figure element which are not assigned to any canvas.
     *
     * @param {graphiti.Canvas} canvas the related canvas element
     * @param {Number} type the type of the ResizeHandle.
     */
    init: function( canvas, type) {
 
      this._super();
      
      if(graphiti.isTouchDevice){
          this.setDimension(15,15);
      }
      else{
          this.setDimension(8,8);
      }
          
      this.type = type;
      this.canvas = canvas;
      this.command = null;
      this.commandMove=null;
      this.commandResize=null;
      
      var offset= this.getWidth();
      var offset2 = offset/2;
      
      switch(this.type)
      {
        case 1:
          this.setSnapToGridAnchor(new graphiti.geo.Point(offset,offset));
          break;
        case 2:
          this.setSnapToGridAnchor(new graphiti.geo.Point(offset2,offset));
          break;
        case 3:
          this.setSnapToGridAnchor(new graphiti.geo.Point(0,offset));
          break;
        case 4:
          this.setSnapToGridAnchor(new graphiti.geo.Point(0,offset2));
          break;
        case 5:
          this.setSnapToGridAnchor(new graphiti.geo.Point(0,0));
          break;
        case 6:
          this.setSnapToGridAnchor(new graphiti.geo.Point(offset2,0));
          break;
        case 7:
          this.setSnapToGridAnchor(new graphiti.geo.Point(offset,0));
          break;
        case 8:
          this.setSnapToGridAnchor(new graphiti.geo.Point(offset,offset2));
          break;
        case 9:
          this.setSnapToGridAnchor(new graphiti.geo.Point(offset2,offset2));
          break;
      }
      
      this.setBackgroundColor(this.DEFAULT_COLOR);
      this.setColor("#000000");
      this.setStroke(0.5);
      this.setSelectable(false);
      this.setRadius(0);
    },
    

    /**
     * @method
     * The edge of the rectangle for the snapTo mechanism.
     * 
     * @return
     */
    getSnapToDirection:function()
    {
      switch(this.type)
      {
        case 1:
         return graphiti.SnapToHelper.NORTH_WEST;
        case 2:
         return graphiti.SnapToHelper.NORTH;
        case 3:
         return graphiti.SnapToHelper.NORTH_EAST;
        case 4:
         return graphiti.SnapToHelper.EAST;
        case 5:
         return graphiti.SnapToHelper.SOUTH_EAST;
        case 6:
         return graphiti.SnapToHelper.SOUTH;
        case 7:
         return graphiti.SnapToHelper.SOUTH_WEST;
        case 8:
         return graphiti.SnapToHelper.WEST;
        case 9:
         return graphiti.SnapToHelper.NSEW;
      }
    },
    

    /**
     * @method
     * Will be called if the drag and drop action beginns. You can return [false] if you
     * want avoid that the figure can be move.
     * 
    * @return {boolean} true whenever the drag drop operation is allowed.
     **/
    onDragStart : function()
    {
        // This happens if the selected figure has set the "nonResizeable" flag
        // In this case the ResizeHandle can't be dragged. => no resize
        //
        if (!this.isDraggable()) {
            return false;
        }

        this.ox = this.getAbsoluteX();
        this.oy = this.getAbsoluteY();

        var figure = this.getCanvas().getCurrentSelection();

        this.commandMove = figure.createCommand(new graphiti.command.CommandType(graphiti.command.CommandType.MOVE));
        this.commandResize = figure.createCommand(new graphiti.command.CommandType(graphiti.command.CommandType.RESIZE));

        return true;
    },
    
    
    /**
     * @method 
     * Called by the framework if the figure is moved by user interaction.
     * @param {Number} dx the move x offset
     * @param {Number} dy the move y offset
     * 
     * @return {boolean}
     */
    onDrag : function(dx, dy)
    {
        if (this.isDraggable() === false) {
            return false;
        }

        var oldX = this.getAbsoluteX();
        var oldY = this.getAbsoluteY();
        
        // call the super.drag method with all snapTo### handler and adjustments
        this._super(dx, dy);

        var diffX = this.getAbsoluteX() - oldX;
        var diffY = this.getAbsoluteY() - oldY;

        var obj = this.getCanvas().getCurrentSelection();
        var objPosX = obj.getAbsoluteX();
        var objPosY = obj.getAbsoluteY();
        var objWidth = obj.getWidth();
        var objHeight = obj.getHeight();

        switch (this.type) {
        case 1:
            obj.setDimension(objWidth - diffX, objHeight - diffY);
            obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY + (objHeight - obj.getHeight()));
            break;
        case 2:
            obj.setDimension(objWidth, objHeight - diffY);
            obj.setPosition(objPosX, objPosY + (objHeight - obj.getHeight()));
            break;
        case 3:
            obj.setDimension(objWidth + diffX, objHeight - diffY);
            obj.setPosition(objPosX, objPosY + (objHeight - obj.getHeight()));
            break;
        case 4:
            obj.setDimension(objWidth + diffX, objHeight);
            break;
        case 5:
            obj.setDimension(objWidth + diffX, objHeight + diffY);
            break;
        case 6:
            obj.setDimension(objWidth, objHeight + diffY);
            break;
        case 7:
            obj.setDimension(objWidth - diffX, objHeight + diffY);
            obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY);
            break;
        case 8:
            obj.setDimension(objWidth - diffX, objHeight);
            obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY);
            break;
        }
        this.canvas.moveResizeHandles(obj);
    },

    /**
     * @method
     * Will be called after a drag and drop action.<br>
     *
     * @private
     **/
    onDragEnd : function()
    {
        if (!this.isDraggable()) {
            return;
        }

        var figure = this.canvas.getCurrentSelection();

        // An non draggable resizeHandle doesn't create a move/resize command.
        // This happens if the selected figure has set the "nonResizeable" flag.
        //
        if (this.commandMove !== null) {
            this.commandMove.setPosition(figure.getX(), figure.getY());
            this.canvas.getCommandStack().execute(this.commandMove);
            this.commandMove = null;
        }

        if (this.commandResize !== null) {
            this.commandResize.setDimension(figure.getWidth(), figure.getHeight());
            this.canvas.getCommandStack().execute(this.commandResize);
            this.commandResize = null;
        }

        this.canvas.hideSnapToHelperLines();
    },
    
    /**
     * Set the position of the object.<br>
     * The ResizeHandle overrides the Figure.setPosition method. The base
     * class updates the resize handles during the update of the Dimension/Position. This
     * is not neccessary for the ResizeHandles. Performance issue.
     * 
     * @param {Number} x The new x coordinate of the figure
     * @param {Number} y The new y coordinate of the figure
     **/
    setPosition:function(x ,y )
    {
      // don't call base implementation. Base implementation will show ResizeHandles...but I'm the ResizeHandle
      this.x = x;
      this.y = y;
      
      this.repaint();
    },
    
    
    /**
     * @method
     * Show the ResizeHandle and add it to the canvas.<br>
     * Additional bring it in to the front of other figures.
     *
     * @param {graphiti.Canvas} canvas the canvas to use
     * @param {Number} x the x-positin
     * @param {Number} y the y-position
     **/
    show:function(canvas, x, y)
    {
      // don't call the parent function. The parent functions delete this object
      // and a resize handle can't be deleted.
      if(this.shape===null) {
         this.setCanvas(canvas);
      }
     
      this.setPosition(x,y);
      this.shape.toFront();
    },
    
    /**
     * @method
     * Hide the resize handle and remove it from the cnavas.
     *
     **/
    hide:function()
    {
      // don't call the parent function. The parent functions delete this object
      // and a resize handle shouldn't be deleted.
      if(this.shape===null){
        return;
      }
        
      this.setCanvas(null);
    },
    
    
    /**
     * @method
     * return true if the element can be used in combination with the 
     * SnapToHelper feature.
     *
     * @return boolean
     * @public
     **/
    supportsSnapToHelper:function()
    {
    	return true;
    },
    
    
    /**
     * @method
     * Override this method and redirect them to the cavas. A ResizeHandle didn't support
     * Keyboard interaction at the moment.
     *
     * @param {Number} keyCode the id of the pressed key
     * @param {boolean} ctrl true if the user has pressed the CTRL/STRG key as well.
     **/
    onKeyDown:function(keyCode, ctrl)
    {
      // don't call the parent function. The parent functions delete this object
      // and a resize handle can't be deleted.
      this.canvas.onKeyDown(keyCode,ctrl);
    },
    
    
    fireMoveEvent:function()
    {
      // A resizeHandle doesn't fire this event.
      // Normally this set the document dirty. This is not necessary for a ResizeHandle.
    },


    // 添加 onclick事件 显示工具栏
    onClick: function(evt) {
      // 重载onclick函数，使点击resizeHandle点时不显示菜单栏和配置栏
    }    
});