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
 * @class graphiti.HybridPort
 * A HybridPort can work as Input and as Output port in the same way for a {@link graphiti.Connection}.
 * 
 * @author Andreas Herz
 * @extends graphiti.Port
 */ 
graphiti.HybridPort = graphiti.Port.extend({

    NAME : "graphiti.HybridPort",

    /**
     * @constructor
     * Create a new HybridPort element
     * 
     * @param {String} [name] the name for the Port.
     */
    init : function(name)
    {
        this._super(name);
        this.TYPE = "HybridPort";
    },

    
    /**
     * @inheritdoc
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * @return {Boolean} true if this figure accepts the dragging figure for a drop operation
     */
    onDragEnter : function(figure)
    {
    	// Accept any kind of port
        if (figure instanceof graphiti.Port) {
            return this._super(figure);
        }
        
        return false;
    },
    
    /**
     * @inheritdoc
     * 
     */
    onDragLeave:function( figure)
    {
	  // Ports accepts only Ports as DropTarget
	  //
	  if(!(figure instanceof graphiti.Port)){
		 return;
	  }

	  // accept any kind of port
      if(figure instanceof graphiti.Port){
        this._super( figure);
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
       // Connect request between two ports
       //
       if(request.getPolicy() === graphiti.command.CommandType.CONNECT) {
           
         if(request.source.getParent().getId() === request.target.getParent().getId()){
            return null;
         }    

         if (request.source instanceof graphiti.InputPort) {
            // This is the difference to the InputPort implementation of createCommand.
            return new graphiti.command.CommandConnect(request.canvas, request.target, request.source,request.decorator);
         }
         else if (request.source instanceof graphiti.OutputPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new graphiti.command.CommandConnect(request.canvas, request.source, request.target,request.decorator);
         }
         else if (request.source instanceof graphiti.HybridPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new graphiti.command.CommandConnect(request.canvas, request.source, request.target, request.decorator);
         }
         
         return null;
       }
    
       // ...else call the base class
       return this._super(request);
    }
});