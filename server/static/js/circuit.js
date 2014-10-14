// Global variable
var MAXCIRCUITSNUM = 3;
var MAXPARTSNUM = 2;
var MAXOUTPUTSNUM = 3;
var MAXTRUTHABLEROWNUM = 4;

// view template
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
var currentcircuit;
var circuitsArr = [];

function Circuit() {
    var that = this;
    this.view = circuit.clone(true);
    this.view.circuit = this;
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
    //this.addPart();
    //this.addOutput();
    this.view.find(".ui.checkbox.mode").checkbox({
        "onEnable": function() {
            /*$(".logic").css({display: "block"});
              $(".logic").css({width: "25%"});
              $(".truthtable").css({width: "0"});
              $(".truthtable").css({display: "none"});*/
            that.view.find(".truthtable").hide("slow");
            that.view.find(".logics").show("slow");
        },
        "onDisable": function() {
            /*$(".truthtable").css({display: "block"});
              $(".truthtable").css({width: "25%"});
              $(".logic").css({width: "0"});
              $(".logic").css({display: "none"});*/
            that.view.find(".logics").hide("slow");    
            that.view.find(".truthtable").show("slow");
        }
    });
    this.view.find("[name='addPart']").click(function() {
        if (that.partsArr.length < MAXPARTSNUM) {
            that.addPart();
        }
        if (that.partsArr.length == MAXPARTSNUM) {
            $(this).addClass("disabled");
        }
    });
    this.view.find("[name='addOutput']").click(function() {
        if (that.outputsArr.length < MAXOUTPUTSNUM) {
            that.addOutput();
        }
        if (that.outputsArr.length == MAXOUTPUTSNUM) {
            $(this).addClass("disabled");
        }
    });
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
    /*this.view.find("[name='frame']").click(function() {
      frame.modal("show");
      });*/
    this.view.find("[name='submit']").click(function() {
        //sessionStorage.setItem("data", JSON.stringify(currentcircuit.getData()));
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

Circuit.prototype.addPart = function(newPart) {
    //var newPart = new Part(this.truthrownum);
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

Circuit.prototype.deletePart = function(delpart) {
    //this.view.find(".parts .items").remove(this.partsArr[index].view);
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

Circuit.prototype.updateTruthTable = function() {
    this.truthtable = this.view.find(".truthtable table > thead > tr > th").first().children().length != 0 ||
        this.view.find(".truthtable table > thead > tr > th").last().children().length != 0;
    if (!this.truthtable) {
        this.view.find(".truthtable .table").hide("slow");
        this.view.find("[name='addTruthTableRow']").addClass("disabled");
        this.view.find("[name='deleteTruthTableRow']").addClass("disabled");
    }
}

Circuit.prototype.addOutput = function(newOutput) {
    //var newOutput = new Output(this.truthrownum);
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
            that.outputsArr.slice(index, 1);
        } else {
            that.deleteOutput(newOutput);
        }
    });
    newOutput.littleview.find("img[name='output']").popup();
}

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

Circuit.prototype.deleteTruthTableRow = function() {
    this.view.find(".truthtable table > tbody > tr").last().remove();
}

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
        console.log(data);
        result = data;
    });
    return result;
}

Circuit.prototype.disableDrop = function() {
    this.view.find(".items").droppable({disabled: true});
    console.log("success");
}

Circuit.prototype.enableDrop = function() {
    this.view.find(".items").droppable({disabled: false});
}

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
                } else {
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
                warnmessage.html("Inputs is enough!");
                warning.modal("show");
            }
        }
    });
}

Part.prototype.getId = function() {
    return {'id': this.data.input.id, 'promoter_id': this.data.promoter.id, 'receptor_id': this.data.receptor.id};
}

