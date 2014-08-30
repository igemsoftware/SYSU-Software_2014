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
 * @class graphiti.command.CommandStack
 * Stack for undo/redo operations
 */
graphiti.command.CommandStack = Class.extend({
    NAME : "graphiti.command.CommandStack", 


    /**
     * @constructor
     * Create a new CommandStack objects which can be execute via the CommandStack.
     * 
     */
    init : function( ) {
       this.undostack = [];
       this.redostack = [];
       this.maxundo = 50;
       this.eventListeners = new graphiti.util.ArrayList();
    },
    
 
    /**
     * @method
     * Set the maximal undo stack size. Entries will be remove if the max. stack 
     * size has been reached.
     *
     * @param {Number} count The maximal undo stack size.
     * 
     **/
    setUndoLimit:function( count)
    {
      this.maxundo = count;
    },
    
    /**
     * @method
     * Remove the undo / redo history. This is useful if the user has been save the 
     * document.
     *
     **/
    markSaveLocation:function()
    {
       this.undostack = [];
       this.redostack = [];
    },
    
    /**
     * @method
     * 
     * Executes the specified Command if possible. Prior to executing the command, a
     * graphiti.command.CommandStackEvent for {@link #PRE_EXECUTE} will be fired to event listeners. 
     * Similarly, after attempting to execute the command, an event for {@link #POST_EXECUTE}
     * will be fired.
     *
     * @param {graphiti.command.Command} command The command to execute.
     * 
     **/
    execute:function(command)
    {
       // nothing to do
       if(command===null)
          return; //silently
    
       if(typeof command === "undefined")
          throw "Missing parameter [command] for method call CommandStack.execute";
          
       // return if the command can't execute or it doesn't change the model
       // => Empty command
       if(command.canExecute()===false)
          return;
    
       this.notifyListeners(command, graphiti.command.CommandStack.PRE_EXECUTE);
    
       this.undostack.push(command);
       command.execute();
    
       // cleanup the redo stack if the user execute a new command.
       // I think this will create a "clean" behaviour of the unde/redo mechanism.
       //
       this.redostack = [];
    
       // monitor the max. undo stack size
       //
       if(this.undostack.length > this.maxundo)
       {
          this.undostack = this.undostack.slice(this.undostack.length-this.maxundo);
       }
       this.notifyListeners(command, graphiti.command.CommandStack.POST_EXECUTE);
    },
    
    /**
     * @method
     * Undo on command from the stack and store them on the redo command stack.
     *
     **/
    undo:function()
    {
       var command = this.undostack.pop();
       if(command)
       {
          this.notifyListeners(command, graphiti.command.CommandStack.PRE_UNDO);
          this.redostack.push(command);
          command.undo();
          this.notifyListeners(command, graphiti.command.CommandStack.POST_UNDO);
       }
    },
    
    /** 
     * @method
     * Redo a command after the user has undo a command
     *
     **/
    redo:function()
    {
       var command = this.redostack.pop();
    
       if(command)
       {
          this.notifyListeners(command, graphiti.command.CommandStack.PRE_REDO);
          this.undostack.push(command);
          command.redo();
          this.notifyListeners(command, graphiti.command.CommandStack.POST_REDO);
       }
    },
    
    /**
     * @method
     * Return the label of the next REDO command.
     *
     * @return {String}
    **/
    getRedoLabel:function()
    {
       if(this.redostack.lenght===0)
         return "";
         
       var command = this.redostack[this.redostack.length-1];
    
       if(command)
       {
          return command.getLabel();
       }
       return "";
    },
    
    
    /**
     * @method
     * Return the label of the next UNDO command.
     *
     * @return {String}
     **/
    getUndoLabel:function()
    {
       if(this.undostack.lenght===0)
         return "";
         
       var command = this.undostack[this.undostack.length-1];
    
       if(command)
       {
          return command.getLabel();
       }
       return "";
    },
    
    
    /**
     * @method
     * Indicates whenever a REDO is possible.
     * 
     * @return boolean <code>true</code> if it is appropriate to call {@link #redo()}.
     */
    canRedo:function()
    {
       return this.redostack.length>0;
    },
    
    /**
     * @method 
     * indicator whenever a undo is possible.
     * 
     * @return {boolean} <code>true</code> if {@link #undo()} can be called
     **/ 
    canUndo:function()
    {
       return this.undostack.length>0;
    },
    
    /**
     * @method
     * Adds a listener to the command stack, which will be notified whenever a command has been processed on the stack.
     * 
     * @param {graphiti.command.CommandStackEventListener} listener the listener to add.
     */
    addEventListener:function( listener)
    {
        if(listener instanceof graphiti.command.CommandStackEventListener){
          this.eventListeners.add(listener);
        }
        else if(typeof listener.stackChanged ==="function"){
          this.eventListeners.add(listener);
        }
        else if(typeof listener === "function"){
          this.eventListeners.add( {  stackChanged : listener });
        }
        else{
          throw "Object doesn't implement required callback interface [graphiti.command.CommandStackListener]";
        }
    },
    
    /**
     * @method
     * Removes a listener from the command stack.
     * 
     * @param {graphiti.command.CommandStackEventListener} listener the listener to remove.
     */
    removeEventListener:function(listener)
    {
        for (var i = 0; i < size; i++){
            var entry = this.eventListeners.get(i);
            if(entry ===listener || entry.stackChanged === listener){
                this.eventListeners.remove(entry);
                return;
            }
         }
    },
        
    /**
     * @method
     * Notifies command stack event listeners that the command stack has changed to the
     * specified state.
     * 
     * @param {graphiti.command.Command} command the command
     * @param {Number} state the current stack state
     *
     **/
    notifyListeners:function(command,  state)
    {
      var event = new graphiti.command.CommandStackEvent(this, command, state);
      var size = this.eventListeners.getSize();
      for (var i = 0; i < size; i++)
         this.eventListeners.get(i).stackChanged(event);
    }
});


/** Constant indicating notification prior to executing a command (value is 1).*/
graphiti.command.CommandStack.PRE_EXECUTE=1;
/** Constant indicating notification prior to redoing a command (value is 2).*/
graphiti.command.CommandStack.PRE_REDO=2;
/** Constant indicating notification prior to undoing a command (value is 4).*/
graphiti.command.CommandStack.PRE_UNDO=4;
/**  Constant indicating notification after a command has been executed (value is 8).*/
graphiti.command.CommandStack.POST_EXECUTE=8;
/** Constant indicating notification after a command has been redone (value is 16).*/
graphiti.command.CommandStack.POST_REDO=16;
/** Constant indicating notification after a command has been undone (value is 32).*/
graphiti.command.CommandStack.POST_UNDO=32;

graphiti.command.CommandStack.POST_MASK = graphiti.command.CommandStack.POST_EXECUTE | graphiti.command.CommandStack.POST_UNDO | graphiti.command.CommandStack.POST_REDO;
graphiti.command.CommandStack.PRE_MASK  = graphiti.command.CommandStack.PRE_EXECUTE  | graphiti.command.CommandStack.PRE_UNDO  |graphiti.command.CommandStack.PRE_REDO;


