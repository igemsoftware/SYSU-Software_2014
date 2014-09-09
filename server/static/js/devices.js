


// graphiti Application
var g = {};

g.Application = Class.extend({
    NAME: "graphiti.Application",

    /**
     * @constructor
     *
     * @param {String} canvasId the id of the DOM element to use as paint container
     */
    init: function() {
        this.view = new g.View("devices");
    },

    undo: function() {
        this.view.getCommandStack().undo();
    },

    redo: function() {
        this.view.getCommandStack().redo();
    },

    zoom: function(x, y, zoomFactor) {
        this.view.setZoom(this.view.getZoom() * zoomFactor);
    },

    zoomReset: function() {
        this.view.setZoom(1.0);
    },

    toggleSnapToGrid: function() {
        this.view.setSnapToGrid(!this.view.getSnapToGrid());
    }

});



g.View = graphiti.Canvas.extend({

    init: function(id) {
        this._super(id);
        this.setScrollArea("#" + id);
        this.currentDropConnection = null;
        this.setSnapToGrid(true);
        this.collection = new Array(); // Store all components in this view
        this.connections = new Array(); // Store all connections in this view
        this.boundPairs = new Array(); // Store all bounds of proteins
        this.currentSelected = null; // Store the figure that is currently seleted

        this.collection.counter = 0;
    },


    /**
     * @method
     * Called if the DragDrop object is moving around.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} droppedDomNode The dragged DOM element.
     * @param {Number} x the x coordinate of the drag
     * @param {Number} y the y coordinate of the drag
     *
     * @template
     **/
    onDrag: function(droppedDomNode, x, y) {},

    /**
     * @method
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x coordinate of the drop
     * @param {Number} y the y coordinate of the drop
     * @private
     **/
    onDrop: function(droppedDomNode, x, y) {
        var type = $(droppedDomNode).data("shape");
        var figure = eval("new " + type + "();");

        // create a command for the undo/redo support
        var command = new graphiti.command.CommandAdd(this, figure, x, y);
        this.getCommandStack().execute(command);
    },

    onMouseDown: function( /* :int */ x, /* :int */ y) {
        var canDragStart = true;

        var figure = this.getBestFigure(x, y);

        // check if the user click on a child shape. DragDrop and movement must redirect
        // to the parent
        // Exception: Port's
        if ((figure !== null && figure.getParent() !== null) && !(figure instanceof graphiti.Port)) {
            figure = figure.getParent();
        }

        if (figure !== null && figure.isDraggable()) {
            canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY());
            // Element send a veto about the drag&drop operation
            if (canDragStart === false) {
                this.mouseDraggingElement = null;
                this.mouseDownElement = figure;
            } else {
                this.mouseDraggingElement = figure;
                this.mouseDownElement = figure;
            }
        }

        if (figure !== this.currentSelection && figure !== null && figure.isSelectable() === true) {

            this.hideResizeHandles();
            this.setCurrentSelection(figure);

            // its a line
            if (figure instanceof graphiti.shape.basic.Line) {
                // you can move a line with Drag&Drop...but not a connection.
                // A Connection is fixed linked with the corresponding ports.
                //
                if (!(figure instanceof graphiti.Connection)) {
                    this.draggingLineCommand = figure.createCommand(new graphiti.command.CommandType(graphiti.command.CommandType.MOVE));
                    if (this.draggingLineCommand !== null) {
                        this.draggingLine = figure;
                    }
                }
            } else if (canDragStart === false) {
                this.setCurrentSelection(null);
            }
        } else if (figure === null) {
            this.setCurrentSelection(null);
        }

        if (figure == null) {
            g.hideAllToolbar();
        }
    }
});

// Creates shapes
g.Shapes = {};

// shape container
g.Shapes.Container = graphiti.shape.basic.Rectangle.extend({
    NAME: "g.Shapes.Container",

    init: function(name) {
        this._super();

        /*if (typeof radius === "number") {
          this.setDimension(radius, radius);
          } else {
          this.setDimension(1000, 1000);
          }

          this.TYPE = "Container";
          this.count = 0;
          this.countLength = 0;*/
        //this.selectable = true;
        //this.draggable = true;

        this.boundElements = new graphiti.util.ArrayList();
        this.setAlpha(0.01);
    },

    addItem: function(item) {
        item.locator = new graphiti.layout.locator.UnbindLocator(this, this.countLength, 100);
        this.addFigure(item, item.locator); 
        this.updateContainer();
    },

    onClick: function(x, y) {
        var figure = this.getBestFigure(x, y);
        // console.log(figure);
        if (figure !== undefined)
            g.toolbar(figure); 
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    },

    resetChildren: function() {
        var that = this;
        this.children.each(function(i, e) {
            if (!e.figure.TYPE) {
                e.figure.setCanvas(null);
                that.children.remove(e.figure);
            }
        });
        this.repaint();
    },

    getBestFigure: function(x, y, ignoreType) {
        var result = null;

        for (var i = 0; i < this.getChildren().getSize(); i++) {
            var figure = this.getChildren().get(i);
            if (figure.hitTest(x, y) == true) {
                if (result === null) {
                    result = figure;
                } else if (result.getZOrder() < figure.getZOrder()) {
                    result = figure;
                }
            }
        };

        if (result !== null)
            return result;
    },

    updateContainer: function() { 
        this.setDimension(this.getWidth(), this.getHeight());
    }
});

