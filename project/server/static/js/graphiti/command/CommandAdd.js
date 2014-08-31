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
 * @class graphiti.command.CommandAdd
 * 
 * Command to add a figure with CommandStack support.
 * 
 * @extends graphiti.command.Command
 */
graphiti.command.CommandAdd = graphiti.command.Command.extend({
    
    /**
     * @constructor
     * Create a add command for the given figure.
     * 
     * @param {graphiti.Canvas} canvas the canvas to use
     * @param {graphiti.Figure} figure the figure to add
     */
    init: function(canvas, figure, x,y)
    {
       this._super("Delete Figure");
       this.figure = figure;
       this.canvas = canvas;
       this.x = x;
       this.y = y;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
       this.canvas.addFigure(this.figure, this.x, this.y);
    },
    
    /** 
     * @method
     * Redo the command after the user has undo this command
     *
     **/
    redo:function()
    {
        this.execute();
    },
    
    /**
     * @method
     * Undo the command
     *
     **/
    undo:function()
    {
        this.canvas.removeFigure(this.figure);
    }
    
});