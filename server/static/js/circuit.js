/**
 * @file circuit.js
 * @description Help the user to design circuits and logics
 * @author Xiangyu Liu
 * @mail liuxiangyu@live.com
 * @blog liuxiangyu.net
 * @data Oct 19 2014
 * @copyright 2014 SYSU-Software. All rights reserved.
 * 
 */

// Global constant
var MAXCIRCUITSNUM = 3;
var MAXPARTSNUM = 2;
var MAXOUTPUTSNUM = 3;
var MAXTRUTHABLEROWNUM = 4;

// View template
var circuit = $("#circuit");
var part = $("#template .part");
var output = $("#template .item.output");
var littleoutput = $("#template .item.littleoutput");
var bioselector = $(".biobrickselector");
var truthele = $("#template .truthele");
var logiccontainer = $("#template .logiccontainer");
var outputcontainer = $("#template .outputcontainer");
var frame = $(".frame");
var recommend = $(".recommend");
var closeicon = $("#template > .delete");
var step = $("#template .ui.step");
var repressilator = $("#repressilator");
var toggletwo = $("#toggletwo");
var warning = $("#warning");
var warnmessage = $("#warnmessage");
var biobrick = $("#template .item.biobrick");
var input = $("#template .item.input");
var promoter = $("#template .item.promoter");
var receptor = $("#template .item.receptor");
var biolist = $("#biolist");
var olist = $("#outputlist");
var logiclist = $("#logiclist");
var logic = $("#template .item.logic");
var littlelogic = $("#template .item.littlelogic");
var circuits = $("#circuits").tabs();

// Global variable
var circuitNum = 0;
var circuitCounter = 0;
var circuitFlag = new Array(false, false, false);
var currentcircuit;
var circuitsArr = [null, null, null];
var addInputFlag = true;
var inputselector;
var outputselect;
var logicselector;

/**
 * @class Circuit
 *
 * @method constructor
 *
 * @description the object of an circuit
 */
function Circuit() {
    var that = this;
    this.view = circuit.clone(true);
    this.view.attr("id", "circuit" + circuitNum);
    this.truthrownum = 1;
    this.truthtable = false;
    this.partsArr = new Array();
    this.outputsArr = new Array();
    this.logicsArr = new Array();
    this.isRepSelected = false;
    this.isTogSwiTwoSelected = false;
    this.isSingleInput = false;
    this.isTwoInput = false;

    // Change truth table mode or drag logic mode
    this.view.find(".ui.checkbox.mode").checkbox({
        "onEnable": function() {
            that.view.find(".truthtable").hide("slow");
            that.view.find(".logics").show("slow");
        },
        "onDisable": function() {
            that.view.find(".logics").hide("slow");
            that.view.find(".truthtable").show("slow");
        }
    });

    // Add a truth table row
    this.view.find("[name='addTruthTableRow']").click(function() {
        if (that.truthrownum < MAXTRUTHABLEROWNUM && that.truthtable) {
            that.addTruthTableRow();
            ++that.truthrownum;
        }
        if (that.truthrownum > 1) {
            that.view.find("[name='deleteTruthTableRow']").removeClass("disabled");
        }
        if (that.truthrownum == MAXTRUTHABLEROWNUM) {
            $(this).addClass("disabled");
        }
    });

    // Delete a truth table row
    this.view.find("[name='deleteTruthTableRow']").click(function() {
        if (that.truthrownum > 1) {
            that.deleteTruthTableRow();
            --that.truthrownum;
        }
        if (that.truthrownum == 1) {
            $(this).addClass("disabled");
        }
        if (that.truthrownum < MAXTRUTHABLEROWNUM) {
            that.view.find("[name='addTruthTableRow']").removeClass("disabled");
        }

    });

    // Submit truth table and get recommend logics
    this.view.find("[name='submit']").click(function() {
        $.ajax({
            type: "POST",
            url:"/circuit/schemes",
            contentType: "application/json",
            data: JSON.stringify(currentcircuit.getData())
        }).done(function(data) {
            if (data.logics.length > 0) {
                var recommend = new Recommend(data.logics);
            }
        });
    });
}

/**
 * @class Circuit
 *
 * @method addPart
 *
 * @description add a new part to the circuit
 *
 * @param {newPart} a Part object to be added
 */
Circuit.prototype.addPart = function(newPart) {
    newPart.view.draggable({disabled: "true"});
    newPart.view.find(".element").popup();
    var newdelete = closeicon.clone(true);
    var partindex = this.partsArr.length;
    newPart.view.append(newdelete);
    this.view.find(".parts .items").append(newPart.view);
    this.view.find(".truthtable table > thead > tr > th").first().append("<th>Input" + (this.partsArr.length + 1) + "</th>");
    var row = this.view.find(".truthtable table > tbody > tr");
    for (var i = 0; i < this.truthrownum; ++i) {
        var newtruthele = truthele.clone(true);
        newtruthele.checkbox();
        row.children("td").first().append("<td></td>");
        row.children("td").first().children().last().append(newtruthele);
        row = row.next();
    }
    if (!this.truthtable) {
        this.view.find(".truthtable .table").show("slow");
        this.truthtable = true;
        this.view.find("[name='addTruthTableRow']").removeClass("disabled");
    }
    this.partsArr.push(newPart);
    if (this.partsArr.length == MAXPARTSNUM || (this.partsArr.length == 1 && this.isSingleInput)) {
        this.view.find(".parts .items").droppable({disabled:true});
    }
    if (this.partsArr.length == 2) {
        this.isTwoInput = true;
    }
    var that = this;
    newdelete.click(function() {
        that.deletePart(newPart);
    });
}