function Output(data)  {
    var that = this;
    this.data = data;
    this.view = biobrick.clone(true);
    this.view.find("img")[0].src = "../static/images/circuit/outputfinal.png";
    this.view.find("[name='id']").append(this.data.part_id);
    this.view.find("[name='name']").append(this.data.name);
    this.view.find("[name='sname']").append(this.data.short_name);
    this.view.find("[name='sdesc']").append(this.data.description);
    this.littleview = littleoutput.clone(true);
    this.littleview.find("[name='name']").append(this.data.name);
    this.littleview.find("img[name='output']").attr("data-html", "<div class='ui ribbon label'>Part_id</div><p name='id'>" + this.data.id + "</p><div class='ui ribbon label'>Part_short_name</div><p name='sname'>" + this.data.short_name + "</p><div class='ui ribbon label'>Part_short_desc</div><p name='sdesc'>" + this.data.description + "</p>");
    this.logicview = logiccontainer.clone(true);
    this.logic = null;
    /*this.view.find(".element").click(function(){
      var type = this.getAttribute("name");
      var title = "Select Output";
      var statue = "false";
      $.ajax({
      url:"biobrick/" + type,
      }).done(function(data) {
      statue = "success";
      }); 
      bioselector.find(".header").html(title);
      bioselector.find(".content").html(statue);
      bioselector.modal("show");
      });*/ 
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

    /*currentcircuit.view.find(".outputs .items").droppable({
      accept: that.view,
      activeClass: "ui-state-highlight",
      drop: function( event, ui ) {
      currentcircuit.addOutput(that);
      }
      });*/
    /*for (var i = 0; i < truthrownum; ++i) {
      addTruthTableRow(this);
      }*/
}

Output.prototype.getId = function() {
    return this.data.id;
}

//init
$("#template").hide();
// Add circuit
var circuitNum = 0;
var circuitCounter = 0;
var circuitFlag = new Array(false, false, false);

var circuits = $("#circuits").tabs();

$("#addCircuit").unbind('click').click(function() {
    addCircuit();
});

function addCircuit() {
    if (sessionStorage.getItem("data") != undefined) {
        console.log(sessionStorage.getItem("data"));
        var data = JSON.parse(sessionStorage.getItem("data"));
        console.log(data);
    }
    if (circuitCounter < MAXCIRCUITSNUM) {
        circuitNum = 1;
        ++circuitCounter;
        while (circuitFlag[circuitNum - 1]) {
            ++circuitNum;
        }
        circuitFlag[circuitNum - 1] = true;
        var newCircuit = new Circuit();
        currentcircuit = newCircuit;
        circuitsArr.push(newCircuit);
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

circuits.tabs({
    activate: function(event, ui) {
        var panelindex = ui.newTab.parent().children().index(ui.newTab);
        currentcircuit = circuitsArr[panelindex - 1];
    }
});

$("i.deletecircuit").unbind("click").click(function() {
    if (circuitCounter == MAXCIRCUITSNUM) {
        $("#addCircuit").removeClass("disabled").show();
    }
    var panelindex = $( this ).closest( "li" ).parent().children().index($( this ).closest( "li" ));
    var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
    $( "#" + panelId ).remove();
    circuitNum = parseInt(panelId.charAt(7));
    circuitsArr.splice(panelindex - 1, 1);
    circuitFlag[circuitNum - 1] = false;
    --circuitCounter;
    circuits.tabs( "refresh" );
});

circuits.bind( "keyup", function( event ) {
    if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
        if (circuitCounter == MAXCIRCUITSNUM) {
            $("#addCircuit").removeClass("disabled");
        }
        var panelindex = $( this ).closest( "li" ).parent().children().index($( this ).closest( "li" ));
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        circuitNum = parseInt(panelId.charAt(7));
        circuitsArr.splice(panelindex - 1, 1);
        circuitFlag[circuitNum - 1] = false;
        --circuitCounter;
        circuits.tabs( "refresh" );
    }
});

$(".content").selectable();
//$('.ui.checkbox').checkbox();


// Radar
/*var radarChartData = {
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
  data: [0, 0, 0, 0, 0]
  }
  ]
  };*/

var addInputFlag = true;
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

var data = new Array();

data[0] = new Array();
for (var i = 0; i < 20; ++i) {
    var bio = {"type": "input", "name": "XXXX" + i, "id": i};
    data[0].push(bio);
}

data[1] = new Array();
for (var i = 0; i < 20; ++i) {
    var bio = {"type": "promoter", "name": "XXXX" + i, "id": i};
    data[1].push(bio);
}

data[2] = new Array();
for (var i = 0; i < 20; ++i) {
    var bio = {"type": "receptor", "name": "XXXX" + i, "id": i};
    data[2].push(bio);
}

data[3] = new Array();
for (var i = 0; i < 20; ++i) {
    var bio = {"type": "output", "name": "XXXX" + i, "id": i};
    data[3].push(bio);
}


var biobrick = $("#template .item.biobrick");
var input = $("#template .item.input");
var promoter = $("#template .item.promoter");
var receptor = $("#template .item.receptor");
var biolist = $("#biolist");
var olist = $("#outputlist");
var logiclist = $("#logiclist");
var logic = $("#template .item.logic");
var littlelogic = $("#template .item.littlelogic");


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
}

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
        var type;
        if (parent.index == 3) {
            type = "input";
        } else if (parent.index == 1) {
            type = "suggest/promoters?input_id=" + data.id;
        } else if (parent.index == 2) {
            type = "suggest/receptors?input_id=" + parent.result["input"].id + "&promoter_id=" + data.id;
        }
        $.ajax({
            url:"biobrick/" + type,
        }).done(function(data) {
            parent.arr = data["result"];
            parent.nextstep();
        });
    });
}

