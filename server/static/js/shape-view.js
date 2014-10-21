/*
 * @file shape-view.js
 * @description draw graph of circuit in three different way.
 * @author Xiangyu Liu
 * @mail liuxiangyu@live.com
 * @blog liuxiangyu.net
 * @data Oct 19 2014
 * @copyright 2014 SYSU-Software. All rights reserved.
 * 
 */

// graphiti Application
var g = {};

// Global variable
g.BiobrickWidth = 75;
g.LocatorWidth = 1;
g.promoter = new Array();
g.output = new Array();
g.view = null;
g.Canvas = null;
g.VectorFactor = 1.25;

// Get default rbs, gene, terminator
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
     * @param {ids} array of view
     *
     * @param {data} data of circuits
     *
     * @param {type} type of view
     */
    init: function(ids, data, type) {
        this.data = data;
        this.view;
        this.views = new Array();
        this.interval = 25;
        this.baseX = 150;
        this.baseY = 150;
        var input = new Array();
        var gene = new Array();
        var output = new Array();
        for (var i = 0; i < this.data.circuits.length; ++i) {
            for (var j = 0; j < this.data.circuits[i].inputs.length; ++j) {
                if (this.data.circuits[i].logics[0].logic_type != "repressilator") {
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
                progressbar.animate({width: "0%"});
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

    /**
     * @method drawDevice
     *
     * @param {data} data of device
     */
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
            progressbar.animate({width: "0%"});
        } 
    },

    /**
     * @method drawPart
     *
     * @param {arr} Biobrick array of the part
     *
     * @param {index} index of the part
     */
    drawPart: function(arr, index) {
        var newpart = new g.Shapes.Part(arr, "");
        newpart.draggable = false;
        newpart.selectable = false;
        this.views[index].html.css({width:  newpart.getWidth() + g.BiobrickWidth + "px"});
        this.views[index].html.find("svg").css({width: newpart.getWidth() + g.BiobrickWidth + "px"});
        this.views[index].addFigure(newpart, 20, 0);

    },

    /**
     * @method drawVector
     *
     * @param {arr} biobrick array
     */
    drawVector: function(arr) {
        var bionum = arr[0].length + arr[1].length + arr[2].length;
        var radius = (g.BiobrickWidth + 2 * g.LocatorWidth + this.interval) / (2 * Math.sin(3.1415926 / parseFloat(bionum * g.VectorFactor))); 
        var x = parseFloat(this.baseX + radius);
        var y = parseFloat(this.baseY + radius);
        var shape =  new graphiti.shape.basic.Circle(2 * radius);
        shape.setStroke(3);
        shape.setColor("#3d3d3d");
        shape.setBackgroundColor(null);
        shape.selectable = false;
        shape.draggable = false;
        this.views[0].addFigure(shape, this.baseX, this.baseY);
        this.label = new graphiti.shape.basic.Label("pSB1C3(2070bp)");
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.label.setFontSize(radius / 10);
 
        this.views[0].addFigure(this.label);
        this.label.setPosition(x - this.label.getWidth() / 2, y - this.label.getHeight() / 2);
        var index = 1;
        for (var i = 0; i < arr.length; ++i) {
            for (var j = 0; j < arr[i].length; ++j, ++index) {
                var angle = 2.0 * parseFloat(index) * 3.1415926 / parseFloat(bionum * g.VectorFactor);
                var bio = new g.Shapes.VectorBiobrick(arr[i][j], angle);
                this.views[0].addFigure(bio, x + Math.sin(angle) * radius - bio.getWidth() / 2, y - Math.cos(angle) * radius - bio.getHeight() / 2);
            }
            progressbar.animate({width: "0%"});
        }

        g.addLable(this.views[0], x, y, radius, bionum, 0, -30, -30, -1, -1, "EcoRI");
        g.addLable(this.views[0], x, y, radius, bionum, 1.0, 30, -30, -1, -1, "XbaI");
        g.addLable(this.views[0], x, y, radius, bionum, index * 2 - 1, -30, 30, -1, 0, "SpeI");
        g.addLable(this.views[0], x, y, radius, bionum, index * 2, 0, -30, -1, -1, "PstI");
    }
});