/**
 * @class Circuit
 *
 * @method deletePart
 *
 * @description delete a part of the circuit
 *
 * @param {delPart} the Part object to be deleted
 */
Circuit.prototype.deletePart = function(delpart) {
    if (this.partsArr.length == 2) {
        this.isTwoInput = false;
        for (var i = 0; i < this.logicsArr.length; ++i) {
            if (this.logicsArr[i] != null && this.logicsArr[i].n_inputs == 2) {
                this.isTwoInput = true;
            }
        }
    }
    var index = this.partsArr.indexOf(delpart);
    this.partsArr[index].view.remove();
    this.view.find(".truthtable table > thead > tr > th").first().children().last().remove();
    var row = this.view.find(".truthtable table > tbody > tr").first();
    for (var i = 0; i < this.truthrownum; ++i) {
        row.children("td").first().children().get(index).remove();
        row = row.next();
    }
    this.view.find(".parts .items").droppable({disabled:false});
    this.partsArr.splice(index, 1);
    this.updateTruthTable();
}


/**
 * @class Circuit
 *
 * @method updateTruthTable
 *
 * @description when add or delete a part or output update the truthtable
 */
Circuit.prototype.updateTruthTable = function() {
    this.truthtable = this.view.find(".truthtable table > thead > tr > th").first().children().length != 0 ||
        this.view.find(".truthtable table > thead > tr > th").last().children().length != 0;
    if (!this.truthtable) {
        this.view.find(".truthtable .table").hide("slow");
        this.view.find("[name='addTruthTableRow']").addClass("disabled");
        this.view.find("[name='deleteTruthTableRow']").addClass("disabled");
    }
}

/**
 * @class Circuit
 *
 * @method addOutput
 *
 * @description add an output to the circuit
 *
 * @param {newOutput} the Output object to be added
 */
Circuit.prototype.addOutput = function(newOutput) {
    var that = this;
    this.view.find(".outputs .items").append(newOutput.littleview);
    this.view.find(".logics .items").append(newOutput.logicview);
    this.view.find(".truthtable table > thead > tr > th").last().append("<th>Output" + (this.outputsArr.length + 1) + "</th>");
    var row = this.view.find(".truthtable table > tbody > tr").first();
    for (var i = 0; i < this.truthrownum; ++i) {
        var newtruthele = truthele.clone(true);
        newtruthele.checkbox();
        row.children("td").last().append("<td></td>");
        row.children("td").last().children().last().append(newtruthele);
        row = row.next();
    }
    if (!this.truthtable) {
        this.view.find(".truthtable .table").show("slow");
        this.truthtable = true;
        this.view.find("[name='addTruthTableRow']").removeClass("disabled");
    }
    this.outputsArr.push(newOutput);
    this.logicsArr.push(newOutput.logic);
    newOutput.littleview.find(".delete").click(function() {
        if (that.isTogSwiTwoSelected) {
            var index = newOutput.view.parent().children().index(newOutput.view);
            var newoutputcontainer = outputcontainer.clone(true);
            newOutput.littleview.remove();
            that.view.find(".outputs .items").append(newoutputcontainer);
            that.outputsArr.splice(index, 1);
        } else {
            that.deleteOutput(newOutput);
        }
    });
    newOutput.littleview.find("img[name='output']").popup();
}


/**
 * @class Circuit
 *
 * @method deleteOutput
 *
 * @description delete an output of the circuit
 *
 * @param {delPart} the Output object to be deleted
 */
Circuit.prototype.deleteOutput = function(deloutput) {
    var index = this.outputsArr.indexOf(deloutput);
    this.outputsArr[index].littleview.remove();
    deloutput.logicview.remove();
    this.view.find(".truthtable table > thead > tr > th").last().children().last().remove();
    var row = this.view.find(".truthtable table > tbody > tr").first();
    for (var i = 0; i < this.truthrownum; ++i) {
        row.children("td").last().children().get(index).remove();
        row = row.next();
    }
    this.view.find(".outputs .items").droppable({disabled: false});
    this.outputsArr.splice(index, 1);
    this.logicsArr.splice(index, 1);
    this.updateTruthTable();
}

/**
 * @class Circuit
 *
 * @method clear
 *
 * @description clear all data of the circuit
 */
Circuit.prototype.clear = function() {
    var partsnum = this.partsArr.length;
    var outputsnum = this.outputsArr.length;
    for (var i = 0; i < partsnum; ++i) {
        this.deletePart(this.partsArr[0]);
    }
    for (var i = 0; i < outputsnum; ++i) {
        this.deleteOutput(this.outputsArr[0]);
    }
    if (this.logicsArr.length != 0) {
        this.logicsArr[0].littleview.remove();
        this.logicsArr.pop();
    }
}

/**
 * @class Circuit
 *
 * @method addTruthTableRow
 *
 * @description add the truth table a row
 */
Circuit.prototype.addTruthTableRow = function() {
    var tbody = this.view.find(".truthtable table > tbody");
    tbody.append("<tr><td></td><td></td></tr>");
    var inputtruth = tbody.children().last().children().first();
    var outputtruth = tbody.children().last().children().last();
    for (var i = 0; i < this.partsArr.length; ++i) {
        inputtruth.append("<td></td>");
        var newtruthele = truthele.clone(true);
        newtruthele.checkbox();
        inputtruth.children().last().append(newtruthele);
    }

    for (var i = 0; i < this.outputsArr.length; ++i) {
        outputtruth.append("<td></td>");
        var newtruthele = truthele.clone(true);
        newtruthele.checkbox();
        outputtruth.children().last().append(newtruthele);
    }
}

