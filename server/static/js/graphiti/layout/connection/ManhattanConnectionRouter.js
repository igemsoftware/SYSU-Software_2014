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
 * @class graphiti.layout.connection.ManhattanConnectionRouter
 * Provides a {@link graphiti.Connection} with an orthogonal route between the Connection's source 
 * and target anchors.
 * 
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends  graphiti.layout.connection.ConnectionRouter
 */
graphiti.layout.connection.ManhattanConnectionRouter = graphiti.layout.connection.ConnectionRouter.extend({
 
	MINDIST : 20,
	TOL     : 0.1,
	TOLxTOL : 0.01,

	/**
	 * @constructor 
	 * Creates a new Router object.
	 * 
	 */
    init: function(){
    },
    
	/**
	 * @method
	 * Layout the hands over connection in a manhattan like layout
	 * 
	 * @param {graphiti.Connection} conn
	 */
	route:function( conn)
	{
	   var fromPt  = conn.getStartPoint();
	   var fromDir = this.getStartDirection(conn);
	
	   var toPt    = conn.getEndPoint();
	   var toDir   = this.getEndDirection(conn);
	
	   // draw a line between the two points.
	   this._route(conn,toPt, toDir, fromPt, fromDir);
	},
	
	/**
	 * @method
	 * Internal routing algorithm.
	 * 
	 * @private
	 * @param {graphiti.Connection} conn
	 * @param {graphiti.geo.Point} fromPt
	 * @param {Number} fromDir
	 * @param {graphiti.geo.Point} toPt
	 * @param {Number} toDir
	 */
	_route:function( conn, fromPt, fromDir, toPt, toDir)
	{
	   // fromPt is an x,y to start from.  
	   // fromDir is an angle that the first link must 
	   //
	   var UP   = 0;
	   var RIGHT= 1;
	   var DOWN = 2;
	   var LEFT = 3;
	
	   var xDiff = fromPt.x - toPt.x;
	   var yDiff = fromPt.y - toPt.y;
	   var point;
	   var dir;
	
	   if (((xDiff * xDiff) < (this.TOLxTOL)) && ((yDiff * yDiff) < (this.TOLxTOL))) 
	   {
	      conn.addPoint(new graphiti.geo.Point(toPt.x, toPt.y));
	      return;
	   }
	
	   if (fromDir === LEFT) 
	   {
	      if ((xDiff > 0) && ((yDiff * yDiff) < this.TOL) && (toDir === RIGHT))
	      {
	         point = toPt;
	         dir = toDir;
	      } 
	      else 
	      {
	         if (xDiff < 0) 
	         {
	            point = new graphiti.geo.Point(fromPt.x - this.MINDIST, fromPt.y);
	         }
	         else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) 
	         {
	            point = new graphiti.geo.Point(toPt.x, fromPt.y);
	         }
	         else if (fromDir == toDir)
	         {
	            var pos = Math.min(fromPt.x, toPt.x) - this.MINDIST;
	            point = new graphiti.geo.Point(pos, fromPt.y);
	         }
	         else
	         {
	            point = new graphiti.geo.Point(fromPt.x - (xDiff / 2), fromPt.y);
	         }
	
	         if (yDiff > 0) 
	         {
	            dir = UP;
	         }
	         else
	         {
	            dir = DOWN;
	         }
	      }
	   }
	   else if (fromDir === RIGHT) 
	   {
	      if ((xDiff < 0) && ((yDiff * yDiff) < this.TOL)&& (toDir === LEFT)) 
	      {
	         point = toPt;
	         dir = toDir;
	      } 
	      else 
	      {
	         if (xDiff > 0) 
	         {
	           point = new graphiti.geo.Point(fromPt.x + this.MINDIST, fromPt.y);
	         } 
	         else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) 
	         {
	            point = new graphiti.geo.Point(toPt.x, fromPt.y);
	         } 
	         else if (fromDir === toDir) 
	         {
	            var pos = Math.max(fromPt.x, toPt.x) + this.MINDIST;
	            point = new graphiti.geo.Point(pos, fromPt.y);
	         } 
	         else 
	         {
	               point = new graphiti.geo.Point(fromPt.x - (xDiff / 2), fromPt.y);
	         }
	
	         if (yDiff > 0)
	         {
	            dir = UP;
	         }
	         else
	         {
	            dir = DOWN;
	         }
	      }
	   } 
	   else if (fromDir === DOWN) 
	   {
	      if (((xDiff * xDiff) < this.TOL) && (yDiff < 0)&& (toDir === UP)) 
	      {
	         point = toPt;
	         dir = toDir;
	      } 
	      else 
	      {
	         if (yDiff > 0) 
	         {
	            point = new graphiti.geo.Point(fromPt.x, fromPt.y + this.MINDIST);
	         } 
	         else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) 
	         {
	           point = new graphiti.geo.Point(fromPt.x, toPt.y);
	         } 
	         else if (fromDir === toDir) 
	         {
	            var pos = Math.max(fromPt.y, toPt.y) + this.MINDIST;
	            point = new graphiti.geo.Point(fromPt.x, pos);
	         } 
	         else 
	         {
	            point = new graphiti.geo.Point(fromPt.x, fromPt.y - (yDiff / 2));
	         }
	
	         if (xDiff > 0) 
	         {
	            dir = LEFT;
	         }
	         else 
	         {
	            dir = RIGHT;
	         }
	      }
	   } 
	   else if (fromDir === UP) 
	   {
	      if (((xDiff * xDiff) < this.TOL) && (yDiff > 0) && (toDir === DOWN))
	      {
	         point = toPt;
	         dir = toDir;
	      } 
	      else 
	      {
	         if (yDiff < 0) 
	         {
	            point = new graphiti.geo.Point(fromPt.x, fromPt.y - this.MINDIST);
	         } 
	         else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) 
	         {
	            point = new graphiti.geo.Point(fromPt.x, toPt.y);
	         } 
	         else if (fromDir === toDir) 
	         {
	            var pos = Math.min(fromPt.y, toPt.y) - this.MINDIST;
	            point = new graphiti.geo.Point(fromPt.x, pos);
	         } 
	         else 
	         {
	            point = new graphiti.geo.Point(fromPt.x, fromPt.y - (yDiff / 2));
	         }
	
	         if (xDiff > 0)
	         {
	            dir = LEFT;
	         }
	         else
	         {
	            dir = RIGHT;
	         }
	      }
	   }
	   this._route(conn,point, dir, toPt, toDir);
	   conn.addPoint(fromPt);
	}

});