g.View = graphiti.Canvas.extend({

    init: function(id) {
        this._super(id);
        this.setScrollArea("#" + id);
        this.currentDropConnection = null;
        this.setSnapToGrid(true);
        this.connections = new Array(); // Store all connections in this view
        this.boundPairs = new Array(); // Store all bounds of proteins
        this.currentSelected = null; // Store the figure that is currently seleted

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

    /**
     * @constructor
     *
     * @param {name} the circuit name
     *
     * @param {data} the data of the circuit
     */
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

        // Lable of the circuit
        this.label = new graphiti.shape.basic.Label(name);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.addFigure(this.label, new graphiti.layout.locator.LeftLocator(this));
    },



    /**
     * @method draw
     *
     * @description draw the circuit by divided it into little Part
     *
     * @param {circuit} data of the circuit
     */
    draw: function(circuit) {
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
    },

    /**
     * @method addPart
     *
     * @description add a Part
     *
     * @param {item} item to add
     *
     * @param {index} index of the item
     */
    addPart: function(item, index) {
        item.locator = new graphiti.layout.locator.DeviceLocator(this, index * 2 * (item.getWidth() + 2 * g.LocatorWidth), g.LocatorWidth);
        this.setDimension((index * 2 + 1) * (item.getWidth() + 2 * g.LocatorWidth), item.getHeight() + 2 * g.LocatorWidth);
        this.addFigure(item, item.locator); 
        if (this.lastitem != null) {
            g.drawLine(this.lastitem, item);
        }
        this.lastitem = item;
        if (item.data !== undefined) {
            if (item.data.type == "promoter") {
                g.promoter.push(item);
            } else if (item.data.type == "output") {
                g.output.push(item);
            }
        }
    },

    /**
     * @method addItem
     *
     * @description add a item to circuit
     *
     * @param {item} item to add
     *
     * @param {index} index of the item
     */
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

    /**
     * @method onClick
     *
     * @description when the circuit clicked
     *
     * @param {x} position x
     *
     * @param {y} position y
     */
    onClick: function(x, y) {
        var figure = this.getBestFigure(x, y);
        if (figure !== undefined) {
            figure.onClick(x, y);
        } else {
            g.closeToolbar(lastFigure);
        }
    },

    /**
     * @method getBestFigure
     *
     * @description when the circuit clicked, get the best figure clicked
     *
     * @param {x} position x
     *
     * @param {y} position y
     */
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

    /**
     * @constructor
     *
     * @param {data} Biobricks data
     *
     * @param {type} type of part
     */
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
        this.addFigure(item, item.locator); 
        if (this.lastitem != null) {
            g.drawLine(this.lastitem, item);
        } else {
            this.firstitem = item;
        }
        this.lastitem = item;
    }, 

    onClick: function(x, y) {
        var figure = this.getBestFigure(x, y);
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

    /**
     * @constructor
     *
     * @param {data} logic data
     *
     * @param {portArr} input ports
     */
    init: function(data, portArr) {
        this._super();
        this.boundElements = new graphiti.util.ArrayList();
        this.setAlpha(0.01);
        this.TYPE = "Container";
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
                    logic.outputparts[i][j].type += i;
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
            var gate = new g.Gate(logic.logic_type, this.gateWidth, this.gateHeight);
            this.addItem(gate);
            var lastpartlength = logic.outputparts[partslength - 1].length;
            logic.outputparts[partslength - 1][lastpartlength - 2].type = "outputfinal";
            var outputpart = new g.Shapes.Part(logic.outputparts[0], "output");
            this.addItem(outputpart);
            if (logic.logic_type === "inverter") {
                this.gateWidth += 100;
            } 
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
        if (item.data.type.slice(0, 10) != "terminator") {
            this.lastbio = item;
        }
    },

    addItem: function(item) {
        if (item.type == "input") {
            if (this.data.inputparts.length == 2) {
                item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, this.baseY);
                this.baseY += item.getHeight() * 2;
                this.setDimension(item.getWidth(), this.baseY - item.getHeight());
                this.addFigure(item, item.locator);
            } else {
                item.locator = new graphiti.layout.locator.DeviceLocator(this, 0, item.getHeight());
                this.setDimension(item.getWidth(), item.getHeight() * 3);
                this.addFigure(item, item.locator);
            }
        } else if (item.type === "inverter") {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.gateX, this.gateY - 15);
            this.gateX += this.gateWidth + 2.5 * g.BiobrickWidth;
            this.addFigure(item, item.locator);
        } else if (item.type === "and_gate") {
            item.locator = new graphiti.layout.locator.DeviceLocator(this, this.gateX, this.gateY);
            this.gateX += this.gateWidth + 2.5 * g.BiobrickWidth;
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

g.Shapes.Biobrick = graphiti.shape.icon.Icon.extend({
    NAME: "g.Shapes.Biobrick",

    /**
     * @constructor
     *
     * @param {data} Biobrick data
     */
    init: function(data) {
        this._super();
        this.data = data;
        this.name = data.name;
        this.type = data.type;
        this.relationship = data.relationship;
        this.draggable = false;
        this.setDimension(g.BiobrickWidth, g.BiobrickWidth);
        this.resizeable = false;

        this.label = new graphiti.shape.basic.Label(this.name);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.label.setFontSize(g.BiobrickWidth / 5);
        this.addFigure(this.label, new graphiti.layout.locator.BottomLocator(this));
    },

    onClick: function() { 
        g.toolbar(this); 
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    },

    createSet : function() {
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


g.Shapes.VectorBiobrick = graphiti.shape.icon.Icon.extend({
    NAME: "g.Shapes.VectorBiobrick",

    /**
     * @constructor
     *
     * @param {data} VectorBiobrick data
     */
    init: function(data, angle) {
        this._super();
        this.data = data;
        this.name = data.name;
        this.type = data.type;
        this.relationship = data.relationship;
        this.draggable = false;
        this.setDimension(g.BiobrickWidth, g.BiobrickWidth);
        this.resizeable = false;

        this.label = new graphiti.shape.basic.Label(this.name);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.label.setFontSize(8);
        var locator;
        if (angle < 5.0 * 3.1415926 / 6.0) {
            locator = new graphiti.layout.locator.RightLocator(this);
        } else if (angle > 7.0 * 3.1415926 / 6.0) {
            locator = new graphiti.layout.locator.LeftLocator(this);
        } else {
            locator = new graphiti.layout.locator.BottomLocator(this);
        }
        this.addFigure(this.label, locator);
    },

    onClick: function() { 
        g.toolbar(this); 
    },

    onDoubleClick: function() {
        g.closeToolbar(this);
    },

    createSet : function() { 
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


g.Gate = graphiti.shape.icon.Icon.extend({

    NAME : "graphiti.Buttons.Back",

    /**
     * 
     * @constructor
     * @description Creates a new logic icon element which are not assigned to any canvas.
     * 
     * @param {type} type of the gate
     * @param {Number} [width] the width of the gate
     * @param {Number} [height] the height of the gate
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

var lastFigure = null;
(function(ex) {
    /** 
     * @function toolbar
     *
     * @description Show toolbar when click the BiobrickWidth
     *
     * @param {ctx} clicked Biobrick
     */
    ex.toolbar = function(ctx) {
        if (lastFigure !== null) {
            lastFigure.removeToolBar();
        }
        $("#information").hide();
        $("#information").find("[name='pid']").html(ctx.data.part_id);
        $("#information").find("[name='sname']").html(ctx.data.short_name);
        $("#information").find("[name='desc']").html(ctx.data.description);
        $("#information").show("slow");
        lastFigure = ctx;
    }

    /** 
     * @function closeToolbar
     *
     * @description close toolbar when double click the BiobrickWidth
     *
     * @param {ctx} clicked Biobrick
     */
    ex.closeToolbar = function(ctx) {
        if (ctx !== null) {
            ctx.removeToolBar();
            $("#information").hide("slow");
            ctx = null;
        }
    }

    /**
     * @function drawLine
     *
     * @description link two biobrick
     *
     * @param {source} source biobrick
     *
     * @param {target} target biobrick
     */
    ex.drawLine = function(source, target) {
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

    /**
     * @function link
     *
     * @description link input and logic
     *
     * @param {source} source input
     *
     * @param {target} target logic input
     *
     * @param {index} index of logic input
     */
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

    /**
     * @function link
     *
     * @description link  biobrick in a repressilator
     *
     * @param {source} source biobrick
     *
     * @param {target} target biobrick
     *
     * @param {index} index of a part
     */
    ex.circle = function(source, target, index) {
        var decorator = null, targetport, sourceport;
        if (source.type.slice(0, 6) === "output" && target.type.slice(0, 8) === "promoter") {
            decorator = new graphiti.decoration.connection.TDecorator();
            var angle = [3.1415926 / 3.0, 3.1415926 * 5.0 / 3.0, 3.1415926];
            targetport = target.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(target, target.getWidth() / 2 - g.BiobrickWidth * 2.0 / 3.0 * Math.cos(angle[index]), target.getHeight() / 2 + g.BiobrickWidth * 2.0 / 3.0 * Math.sin(angle[index])));
            sourceport = source.createPort("hybrid", new graphiti.layout.locator.DeviceLocator(target, target.getWidth() / 2 + g.BiobrickWidth * 2.0 / 3.0 * Math.cos(angle[index]), target.getHeight() / 2 - g.BiobrickWidth * 2.0 / 3.0 * Math.sin(angle[index]))); 
        } else {
            targetport = target.createPort("hybrid", new graphiti.layout.locator.CenterLocator(target));
            sourceport = source.createPort("hybrid", new graphiti.layout.locator.CenterLocator(source));
        }  
        var command = new graphiti.command.CommandConnect(g.Canvas, sourceport, targetport, decorator, "input2");
        g.view.getCommandStack().execute(command);
    }

    /**
     * @function addLable
     *
     * @description draw vector label
     *
     * @param {view}
     */
    ex.addLable = function(view, x, y, radius, bionum, posindex, offsetX, offsetY, labelXFlag, labelYFlag, content) {
        var point1X = x + Math.sin(posindex * 3.1415926 / parseFloat(bionum * g.VectorFactor)) * radius,
            point1Y = y - Math.cos(posindex * 3.1415926 / parseFloat(bionum * g.VectorFactor)) * radius,
            point2X = x + Math.sin(posindex * 3.1415926 / parseFloat(bionum * g.VectorFactor)) * (radius + 100),
            point2Y = y - Math.cos(posindex * 3.1415926 / parseFloat(bionum * g.VectorFactor)) * (radius + 100),
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