/**
 * @class Circuit
 *
 * @method deleteTruthTableRow
 *
 * @description delete the last row of the truth table
 */
Circuit.prototype.deleteTruthTableRow = function() {
    this.view.find(".truthtable table > tbody > tr").last().remove();
}

/**
 * @class Circuit
 *
 * @method getData
 *
 * @description get the data of circuit to require recommend logics
 */
Circuit.prototype.getData = function() {
    var schemes = {'inputs':[], 'outputs':[], 'truth_table':[]};
    for (var i = 0; i < this.partsArr.length; ++i) {
        schemes.inputs.push(this.partsArr[i].getId());
    }
    for (var i = 0; i < this.outputsArr.length; ++i) {
        schemes.outputs.push(this.outputsArr[i].getId());
    }
    for (var i = 0; i < this.truthrownum; ++i) {
        var truthtablerowdata = {'inputs':[], 'outputs': []};
        var inputtruth = this.view.find(".truthtable table > tbody").children().first().children().first().children().first();
        var outputtruth = this.view.find(".truthtable table > tbody").children().last().children().first().children().first();
        for (var j = 0; j < this.partsArr.length; ++j) {
            truthtablerowdata.inputs.push(this.view.find("form [name='truth']")[i * this.partsArr.length + i * this.outputsArr.length + j].checked);
        }
        for (var j = 0; j < this.outputsArr.length; ++j) {
            truthtablerowdata.outputs.push(this.view.find("form [name='truth']")[(i + 1) * this.partsArr.length + i * this.outputsArr.length + j].checked);
        }
        schemes.truth_table.push(truthtablerowdata);
    }
    return schemes;
}

/**
 * @class Circuit
 *
 * @method getDetail
 *
 * @description get the details of circuit
 */
Circuit.prototype.getDetail = function() {
    var schemes = {'inputs':[], 'outputs':[], 'logics':[]};
    var result;
    for (var i = 0; i < this.partsArr.length; ++i) {
        schemes.inputs.push(this.partsArr[i].getId());
    }
    if (schemes.inputs.length == 0) {
        var defaultinput = {'id': 1, 'promoter_id': 17, 'receptor_id': 1};
        schemes.inputs.push(defaultinput);
    }
    for (var i = 0; i < this.outputsArr.length; ++i) {
        schemes.outputs.push(this.outputsArr[i].getId());
    }
    for (var i = 0; i < this.logicsArr.length; ++i) {
        schemes.logics.push(this.logicsArr[i].getId());
    }
    return schemes;
}

/**
 * @class Circuit
 *
 * @method uploaddata
 *
 * @description upload the circuit details and get circuit display data
 */
Circuit.prototype.uploaddata = function() {
    var schemes = this.getDetail();
    var result;
    $.ajax({
        type: "POST",
        url: "/circuit/details",
        contentType: "application/json",
        data: JSON.stringify(schemes),
        async: false
    }).done(function(data) {
        result = data;
    });
    return result;
}

/**
 * @class Circuit
 *
 * @method saveData
 *
 * @description save data of the circuit
 */
Circuit.prototype.saveData = function() {
    var partdatas = [], outputdatas = [], logicdatas = [];
    for (var i = 0; i < this.partsArr.length; ++i) {
        partdatas.push(this.partsArr[i].data);
    }
    for (var i = 0; i < this.outputsArr.length; ++i) {
        outputdatas.push(this.outputsArr[i].data);
    }
    for (var i = 0; i < this.logicsArr.length; ++i) {
        logicdatas.push(this.logicsArr[i].data);
    }
    return {
        "partdatas": partdatas,
            "outputdatas": outputdatas,
            "logicdatas": logicdatas,
            "isRepSelected": this.isRepSelected,
            "isTogSwiTwoSelected": this.isTogSwiTwoSelected,
            "isSingleInput": this.isSingleInput,
            "isTwoInput": this.isTwoInput
    };
}

/**
 * @class Circuit
 *
 * @method recover
 *
 * @description recover a circuit base in the given data
 *
 * @param {data} the data to rebuild a circuit
 */
Circuit.prototype.recover = function(data) {
    this.isRepSelected = data.isRepSelected;
    this.isTogSwiTwoSelected = data.isTogSwiTwoSelected;
    this.isSingleInput = data.isSingleInput;
    this.isTwoInput = data.isTwoInput;
    for (var i = 0; i < data.partdatas.length; ++i) {
        this.addPart(new Part(data.partdatas[i]));
    }
    for (var i = 0; i < data.outputdatas.length; ++i) {
        this.addOutput(new Output(data.outputdatas[i]));
    }
    if (this.isTogSwiTwoSelected) {
        this.logicsArr.length = 0;
    }
    this.view.find(".logics .items").empty();
    if (this.isRepSelected) {
        this.logicsArr.push(new Logic(data.logicdatas[0]));
        this.view.find(".logics .items").append(this.logicsArr[0].littleview);
    } else {
        for (var i = 0; i < data.logicdatas.length; ++i) {
            this.logicsArr[i] = new Logic(data.logicdatas[i]);
            this.outputsArr[i].logic = this.logicsArr[i];
            this.outputsArr[i].logicview = this.logicsArr[i].littleview;
            this.view.find(".logics .items").append(this.logicsArr[i].littleview);
        }
    }
}


/**
 * @class Circuit
 *
 * @method disableDrop
 *
 * @description disable all drop event in this circuit
 */
Circuit.prototype.disableDrop = function() {
    this.view.find(".items").droppable({disabled: true});
}

