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
 * @class graphiti.command.CommandConnect
 * 
 * Connects two ports with a connection.
 *
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends graphiti.command.Command
 */
graphiti.command.CommandConnect = graphiti.command.Command.extend({
    NAME : "graphiti.command.CommandConnect", 
    
    /**
     * @constructor
     * Create a new CommandConnect objects which can be execute via the CommandStack.
     *
     * @param {graphiti.Canvas} canvas the canvas to user
     * @param {graphiti.Port} source the source port for the connection to create
     * @param {graphiti.Port} target the target port for the connection to create
     */
    init : function(canvas, source, target, decorator, type)
     {
       this._super("Connecting Ports");
       this.canvas = canvas;
       this.source   = source;
       this.target   = target;
       this.connection = null;
       this.decorator = decorator;
       this.type = type;
    },
    
    setConnection:function(connection)
    {
       this.connection=connection;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
       if(this.connection===null)
          this.connection = new graphiti.Connection();

        
       // 
       if(this.type === "Activate"){
        this.connection.setTargetDecorator(this.decorator);
        this.connection.setColor(new graphiti.util.Color("#43B967"));
        this.label = new graphiti.shape.icon.Activate();
        this.connection.TYPE = "Activator";
       }else if(this.type === "Inhibit"){
        this.connection.setTargetDecorator(this.decorator);
        this.connection.setColor(new graphiti.util.Color("#E14545"));
        this.label = new graphiti.shape.icon.Inhibit();
        this.connection.TYPE = "Repressor";
       }else{
        this.connection.setColor(new graphiti.util.Color("#00ff00"));
        this.label = new graphiti.shape.icon.CoExpress();
       }

       // add label to connection
       this.label.setDimension(20,20);
       // this.connection.addFigure(this.label, new graphiti.layout.locator.ManhattanMidpointLocator(this.connection));

       this.connection.setSource(this.source);
       this.connection.setTarget(this.target);
       this.canvas.addFigure(this.connection);

       // return this.connection;
    },
    
    /**
     * @method
     * Redo the command after the user has undo this command.
     *
     **/
    redo:function()
    {
       if(this.type === "Activate"){
        this.connection.setTargetDecorator(this.decorator);
        this.connection.setColor(new graphiti.util.Color("#0000ff"));
       }else if(this.type === "Inhibit"){
        this.connection.setTargetDecorator(this.decorator);
        this.connection.setColor(new graphiti.util.Color("#ff0000"));
       }else{
        this.connection.setColor(new graphiti.util.Color("#00ff00"));
       }
       this.canvas.addFigure(this.connection);
       this.connection.reconnect();
    },
    
    /** 
     * @method
     * Undo the command.
     * 
     **/
    undo:function()
    {   
        this.connection.getTargetDecorator().setColor(new graphiti.util.Color(250, 250, 250));   // unuseful. wait to fix
        this.canvas.removeFigure(this.connection);
    }
});
