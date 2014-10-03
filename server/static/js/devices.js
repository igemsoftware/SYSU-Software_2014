// graphiti Application
var g = {};

g.BiobrickWidth = 75;
g.LocatorWidth = 10;
g.promoter = new Array();
g.output = new Array();
g.view = null;
g.Canvas = null;


g.Application = Class.extend({
    NAME: "graphiti.Application",

    /**
     * @constructor
     *
     * @param {String} canvasId the id of the DOM element to use as paint container
     */
    init: function(id, data) {
        this.view = new g.View(id);
        g.view = this.view;
        this.data = data;
        this.draw(data);
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
    },

    draw: function(data) {
        var baseheight = 50;
        var interval = 100;
        var largestwidth = 0;
        for (var i = 0; i < data.circuits.length; ++i) {
            var circuit = new g.Shapes.Circuit("Circuit " + (i + 1), data.circuits[i]);
            this.view.addFigure(circuit, circuit.label.getWidth() + 100, baseheight);
            baseheight += circuit.getHeight() + interval;
            if (largestwidth < circuit.getWidth()) {
                largestwidth = circuit.getWidth();
            }
        }
        /*this.view.html.css({        
          width: largestwidth + "px",
          height: baseheight + "px"
          });
          this.view.html.find("svg").css({        
          width: largestwidth + "px",
          height: baseheight + "px"
          });
          console.log(this.view.getWidth());
          console.log(this.view.getHeight());*/
        /*for (var i = 0; i < data.relationships.length; ++i) {
          g.connect(g.find(data.relationships[i].from, g.output), g.find(data.relationships[i].to, g.promoter), data.relationships[i].type);
          }*/
    }
});



g.View = graphiti.Canvas.extend({

    init: function(id) {
        this._super(id);
        this.setScrollArea("#" + id);
        this.currentDropConnection = null;
        this.setSnapToGrid(true);
        //this.collection = new Array(); // Store all components in this view
        this.connections = new Array(); // Store all connections in this view
        this.boundPairs = new Array(); // Store all bounds of proteins
        this.currentSelected = null; // Store the figure that is currently seleted

        //this.collection.counter = 0;
        g.Canvas = this;
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
            g.closeToolbar(lastFigure);
        }
    } 
});

// Creates shapes
g.Shapes = {};