/**
 * @class Circuit
 *
 * @method enableDrop
 *
 * @description enable all drop event in this circuit
 */
Circuit.prototype.enableDrop = function() {
    this.view.find(".items").droppable({disabled: false});
}

/**
 * @class Part
 * 
 * @method constructor
 *
 * @description the object of a part
 *
 * @param {data} the data of the Part object
 */
function Part(data) {
    var that = this;
    this.view = part.clone(true);
    this.data = clone(data);
    this.view.find(".label[name='input']").append(this.data.input.name);
    this.view.find(".label[name='promoter']").append(this.data.promoter.name);
    this.view.find(".label[name='receptor']").append(this.data.receptor.name);
    this.view.find(".element[name='input']").attr("data-html", "<div class='ui ribbon label'>Part_id</div><p name='id'>" + this.data.input.id + "</p><div class='ui ribbon label'>Part_short_name</div><p name='sname'>" + this.data.input.short_name + "</p><div class='ui ribbon label'>Part_short_desc</div><p name='sdesc'>" + this.data.input.description + "</p>");
    this.view.find(".element[name='promoter']").attr("data-html", "<div class='ui ribbon label'>Part_id</div><p name='id'>" + this.data.promoter.id + "</p><div class='ui ribbon label'>Part_short_name</div><p name='sname'>" + this.data.promoter.short_name + "</p><div class='ui ribbon label'>Part_short_desc</div><p name='sdesc'>" + this.data.promoter.description + "</p>");
    this.view.find(".element[name='receptor']").attr("data-html", "<div class='ui ribbon label'>Part_id</div><p name='id'>" + this.data.input.id + "</p><div class='ui ribbon label'>Part_short_name</div><p name='sname'>" + this.data.receptor.short_name + "</p><div class='ui ribbon label'>Part_short_desc</div><p name='sdesc'>" + this.data.receptor.description + "</p>");
    this.view.draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document",
        helper: "clone",
        cursor: "move",
        start: function(event, ui) {
            if (currentcircuit.partsArr.length < MAXPARTSNUM) {
                if (currentcircuit.partsArr.length == 1 && currentcircuit.isSingleInput) {
                    warnmessage.html("You can not choose this logic gate because you have choosed a single input logic gate!");
                    warning.modal("show");
                } else if (!currentcircuit.isRepSelected){
                    currentcircuit.view.find(".parts .items").droppable({
                        accept: that.view,
                        activeClass: "ui-state-highlight",
                        drop: function( event, ui ) {
                            inputselector.nextstep();
                            currentcircuit.addPart(that);
                        }
                    });
                }
            } else {
                warnmessage.html("Inputs are enough!");
                warning.modal("show");
            }
        }
    });
}

/**
 * @class Part
 *
 * @method getId
 *
 * @description get an object of id of every part
 */
Part.prototype.getId = function() {
    return {'id': this.data.input.id, 'promoter_id': this.data.promoter.id, 'receptor_id': this.data.receptor.id};
}

/**
 * @class Output
 *
 * @method constructor
 *
 * @description the object of an output
 */
function Output(data)  {
    var that = this;
    this.data = data;

    // View in right selector
    this.view = biobrick.clone(true);
    this.view.find("img")[0].src = "../static/images/circuit/outputfinal.png";
    this.view.find("[name='id']").append(this.data.part_id);
    this.view.find("[name='name']").append(this.data.name);
    this.view.find("[name='sname']").append(this.data.short_name);
    this.view.find("[name='sdesc']").append(this.data.description);

    // Little view dropped in the main page
    this.littleview = littleoutput.clone(true);
    this.littleview.find("[name='name']").append(this.data.name);
    this.littleview.find("img[name='output']").attr("data-html", "<div class='ui ribbon label'>Part_id</div><p name='id'>" + this.data.id + "</p><div class='ui ribbon label'>Part_short_name</div><p name='sname'>" + this.data.short_name + "</p><div class='ui ribbon label'>Part_short_desc</div><p name='sdesc'>" + this.data.description + "</p>");

    // Logic for this output
    this.logicview = logiccontainer.clone(true);
    this.logic = null;

    // Drag event for view in right selector
    this.view.draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document",
        helper: "clone",
        cursor: "move",
        start: function(event, ui) {
            if (currentcircuit.isTogSwiTwoSelected) {
                currentcircuit.view.find(".outputcontainer").droppable({
                    accept: that.view,
                    activeClass: "ui-state-highlight",
                    drop: function( event, ui ) {
                        var newOutput = new Output(that.data);
                        $(this).remove();
                        currentcircuit.addOutput(newOutput);
                        newOutput.logicview.remove();
                        currentcircuit.logicsArr.pop();
                        currentcircuit.logicsArr.length = 1;
                    }
                });
            } else {
                if (currentcircuit.outputsArr.length < MAXOUTPUTSNUM) {
                    currentcircuit.view.find(".outputs .items").droppable({
                        accept: that.view,
                        activeClass: "ui-state-highlight",
                        drop: function( event, ui ) {
                            currentcircuit.addOutput(new Output(that.data));
                        }
                    });
                } else {
                    currentcircuit.view.find(".outputs .items").droppable({disabled: true});
                }
            }
        }
    });
}

/**
 * @class Output
 *
 * @method getId
 *
 * @description get the output id
 */
Output.prototype.getId = function() {
    return this.data.id;
}


/**
 * @class Biobrick
 *
 * @method constructor
 *
 * @description the object list in the input selector
 */
