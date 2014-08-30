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
 * @class graphiti.util.UUID
 * Generates a (pseudo) UUID's
 * 
 *      // a UUID in the format 
 *      // xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12) 
 *      var id = graphiti.util.UUID.create();
 * 
 * @author Andreas Herz
 * @constructor
 * @private
 */
graphiti.util.UUID=function()
{
};


/**
 * @method
 * Generates a unique id.<br>
 * But just for the correctness: <strong>this is no Global Unique Identifier</strong>, it is just a random generator 
 * with the output that looks like a GUID. <br>
 * But may be also useful.
 *
 * @returns {String} the  UUID in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12) 
 **/
graphiti.util.UUID.create=function()
{
  var segment=function() 
  {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (segment()+segment()+"-"+segment()+"-"+segment()+"-"+segment()+"-"+segment()+segment()+segment());
};