g.Shapes.Circuit = graphiti.shape.basic.Rectangle.extend({
    NAME: "g.Shapes.Circuit",

    init: function(name, data) {
        this._super();
        this.boundElements = new graphiti.util.ArrayList();
        this.setAlpha(0.01);
        this.TYPE = "Container";
        this.name = name;
        this.data = data;
        this.interval = 200;
        this.outputpartBaseX = 0;
        this.lastitem = null;
        this.draw(data);
        this.label = new graphiti.shape.basic.Label(name);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");

        // add the new decoration to the connection with a position locator.
        //
        this.addFigure(this.label, new graphiti.layout.locator.LeftLocator(this));
    },

    draw: function(circuit) {
        if (circuit.logics[0].id == null) {
            var j = 0
                for (var i = 0; i < circuit.inputs[0].length; ++i, ++j) {
                    var bio = new g.Shapes.Biobrick(circuit.inputs[0][i]);
                    this.addPart(bio, j);
                }
            for (var i = 0; i < circuit.logics[0].outputparts.length; ++i) {
                for (var k = 0; k < circuit.logics[0].outputparts[i].length; ++k, ++j) {
                    var bio = new g.Shapes.Biobrick(circuit.logics[0].outputparts[i][k]);
                    this.addPart(bio, j);
                }
            }
        } else {
            var height;
            if (circuit.logics[0].name == "zhen") {
                height = 12 * g.BiobrickWidth;
            } else {
                height = circuit.logics.length * (6 * g.LocatorWidth + 3 * g.BiobrickWidth) + (circuit.logics.length - 1) * g.BiobrickWidth;
            }
            this.setDimension(this.getWidth(), height);
            var portArr = new Array();
            for (var i = 0; i < circuit.inputs.length; ++i) {
                var input = new g.Shapes.Part(circuit.inputs[i], "input");
                portArr.push(input);
                this.addItem(input, i);
            }
            for (var i = 0; i < circuit.logics.length; ++i) {
                var logic = new g.Shapes.Logic(circuit.logics[i], portArr);
                this.addItem(logic, i);
            }
        }
    },

    addPart: function(item, index) {
        item.locator = new graphiti.layout.locator.DeviceLocator(this, index * 2 * (item.getWidth() + 2 * g.LocatorWidth), g.LocatorWidth);
        this.setDimension((index * 2 + 1) * (item.getWidth() + 2 * g.LocatorWidth), item.getHeight() + 2 * g.LocatorWidth);
        //item.locator = new graphiti.layout.locator.ContainerLocator(this, index, 50)
        this.addFigure(item, item.locator); 
        if (this.lastitem != null) {
            g.drawLine(this.lastitem, item, "input0");
        }
        this.lastitem = item;
        //this.updateContainer();
        if (item.data !== undefined) {
            if (item.data.type == "promoter") {
                g.promoter.push(item);
            } else if (item.data.type == "output") {
                g.output.push(item);
            }
        }
    },

    addItem: function(item, index) {
        if (item.type == "input") {
            if (this.data.inputs.length == 2) {
                item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, this.getHeight() / 4 + this.getHeight() / 2 * index - item.getHeight() / 2);
                this.outputpartBaseX = item.getWidth();
            } else {
                item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, this.getHeight() / 2 - item.getHeight() / 2);
                if (this.data.logics[0].name == "zhen") {
                    item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, g.BiobrickWidth * 6);
                }
                this.outputpartBaseX = item.getWidth();
            }
        } else {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.outputpartBaseX + this.interval, (item.getHeight() + g.BiobrickWidth) * index);
            this.setDimension(this.outputpartBaseX + this.interval + item.getWidth(), this.getHeight());
        }
        this.addFigure(item, item.locator);
    },

    onClick: function(x, y) {
        var figure = this.getBestFigure(x, y);
        if (figure !== undefined) {
            figure.onClick(x, y);
        } else {
            g.closeToolbar(lastFigure);
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

g.Shapes.Part = graphiti.shape.basic.Rectangle.extend({
    NAME: "g.Shapes.Part",

    init: function(data, type) {
        this._super();
        this.boundElements = new graphiti.util.ArrayList();
        this.setAlpha(0.01);
        this.TYPE = "Container";
        this.draggable = true;
        this.selectable = true;
        this.data = data; 
        this.type = type;
        this.lastitem = null;
        this.firstitem = null;
        this.draw(data);
    },

    draw: function(part) {
        for (i = 0; i < part.length; ++i) {
            var bio = new g.Shapes.Biobrick(part[i]);
            this.addItem(bio, i);
        }
    },

    addItem: function(item, index) {
        item.locator = new graphiti.layout.locator.DeviceLocator(this, index * 2 * (item.getWidth()), g.LocatorWidth);
        this.setDimension((index * 2 + 1) * (item.getWidth()), item.getHeight() + 2 * g.LocatorWidth);
        //item.locator = new graphiti.layout.locator.ContainerLocator(this, index, 50)
        this.addFigure(item, item.locator); 
        if (this.lastitem != null) {
            g.drawLine(this.lastitem, item, "input0");
        } else {
            this.firstitem = item;
        }
        this.lastitem = item;
        //this.updateContainer();
        if (item.data !== undefined) {
            if (item.data.type == "promoter") {
                g.promoter.push(item);
            } else if (item.data.type == "output") {
                g.output.push(item);
            }
        }
    }, 

    onClick: function(x, y) {
        var figure = this.getBestFigure(x, y);
        // console.log(figure);
        if (figure !== undefined) {
            figure.onClick(x, y);
        } else {
            g.closeToolbar(lastFigure);
        }
    },

    onDoubleClic: function() {
        g.closeToolbar(this);
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
            for (var j = 0; j < figure.getChildren().getSize(); ++j) {
                var child = figure.getChildren().get(j);
                if (child.hitTest(x, y) == true) {
                    if (result === null) {
                        result = child;
                    } else if (result.getZOrder() < figure.getZOrder()) {
                        result = child;
                    }
                }
            }
        };

        if (result !== null)
            return result;
    }
});

g.Shapes.Logic = graphiti.shape.basic.Rectangle.extend({
    NAME: "g.Shapes.Logic",

    init: function(data, portArr) {
        this._super();
        this.boundElements = new graphiti.util.ArrayList();
        this.setAlpha(0.01);
        this.TYPE = "Container";
        //this.setDimension(700,210);
        this.draggable = true;
        this.selectable = true;
        this.baseY = 0;
        this.interval = 30;
        this.data = data;
        this.gateX = g.BiobrickWidth * 4;
        this.gateY = 0;
        this.gateWidth = 360;
        this.gateHeight = 320;
        this.lastbio = null;
        this.firstitem = null;
        this.draw(data, portArr); 
        this.type = "logic";
    },

    draw: function(logic, portArr) {
        for (var i = 0; i < logic.inputparts.length; ++i) {
            var logicinput = new g.Shapes.Part(logic.inputparts[i], "input");
            this.addItem(logicinput);
            g.link(portArr[i], logicinput, i);
        }
        if (logic.name == "Nots") {
            for (var i = 0; i < 2; ++i) {
                var outputpart = new g.Shapes.Part(logic.outputparts[0].slice(4 * i, 4 * (i + 1)), "output");
                this.addItem(outputpart);
                var gate = new g.Gate(this.gateWidth, this.gateHeight);
                this.addItem(gate);
            }
        } else if (logic.name == "zhen") {
            this.setDimension(9 * g.BiobrickWidth, 8 * g.BiobrickWidth);
            for (var i = 0; i < logic.outputparts.length; ++i) {
                for (var j = 0; j < logic.outputparts[i].length; ++j) {
                    var bio = new g.Shapes.Biobrick(logic.outputparts[i][j]);
                    this.addBio(bio, i);
                }
            }
            g.circle(this.lastbio, this.firstitem, 0);
            g.link(portArr[0], this.firstitem, 2);
        } else {
            var outputpart = new g.Shapes.Part(logic.outputparts[0], "output");
            this.addItem(outputpart);
            var gate = new g.Gate(this.gateWidth, this.gateHeight);
            this.addItem(gate);
        }
    },

    addBio: function(item, i) {
        var angle = [3.1415926 / 3.0, 3.1415926 * 5.0 / 3.0, 3.1415926];
        if (this.lastbio != null) {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.lastbio.locator.x + g.BiobrickWidth * 2 * Math.cos(angle[i]), this.lastbio.locator.y - g.BiobrickWidth * 2 * Math.sin(angle[i]));
            g.circle(this.lastbio, item, i);
        } else {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, g.BiobrickWidth * 2, this.getHeight() - g.BiobrickWidth * 2);
            this.firstitem = item;
        }
        this.addFigure(item, item.locator);
        if (item.type != "terminator") {
            this.lastbio = item;
        }
    },

    addItem: function(item) {
        if (item.type == "input") {
            if (this.data.inputparts.length == 2) {
                item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, this.baseY);
                this.baseY += item.getHeight() * 2;
                //alert(item.getWidth() + " " + this.interval + " " + this.baseY + " " + item.getHeight());
                this.setDimension(item.getWidth() + this.interval, this.baseY - item.getHeight());
                this.addFigure(item, item.locator);
            } else {
                item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, item.getHeight());
                //alert(item.getWidth() + " " + this.interval + " " + this.baseY + " " + item.getHeight());
                this.setDimension(item.getWidth() + this.interval, item.getHeight() * 3);
                this.addFigure(item, item.locator);
            }
        } else if (item.type == "gate") {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.gateX, this.gateY);
            //alert(item.getWidth() + " " + this.interval + " " + this.baseY + " " + item.getHeight());
            this.gateX += 550;
            this.addFigure(item, item.locator);
        } else {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.getWidth() + 20, item.getHeight());
            this.setDimension( item.getWidth() + this.getWidth() + 20, this.getHeight());
            this.addFigure(item, item.locator);
        }
    },

    onClick: function(x, y) {
        var figure = this.getBestFigure(x, y);
        if (figure !== undefined) {
            figure.onClick(x, y);
        } else {
            g.closeToolbar(lastFigure);
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
    }
});