//var inputselector = new Inputselector();


// Output Selector
function Logic(data) {
    var that = this;
    this.data = data; 
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
    this.view.mouseenter(function() {
        /*window.myRadar = */new Chart(document.getElementById("radar" + data.id).getContext("2d")).Radar(radardata, {
            responsive: true,
            angleLineColor : "rgba(255,255,255,.5)",
            scaleLineColor: "rgba(255,255,255,.5)"
        });
    });
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
    this.littleview.find(".delete").click(function() {
        var index = $(this).parent().parent().children().index($(this).parent());
        if (that.data.n_inputs == 1) {
            currentcircuit.isSingleInput = false;
        } else {
            currentcircuit.isTwoInput = false;
        }
        if (that.data.logic_type == "repressilator") {
            $(this).parent().remove();
            currentcircuit.outputsArr.pop();
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

Logic.prototype.getId = function() {
    return this.data.id;
}

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

function Logicselector() {
    var that = this;
    this.logiclist = logiclist;
    $.ajax({
        url:"biobrick/logic",
    }).done(function(data) {
        console.log(data);
        for (var i = 0; i < data["result"].length; ++i) {
            var logic = new Logic(data["result"][i]);
            that.logiclist.append(logic.view); 
        }
    });
}

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
}

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

var inputselector;
var outputselect;
var logicselector;
$(document).ready(function() {
    addCircuit();
    inputselector = new Inputselector();
    outputselect = new Outputselector();
    logicselector = new Logicselector();
});

$("#upload").click(function() {
    var circuits = new Array();
    var details = new Array();
    var message = "Error: You have not design any circuit";
    var valid = false;
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
                        message += "Error: The number of logics does not equal to that of outputs in ircuit " + (i + 1);
                valid = false;
                        break;
                    }
                }
            } 
            if (valid) {
                circuits.push(circuitsArr[i].uploaddata());
                details.push(circuitsArr[i].getDetail());
            } else {
                break;
            }
        }
    }
    if (valid) {
        sessionStorage.setItem("circuits", JSON.stringify(circuits));
        sessionStorage.setItem("preprocess", JSON.stringify(details));
        window.location.href = "/shape";
    } else {
        warnmessage.html(message);
        warning.modal("show");
    }
});