function Biobrick(parent, data) {
    var that = this;
    this.view = biobrick.clone(true);
    var type = data.type;
    this.data = data;
    if (data.type === "promoter") {
        type += "3";
    }
    this.view.find("img")[0].src = "../static/images/circuit/" + type + ".png";
    this.view.find("[name='id']").append(data.part_id);
    this.view.find("[name='name']").append(data.name);
    this.view.find("[name='sname']").append(data.short_name);
    this.view.find("[name='sdesc']").append(data.description);
    this.view.click(function() {
        parent.result[that.data.type] = that.data;
        var type = "input";
        if (parent.index == 1) {
            type = "suggest/promoters?input_id=" + data.id;
        } else if (parent.index == 2) {
            type = "suggest/receptors?input_id=" + parent.result["input"].id + "&promoter_id=" + data.id;
        }
        $.ajax({
            url:"biobrick/" + type
        }).done(function(data) {
            parent.arr = data["result"];
            parent.nextstep();
        });
    });
}

/**
 * @class Logic
 *
 * @method constructor
 *
 * @description the object of logic
 */
function Logic(data) {
    var that = this;
    this.data = data;

    // View in right selector
    this.view = logic.clone(true);
    this.view.find("img")[0].src = "../static/images/frame/" + data.name + ".png";
    this.view.find(".label[name='name']").append(data.name);
    this.view.find(".right").append("<canvas id='radar" + data.id + "' width='200' height='200'>hello</canvas>");
    var radardata = {
        labels: ["Efficiency", "Realiability", "Accessiblity", "Demand", "Specificity"],
        datasets: [
        {
            label: "Background dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [this.data.efficiency * 20, this.data.realiability * 20, this.data.accessibility * 20, this.data.demand * 20, this.data.specificity * 20]
        }
        ]
    };
    // When mouse enter, show radar chart
    this.view.mouseenter(function() {
        /*window.myRadar = */new Chart(document.getElementById("radar" + data.id).getContext("2d")).Radar(radardata, {
            responsive: true,
            angleLineColor : "rgba(255,255,255,.5)",
            scaleLineColor: "rgba(255,255,255,.5)"
        });
    });

    // Little view in part display
    this.littleview = littlelogic.clone(true);
    this.littleview.find("img")[0].src = "../static/images/frame/" + data.name + ".png";
    this.littleview.find(".label[name='name']").append(data.name);
    this.view.draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document",
        helper: "clone",
        cursor: "move",
        start: function(event, ui) {
            if (that.data.logic_type === "repressilator") {
                new Repressilator(that.data);
            } else {
                if (currentcircuit.isTwoInput && that.data.n_inputs == 1) {
                    warnmessage.html("This logic gate only has one input but you have choosed two input!");
                    warning.modal("show");
                } else {
                    currentcircuit.view.find(".logiccontainer").droppable({
                        accept: that.view,
                        activeClass: "ui-state-highlight",
                        drop: function( event, ui ) {
                            var index = $(this).parent().children().index($(this));
                            if (that.data.logic_type != "toggle_switch_2") {
                                if (that.data.n_inputs == 1) {
                                    currentcircuit.isSingleInput = true;
                                } else {
                                    currentcircuit.isTwoInput = true;
                                }
                                var newLogic = new Logic(that.data);
                                newLogic.littleview.replaceAll($(this));
                                currentcircuit.outputsArr[index].logicview = newLogic.littleview;
                                currentcircuit.outputsArr[index].logic = newLogic;
                                currentcircuit.logicsArr[index] = newLogic;
                            } else {
                                new Toggletwo(that.data, index, $(this));
                            }
                        }
                    });
                }
            }
        }
    });

    // Delete this output and its logic
    this.littleview.find(".delete").click(function() {
        var index = $(this).parent().parent().children().index($(this).parent());
        if (that.data.n_inputs == 1) {
            currentcircuit.isSingleInput = false;
        } else {
            currentcircuit.isTwoInput = false;
        }
        if (that.data.logic_type == "repressilator") {
            $(this).parent().remove();
            currentcircuit.logicsArr.pop();
            currentcircuit.logicsArr.length = 0;
            currentcircuit.enableDrop();
            currentcircuit.isRepSelected = false;
        } else if (that.data.logic_type == "toggle_switch_2") {
            currentcircuit.isTogSwiTwoSelected = false;
            that.littleview.remove();
            currentcircuit.logicsArr.length = 0;
            currentcircuit.outputsArr.length = 0;
            currentcircuit.view.find(".outputs .items").empty();
        } else {
            var newview = logiccontainer.clone(true);
            newview.replaceAll($(this).parent());
            currentcircuit.outputsArr[index].logicview = newview;
            currentcircuit.outputsArr[index].logic = null;
            currentcircuit.logicsArr[index] = null;
        }
        for (var i = 0; i < currentcircuit.logicsArr.length; ++i) {
            if (currentcircuit.logicsArr[i] != null) {
                if (currentcircuit.logicsArr[i].n_inputs == 1) {
                    currentcircuit.isSingleInput = true;
                } else {
                    currentcircuit.isTwoInput = true;
                }
            }
        }
        if (currentcircuit.partsArr.length == 2) {
            currentcircuit.isTwoInput = true;
        }
    });
}

/**
 * @class Logic
 *
 * @method getId
 *
 * @description get the id of a logic
 */
Logic.prototype.getId = function() {
    return this.data.id;
}

/**
 * @class Inputselector
 *
 * @method constructor
 *
 * @description the object is to help user choose parts of input
 */