// Protein component
g.Shapes.Biobrick = graphiti.shape.icon.Icon.extend({
    NAME: "g.Shapes.Biobrick",

    init: function(data) {
        this._super();
        this.data = data;
        this.name = data.name;
        this.type = data.type;
        this.setDimension(g.BiobrickWidth, g.BiobrickWidth);

        this.setColor("#339BB9");
        //this.TYPE = "Protein";

        // Buttons
        this.forward = new g.Buttons.Forward(g.LocatorWidth, g.LocatorWidth);
        this.add = new g.Buttons.Add(g.LocatorWidth, g.LocatorWidth);
        this.remove = new g.Buttons.Remove(g.LocatorWidth, g.LocatorWidth);
        this.replace = new g.Buttons.Replace(g.LocatorWidth, g.LocatorWidth);
        this.back = new g.Buttons.Back(g.LocatorWidth, g.LocatorWidth);


        // Create any Draw2D figure as decoration for the connection
        //
        this.label = new graphiti.shape.basic.Label(this.name);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.label.setFontSize(10);

        // add the new decoration to the connection with a position locator.
        //
        this.addFigure(this.label, new graphiti.layout.locator.BottomLocator(this));

        if (this.name == "output" || this.name == "promoter") {
            this.port = this.createPort("hybrid", new graphiti.layout.locator.CenterLocator(this));
        }
    },

    onClick: function() { 
        g.toolbar(this); 
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    },

    createSet : function() {
        // var path = this.canvas.paper.path("M0,14.5L6,14.5L6,12L18,12L18,9L24,14.5L30,14.5L30,15.5L24,15.5L18,21L18,18L6,18L6,15.5L0,15.5Z");
        // path.matrix.d = 2.5;
        // //M0,20L4,20L4,16L12,16L12,12L16,20L20,20L16,20L12,28L12,24L4,24L4,20Z
        // //M0,14.5L6,15L6,12L18,12L18,9L24,14.5L30,14.5L30,15.5L24,15.5L18,21L18,18L6,18L0,15,5Z;
        return this.canvas.paper.image("../static/images/circuit/" + this.type + ".png", 0, 0, this.getWidth(), this.getHeight());
    },

    removeToolBar: function() {
        var that = this;
        this.children.each(function(i, e) {
            if (!e.figure.TYPE) {
                e.figure.setCanvas(null);
                that.children.remove(e.figure);
            }
        });
        this.addFigure(this.label, new graphiti.layout.locator.BottomLocator(this));
        this.repaint();
    }
});

