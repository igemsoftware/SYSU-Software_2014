// graphiti Application
var g = {};

g.BiobrickWidth = 75;
g.LocatorWidth = 1;
g.promoter = new Array();
g.output = new Array();
g.view = null;
g.Canvas = null;

var rbs, genebio, terminator;
$.ajax({
    type: "GET",
    url: "/biobrick/RBS?id=1",
    async:false
}).done(function(data) {
    rbs = data["result"];
});

$.ajax({
    type: "GET",
    url: "/biobrick/output?id=1",
    async:false
}).done(function(data) {
    genebio = data["result"];
});

$.ajax({
    type: "GET",
    url: "/biobrick/terminator?id=1",
    async:false
}).done(function(data) {
    terminator = data["result"];
});

g.Application = Class.extend({
    NAME: "graphiti.Application",

    /**
     * @constructor
     *
     * @param {String} canvasId the id of the DOM element to use as paint container
     */
    init: function(ids, data, type) {
        this.data = data;
        this.view;
        this.views = new Array();
        this.interval = 25;
        this.baseX = 100;
        this.baseY = 150;
        //this.views = new g.View(id);
        var input = new Array();
        var gene = new Array();
        var output = new Array();
        for (var i = 0; i < this.data.circuits.length; ++i) {
            for (var j = 0; j < this.data.circuits[i].inputs.length; ++j) {
                if (this.data.circuits[i].logics[0].type != "repressilator") {
                    input.push(this.data.circuits[i].logics[0].inputparts[0][0]);
                } else {
                    input.push(this.data.circuits[i].logics[0].outputparts[0][0]);
                }
                input.push(rbs);
                input.push(genebio);
                input.push(terminator);
            }
            for (var j = 0; j < this.data.circuits[i].logics.length; ++j) {
                for (var k = 0; k < this.data.circuits[i].logics[j].inputparts.length; ++k) {
                    for (var m = 0; m < this.data.circuits[i].logics[j].inputparts[k].length; ++m) {
                        if ((this.data.circuits[i].logics[j].logic_type === "toggle_switch_1"
                                    && k == this.data.circuits[i].logics[j].inputparts.length - 1
                                    && m == this.data.circuits[i].logics[j].inputparts[k].length - 1)
                                || (this.data.circuits[i].logics[j].logic_type === "toggle_switch_2" && k == this.data.circuits[i].logics[j].inputparts.length - 1) || this.data.circuits[i].logics[j].logic_type === "simple" || this.data.circuits[i].logics[j].logic_type === "or_gate") {
                                    output.push(this.data.circuits[i].logics[j].inputparts[k][m]);
                                } else {
                                    gene.push(this.data.circuits[i].logics[j].inputparts[k][m]);
                                }
                    }
                }
                for (var k = 0; k < this.data.circuits[i].logics[j].outputparts.length; ++k) {
                    for (var m = 0; m < this.data.circuits[i].logics[j].outputparts[k].length; ++m) {
                        output.push(this.data.circuits[i].logics[j].outputparts[k][m]);
                    }
                }
            }
        }
        this.arr = [input, gene, output];
        if (type === "device") {
            g.BiobrickWidth = 75;
            this.views[0] = new g.View(ids[0]);
            this.view = this.views[0];
            g.view = this.views[0];
            this.drawDevice(this.data);
        } else if (type === "part") {
            g.BiobrickWidth = 50; 
            for (var i = 0; i < 3; ++i) {
                this.views[i] = new g.View(ids[i]);
                g.view = this.views[i];
                this.drawPart(this.arr[i], i);
                progressbar.animate({width: 50 + 10 * (i + 1) / 3 + "%"});
            }
        } else {
            this.views[0] = new g.View(ids[0]);
            this.view = this.views[0];
            g.view = this.view;
            g.BiobrickWidth = 30;
            this.drawVector(this.arr);
        }
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

    // device
    drawDevice: function(data) {
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
            progressbar.animate({width: 60 + (40 * (i + 1) / data.circuits.length) + "%"});
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
    },

    // part
    drawPart: function(arr, index) {
        //var lastFigure = null;
        /*for (var i = 0; i < arr.length; ++i) {
          var bio = new g.Shapes.Biobrick(arr[i]);
          if (lastFigure != null) {
          g.connect(lastFigure, bio, "input2");
          }
          this.views[index].html.css({width: (g.BiobrickWidth)* 2 * (i + 1) + 50 + "px"});
          this.views[index].html.find("svg").css({width: (g.BiobrickWidth)* 2 * (i + 1) + 50 + "px"});
          this.views[index].addFigure(bio, (g.BiobrickWidth)* 2 * i + 50, g.LocatorWidth); 
          lastFigure = bio;
          }*/
        var newpart = new g.Shapes.Part(arr, "");
        newpart.draggable = false;
        newpart.selectable = false;
        this.views[index].html.css({width:  newpart.getWidth() + g.BiobrickWidth + "px"});
        this.views[index].html.find("svg").css({width: newpart.getWidth() + g.BiobrickWidth + "px"});
        this.views[index].addFigure(newpart, 20, 0);

    },

    // vector 
    drawVector: function(arr) {
        var bionum = arr[0].length + arr[1].length + arr[2].length;
        var radius = (g.BiobrickWidth + 2 * g.LocatorWidth + this.interval) / (2 * Math.sin(3.1415926 / parseFloat(bionum * 3))); 
        var x = parseFloat(this.baseX + radius);
        var y = parseFloat(this.baseY + radius);
        var shape =  new graphiti.shape.basic.Circle(2 * radius);
        shape.setStroke(3);
        shape.setColor("#3d3d3d");
        shape.setBackgroundColor(null);
        shape.selectable = false;
        shape.draggable = false;
        this.views[0].addFigure(shape, this.baseX, this.baseY);
        this.label = new graphiti.shape.basic.Label("2070");
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.label.setFontSize(radius / 10);

        // add the new decoration to the connection with a position locator.
        //
        this.views[0].addFigure(this.label);
        this.label.setPosition(x - this.label.getWidth() / 2, y - this.label.getHeight() / 2);
        var index = 1;
        for (var i = 0; i < arr.length; ++i) {
            for (var j = 0; j < arr[i].length; ++j, ++index) {
                var bio = new g.Shapes.VectorBiobrick(arr[i][j]);
                this.views[0].addFigure(bio, x + Math.sin(2.0 * parseFloat(index) * 3.1415926 / parseFloat(bionum * 3)) * radius - bio.getWidth() / 2, y - Math.cos(2.0 * parseFloat(index) * 3.1415926 / parseFloat(bionum * 3)) * radius - bio.getHeight() / 2);
            }
            progressbar.animate({width: 40 + 10 * (i + 1) / arr.length + "%"});
        }

        //var point1 = new graphiti.geo.Point(this.baseX + radius, this.baseY);
        //this.views[0].addFigure(point1, this.baseX + radius, this.baseY);
        /*var linea1 = new graphiti.shape.basic.Line(x + Math.sin(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * radius, y - Math.cos(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * radius, x + Math.sin(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100), y - Math.cos(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100));
          this.views[0].addFigure(linea1);
          var linea2 = new graphiti.shape.basic.Line(x + Math.sin(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100), y - Math.cos(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100), x + Math.sin(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100) - 30, y - Math.cos(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100) - 30);
          this.views[0].addFigure(linea2);
          var label1 = new graphiti.shape.basic.Label("aaaaa");
          label1.setColor("#0d0d0d");
          label1.setFontColor("#0d0d0d");
          label1.setFontSize(10); 
          this.views[0].addFigure(label1);
          label1.setPosition(x + Math.sin(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100) - 30 - label1.getWidth() / 2.0, y - Math.cos(-1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100) - 30 - label1.getHeight());
          var lineb1 = new graphiti.shape.basic.Line(x + Math.sin(1.0 * 3.1415926 / parseFloat(bionum * 3)) * radius, y - Math.cos(1.0 * 3.1415926 / parseFloat(bionum * 3)) * radius, x + Math.sin(1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100), y - Math.cos(1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100));
          this.views[0].addFigure(lineb1);
          var lineb2 = new graphiti.shape.basic.Line(x + Math.sin(1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100), y - Math.cos(1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100), x + Math.sin(1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100) + 30, y - Math.cos(1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100) - 30);
          this.views[0].addFigure(lineb2);
          var label2 = new graphiti.shape.basic.Label("bbbbb");
          label2.setColor("#0d0d0d");
          label2.setFontColor("#0d0d0d");
          label2.setFontSize(10);
          this.views[0].addFigure(label2);
          label2.setPosition(x + Math.sin(1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100) + 30 - label2.getWidth() / 2.0, y - Math.cos(1.0 * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100) - 30 - label2.getHeight());*/
        g.addLable(this.views[0], x, y, radius, bionum, 0, -30, -30, -1, -1, "EcoRI");
        g.addLable(this.views[0], x, y, radius, bionum, 1.0, 30, -30, -1, -1, "XbaI");
        g.addLable(this.views[0], x, y, radius, bionum, index * 2 - 1, 30, 0, -1, 0, "SpeI");
        g.addLable(this.views[0], x, y, radius, bionum, index * 2, 0, 30, -1, 0, "PstI");
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
        /*if (circuit.logics[0].id == null) {
          var j = 0
          for (var i = 0; i < circuit.inputs[0].length; ++i, ++j) {
          var bio = new g.Shapes.Biobrick(circuit.inputs[0][i]);
          this.addPart(bio, j);
          }
          var partslength = circuit.logics[0].outputparts.length;
          var partlength = circuit.logics[0].outputparts[partslength  - 1].length;
          circuit.logics[0].outputparts[partslength  - 1][partlength - 2].type = "outputfinal";
          for (var i = 0; i < circuit.logics[0].outputparts.length; ++i) {
          for (var k = 0; k < circuit.logics[0].outputparts[i].length; ++k, ++j) {
          var bio = new g.Shapes.Biobrick(circuit.logics[0].outputparts[i][k]); 
          this.addPart(bio, j);
          }
          }
          } else {*/
        var height;
        if (circuit.logics[0].logic_type == "repressilator") {
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
        //}
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
                if (this.data.logics[0].logic_type == "repressilator") {
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
        if (this.firstitem != null && this.firstitem.type === "input" && this.lastitem.type === "receptor") {
            this.lastitem.relationship = this.firstitem.relationship;
        }
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
        /*if (item.data !== undefined) {
          if (item.data.type == "promoter") {
          g.promoter.push(item);
          } else if (item.data.type == "output") {
          g.output.push(item);
          }
          }*/
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

        if (result !== null) {
            return result;
        }
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
        this.interval = 40;
        this.data = data;
        this.gateX = g.BiobrickWidth * 4 - 30;
        this.gateY = -30;
        this.gateWidth = 380;
        this.gateHeight = 300;
        this.lastbio = null;
        this.firstitem = null;
        this.inputparts = new Array();
        this.draw(data, portArr); 
        this.type = "logic";
    },

    draw: function(logic, portArr) { 
        if (logic.logic_type === "toggle_switch_1" || logic.logic_type === "toggle_switch_2") {
            var inputpartslength = logic.inputparts.length;
            var length = logic.inputparts[inputpartslength - 1].length;
            logic.inputparts[inputpartslength - 1][length - 2].type = "outputfinal";
        } else if (logic.logic_type === "or_gate") {
            var length = logic.inputparts[0].length;
            logic.inputparts[0][length - 2].type = "outputfinal";
            var inputpartslength = logic.inputparts.length;
            length = logic.inputparts[inputpartslength - 1].length;
            logic.inputparts[inputpartslength - 1][length - 2].type = "outputfinal";
        }
        for (var i = 0; i < logic.inputparts.length; ++i) { 
            var logicinput = new g.Shapes.Part(logic.inputparts[i], "input");
            this.inputparts.push(logicinput);
            this.addItem(logicinput);
            g.link(portArr[i % portArr.length], logicinput, i % portArr.length);
        }
        var partslength = logic.outputparts.length;
        if (logic.logic_type === "toggle_switch_1" || logic.logic_type === "or_gate") {
        } else if (logic.logic_type === "toggle_switch_2") {
            var lastpartlength = logic.outputparts[partslength - 1].length;
            logic.outputparts[partslength - 1][lastpartlength - 2].type = "outputfinal";
            var outputpart = new g.Shapes.Part(logic.outputparts[0], "toggle_switch_2");
            this.addItem(outputpart);
            g.link(this.inputparts[0], outputpart, 0);
        } else if (logic.logic_type === "repressilator") {
            this.setDimension(9 * g.BiobrickWidth, 8 * g.BiobrickWidth);
            for (var i = 0; i < logic.outputparts.length; ++i) {
                for (var j = 0; j < logic.outputparts[i].length; ++j) {
                    var bio;
                    if (logic.outputparts[i][j].type === "output") {
                        logic.outputparts[i][j].type = "output" + i;
                    }
                    bio = new g.Shapes.Biobrick(logic.outputparts[i][j]);
                    this.addBio(bio, i);
                }
            }
            g.circle(this.lastbio, this.firstitem, 0);
            g.link(portArr[0], this.firstitem, 2);
        } else if (logic.logic_type === "simple") {
            var inputpart = new g.Shapes.Part(logic.inputparts[0], "input");
            this.addItem(inputpart);
        } else {
            var lastpartlength = logic.outputparts[partslength - 1].length;
            logic.outputparts[partslength - 1][lastpartlength - 2].type = "outputfinal";
            var outputpart = new g.Shapes.Part(logic.outputparts[0], "output");
            this.addItem(outputpart);
            var gate = new g.Gate(logic.logic_type, this.gateWidth, this.gateHeight);
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
        if (item.data.type != "terminator") {
            this.lastbio = item;
        }
    },

    addItem: function(item) {
        if (item.type == "input") {
            if (this.data.inputparts.length == 2) {
                item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, this.baseY);
                this.baseY += item.getHeight() * 2;
                //alert(item.getWidth() + " " + this.interval + " " + this.baseY + " " + item.getHeight());
                this.setDimension(item.getWidth(), this.baseY - item.getHeight());
                this.addFigure(item, item.locator);
            } else {
                item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, item.getHeight());
                //alert(item.getWidth() + " " + this.interval + " " + this.baseY + " " + item.getHeight());
                this.setDimension(item.getWidth(), item.getHeight() * 3);
                this.addFigure(item, item.locator);
            }
        } else if (item.type === "inverter" || item.type === "and_gate") {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.gateX, this.gateY);
            //alert(item.getWidth() + " " + this.interval + " " + this.baseY + " " + item.getHeight());
            this.gateX += this.gateWidth + 2.5 * g.BiobrickWidth ;
            this.addFigure(item, item.locator);
        } else if (item.type === "toggle_switch_2") {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.getWidth() + this.interval, 0);
            this.setDimension( item.getWidth() + this.getWidth() + this.interval, this.getHeight());
            this.addFigure(item, item.locator);
        } else {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.getWidth() + this.interval, item.getHeight());
            this.setDimension( item.getWidth() + this.getWidth() + this.interval, this.getHeight());
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
        this.relationship = data.relationship;
        this.draggable = false;
        this.setDimension(g.BiobrickWidth, g.BiobrickWidth);
        this.resizeable = false;

        this.setColor("#339BB9");
        //this.TYPE = "Protein";

        // Buttons
        /*this.forward = new g.Buttons.Forward(g.LocatorWidth, g.LocatorWidth);
          this.add = new g.Buttons.Add(g.LocatorWidth, g.LocatorWidth);
          this.remove = new g.Buttons.Remove(g.LocatorWidth, g.LocatorWidth);
          this.replace = new g.Buttons.Replace(g.LocatorWidth, g.LocatorWidth);
          this.back = new g.Buttons.Back(g.LocatorWidth, g.LocatorWidth);*/


        // Create any Draw2D figure as decoration for the connection
        //
        this.label = new graphiti.shape.basic.Label(this.name);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.label.setFontSize(g.BiobrickWidth / 5);

        // add the new decoration to the connection with a position locator.
        this.addFigure(this.label, new graphiti.layout.locator.BottomLocator(this));
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
    },

    resetLabel: function() {
        var that = this;
        this.children.each(function(i, e) {
            if (!e.figure.TYPE) {
                e.figure.setCanvas(null);
                that.children.remove(e.figure);
            }
        });
        this.addFigure(this.label, new graphiti.layout.locator.TopRightLocator(this));
        this.repaint();
    }
});


