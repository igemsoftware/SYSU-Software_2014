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
 * @class graphiti.command.CommandType
 * 
 * EditPolicies should determine an Figures editing capabilities. 
 * It is possible to implement an Figure such that it handles all editing 
 * responsibility.<br> 
 * However, it is much more flexible and object-oriented to use 
 * EditPolicies. Using policies, you can pick and choose the editing behavior for 
 * an Figure without being bound to its class hierarchy. Code reuse is increased, 
 * and code management is easier. 
 * 
 * @author Andreas Herz
 */
graphiti.command.CommandType = Class.extend({
	
    NAME : "graphiti.command.CommandType",

    /**
     * @constructor
     * Create a new edit policy object
     * 
     * @param {String} policy 
     */
    init: function( policy) {
       this.policy = policy;
    },

    /**
     * @method
     * Return the String representation of the policy
     * 
     * @return {String}
     **/
    getPolicy:function()
    {
       return this.policy;
    }
});
 
graphiti.command.CommandType.DELETE         = "DELETE";
graphiti.command.CommandType.MOVE           = "MOVE";
graphiti.command.CommandType.CONNECT        = "CONNECT";
graphiti.command.CommandType.MOVE_BASEPOINT = "MOVE_BASEPOINT";
graphiti.command.CommandType.RESIZE         = "RESIZE";


