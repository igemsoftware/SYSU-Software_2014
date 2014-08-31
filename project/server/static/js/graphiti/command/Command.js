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
 * @class graphiti.command.Command
 * 
 * Generic support class for the undo/redo concept within graphiti.
 * All add,drag&drop,delete operations should be execute via Commands and the related CommandStack.
 *
 * @inheritable
 * @author Andreas Herz
 */
graphiti.command.Command = Class.extend({

    NAME : "graphiti.command.Command", 

    /**
     * @constructor
     * Create a new Command objects which can be execute via the CommandStack.
     * 
     * @param {String} label
     */
    init: function( label) {
        this.label = label;
    },
    
    
    /**
     * @method
     * Returns a label of the Command. e.g. "move figure".
     *
     * @final
     * @return {String} the label for this command
     **/
    getLabel:function()
    {
       return this.label;
    },
    
    
    /**
     * @method
     * Returns [true] if the command can be execute and the execution of the
     * command modifies the model. e.g.: a CommandMove with [startX,startX] == [endX,endY] should
     * return false. Rhe execution of this Command doesn't modify the model.
     *
     * @return boolean
     **/
    canExecute:function()
    {
      return true;
    },
    
    /**
     * @method
     * Execute the command the first time.
     * Sup-classes must implement this method.
     *
     * @template
     **/
    execute:function()
    {
    },
    
    /**
     * @method
     * Will be called if the user cancel the operation.
     *
     * @template
     **/
    cancel:function()
    {
    },
    
    /**
     * @method
     * Undo the command.
     * Sup-classes must implement this method.
     *
     * @template
     **/
    undo:function()
    {
    },
    
    /** 
     * @method
     * Redo the command after the user has undo this command.
     * Sup-classes must implement this method.
     *
     * @template
     **/
    redo:function()
    {
    }
});
