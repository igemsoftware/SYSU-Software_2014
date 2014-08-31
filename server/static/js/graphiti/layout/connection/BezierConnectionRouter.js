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
 * @class graphiti.layout.connection.BezierConnectionRouter 
 * 
 * @inheritable
 * @author Andreas Herz
 * @extends graphiti.layout.connection.ConnectionRouter
 */
graphiti.layout.connection.BezierConnectionRouter = graphiti.layout.connection.ConnectionRouter.extend({
    /**
     * @constructor Creates a new Router object
     */
    init : function()
    {
        this.cheapRouter = null;
        this.iteration = 5;
    },

    drawBezier : function(/* :Array */pointArray,/* :Array */resultArray, /* :float */t, /* :int */iter)
    {
        var n = pointArray.length - 1;

        var q = [];
        var n_plus_1 = n + 1;
        for ( var i = 0; i < n_plus_1; i++) {
            q[i] = [];
            q[i][0] = pointArray[i];
        }

        for ( var j = 1; j <= n; j++) {
            for ( var i = 0; i <= (n - j); i++) {
                q[i][j] = new /* :NAMESPACE */Point((1 - t) * q[i][j - 1].x + t * q[i + 1][j - 1].x, (1 - t) * q[i][j - 1].y + t * q[i + 1][j - 1].y);
            }
        }
        // Arrays für die Punkte der geteilten Kontrollpolygone C1, C2)
        var c1 = [];
        var c2 = [];

        for ( var i = 0; i < n + 1; i++) {
            c1[i] = q[0][i];
            c2[i] = q[i][n - i];
        }

        if (iter >= 0) {
            this.drawBezier(c1, resultArray, t, --iter);
            this.drawBezier(c2, resultArray, t, --iter);
        }
        else {
            for ( var i = 0; i < n; i++) {
                resultArray.push(q[i][n - i]);
            }
        }
    },

    route : function(conn)
    {
        if (this.cheapRouter !== null && (conn.getSource().getParent().isMoving === true || conn.getTarget().getParent().isMoving === true)) {
            this.cheapRouter.route(conn);
            return;
        }

        var pointList = [];
        var fromPt = conn.getStartPoint();
        var toPt = conn.getEndPoint();

        // create the Manhattan line stroke
        //
        this._route(pointList, conn, toPt, this.getEndDirection(conn), fromPt, this.getStartDirection(conn));
        var resultList = [];
        // create the Bezier spline from the ManhattanLineStroke
        //
        this.drawBezier(pointList, resultList, 0.5, this.iteration);
        for ( var i = 0; i < resultList.length; i++) {
            conn.addPoint(resultList[i]);
        }
        conn.addPoint(toPt);
    },

    /**
     * @private
     */
    _route : function(pointList, /* :Connection */conn,/* :Point */fromPt, /* :int */fromDir, /* :Point */toPt, /* :int */
            toDir)
    {
        var TOL = 0.1;
        var TOLxTOL = 0.01;
        var MINDIST = 90;

        // fromPt is an x,y to start from.
        // fromDir is an angle that the first link must
        //
        var UP = 0;
        var RIGHT = 1;
        var DOWN = 2;
        var LEFT = 3;

        var xDiff = fromPt.x - toPt.x;
        var yDiff = fromPt.y - toPt.y;
        var point;
        var dir;

        if (((xDiff * xDiff) < (TOLxTOL)) && ((yDiff * yDiff) < (TOLxTOL))) {
            pointList.push(new graphiti.geo.Point(toPt.x, toPt.y));
            return;
        }

        if (fromDir === LEFT) {
            if ((xDiff > 0) && ((yDiff * yDiff) < TOL) && (toDir === RIGHT)) {
                point = toPt;
                dir = toDir;
            }
            else {
                if (xDiff < 0) {
                    point = new /* :NAMESPACE */Point(fromPt.x - MINDIST, fromPt.y);
                }
                else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
                    point = new /* :NAMESPACE */Point(toPt.x, fromPt.y);
                }
                else if (fromDir === toDir) {
                    var pos = Math.min(fromPt.x, toPt.x) - MINDIST;
                    point = new /* :NAMESPACE */Point(pos, fromPt.y);
                }
                else {
                    point = new /* :NAMESPACE */Point(fromPt.x - (xDiff / 2), fromPt.y);
                }

                if (yDiff > 0) {
                    dir = UP;
                }
                else {
                    dir = DOWN;
                }
            }
        }
        else if (fromDir === RIGHT) {
            if ((xDiff < 0) && ((yDiff * yDiff) < TOL) && (toDir == LEFT)) {
                point = toPt;
                dir = toDir;
            }
            else {
                if (xDiff > 0) {
                    point = new /* :NAMESPACE */Point(fromPt.x + MINDIST, fromPt.y);
                }
                else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
                    point = new /* :NAMESPACE */Point(toPt.x, fromPt.y);
                }
                else if (fromDir === toDir) {
                    var pos = Math.max(fromPt.x, toPt.x) + MINDIST;
                    point = new /* :NAMESPACE */Point(pos, fromPt.y);
                }
                else {
                    point = new /* :NAMESPACE */Point(fromPt.x - (xDiff / 2), fromPt.y);
                }

                if (yDiff > 0)
                    dir = UP;
                else
                    dir = DOWN;
            }
        }
        else if (fromDir === DOWN) {
            if (((xDiff * xDiff) < TOL) && (yDiff < 0) && (toDir === UP)) {
                point = toPt;
                dir = toDir;
            }
            else {
                if (yDiff > 0) {
                    point = new /* :NAMESPACE */Point(fromPt.x, fromPt.y + MINDIST);
                }
                else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
                    point = new /* :NAMESPACE */Point(fromPt.x, toPt.y);
                }
                else if (fromDir === toDir) {
                    var pos = Math.max(fromPt.y, toPt.y) + MINDIST;
                    point = new /* :NAMESPACE */Point(fromPt.x, pos);
                }
                else {
                    point = new /* :NAMESPACE */Point(fromPt.x, fromPt.y - (yDiff / 2));
                }

                if (xDiff > 0)
                    dir = LEFT;
                else
                    dir = RIGHT;
            }
        }
        else if (fromDir === UP) {
            if (((xDiff * xDiff) < TOL) && (yDiff > 0) && (toDir === DOWN)) {
                point = toPt;
                dir = toDir;
            }
            else {
                if (yDiff < 0) {
                    point = new /* :NAMESPACE */Point(fromPt.x, fromPt.y - MINDIST);
                }
                else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
                    point = new /* :NAMESPACE */Point(fromPt.x, toPt.y);
                }
                else if (fromDir === toDir) {
                    var pos = Math.min(fromPt.y, toPt.y) - MINDIST;
                    point = new /* :NAMESPACE */Point(fromPt.x, pos);
                }
                else {
                    point = new /* :NAMESPACE */Point(fromPt.x, fromPt.y - (yDiff / 2));
                }

                if (xDiff > 0)
                    dir = LEFT;
                else
                    dir = RIGHT;
            }
        }
        this._route(pointList, conn, point, dir, toPt, toDir);
        pointList.push(fromPt);
    }
});