g.Shapes.Circuit = graphiti.shape.basic.Rectangle.extend({
    NAME: "g.Shapes.Circuit",

    init: function(width, height) {
        this._super();
        this.boundElements = new graphiti.util.ArrayList();
        this.setAlpha(0.01);
        this.outputBaseX = 100;
        this.outputBaseY = 0;
        this.inputBaseY = 0;
        this.name; 
        this.setDimension(500, 500);
    },

    setName: function(name) {
        this.name = name;
        this.label = new graphiti.shape.basic.Label(name);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");

        // add the new decoration to the connection with a position locator.
        //
        this.addFigure(this.label, new graphiti.layout.locator.LeftLocator(this));
    },

    addItem: function(item) {
        if (item.type == "output") {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.outputBaseX, this.outputBaseY);
            this.outputBaseY += item.getHeight();
            if (this.outputBaseY > this.height) {
                this.height = this.inputBaseY;
            }
            if (item.getWidth() + this.outputsBaseX > this.width) {
                this.width = item.getWidth() + this.outputsBaseX;
            }
            this.outputBaseY += 50;
        } else {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, this.inputBaseY);
            this.inputBaseY += item.getHeight();
            if (item.getWidth() > this.outputBaseX - 100) {
                this.width += item.getWidth() - this.outputsBaseX + 100;
                this.outputBaseX = item.getWidth() + 50;
            }
            if (this.inputBaseY > this.height) {
                this.height = item.getHeight() + this.inputBaseY;
            }
            this.inputBaseY += 50;
        }

        this.addFigure(item, item.locator); 
        this.updateContainer();
    },

    /*onClick: function(x, y) {
        alert("oh");
        var figure = this.getBestFigure(x, y);
        if (figure !== undefined)
            g.toolbar(figure); 
    },*/

    /*resetChildren: function() {
        var that = this;
        this.children.each(function(i, e) {
            if (!e.figure.TYPE) {
                e.figure.setCanvas(null);
                that.children.remove(e.figure);
            }
        });
        this.repaint();
    },*/

    getBestFigure: function(x, y, ignoreType) {
        var result = null;

        for (var i = 0; i < this.getChildren().getSize(); i++) {
            var figure = this.getChildren().get(i);
            if (figure.hitTest(x, y) == true) {
                if (result === null) {
                    result = figure;
                } else if (result.getZOrder() < figure.getZOrder()) {
                    result = figure;
                }
            }
        };

        if (result !== null)
            return result;
    },

    updateContainer: function() { 
        this.setDimension(this.getWidth(), this.getHeight());
    }
});

g.Shapes.Part = graphiti.shape.basic.Rectangle.extend({
    NAME: "g.Shapes.Part",

    init: function(width, height) {
        this._super();
        this.boundElements = new graphiti.util.ArrayList();
        this.setAlpha(0.01);
        this.type;
    },

    setType: function(type) {
        this.type = type;
    },

    addItem: function(item, index) {
        item.locator = new graphiti.layout.locator.DeviceLocator(this, index * 2 * item.getWidth(), 0);
        //if (index > 0) {
            //var line = new graphiti.shape.basic.Line((index * 2 - 1) * item.getWidth(), 25, index * 2 * item.getWidth() , 25);
            //line.locator = new graphiti.layout.locator.DeviceLocator(this, (index * 2 - 1) * item.getWidth(), item.getHeight() / 2);
            //this.addFigure(line, line.locator);
        //}
        this.setDimension(this.width + item.getWidth() * 2, item.getHeight());
        this.addFigure(item, item.locator); 
        this.updateContainer();
    }, 

    onClick: function(x, y) {
        var figure = this.getBestFigure(x, y);
        if (figure !== undefined) {
            //g.toolbar(figure);
            figure.onClick(x, y);
        }
    },

    getBestFigure: function(x, y, ignoreType) {
        var result = null;
        for (var i = 0; i < this.getChildren().getSize(); i++) {
            var figure = this.getChildren().get(i);
            if (figure.hitTest(x, y) == true) {
                if (result === null) {
                    result = figure;
                } else if (result.getZOrder() < figure.getZOrder()) {
                    result = figure;
                }
            }
        };

        if (result !== null)
            return result;
    },

    updateContainer: function() { 
        this.setDimension(this.getWidth(), this.getHeight());
    }
});

