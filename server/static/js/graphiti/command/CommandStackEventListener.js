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
 * @class graphiti.command.CommandStackEventListener
 * 
 * Event class which will be fired for every CommandStack operation. Required for CommandStackListener.
 * 
 * @inherit
 * @author Andreas Herz
 */
graphiti.command.CommandStackEventListener = Class.extend({
    NAME : "graphiti.command.CommandStackEventListener", 

    /**
     * @constructor
     * Creates a new Listener Object
     * 
     */
    init : function()
    {
    },
    
    /**
     * @method
     * Sent when an event occurs on the command stack. graphiti.command.CommandStackEvent.getDetail() 
     * can be used to identify the type of event which has occurred.
     * 
     * @template
     * 
     * @param {graphiti.command.CommandStackEvent} event
     **/
    stackChanged:function(event)
    {
    }

});
