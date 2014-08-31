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
 * @class graphiti.Port
 * A Port is the anchor for a {@link graphiti.Connection}. A {@link graphiti.Connection} must have a start and a end Port.
 * 
 * @author Andreas Herz
 * @extends graphiti.shape.basic.Circle
 */ 
graphiti.Port = graphiti.shape.basic.Circle.extend({
    NAME : "graphiti.Port",

    DEFAULT_BORDER_COLOR:new graphiti.util.Color(44, 83, 158),
    
    /**
     * @constructor
     * Creates a new Node element which are not assigned to any canvas.
     * 
     * @param {String} [name] the name of the port.
     */
    init : function( name)
    {
        this.locator = null;
        
        this._super();
        
        if (graphiti.isTouchDevice) {
            this.setDimension(25, 25);
        }
        else {
            this.setDimension(10, 10);
        }

        // status var for user interaction
        //
        this.ox = this.x;
        this.oy = this.y;
        this.originalSnapToGrid = false;
        this.originalSnapToGrid = false;
        this.coronaWidth = 5; // the corona width for the hitTest method. Usefull during drag&drop of ports. Better SnapTo behaviour.
        this.corona = null; // Circle
        this.currentTarget = null; // Port

        // visible representation
        //
        this.setBackgroundColor(new graphiti.util.Color(100, 180, 100));
        this.setStroke(1);
        this.setColor(this.DEFAULT_BORDER_COLOR);
        this.setSelectable(false);
    
        // avoid "undefined" values. This breaks the code on iOS.
        if(typeof name ==="undefined"){
            this.name = null;
        }
        else{
            this.name = name;
        }
        
        // for dynamic diagrams. A Port can have a value which is set by a connector
        //
        this.value = null; 
    },

    

    /**
     * @method
     * Set the locator/layouter of the port. A locator is responsive for the x/y arrangement of the 
     * port in relation to the parent node.
     * 
     * @param {graphiti.layout.locator.Locator} locator
     */
    setLocator: function(locator){
        this.locator = locator;
    },
    
    
    /**
     * @method
     * Set a value for the port. This is usefull for interactive/dynamic diagrams like circuits, simulator,...
     *  
     * @param {Object} value the new value for the port 
     */
    setValue:function(value){
        this.value = value;
        if(this.getParent()!==null){
           this.getParent().onPortValueChanged(this);
        }
    },
    
    /**
     * @method
     * Return the user defined value of the port.
     * 
     * @returns {Object}
     */
    getValue:function(){
        return this.value;
    },
    
     /**
      * @inheritdoc
      * 
      * @param attributes
      */
     repaint:function(attributes){
         if(this.repaintBlocked===true || this.shape===null){
             return;
         }

         if(typeof attributes === "undefined"){
             attributes= {};
         }
         
         // a port did have the 0/0 coordinate i the center and not in the top/left corner
         //
         attributes.cx = this.getAbsoluteX();
         attributes.cy = this.getAbsoluteY();
         attributes.rx = this.width/4;
         attributes.ry = this.width/4;
         attributes.fill="r(.4,.3)#499bea-#207ce5:60-#207ce5";
         
         this._super(attributes);
     },
     
    
    /**
     * @inheritdoc
     *
     **/
    onMouseEnter:function()
    {
        this.setStroke(2);
    },
    
    
    /**
     * @inheritdoc
     * 
     **/
    onMouseLeave:function()
    {
        this.setStroke(1);
    },


    /**
     * @method
     * Returns a {@link graphiti.util.ArrayList} of {@link graphiti.Connection}s of all related connections to this port.
     *
     * @type {graphiti.util.ArrayList}
     **/
    getConnections:function()
    {
      var result = new graphiti.util.ArrayList();
    
      // Return all Connections which are bounded to this port
      // In this case this are all movement listener
    
      var size= this.moveListener.getSize();
      for(var i=0;i<size;i++)
      {
        var target = this.moveListener.get(i);
        if(target instanceof graphiti.Connection){
           result.add(target);
        }
      }
      return result;
    },
    
    
    /**
     * @method
     * Set the parent of this port.
     * Call {@link graphiti.shape.node.Node#addPort} if you want to a port to node. Don't call this method directly.
     *
     * @private
     */
    setParent:function(parent)
    {
      this._super(parent);
      
      if(this.parent!==null){
        this.parent.detachMoveListener(this);
      }
      
      if(this.parent!==null) {
        this.parent.attachMoveListener(this);
      }
    },
    

    /**
     * @method
     * Returns the corona width of the Port. The corona width will be used during the
     * drag&drop of a port.
     *
     * @return {Number}
     **/
    getCoronaWidth:function()
    {
       return this.coronaWidth;
    },
    
    
    /**
     * @method
     * Set the corona width of the Port. The corona width will be used during the
     * drag&drop of a port. You can drop a port in the corona of this port to create
     * a connection. It is not neccessary to drop exactly on the port.
     *
     * @param {Number} width The new corona width of the port
     **/
    setCoronaWidth:function( width)
    {
       this.coronaWidth = width;
    },
    
    /**
     * @inheritdoc
     * 
     * @return {boolean}
     **/
    onDragStart : function()
    {
        this.originalSnapToGrid = this.parent.getCanvas().getSnapToGrid();
        this.originalSnapToGeometry = this.parent.getCanvas().getSnapToGeometry();
        this.parent.getCanvas().setSnapToGrid(false);
        this.parent.getCanvas().setSnapToGeometry(false);

        this.getShapeElement().toFront();
        // dont't call the super method. This creates a command and this is not necessary for a port
        this.ox = this.x;
        this.oy = this.y;

       return true;
    },
    
    /**
     * @inheritdoc
     * 
     * @param {Number} dx the x difference between the start of the drag drop operation and now
     * @param {Number} dy the y difference between the start of the drag drop operation and now
     **/
    onDrag:function(dx, dy)
    {
      this.isInDragDrop = true;

      this._super( dx, dy);
      
      this.parent.getCanvas().showConnectionLine(this.ox+this.getParent().getAbsoluteX(), this.oy+this.getParent().getAbsoluteY(), 
                                                 this.getAbsoluteX(), this.getAbsoluteY());

      var target=this.getDropTarget(this.getAbsoluteX(),this.getAbsoluteY(), this);
      // the hovering element has been changed
      if(target!==this.currentTarget){
          if(this.currentTarget!==null){
              this.currentTarget.onDragLeave(this);
          }
          if(target!==null){
              target.onDragEnter(this);
          }
      }
      this.currentTarget=target;         
    },
    
    
    /**
     * @inheritdoc
     **/
    onDragEnd:function()
    {
      this.parent.getCanvas().setSnapToGrid(this.originalSnapToGrid );
      this.parent.getCanvas().setSnapToGeometry( this.originalSnapToGeometry );
      
      // Don't call the parent implementation. This will create an CommandMove object
      // and store them o the CommandStack for the undo operation. This makes no sense for a
      // port.
      // graphiti.shape.basic.Rectangle.prototype.onDragEnd.call(this); DON'T call the super implementation!!!
    
      this.setAlpha(1.0);
    
      // 1.) Restore the old Position of the node
      //
      this.setPosition(this.ox,this.oy);
    
      // 2.) Remove the bounding line from the canvas
      //
      this.parent.getCanvas().hideConnectionLine();
      this.isInDragDrop =false;
      
      // Reset the drag&drop flyover information 
      //
      this.currentTarget = null;
    },
    
    /**
     * @method
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * 
     * @return {Boolean} true if this port accepts the dragging port for a drop operation
     * @private
     **/
    onDragEnter : function( draggedFigure )
    {
    	// Ports accepts only Ports as DropTarget
    	//
    	if(!(draggedFigure instanceof graphiti.Port)){
    		return false;
    	}
    	
        // Create a CONNECT Command to determine if we can show a Corona. Only valid
        // dropTarget did have a corona
        var request = new graphiti.command.CommandType(graphiti.command.CommandType.CONNECT);
        request.canvas = this.parent.getCanvas();
        request.source = draggedFigure;
        request.target = this;
        request.decorator = this.decorator;

        var command = this.createCommand(request);

        if (command === null) {
            return false;
        }

        this.parent.getCanvas().connectionLine.setGlow(true);
        this.setGlow(true);
        return true;
    },
    
    /**
     * @method
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * @private
     **/
    onDragLeave:function( figure )
    {
		// Ports accepts only Ports as DropTarget
		//
		if(!(figure instanceof graphiti.Port)){
			return;
		}
		
        this.parent.getCanvas().connectionLine.setGlow(false);
        this.setGlow(false);
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
    	// Ports accepts only Ports as DropTarget
    	//
    	if(!(dropTarget instanceof graphiti.Port)){
    		return;
    	}
 
    	var request = new graphiti.command.CommandType(graphiti.command.CommandType.CONNECT);
        request.canvas = this.parent.getCanvas();
        request.source = dropTarget;
        request.target = this;

        // get line decorator
        /*var a = prompt("choose line decorator (input 'T' or 'Arrow')");
        this.decorator = a;
        request.decorator = this.decorator;*/

        var command = this.createCommand(request);
        if(command!==null){
           this.parent.getCanvas().getCommandStack().execute(command);
        }
        this.setGlow(false);
    },
   

    /**
     * @method
     * Callback method of the movement of a figure
     * 
     * @param {graphiti.Figure} figure The figure which has been moved
     **/
    onOtherFigureIsMoving:function( figure)
    {
      this.repaint();
      
      // Falls sich der parent bewegt hat, dann muss der Port dies seinen
      // Connections mitteilen
      this.fireMoveEvent();
    },
    
    /**
     * @method
     * Return the name of this port.
     *
     * @see graphiti.shape.node.Node#getPort
     * @return {String}
     **/
    getName:function()
    {
      return this.name;
    },
    
    /**
     * @method
     * Set the name of this port.
     *
     * @see graphiti.shape.node.Node#getPort
     * @param {String} name The new name of this port.
     **/
    setName:function( name)
    {
      this.name=name;
    },
    
    /**
     * @method
     * Hit test for ports. This method respect the corona diameter of the port for the hit test.
     * 
     * @param {Number} iX
     * @param {Number} iY
     * @returns {Boolean}
     */
    hitTest:function (/*:int*/ iX ,/*:int*/ iY)
    {
        var x = this.getAbsoluteX()-(this.coronaWidth*2)-this.getWidth()/2;
        var y = this.getAbsoluteY()-(this.coronaWidth*2)-this.getHeight()/2;
        var iX2 = x + this.width + (this.coronaWidth*2);
        var iY2 = y + this.height + (this.coronaWidth*2);
        return (iX >= x && iX <= iX2 && iY >= y && iY <= iY2);
    },
    
    /**
     * @method
     * Highlight this port
     * 
     * @param {boolean} flag indicator if the figure should glow.
     */
    setGlow:function ( flag)
    {
      if(flag===true && this.corona===null)
      {
    	  this.corona = new graphiti.Corona();
    	  this.corona.setDimension(this.getWidth()+(this.getCoronaWidth()*2),this.getWidth()+(this.getCoronaWidth()*2));
          this.corona.setPosition(this.getAbsoluteX()-this.getCoronaWidth()-this.getWidth()/2, this.getAbsoluteY()-this.getCoronaWidth()-this.getHeight()/2);
          
          this.corona.setCanvas(this.getCanvas());

          // important inital 
          this.corona.getShapeElement();
          this.corona.repaint();
          
          // DON'T add them to the document. The corona is just a visual feedback and not part
          // of the canvas document.
         // this.parent.getCanvas().addFigure(this.corona,this.getAbsoluteX()-this.getCoronaWidth()-this.getWidth()/2, this.getAbsoluteY()-this.getCoronaWidth()-this.getHeight()/2);
      }
      else if(flag===false && this.corona!==null)
      {
          this.corona.setCanvas(null);
    	  this.parent.getCanvas().removeFigure(this.corona);
    	  this.corona = null;
      }
    },
    
    /**
     * @inheritdoc
     *
     * @param {graphiti.command.CommandType} request describes the Command being requested
     * @return {graphiti.command.Command} null or a valid command
     **/
    createCommand:function(request)
    {
       // the port has its own implementation of the CommandMove
       //
       if(request.getPolicy() ===graphiti.command.CommandType.MOVE)
       {
         if(!this.isDraggable()){
            return null;
         }
         return new graphiti.command.CommandMovePort(this);
       }
       // Connect request between two ports
       //
       if(request.getPolicy() ===graphiti.command.CommandType.CONNECT)
       {
         if(request.source.parent.id === request.target.parent.id){
            return null;
         }
         else{

            return new graphiti.command.CommandConnect(request.canvas,request.source,request.target,request.decorator);
         }
       }
    
       return null;
    },
    
    /**
     * @method
     * Called from the figure itself when any positin changes happens. All listenter
     * will be informed.
     * DON'T fire this event if the Port is during a Drag&Drop operation. This can happen
     * if we try to connect two ports
     * 
     * @private
     **/
    fireMoveEvent : function()
    {
        if (this.isInDragDrop === true) {
            return;
        }

        this._super();
    },
 
    /**
     * @method 
     * Return a possible drop target which is under the hands over coordinate.
     * 
     * @param {Number} x
     * @param {Number} y
     * 
     * @return {graphiti.Figure}
     */
    getDropTarget: function (x , y, portToIgnore)
    {
      for(var i=0;i<this.targets.getSize();i++)
      {
        var target = this.targets.get(i);
        if (target.hitTest(x, y)===true && target!==portToIgnore)
        {
            return target;
        }
      }
      return null;
    },

    onClick: function () {
        // 重载onclick函数，使点击链接点时不出现菜单栏和配置栏
    }
});


/**
 * @class graphiti.Corona
 * Glow effect for ports. Just for internal use.
 * 
 * @extend graphiti.shape.basic.Circle
 */
graphiti.Corona = graphiti.shape.basic.Circle.extend({

    /**
     * @constructor
     * Creates a new Node element which are not assigned to any canvas.
     * 
     */
    init : function()
    {
        this._super();
        this.setAlpha(0.3);
        this.setBackgroundColor(new  graphiti.util.Color(178,225,255));
        this.setColor(new graphiti.util.Color(102,182,252));
    },
    
    /**
     * @method
     * the the opacity of the element.
     * 
     * @param {Number} percent
     */
    setAlpha : function(percent)
    {
        this._super(Math.min(0.3, percent));
        this.setDeleteable(false);
        this.setDraggable(false);
        this.setResizeable(false);
        this.setSelectable(false);
    },

    onClick: function () {
        // 重载onclick函数，使点击链接点时不出现菜单栏和配置栏
    }
});