/*
 * 在生物元件上方显示操作按钮组
 */
var lastFigure = null;
(function(ex) { 
    ex.toolbar = function(ctx) {
        if (lastFigure !== null) {
            lastFigure.removeToolBar();
        }
        /*ctx.addFigure(ctx.add, new graphiti.layout.locator.TopLeftLocator(ctx));
          ctx.addFigure(ctx.remove, new graphiti.layout.locator.TopLocator(ctx));
          ctx.addFigure(ctx.replace, new graphiti.layout.locator.TopRightLocator(ctx));
          ctx.addFigure(ctx.forward, new graphiti.layout.locator.LeftLocator(ctx));
          ctx.addFigure(ctx.back, new graphiti.layout.locator.RightLocator(ctx));*/
        lastFigure = ctx;
    }

    ex.closeToolbar = function(ctx) {
        if (ctx !== null) {
            ctx.removeToolBar();
            ctx = null;
        }
    }

    ex.connect = function(source, target, type) {
        var sourceport = source.createPort("hybrid", new graphiti.layout.locator.CenterLocator(source));
        var targetport = target.createPort("hybrid", new graphiti.layout.locator.CenterLocator(target));
        var command = new graphiti.command.CommandConnect(g.Canvas, sourceport, targetport, new graphiti.decoration.connection.ArrowDecorator(), type);
        g.view.getCommandStack().execute(command);
    }

    ex.find = function(eid, arr) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i].data.eid == eid) {
                return arr[i];
            }
        }
        return null;
    } 

    ex.find = function(eid, arr) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i].data.eid == eid) {
                return arr[i];
            }
        }
        return null;
    }

    ex.drawLine = function(source, target, type) {
        var sourceport = source.createPort("hybrid", new graphiti.layout.locator.CenterLocator(source));
        var targetport = target.createPort("hybrid", new graphiti.layout.locator.CenterLocator(target));
        var command = new graphiti.command.CommandConnect(g.Canvas, sourceport, targetport, null, "input2");
        g.view.getCommandStack().execute(command);
    }

    ex.link = function(source, target, index) {
        var sourceport = source.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(source, source.getWidth() + index * 30, source.getHeight() / 2));
        var targetport = target.createPort("hybrid", new graphiti.layout.locator.LeftLocator(target));
        var command = new graphiti.command.CommandConnect(g.Canvas, sourceport, targetport, null, "input" + index);
        g.view.getCommandStack().execute(command);
    }

    ex.circle = function(source, target, index) { 
        var decorator = null;
        if (source.type == "output" && target.type == "promoter") {
            decorator = new graphiti.decoration.connection.TDecorator();
        var angle = [3.1415926 / 3.0, 3.1415926 * 5.0 / 3.0, 3.1415926];
            var targetport = target.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(target, target.getWidth() / 2 - g.BiobrickWidth * 2.0 / 3.0 * Math.cos(angle[index]), target.getHeight() / 2 + g.BiobrickWidth * 2.0 / 3.0 * Math.sin(angle[index])));
            var sourceport = source.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(target, target.getWidth() / 2 + g.BiobrickWidth * 2.0 / 3.0 * Math.cos(angle[index]), target.getHeight() / 2 - g.BiobrickWidth * 2.0 / 3.0 * Math.sin(angle[index])));
            /*if (index == 0) {
            //var sourceport = source.createPort("hybrid", new graphiti.layout.locator.RightLocator(source));
            var targetport = target.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(target));
        } else if (index == 1) {
            //var sourceport = source.createPort("hybrid", new graphiti.layout.locator.BottomLocator(source));
            var targetport = target.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(target));
        } else {
            //var sourceport = source.createPort("hybrid", new graphiti.layout.locator.LeftLocator(source));
            var targetport = target.createPort("hybrid", new graphiti.layout.locator.RightLocator(target));
        }*/
        } else {
        var targetport = target.createPort("hybrid", new graphiti.layout.locator.CenterLocator(target));
            var sourceport = source.createPort("hybrid", new graphiti.layout.locator.CenterLocator(source));
        }  
        var command = new graphiti.command.CommandConnect(g.Canvas, sourceport, targetport, decorator, "input2");
        g.view.getCommandStack().execute(command);
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
        return this.canvas.paper.image("../static/images/icon/forward.png", 0, 0, 10, 10);
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
        return this.canvas.paper.image("../static/images/icon/add.png", 0, 0, 10, 10);
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
        return this.canvas.paper.image("../static/images/icon/remove.png", 0, 0, 10, 10);
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
        return this.canvas.paper.image("../static/images/icon/replace.png", 0, 0, 10, 10);
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
        return this.canvas.paper.image("../static/images/icon/back.png", 0, 0, 10, 10);
    },

    onClick: function() {
    }
});


