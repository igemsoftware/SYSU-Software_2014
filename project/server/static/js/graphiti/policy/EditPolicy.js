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
 * @class graphiti.policy.EditPolicy
 * 
 *
 * @author Andreas Herz
 */
graphiti.policy.EditPolicy = Class.extend({

    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
    },
    
    /**
     * @method
     * Return the role of the edit policy
     * 
     * @template
     * @return the role of the policy.
     */
    getRole:function(){
        
    }
    
});

/**
 * The key used to install a primary drag EditPolicy. 
 */
graphiti.policy.EditPolicy.Role = 
        { 
           // The key used to install a primary drag EditPolicy.
           PRIMARY_DRAG_ROLE : 0 ,
           
           // The key used to install a direct edit EditPolicy. 
           DIRECT_EDIT_ROLE:1,
           
           // The key used to install a selection feedback EditPolicy. 
           SELECTION_FEEDBACK_ROLE:2
        };