function Inputselector() {
    var that = this;
    this.steps = $("#chose-steps > .step");
    this.steps.addClass("disabled");
    this.search = $("#inputpart > .search");
    this.searchinput = $("#inputpart > .search > input");
    this.currentstep = $("#chose-steps > .first");
    this.index = 0;
    this.inputpart = $("#inputpart");
    this.arr;
    this.result = {"input": null, "promoter": null, "receptor": null};
    $.ajax({
        url:"biobrick/input",
    }).done(function(data) {
        that.arr = data["result"];
        that.nextstep();
    });
    this.steps.click(function() {
        var index = $(this).parent().children().index($(this));
        if (index < that.index || that.index  == 0) {
            that.index = index;
            var step = $(this);
            if (that.index > 0) {
                that.currentstep = step.prev();
            }
            step.addClass("active");
            for (var i = that.index; i < 3; ++i) {
                step = step.next();
                step.removeClass("active");
                step.addClass("disabled");
            }
            var type = "input";
            if (that.index == 1) {
                type = "suggest/promoters?input_id=" + that.result["input"].id;
            } else if (that.index == 2) {
                type = "suggest/receptors?input_id=" + that.result["input"].id + "&promoter_id=" + that.result["promoter"].id;
            }
            $.ajax({
                url:"biobrick/" + type
            }).done(function(data) {
                that.arr = data["result"];
                that.nextstep();
            });
        }
    });
}

/**
 * @class Inputselector
 *
 * @method nextstep
 *
 * @description when user click an item, move to next step
 */
Inputselector.prototype.nextstep = function() {
    var that = this;
    this.search.hide();
    if (this.biolist) {
        this.biolist.remove();
    }
    this.currentstep.removeClass("active");
    if (this.index > 0) {
        this.currentstep = this.currentstep.next();
    } else {
        this.currentstep = $("#chose-steps > .first");
        this.steps.addClass("disabled");
    }
    this.currentstep.removeClass("disabled");
    this.currentstep.addClass("active");
    this.biolist = biolist.clone();
    if (this.index < 3) {
        for (var i = 0; i < this.arr.length; ++i) {
            var bio = new Biobrick(this, this.arr[i]);
            this.biolist.append(bio.view);
        }
        if (this.index == 1 || this.index == 2) {
            this.search.show();
            this.searchinput.keyup(function() {
                var type = ["promoter", "receptor"];
                if (that.searchinput.val() != "") {
                    $.ajax({
                        type: "GET",
                        url: "/biobrick/search/" + type[that.index - 2] + "/" + that.searchinput.val(),
                    }).done(function(data) {
                        that.biolist.empty();
                        for (var i = 0; i < data.result.length; ++i) {
                            var bio = new Biobrick(that, data.result[i]);
                            that.biolist.append(bio.view);
                        }
                    });
                } else {
                    that.biolist.empty();
                    for (var i = 0; i < that.arr.length; ++i) {
                        var bio = new Biobrick(that, that.arr[i]);
                        that.biolist.append(bio.view);
                    }
                }
            });
        }
    } else {
        var newpart = new Part(this.result);
        this.biolist.append(newpart.view);
    }
    this.inputpart.append(this.biolist);
    this.index  = (this.index + 1) % 4;
}

/**
 * @class Outputselector
 *
 * @method constructor
 *
 * @description the object help user choose output
 */
function Outputselector() {
    var that = this;
    this.outputlist = olist;
    $.ajax({
        url:"biobrick/output",
    }).done(function(data) {
        for (var i = 0; i < data["result"].length; ++i) {
            var outp = new Output(data["result"][i]);
            that.outputlist.append(outp.view);
        }
    }); 
}

/**
 * @class Logicselector
 *
 * @method constructor
 *
 * @description the object help user choose logic
 */
function Logicselector() {
    var that = this;
    this.logiclist = logiclist;
    $.ajax({
        url:"biobrick/logic",
    }).done(function(data) {
        for (var i = 0; i < data["result"].length; ++i) {
            var logic = new Logic(data["result"][i]);
            that.logiclist.append(logic.view); 
        }
    });
}

/**
 * @class Recommend
 *
 * @method constructor
 *
 * @description when user submit the truth table data of a circuit, display recommend logicsArr
 *
 * @param {data} the logics data got from server
 */
function Recommend(data) {
    var that = this;
    this.data = data;
    this.index = 0;
    this.view = $("#recommend");
    this.logiclist = $("#recommendlogics");
    this.steps = $("#logic-steps");
    this.steps.empty();
    this.result = new Array();
    this.confirmbut = this.view.find(".actions");
    for (var i = 0; i < this.data.length; ++i) {
        var newstep = step.clone(true);
        newstep.append("Logic " + (1 + i));
        newstep.addClass("disabled");
        this.steps.append(newstep);
    }
    var newstep = step.clone(true);
    newstep.append("Complete");
    newstep.addClass("disabled");
    this.steps.append(newstep);
    this.currentstep = this.steps.children().first();
    this.nextstep();
    this.view.modal('setting', 'closable', false).modal("show");
    this.confirmbut.hide();
    this.confirmbut.click(function() {
        for (var i = 0; i < that.result.length; ++i) {
            var newLogic = new Logic(that.result[i]);
            newLogic.littleview.replaceAll(currentcircuit.outputsArr[i].logicview);
            currentcircuit.outputsArr[i].logicview = newLogic.littleview;
            currentcircuit.outputsArr[i].logic = newLogic;
            currentcircuit.logicsArr[i] = newLogic;
        }
        currentcircuit.view.find(".ui.checkbox.mode").checkbox("enable");
    });
    this.steps.children().click(function() {
        var index = $(this).parent().children().index($(this));
        if (index < that.index) {
            that.confirmbut.hide();
            that.index = index;
            that.result.length = index;
            var step = $(this);
            that.currentstep = step;
            step = step.next();
            while (index <= that.data.length) {
                step.removeClass("active");
                step.addClass("disabled");
                step = step.next();
                ++index;
            }
            that.nextstep();
        }
    });
}