g.Gate = graphiti.shape.icon.Icon.extend({

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
        this.type = "gate";
    },

    /**
     * @private
     * @returns
     */
    createSet : function() {
        return this.canvas.paper.image("../static/images/device/and.png", 0, 0, this.getWidth(), this.getHeight());
    },

    onClick: function() {
    }
});


// test script
//var app = new g.Application("devices");
//var container = new g.Shapes.Container();
/*for (var i = 0; i < 5; ++i) {
  var bio = new g.Shapes.Biobrick(100, 100, "hehe");
  container.addItem(bio, i * 150, 30);
  }*/



/*var circuits = 
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
    var circuit = new g.Shapes.Circuit(0, 0, "Circuit " + (i + 1));
    for (var j = 0; j < circuits[i].inputs.length; ++j) {
        var input = new g.Shapes.Part(50, 50, "input");
        for (var k = 0; k < circuits[i].inputs[j].length; ++k) {
            var bio = new g.Shapes.Biobrick(50, 50, circuits[i].inputs[j][k].type);
            input.addItem(bio, k);
        }
        circuit.addItem(input);
    }

    for (var j = 0; j < circuits[i].outputs.length; ++j) {
        var output = new g.Shapes.Part(50, 50, "output");
        for (var k = 0; k < circuits[i].outputs[j].length; ++k) {
            var bio = new g.Shapes.Biobrick(50, 50, circuits[i].outputs[j][k].type);
            output.addItem(bio, k);
        }
        circuit.addItem(output);
    }
    app.view.addFigure(circuit, 100, i * 200);
}*/