// Protein component
g.Shapes.Biobrick = graphiti.shape.icon.Icon.extend({
    NAME: "g.Shapes.Biobrick",

    init: function(width, height, name) {
        this._super(width, height);
        this.name = name;

        /*if (typeof radius === "number") {
          this.setDimension(radius, radius);
          } else {
          this.setDimension(100, 100);
          }*/

        this.setDimension(width, height);
        this.setColor("#339BB9");
        //this.TYPE = "Protein";

        // Buttons
        this.forward = new g.Buttons.Forward(20, 20);
        this.add = new g.Buttons.Add(20, 20);
        this.remove = new g.Buttons.Remove(20, 20);
        this.replace = new g.Buttons.Replace(20, 20);
        this.back = new g.Buttons.Back(20, 20);

        // Create any Draw2D figure as decoration for the connection
        //
        this.label = new graphiti.shape.basic.Label(this.name);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.label.setFontSize(10);

        // add the new decoration to the connection with a position locator.
        //
        this.addFigure(this.label, new graphiti.layout.locator.BottomLocator(this));
    },

    /*onClick: function() {
        alert("ni");
        g.toolbar(this);
    },*/

    createSet : function() {
        // var path = this.canvas.paper.path("M0,14.5L6,14.5L6,12L18,12L18,9L24,14.5L30,14.5L30,15.5L24,15.5L18,21L18,18L6,18L6,15.5L0,15.5Z");
        // path.matrix.d = 2.5;
        // //M0,20L4,20L4,16L12,16L12,12L16,20L20,20L16,20L12,28L12,24L4,24L4,20Z
        // //M0,14.5L6,15L6,12L18,12L18,9L24,14.5L30,14.5L30,15.5L24,15.5L18,21L18,18L6,18L0,15,5Z;
        return this.canvas.paper.image("../static/images/circuit/" + this.name + ".png", 0, 0, 107, 94);
    }/*,

    hitTest : function ( iX , iY)
    {
        var x = this.getAbsoluteX();
        var y = this.getAbsoluteY();
        var iX2 = x + this.getWidth();
        var iY2 = y + this.getHeight();
        alert("" + x + " " + iX + " " + iX2 + " " + y + " " + iY + " " + iY2);
        return (iX >= x && iX <= iX2 && iY >= y && iY <= iY2);
    }*/
});

/*
 * 在生物元件上方显示操作按钮组
 */
(function(ex) {
    ex.toolbar = function(ctx) {
        ctx.addFigure(ctx.add, new graphiti.layout.locator.TopLeftLocator(ctx));
        ctx.addFigure(ctx.remove, new graphiti.layout.locator.TopLocator(ctx));
        ctx.addFigure(ctx.replace, new graphiti.layout.locator.TopRightLocator(ctx));
        ctx.addFigure(ctx.forward, new graphiti.layout.locator.LeftLocator(ctx));
        ctx.addFigure(ctx.back, new graphiti.layout.locator.RightLocator(ctx));
    }
})(g);

// Buttons
g.Buttons = {};

g.Buttons.Forward = graphiti.shape.icon.Icon.extend({
    NAME : "graphiti.Buttons.Forward",

    /**
     * 
     * @constructor
     * Creates a new icon element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width, height) {
        this._super(width, height);
    },

    /**
     * @private
     * @returns
     */
    createSet : function() {
        return this.canvas.paper.image("../static/images/icon/forward.png", 0, 0, 30, 30);
    },

    onClick: function() {
    }
});


g.Buttons.Add = graphiti.shape.icon.Icon.extend({

    NAME : "graphiti.Buttons.Add",

    /**
     * 
     * @constructor
     * Creates a new icon element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width, height) {
        this._super(width, height);
    },

    /**
     * @private
     * @returns
     */
    createSet : function() {
        return this.canvas.paper.image("../static/images/icon/add.png", 0, 0, 30, 30);
    },

    onClick: function() {
    }
});