/**
 * @class Recommend
 *
 * @method nextstep
 *
 * @description when user choose an logic
 */
Recommend.prototype.nextstep = function() {
    this.logiclist.empty();
    if (this.index > 0) {
        this.currentstep.prev().removeClass("active");
    }
    this.currentstep.removeClass("disabled");
    this.currentstep.addClass("active");
    if (this.index < this.data.length) {
        for (var i = 0; i < this.data[this.index].length; ++i) {
            var newlogic = new Logicitem(this.data[this.index][i], this);
            this.logiclist.append(newlogic.view);
        }
    } else {
        for (var i = 0; i < this.result.length; ++i) {
            var newlogic = new Logicitem(this.result[i], this);
            newlogic.view.unbind("click");
            this.logiclist.append(newlogic.view);
        }
        this.confirmbut.show();
    }
    ++this.index;
    this.currentstep = this.currentstep.next();
}


/**
 * @class Logicitem
 *
 * @method constructor
 *
 * @description item object list in recommend
 */
function Logicitem(data, parent) {
    var that = this;
    this.view = logic.clone(true);
    this.data = data;
    this.view.find("img")[0].src = "../static/images/frame/" + data.name + ".png";
    this.view.find(".label[name='name']").append(data.name);
    this.view.find(".right").append("<canvas id='recommendradar" + data.id + "' width='200' height='200'>hello</canvas>");
    var radardata = {
        labels: ["Efficiency", "Realiability", "Accessiblity", "Demand", "Specificity"],
        datasets: [
        {
            label: "Background dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [this.data.efficiency * 20, this.data.realiability * 20, this.data.accessibility * 20, this.data.demand * 20, this.data.specificity * 20]
        }
        ]
    };
    this.view.mouseenter(function() {
        window.myRadar = new Chart(document.getElementById("recommendradar" + data.id).getContext("2d")).Radar(radardata, {
            responsive: true,
            angleLineColor : "rgba(255,255,255,.5)",
            scaleLineColor: "rgba(255,255,255,.5)"
        });
    });
    this.view.click(function() {
        parent.result.push(that.data);
        parent.nextstep();
    });
}

/**
 * @class 
 *
 * @method constructor
 *
 * @description when user choose a logic of repressilator
 */
function Repressilator(data) {
    var that = this;
    this.view = repressilator;
    this.data = data;
    this.view.modal('setting', 'closable', false).modal("show");
    this.view.find("[name='clear']").unbind("click").click(function() {
        currentcircuit.clear();
        var newrepressilator = new Logic(that.data);
        currentcircuit.view.find(".ui.checkbox.mode").checkbox("enable");
        currentcircuit.view.find(".logics .items").append(newrepressilator.littleview);
        currentcircuit.logicsArr.push(newrepressilator);
        currentcircuit.disableDrop();
        currentcircuit.isRepSelected = true;
        that.view.modal("hide");
    });
}


/**
 * @class Toggletwo
 *
 * @method constructor
 *
 * @description when user choose the logic of toggle switch 2
 */
function Toggletwo(data, index, container) {
    var that = this;
    this.data = data;
    this.view = toggletwo;
    this.view.modal('setting', 'closable', false).modal("show");
    this.view.find("[name='clear']").unbind("click").click(function() {
        var newtoggle = new Logic(that.data);
        for (var i = 0; i < index; ++i) {
            currentcircuit.deleteOutput(currentcircuit.outputsArr[i]);
        }
        newtoggle.littleview.replaceAll(container);
        currentcircuit.logicsArr.length = 0;
        currentcircuit.logicsArr.push(newtoggle);
        var newoutputcontainer = outputcontainer.clone(true);
        currentcircuit.view.find(".outputs .items").append(outputcontainer);
        currentcircuit.isTogSwiTwoSelected = true;
        currentcircuit.view.find(".outputs .items").droppable({disabled: true});
        that.view.modal("hide");
    });
}


/**
 * @function clone
 *
 * @description deep copy an object
 */
function clone(Obj) {
    var buf;
    if (Obj instanceof Array) {   
        buf = [];
        var i = Obj.length;   
        while (i--) {   
            buf[i] = clone(Obj[i]);   
        }   
        return buf;
    }else if (Obj instanceof Object){   
        buf = {};
        for (var k in Obj) {
            buf[k] = clone(Obj[k]);   
        }   
        return buf;   
    }else{   
        return Obj;   
    }   
}

// Hide the view template
$("#template").hide();

// Add circuit
$("#addCircuit").unbind('click').click(function() {
    addCircuit();
});

/**
 * @function addCircuit
 *
 * @description add a circuit when the page load or user click the add button
 */
function addCircuit() {
    if (circuitCounter < MAXCIRCUITSNUM) {
        circuitNum = 1;
        ++circuitCounter;
        while (circuitFlag[circuitNum - 1]) {
            ++circuitNum;
        }
        circuitFlag[circuitNum - 1] = true;
        var newCircuit = new Circuit();
        currentcircuit = newCircuit;
        circuitsArr[circuitNum - 1] = newCircuit;
        var newli = $("#template").find('li').clone(true);
        newli.find("a").attr('href', "#circuit" + circuitNum).append("Circuit " + circuitNum);
        circuits.append(newCircuit.view);
        $("#circuits>ul").append(newli);
        circuits.tabs("refresh");
        circuits.tabs({active: circuitCounter - 1});
    }
    if (circuitCounter == MAXCIRCUITSNUM) {
        $("#addCircuit").addClass("disabled").hide();
    }
}

