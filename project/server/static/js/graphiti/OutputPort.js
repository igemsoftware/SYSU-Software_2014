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
 * @class graphiti.OutputPort
 * A OutputPort is the start anchor for a {@link graphiti.Connection}.
 * 
 * @author Andreas Herz
 * @extends graphiti.Port
 */ 
graphiti.OutputPort = graphiti.Port.extend({

    NAME : "graphiti.OutputPort",

    /**
     * @constructor
     * Create a new OutputPort element
     * 
     * @param {String} [name] the name for the Port. 
     */
    init : function(name)
    {
        this._super(name);
       
        // responsive for the arrangement of the port 
        // calculates the x/y coordinates in relation to the parent node
        this.locator=new graphiti.layout.locator.OutputPortLocator();
    },

    
    /**
     * @inheritdoc
     * 
     * @param {graphiti.Figure} figure The figure which is currently dragging
     * @return {Boolean} true if this figure accepts the dragging figure for a drop operation
     */
    onDragEnter : function(figure)
    {
    	// Ports accepts only InputPorts as DropTarget
    	//
        if (figure instanceof graphiti.InputPort) {
            return this._super(figure);
        }
        
        if (figure instanceof graphiti.HybridPort) {
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
	  // Ports accepts only InputPorts as DropTarget
	  //
      if(figure instanceof graphiti.InputPort){
        this._super( figure);
      }
      else if(figure instanceof graphiti.HybridPort){
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
       if(request.getPolicy() === graphiti.command.CommandType.CONNECT)
       {
         if(request.source.getParent().getId() === request.target.getParent().getId()){
            return null;
         }
    
         if(request.source instanceof graphiti.InputPort){
            // This is the different to the InputPort implementation of createCommand.
            return new graphiti.command.CommandConnect(request.canvas,request.target,request.source);
         }
         if(request.source instanceof graphiti.HybridPort){
             // This is the different to the InputPort implementation of createCommand.
             return new graphiti.command.CommandConnect(request.canvas,request.target,request.source);
         }
    
         return null;
       }
    
       // ...else call the base class
       return this._super(request);
    }
});