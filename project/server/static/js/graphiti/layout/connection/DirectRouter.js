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
 * @class graphiti.layout.connection.DirectRouter
 * Router for direct connections between two ports. Beeline
 * 
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends  graphiti.layout.connection.ConnectionRouter
 */
graphiti.layout.connection.DirectRouter = graphiti.layout.connection.ConnectionRouter.extend({

	/**
	 * @constructor 
	 * Creates a new Router object
	 */
    init: function(){
    },
    
    
    /**
     * @method
     * Invalidates the given Connection
     */
    invalidate:function()
    {
    },
    
    /**
     * @method
     * Routes the Connection in air line (beeline).
     * 
     * @param {graphiti.Connection} connection The Connection to route
     */
    route:function( connection)
    {
       connection.addPoint(connection.getStartPoint());
       connection.addPoint(connection.getEndPoint());
    }
});