/**
 * @description when a tab is activate, change the current circuit
 */
circuits.tabs({
    activate: function(event, ui) {
        var panelId = ui.newPanel.attr("id");
        currentcircuit = circuitsArr[parseInt(panelId.charAt(7)) - 1];
    }
});

/**
 * @description remove a circuit
 */
$("i.deletecircuit").unbind("click").click(function() {
    if (circuitCounter == MAXCIRCUITSNUM) {
        $("#addCircuit").removeClass("disabled").show();
    }
    var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
    $( "#" + panelId ).remove();
    circuitNum = parseInt(panelId.charAt(7));
    //circuitsArr.splice(panelindex - 1, 1);
    circuitsArr[circuitNum - 1] = null;
    circuitFlag[circuitNum - 1] = false;
    --circuitCounter;
    circuits.tabs( "refresh" );
});

// Right Selector
$(".trigger-right").click(function() {
    var right = $("#right-container").css("right");


    if (parseInt(right) == 0) {
        $("#right-container").css({
            right: '-455px'
        });

        $(".circuit").animate({
            left: '0px'
        }, 1000);
        $("#right-container .trigger-right > i").removeClass("right").addClass("left");
    } else {
        $("#right-container").css({
            right: '0px'
        });

        if (!addInputFlag) {
            $(".circuit").animate({
                left: '-300px'
            }, 1000);
        }
        $("#right-container .trigger-right > i").removeClass("left").addClass("right");
    }
});

// Right selector accordion
$(".accordion").accordion();

$("#addInput").click(function() {
    $(".circuit").animate({
        left: '0px'
    }, 1000);
    addInputFlag = true;
});

$("#addOutput").click(function() {
    $(".circuit").animate({
        left: '-300px'
    }, 1000);
    addInputFlag = false;
});

$("#designframe").click(function() {
    $(".circuit").animate({
        left: '-300px'
    });
    addInputFlag = false;
});

// init function
$(document).ready(function() {
    $("#right-container").show();

    // if sessionStorage has circuit data, recover it
    if (sessionStorage.getItem("viewdata")) {
        var viewdata = JSON.parse(sessionStorage.getItem("viewdata"));
        for (var i = 0; i < viewdata.length; ++i) {
            circuitCounter++;
            circuitNum = circuitCounter;
            var newCircuit = new Circuit();
            circuitFlag[i] = true;
            circuitsArr[i] = newCircuit;
            var newli = $("#template").find('li').clone(true);
            newli.find("a").attr('href', "#circuit" + circuitCounter).append("Circuit " + circuitCounter);
            circuits.append(newCircuit.view);
            $("#circuits>ul").append(newli);
            currentcircuit = newCircuit;
            newCircuit.recover(viewdata[i]);
            circuits.tabs("refresh");
            circuits.tabs({active: circuitCounter - 1});
        }
        if (circuitCounter == MAXCIRCUITSNUM) {
            $("#addCircuit").addClass("disabled").hide();
        }
    } else {
        addCircuit();
    }

    // Init right selector
    inputselector = new Inputselector();
    outputselect = new Outputselector();
    logicselector = new Logicselector();
});

// When user complete design
$("#upload").click(function() {
    var circuits = new Array();
    var details = new Array();
    var viewdata = new Array();
    var message = "Error: You have not design any circuit";
    var valid = false;

    // Judge whether circuits are valid, and write error message
    for (var i = 0; i < circuitsArr.length; ++i) {
        if (circuitFlag[i]) {
            valid = true;
            message = "";
            if (circuitsArr[i].logicsArr.length == 0) {
                message += "Error: Circuit " + (i + 1) + " is empty.";
                valid = false;
                break;
            } else if (!circuitsArr[i].isRepSelected) {
                if (circuitsArr[i].partsArr.length == 0) {
                    message += "Error: No input in circuit " + (i + 1) + ".<br>";
                    valid = false;
                } else if (circuitsArr[i].isTwoInput && circuitsArr[i].partsArr.length == 1) {
                    message += "Error: Some logics in circuit " + (i + 1) + " require 2 inputs.<br>";
                    valid = false;
                }
                if (circuitsArr[i].outputsArr.length == 0) {
                    message += "Error: No output in circuit " + (i + 1) + ".<br>";
                    valid = false;
                } else if (circuitsArr[i].isTogSwiTwoSelected && circuitsArr[i].outputsArr.length == 1) {
                    message += "Error: Toogle switch 2 in circuit " + (i + 1) + " require 2 inputs.<br>";
                    valid = false;
                }
                for (var j = 0; j < circuitsArr[i].logicsArr.length; ++j) {
                    if (circuitsArr[i].logicsArr[j] == null) {
                        message += "Error: The number of logics does not equal to that of outputs in circuit " + (i + 1);
                        valid = false;
                        break;
                    }
                }
            }
            if (valid) {
                circuits.push(circuitsArr[i].uploaddata());
                details.push(circuitsArr[i].getDetail());
                viewdata.push(circuitsArr[i].saveData());
            } else {
                break;
            }
        }
    }

    // If circuits are valid, save the data and jump to display page,
    // if not, print error message
    if (valid) {
        sessionStorage.setItem("circuits", JSON.stringify(circuits));
        sessionStorage.setItem("preprocess", JSON.stringify(details));
        sessionStorage.setItem("viewdata", JSON.stringify(viewdata));
        window.location.href = "/shape";
    } else {
        warnmessage.html(message);
        warning.modal("show");
    }
});
