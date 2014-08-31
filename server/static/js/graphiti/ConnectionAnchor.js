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
 * @class graphiti.ConnectionAnchor
 *  An object to which a {@link graphiti.Connection} will be anchored.
 *  
 * @inheritable
 * @author Andreas Herz
 */
graphiti.ConnectionAnchor = Class.extend({
    NAME : "graphiti.ConnectionAnchor",

    /**
     * @constructor
     * 
     * @param {graphiti.Figure} owner the figure to use for the anchor calculation 
     */
    init:function(owner){
    	if(typeof owner ==="undefined"){
    		throw "Missing parameter for 'owner' in ConnectionAnchor";
    	}
    	
        this.owner = owner;
    },

    /**
     * @method
     * Returns the location where the Connection should be anchored in absolute coordinates. 
     * The anchor may use the given reference Point to calculate this location.
     * 
     * @param
     * @return {Number} reference The reference Point in absolute coordinates
     */
    getLocation:function(reference)
    {
       // return the center of the owner.
       return this.getReferencePoint();
    },
    
    /**
     * @method
     * Returns the Figure that contains this ConnectionAnchor.
     * 
     * @return {graphiti.Figure} The Figure that contains this ConnectionAnchor
     */
    getOwner:function()
    {
       return this.owner;
    },
    
    /**
     * @method
     * Set the owner of the Anchor.
     * 
     * @param {graphiti.Figure} owner the new owner of the anchor locator
     */
    setOwner:function( owner)
    {
    	if(typeof owner ==="undefined"){
    		throw "Missing parameter for 'owner' in ConnectionAnchor.setOwner";
    	}
        this.owner=owner;
    },
    
    /**
     * @method
     * Returns the bounds of this Anchor's owner.  Subclasses can override this method
     * to adjust the box. Maybe you return the box of the port parent (the parent figure)
     *
     * @return {graphiti.geo.Rectangle} The bounds of this Anchor's owner
     */
    getBox:function()
    {
      return this.getOwner().getAbsoluteBounds();
    },
    
    /**
     * @method
     * Returns the reference point for this anchor in absolute coordinates. This might be used
     * by another anchor to determine its own location.
     * 
     * @return {graphiti.geo.Point} The reference Point
     */
    getReferencePoint:function()
    {
       return this.getOwner().getAbsolutePosition();
    }
});