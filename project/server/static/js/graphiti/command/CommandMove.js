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
 * @class graphiti.command.CommandMove
 * 
 * Command for the movement of figures.
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends graphiti.command.Command
 */
graphiti.command.CommandMove = graphiti.command.Command.extend({
    NAME : "graphiti.command.CommandMove", 
  
    /**
     * @constructor
     * Create a new Command objects which can be execute via the CommandStack.
     *
     * @param {graphiti.Figure} figure the figure to move
     * @param {Number} [x] the current x position
     * @param {Number} [y] the current y position
     */
    init : function(figure, x, y)
    {
        this._super("Move Figure");
        this.figure = figure;
        if (typeof x === "undefined")
        {
            this.oldX = figure.getX();
            this.oldY = figure.getY();
        }
        else
        {
            this.oldX = x;
            this.oldY = y;
        }
   },
    
  
    /**
     * @method
     * Set the initial position of the element
     *
     * @param {Number} x the new initial x position
     * @param {Number} y the new initial y position
     **/
    setStartPosition:function( x,  y)
    {
       this.oldX = x;
       this.oldY = y;
    },
    
    /**
     * @method
     * Set the target/final position of the figure move command.
     *
     * @param {Number} x the new x position
     * @param {Number} y the new y position
     **/
    setPosition:function( x,  y)
    {
       this.newX = x;
       this.newY = y;
    },

    /**
     * @method
     * Returns [true] if the command can be execute and the execution of the
     * command modify the model. A CommandMove with [startX,startX] == [endX,endY] should
     * return false. <br>
     * the execution of the Command doesn't modify the model.
     *
     * @return {boolean}
     **/
    canExecute:function()
    {
      // return false if we doesn't modify the model => NOP Command
      return this.newX!=this.oldX || this.newY!=this.oldY;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
       this.redo();
    },
    
    /**
     * @method
     *
     * Undo the move command
     *
     **/
    undo:function()
    {
       this.figure.setPosition(this.oldX, this.oldY);
    },
    
    /**
     * @method
     * 
     * Redo the move command after the user has undo this command
     *
     **/
    redo:function()
    {
       this.figure.setPosition(this.newX, this.newY);
    }
});