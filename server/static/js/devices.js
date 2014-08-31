


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

    init: function(width, height) {
        this._super();

        if (typeof radius === "number") {
            this.setDimension(radius, radius);
        } else {
            this.setDimension(1000, 1000);
        }

        this.TYPE = "Container";
        this.count = 0;
        this.countLength = 0;

        this.boundElements = new graphiti.util.ArrayList();
        this.setAlpha(0.01);

        // Buttons
        /*this.remove = new g.Buttons.Remove();
          this.Activate = new g.Buttons.Activate();
          this.Inhibit = new g.Buttons.Inhibit();
          this.CoExpress = new g.Buttons.CoExpress();*/


        // this.addFigure(new g.Shapes.Protein(), new graphiti.layout.locator.LeftLocator(this));
    },

    addItem: function(item) {
        item.locator = (item.TYPE == "Unbind") ? new graphiti.layout.locator.UnbindLocator(this, this.countLength, 100) : new graphiti.layout.locator.ContainerLocator(this, this.count, 100);
        this.addFigure(item, item.locator);
        if (item.TYPE !== "Unbind") {
            this.count ++;
        }
        //this.updateContainer();
    },

    removeItem: function(item, flag) {
        var target = null;
        this.children.each(function(i, e) {
            if (e.figure.getId() == item.getId()) {
                target = e;
                return;
            }
        });

        if (item.TYPE !== "Unbind") {
            this.count--;
        }

        this.children.remove(target);

        if (flag) {
            target.figure.setCanvas(null);
        }

        this.updateContainer();
        return target.figure;
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

    /*updateContainer: function() {
      var children = this.getChildren();
      var len = children.getSize();
      var count = 0;
      var lastLength;

      for (var i = 0; i < len; i++) {
      var innerItem = children.get(i);

      if (innerItem.TYPE == "Container") {
      innerItem.locator.no = count;
      innerItem.locator.relocate(i, innerItem);
      count += innerItem.count;
      lastLength = innerItem.count;
      } else if (innerItem.TYPE == "Protein" || innerItem.TYPE == "R" || innerItem.TYPE == "A") {
      innerItem.locator.no = count;
      innerItem.locator.relocate(i, innerItem);
      count += 1;
      lastLength = 1;
      }
      }
    // console.log(innerItem.count);
    this.countLength = count - lastLength;
    this.setDimension(1000, 1000);
    }*/
});

// Protein component
g.Shapes.Biobrick = graphiti.shape.icon.ProteinIcon.extend({
    NAME: "g.Shapes.Biobrick",

    init: function(width, height, name) {
        this._super();
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

        // add the new decoration to the connection with a position locator.
        //
        this.addFigure(this.label, new graphiti.layout.locator.BottomLocator(this));
    },

    onClick: function() {
        g.toolbar(this);
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    }
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
(function(ex) {

    ex.test = function() {
        var c = new g.Shapes.Container();
        var figure = new g.Shapes.Protein();
        var figure2 = new g.Shapes.R();
        var figure3 = new g.Shapes.A();
        var figure4 = new g.Shapes.Protein();


        c.addItem(figure);
        c.addItem(figure2);
        c.addItem(figure3);
        c.addItem(figure4);

        c.removeItem(figure3);
        console.log(c);

        app.view.addFigure(c, 100, 100);
    }
})(g);

var app = new g.Application();
var container = new g.Shapes.Container();
for (var i = 0; i < 5; ++i) {
    var bio = new g.Shapes.Biobrick(100, 100, "hehe");
    container.addItem(bio, 30 + i * 100, 30);
}
app.view.addFigure(container);