g.Shapes.VectorBiobrick = graphiti.shape.icon.Icon.extend({
    NAME: "g.Shapes.VectorBiobrick",

    init: function(data) {
        this._super();
        this.data = data;
        this.name = data.name;
        this.type = data.type;
        this.relationship = data.relationship;
        this.draggable = false;
        this.setDimension(g.BiobrickWidth, g.BiobrickWidth);
        this.resizeable = false;

        this.setColor("#339BB9");
        //this.TYPE = "Protein";

        // Buttons
        /*this.forward = new g.Buttons.Forward(g.LocatorWidth, g.LocatorWidth);
          this.add = new g.Buttons.Add(g.LocatorWidth, g.LocatorWidth);
          this.remove = new g.Buttons.Remove(g.LocatorWidth, g.LocatorWidth);
          this.replace = new g.Buttons.Replace(g.LocatorWidth, g.LocatorWidth);
          this.back = new g.Buttons.Back(g.LocatorWidth, g.LocatorWidth);*/


        // Create any Draw2D figure as decoration for the connection
        //
        this.label = new graphiti.shape.basic.Label(this.name);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.label.setFontSize(8);

        // add the new decoration to the connection with a position locator.
        this.addFigure(this.label, new graphiti.layout.locator.RightLocator(this));
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
        this.addFigure(this.label, new graphiti.layout.locator.RightLocator(this));
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
        $("#information").hide();
        $("#information").find("[name='pid']").html(ctx.data.part_id);
        $("#information").find("[name='sname']").html(ctx.data.short_name);
        $("#information").find("[name='desc']").html(ctx.data.description);
        $("#information").show("slow");
        lastFigure = ctx;
    }

    ex.closeToolbar = function(ctx) {
        if (ctx !== null) {
            ctx.removeToolBar();
            $("#information").hide("slow");
            ctx = null;
        }
    }

    ex.connect = function(source, target, type) {
        var sourceport = source.createPort("hybrid", new graphiti.layout.locator.CenterLocator(source));
        var targetport = target.createPort("hybrid", new graphiti.layout.locator.CenterLocator(target));
        var command = new graphiti.command.CommandConnect(g.Canvas, sourceport, targetport, null, "input2");
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

    ex.drawLine = function(source, target, type) {
        var decorator = null;
        if (source.type === "input" && target.type === "receptor" && source.relationship === "BIREPRESS") {
            decorator = new graphiti.decoration.connection.TDecorator();
            var targetport = target.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(target, 0, target.getHeight() / 2));
            var sourceport = source.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(source, source.getWidth(), source.getHeight() / 2));
        } else {
            var targetport = target.createPort("hybrid", new graphiti.layout.locator.CenterLocator(target));
            var sourceport = source.createPort("hybrid", new graphiti.layout.locator.CenterLocator(source));
        }
        var command = new graphiti.command.CommandConnect(g.Canvas, sourceport, targetport, decorator, "input2");
        g.view.getCommandStack().execute(command);
    }

    ex.link = function(source, target, index) {
        var decorator = null;
        if (source.relationship === "PROMOTE") {
            decorator = new graphiti.decoration.connection.ArrowDecorator();
        } else {
            decorator = new graphiti.decoration.connection.TDecorator();
        }
        var sourceport = source.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(source, source.getWidth() + index * 30, source.getHeight() / 2));
        var targetport = target.createPort("hybrid", new graphiti.layout.locator.LeftLocator(target));
        var command = new graphiti.command.CommandConnect(g.Canvas, sourceport, targetport, decorator, "input" + index);
        g.view.getCommandStack().execute(command);
    }

    ex.circle = function(source, target, index) {
        var decorator = null, targetport, sourceport;
        if (source.type.slice(0, 6) == "output" && target.type == "promoter") {
            decorator = new graphiti.decoration.connection.TDecorator();
            var angle = [3.1415926 / 3.0, 3.1415926 * 5.0 / 3.0, 3.1415926];
            targetport = target.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(target, target.getWidth() / 2 - g.BiobrickWidth * 2.0 / 3.0 * Math.cos(angle[index]), target.getHeight() / 2 + g.BiobrickWidth * 2.0 / 3.0 * Math.sin(angle[index])));
            sourceport = source.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(target, target.getWidth() / 2 + g.BiobrickWidth * 2.0 / 3.0 * Math.cos(angle[index]), target.getHeight() / 2 - g.BiobrickWidth * 2.0 / 3.0 * Math.sin(angle[index])));
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
            targetport = target.createPort("hybrid", new graphiti.layout.locator.CenterLocator(target));
            sourceport = source.createPort("hybrid", new graphiti.layout.locator.CenterLocator(source));
        }  
        var command = new graphiti.command.CommandConnect(g.Canvas, sourceport, targetport, decorator, "input2");
        g.view.getCommandStack().execute(command);
    }

    ex.addLable = function(view, x, y, radius, bionum, posindex, offsetX, offsetY, labelXFlag, labelYFlag, content) {
        var point1X = x + Math.sin(posindex * 3.1415926 / parseFloat(bionum * 3)) * radius,
            point1Y = y - Math.cos(posindex * 3.1415926 / parseFloat(bionum * 3)) * radius,
            point2X = x + Math.sin(posindex * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100),
            point2Y = y - Math.cos(posindex * 3.1415926 / parseFloat(bionum * 3)) * (radius + 100),
            point3X = point2X + offsetX,
            point3Y = point2Y + offsetY;
        var line1 = new graphiti.shape.basic.Line(point1X, point1Y, point2X, point2Y);
        view.addFigure(line1);
        var line2 = new graphiti.shape.basic.Line(point2X, point2Y, point3X, point3Y);
        view.addFigure(line2);
        var label = new graphiti.shape.basic.Label(content);
        label.setColor("#0d0d0d");
        label.setFontColor("#0d0d0d");
        label.setFontSize(10); 
        view.addFigure(label);
        label.setPosition(point3X + labelXFlag * label.getWidth() / 2.0, point3Y + labelYFlag * label.getHeight());
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
    init: function(type, width, height) {
        this._super(width, height);
        this.type = type;
    },

    /**
     * @private
     * @returns
     */
    createSet : function() {
        return this.canvas.paper.image("../static/images/device/" + this.type + ".png", 0, 0, this.getWidth(), this.getHeight());
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
