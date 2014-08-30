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
 * @class graphiti.shape.node.Node
 * 
 * A Node is the base class for all figures which can have {@link graphiti.Port}s. A {@link graphiti.Port} is the
 * anchor for a {@link graphiti.Connection} line.<br><br>A {@link graphiti.Port} is a green dot which can 
 * be dragged and dropped over another port.<br>
 * 
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.Figure 
 */
graphiti.shape.node.Node = graphiti.Figure.extend({
 
	NAME : "graphiti.shape.node.Node",

    /**
     * @constructor
     * Creates a new Node element which are not assigned to any canvas.
     */
    init: function( ) {
      this.bgColor   = new  graphiti.util.Color(255,255,255);
      this.lineColor = new  graphiti.util.Color(128,128,255);
      this.lineStroke=1;
      
      this.inputPorts = new graphiti.util.ArrayList();
      this.outputPorts= new graphiti.util.ArrayList();
      this.hybridPorts= new graphiti.util.ArrayList();
      
      this._super();
    },
    

    /**
     * @method
     * Return all ports of the node.
     *
     * @return  {graphiti.util.ArrayList}
     **/
    getPorts: function()
    {
      // TODO: expensive! Find another solution.
      return this.inputPorts
             .clone()
             .addAll(this.outputPorts)
             .addAll(this.hybridPorts);
    },
    
    
    /**
     * @method
     * Return all input ports of the node.
     *
     * @return {graphiti.util.ArrayList}
     **/
    getInputPorts: function()
    {
      return this.inputPorts
               .clone()
               .addAll(this.hybridPorts);
    },
    
    /**
     * @method
     * Return all output ports of the node.
     *
     * @return {graphiti.util.ArrayList}
     **/
    getOutputPorts: function()
    {
      return this.outputPorts
          .clone()
          .addAll(this.hybridPorts);
    },
    
    /**
     * @method
     * Return the port with the corresponding name.
     *
     * 
     * @param {String} portName The name of the port to return.
     * @return {graphiti.Port} Returns the port with the hands over name or null.
     **/
    getPort: function( portName)
    {
        var i=0;
        for ( i = 0; i < this.outputPorts.getSize(); i++) {
            var port = this.outputPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }

        for ( i = 0; i < this.inputPorts.getSize(); i++) {
            var port = this.inputPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }
          
        for ( i = 0; i < this.hybridPorts.getSize(); i++) {
            var port = this.hybridPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }
         return null;
    },
    
    /**
     * @method
     * Return the input port with the corresponding name.
     *
     * 
     * @param {String/Number} portName The name or numeric index of the port to return.
     * @return {graphiti.InputPort} Returns the port with the hands over name or null.
     **/
    getInputPort: function( portName)
    {
        if(typeof portName === "number"){
            return this.inputPorts.get(portName);
        }
        
        for ( var i = 0; i < this.inputPorts.getSize(); i++) {
            var port = this.inputPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }
      
        return null;
    },
    
    /**
     * @method
     * Return the output port with the corresponding name.
     *
     * @param {String/Number} portName The name or the numeric index of the port to return.
     * @return {graphiti.OutputPort} Returns the port with the hands over name or null.
     **/
    getOutputPort: function( portName)
    {
        if(typeof portName === "number"){
            return this.outputPorts.get(portName);
        }
        
         for ( var i = 0; i < this.outputPorts.getSize(); i++) {
            var port = this.outputPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }

        return null;
    },
    
    /**
     * @method
     * Return the input port with the corresponding name.
     *
     * 
     * @param {String/Number} portName The name or numeric index of the port to return.
     * @return {graphiti.InputPort} Returns the port with the hands over name or null.
     **/
    getHybridPort: function( portName)
    {
        if(typeof portName === "number"){
            return this.hybridPorts.get(portName);
        }
        
        for ( var i = 0; i < this.hybridPorts.getSize(); i++) {
            var port = this.hybridPorts.get(i);
            if (port.getName() === portName) {
                return port;
            }
        }
      
        return null;
    },
    
    /**
     * @method
     * Add a port to this node at the given position.<br>
     *
     * @param {graphiti.Port} port The new port to add.
     * @param {graphiti.layout.locator.Locator} locator The layouter for the port.
     **/
    addPort: function(port, locator)
    {
        if(!(port instanceof graphiti.Port)){
            throw "Argument is not typeof 'graphiti.Port'. \nFunction: graphiti.shape.node.Node#addPort";
        }
        
        
        if (port instanceof graphiti.InputPort) {
            this.inputPorts.add(port);
        }
        else if(port instanceof graphiti.OutputPort){
            this.outputPorts.add(port);
        }
        else if(port instanceof graphiti.HybridPort){
            this.hybridPorts.add(port);
        }

        if((typeof locator !== "undefined") && (locator instanceof graphiti.layout.locator.Locator)){
            port.setLocator(locator);
        }
        
        port.setParent(this);
        port.setCanvas(this.canvas);

        // You can't delete a port with the [DEL] key if a port is a child of a node
        port.setDeleteable(false);

        if (this.canvas !== null) {
            port.getShapeElement();
            this.canvas.registerPort(port);
        }
    },
    
    /**
     * @method
     * Removes a port and all related connections from this node.<br>
     *
     * @param {graphiti.Port} port The port to remove.
     **/
    removePort : function(port)
    {
        this.inputPorts.remove(port);
        this.outputPorts.remove(port);
        this.hybridPorts.remove(port);

        if (port.getCanvas() !== null) {
            port.getCanvas().unregisterPort(port);
            // remove the related connections of the port too.
            var connections = port.getConnections();
            for ( var i = 0; i < connections.getSize(); ++i) {
                port.getCanvas().removeFigure(connections.get(i));
            }
        }

        port.setCanvas(null);
    },
    
    /**
     * @method
     * Create a standard Port for this element. Inherited class can override this
     * method to create its own type of ports.
     * 
     * @param {String} type the type of the requested port. possible ["input", "output"]
     * @param {graphiti.layout.locator.Locator} [locator] the layouter to use for this port
     * @template
     */
    createPort: function(type, locator){
        var newPort = null;
        var count =0;
        
    	switch(type){
    	case "input":
    		newPort= new graphiti.InputPort(name);
    		count = this.inputPorts.getSize();
    		break;
    	case "output":
    		newPort= new graphiti.OutputPort(name);
            count = this.outputPorts.getSize();
    		break;
        case "hybrid":
            newPort= new graphiti.HybridPort(name);
            count = this.hybridPorts.getSize();
            break;
    	default:
            throw "Unknown type ["+type+"] of port requested";
    	}
    	
   	    newPort.setName(type+count);
    	
    	this.addPort(newPort, locator);
    	// relayout the ports
    	this.setDimension(this.width,this.height);
    	
    	return newPort;
    },
    
    getConnections: function(){
        var connections = new graphiti.util.ArrayList();
        var ports = this.getPorts();
        for(var i=0; i<ports.getSize(); i++)
        {
          var port = ports.get(i);
          // Do NOT add twice the same connection if it is linking ports from the same node
          for (var c = 0, c_size = port.getConnections().getSize() ; c< c_size ; c++)
          {
              if(!connections.contains(port.getConnections().get(c)))
              {
                connections.add(port.getConnections().get(c));
              }
          }
        }
        return connections;
    },

    /**
     * @private
     **/
    setCanvas : function(canvas)
    {
        var oldCanvas = this.canvas;
        this._super(canvas);
        var canvas =  this.canvas;
        
        var ports = this.getPorts();
        if (oldCanvas !== null) {
            ports.each(function(i,port){
                oldCanvas.unregisterPort(port);
            });
        }

        if (canvas !== null) {
            ports.each(function(i,port){
                port.setCanvas(canvas);
                canvas.registerPort(port);
            });
            // relayout the ports
            this.setDimension(this.width,this.height);
        }
        else {
            ports.each(function(i,port){
                port.setCanvas(null);
            });
        }
        
    },
    
    
    /**
     * @inheritdoc
     *
     * @param {Number} w The new width of the figure
     * @param {Number} h The new height of the figure
     **/
    setDimension:function(w, h)
    {
        this._super(w,h);

        // make no sense to layout the ports if we not part
        // of the canvas
        if(this.shape==null){
            return;
        }
        
        // layout the ports
        //
        this.outputPorts.each(function(i, port){
            port.locator.relocate(i,port);
        });
        
        this.inputPorts.each(function(i, port){
            port.locator.relocate(i,port);
        });
        
        this.hybridPorts.each(function(i, port){
            port.locator.relocate(i,port);
        });
    },

    /**
     * @method
     * Called if the value of any port has been changed
     * 
     * @param {graphiti.Port} relatedPort
     * @template
     */
    onPortValueChanged: function(relatedPort){
    
    }
});