g.Buttons.Remove = graphiti.shape.icon.Icon.extend({

    NAME : "graphiti.Buttons.Remove",

    /**
     * 
     * @constructor
     * Creates a new icon element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width, height) {
        this._super(width, height);
    },

    /**
     * @private
     * @returns
     */
    createSet : function() {
        return this.canvas.paper.image("../static/images/icon/remove.png", 0, 0, 30, 30);
    },

    onClick: function() {
    }
});

g.Buttons.Replace = graphiti.shape.icon.Icon.extend({

    NAME : "graphiti.Buttons.Replace",

    /**
     * 
     * @constructor
     * Creates a new icon element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width, height) {
        this._super(width, height);
    },

    /**
     * @private
     * @returns
     */
    createSet : function() {
        return this.canvas.paper.image("../static/images/icon/replace.png", 0, 0, 30, 30);
    },

    onClick: function() {
    }
});


g.Buttons.Back = graphiti.shape.icon.Icon.extend({

    NAME : "graphiti.Buttons.Back",

    /**
     * 
     * @constructor
     * Creates a new icon element which are not assigned to any canvas.
     * @param {Number} [width] the width of the Oval
     * @param {Number} [height] the height of the Oval
     */
    init: function(width, height) {
        this._super(width, height);
    },

    /**
     * @private
     * @returns
     */
    createSet : function() {
        return this.canvas.paper.image("../static/images/icon/back.png", 0, 0, 30, 30);
    },

    onClick: function() {
    }
});


// test script
var app = new g.Application();
//var container = new g.Shapes.Container();
/*for (var i = 0; i < 5; ++i) {
  var bio = new g.Shapes.Biobrick(100, 100, "hehe");
  container.addItem(bio, i * 150, 30);
  }*/



var circuits = 
[
{
    "inputs":[
        [
        {"type": "input"},
        {"type": "receptor"},
        {"type": "promoter"},
        {"type": "bio1"},
        {"type": "bio2"}
    ],
        [
        {"type": "input"},
        {"type": "receptor"},
        {"type": "promoter"},
        {"type": "bio1"},
        {"type": "bio2"}
    ]],

        "outputs":[
            [
            {"type": "promoter"},
            {"type": "bio1"},
            {"type": "bio3"}
    ],
        [
        {"type": "promoter"},
        {"type": "bio1"},
        {"type": "bio3"}
    ]
        ]
},
{
    "inputs":[
        [
        {"type": "input"},
        {"type": "receptor"},
        {"type": "promoter"},
        {"type": "bio1"},
        {"type": "bio2"}
    ],
        [
        {"type": "input"},
        {"type": "receptor"},
        {"type": "promoter"},
        {"type": "bio1"},
        {"type": "bio2"}
    ]],

        "outputs":[
            [
            {"type": "promoter"},
            {"type": "bio1"},
            {"type": "bio3"}
    ],
        [
        {"type": "promoter"},
        {"type": "bio1"},
        {"type": "bio3"}
    ]
        ]
},
{
    "inputs":[
        [
        {"type": "input"},
        {"type": "receptor"},
        {"type": "promoter"},
        {"type": "bio1"},
        {"type": "bio2"}
    ],
        [
        {"type": "input"},
        {"type": "receptor"},
        {"type": "promoter"},
        {"type": "bio1"},
        {"type": "bio2"}
    ]],

        "outputs":[
            [
            {"type": "promoter"},
            {"type": "bio1"},
            {"type": "bio3"}
    ],
        [
        {"type": "promoter"},
        {"type": "bio1"},
        {"type": "bio3"}
    ]
        ]
}
];

for (var i = 0; i < circuits.length; ++i) {
    var circuit = new g.Shapes.Circuit();
    circuit.setName("Circuit " + (i + 1));
    for (var j = 0; j < circuits[i].inputs.length; ++j) {
        var input = new g.Shapes.Part();
        input.setType("input");
        for (var k = 0; k < circuits[i].inputs[j].length; ++k) {
            var bio = new g.Shapes.Biobrick(50, 50, circuits[i].inputs[j][k].type);
            input.addItem(bio, k);
        }
        circuit.addItem(input);
    }

    for (var j = 0; j < circuits[i].outputs.length; ++j) {
        var output = new g.Shapes.Part();
        output.setType("output");
        for (var k = 0; k < circuits[i].outputs[j].length; ++k) {
            var bio = new g.Shapes.Biobrick(50, 50, circuits[i].outputs[j][k].type);
            output.addItem(bio, k);
        }
        circuit.addItem(output);
    }
    app.view.addFigure(circuit, 100, i * 200);
}
