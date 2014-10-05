// Global variable
var MAXCIRCUITSNUM = 3;
var MAXPARTSNUM = 2;
var MAXOUTPUTSNUM = 3;
var MAXTRUTHABLEROWNUM = 4;

// view template
var circuit = $("#circuit");
var part = $("#template .part");
var output = $("#template .item.output");
var littleoutput = $("#template .item.littleoutput")
var bioselector = $(".biobrickselector");
var truthele = $("#template .truthele");
var logiccontainer = $("#template .logiccontainer");
var frame = $(".frame");
var recommend = $(".recommend");
var closeicon = $("span.ui-icon.ui-icon-close.delete");
var step = $("#template .ui.step");
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
    //this.addPart();
    //this.addOutput();
    this.view.find(".ui.checkbox.mode").checkbox({
        "onEnable": function() {
            /*$(".logic").css({display: "block"});
              $(".logic").css({width: "25%"});
              $(".truthtable").css({width: "0"});
              $(".truthtable").css({display: "none"});*/
            that.view.find(".truthtable").hide("slow");
            that.view.find(".logic").show("slow");
        },
        "onDisable": function() {
            /*$(".truthtable").css({display: "block"});
              $(".truthtable").css({width: "25%"});
              $(".logic").css({width: "0"});
              $(".logic").css({display: "none"});*/
            that.view.find(".logic").hide("slow");    
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
        //recommend.modal("show");
        window.myRadar = new Chart(document.getElementById("radar1").getContext("2d")).Radar(radarChartData, {
          responsive: true
          });
        /*recommend.find("#radar").bind("click", function(evt) {
          var index = window.myRadar.indexOf(window.myRadar.eachPoints, window.myRadar.getPointsAtEvent(evt)[0]);
          alert(index);
          });*/
        console.log(JSON.stringify(currentcircuit.getData()));
        $.ajax({
            type: "POST",
            url:"/circuit/schemes",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(currentcircuit.getData())
        }).done(function(data) {
            var recommend = new Recommend();
        });
    });
}

Circuit.prototype.addPart = function(newPart) {
    //var newPart = new Part(this.truthrownum);
    newPart.view.draggable({disabled: "true"});
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
    var that = this;
    newdelete.click(function() {
        that.deletePart(newPart);
    });
}

Circuit.prototype.deletePart = function(delpart) {
    //this.view.find(".parts .items").remove(this.partsArr[index].view);
    var index = this.partsArr.indexOf(delpart);
    this.partsArr[index].view.remove();
    this.view.find(".truthtable table > thead > tr > th").first().children().last().remove();
    var row = this.view.find(".truthtable table > tbody > tr").first();
    for (var i = 0; i < this.truthrownum; ++i) {
        row.children("td").first().children().get(index).remove();
        row = row.next();
    }
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
    this.view.find(".logic .items").append(newOutput.logicview);
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
    newOutput.littleview.find(".delete").click(function() {
        that.deleteOutput(newOutput);
    });
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
    this.outputsArr.splice(index, 1);
    this.updateTruthTable();
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
    var schemes = {"inputs":[], "outputs":[], "truth_table":[]};
    for (var i = 0; i < this.partsArr.length; ++i) {
        schemes.inputs.push(this.partsArr[i].getId());
    }
    for (var i = 0; i < this.outputsArr.length; ++i) {
        schemes.outputs.push(this.outputsArr[i].getId());
    }
    for (var i = 0; i < this.truthrownum; ++i) {
        var truthtablerowdata = {"inputs":[], "outputs": []};
        var inputtruth = this.view.find(".truthtable table > tbody").children().first().children().first().children().first();
        var outputtruth = this.view.find(".truthtable table > tbody").children().last().children().first().children().first();
        for (var j = 0; j < this.partsArr.length; ++j) {
            //console.log(this.view.find(".truthtable > table > tbody > tr").get(i).children().first());
            //truthtablerowdata.inputs.push(inputtruth);
            /*inputtruth.children().first().checkbox({
              "onDisable": function() {
              alert("nn");
              state = false;
              }, 
              "onEnable": function() {
              alert("nn");
              state =  true;
              } 
              })*/
            //console.log(inputtruth.children().first().children().first().checked);
            truthtablerowdata.inputs.push(this.view.find("form [name='truth']")[i * this.partsArr.length + j].checked);
            //truthtablerowdata.inputs.push(true);
            //console.log(this.view.find(".truthtable > table > tbody > tr").get(i).children().first().children().get(j).children("input"));
            //console.log(this.view.find("form [name='truth']")[j].checked);
        }
        for (var j = 0; j < this.outputsArr.length; ++j) {
            //truthtablerowdata.outputs.push(this.view.find(".truthtable > table > tbody > tr").get(i).children().last().children().get(j).children("input").checked());
            truthtablerowdata.outputs.push(this.view.find("form [name='truth']")[(i + 1) * this.partsArr.length + i * this.outputsArr.length + j].checked);
        }
        schemes.truth_table.push(truthtablerowdata);
    }
    return schemes;
}

function Part(data) {
    var that = this;
    this.view = part.clone(true);
    this.data = data;
    this.view.find(".label[name='input']").append(this.data.input.name);
    this.view.find(".label[name='promoter']").append(this.data.promoter.name);
    this.view.find(".label[name='receptor']").append(this.data.receptor.name);
    this.view.draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document",
        helper: "clone",
        cursor: "move",
        start: function(event, ui) {
            if (currentcircuit.partsArr.length < MAXPARTSNUM) {
                currentcircuit.view.find(".parts .items").droppable({
                    disabled: false,
                    accept: that.view,
                    activeClass: "ui-state-highlight",
                    drop: function( event, ui ) {
                        inputselector.nextstep();
                        currentcircuit.addPart(that);
                    }
                });
            } else {
                currentcircuit.view.find(".parts .items").droppable({disabled:true});
            }
        }
    });
    /*this.view.find(".element").click(function(){
      var type = this.getAttribute("name");
      var title;
      var statue = "false";
      $.ajax({
      url:"biobrick/" + type,
      }).done(function(data) {
      statue = "success";
      });
      if ("input" == type) {
      title = "Select Input";
      } else if ("promoter" == type) {
      title = "Select Promoter";
      } else {
      title = "Select Receptor";
      }
      bioselector.find(".header").html(title);
      bioselector.find(".content").html(statue);
      bioselector.modal("show");
      });*/

    /*for (var i = 0; i < truthrownum; ++i) {
      addTruthTableRow(this);
      }*/
    this.view.find(".element").popup({});
}

Part.prototype.getId = function() {
    return {"id": this.data.input.id, "promoter_id": this.data.promoter.id, "receptor_id": this.data.receptor.id};
}

function Output(data)  {
    var that = this;
    this.data = data;
    this.view = biobrick.clone(true);
    this.view.find("img")[0].src = "../static/images/circuit/outputfinal.png";
    this.view.find("[name='id']").append(this.data.id);
    this.view.find("[name='name']").append(this.data.name);
    //this.view.find("[name='sname']").append();
    //this.view.find("[name='sdesc']").append();
    this.littleview = littleoutput.clone(true);
    this.littleview.find("[name='name']").append(this.data.name);
    this.logicview = logiccontainer.clone(true);
    this.logic;
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
            if (currentcircuit.outputsArr.length < MAXOUTPUTSNUM) {
                currentcircuit.view.find(".outputs .items").droppable({disabled:false});
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
var radarChartData = {
    labels: ["Efficiency", "Noise", "Accessiblity", "Demand", "Specificity"],
    datasets: [
    {
        label: "Background dataset",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: [100,100,100,100,100]
    }
    ]
};

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
            //console.log(i);
        }
        if (this.index == 1 || this.index == 2) {
            this.search.show();
            this.searchinput.keyup(function() {
                console.log(that.searchinput.val());
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
    this.view = biobrick.clone(true);
    this.view.find("img")[0].src = "../static/images/circuit/" + data.type + ".png";
    this.view.find("[name='id']").append(data.id);
    this.view.find("[name='name']").append(data.name);
    //this.view.find("[name='sname']").append();
    //this.view.find("[name='sdesc']").append();
    this.view.click(function() {
        parent.result[data.type] = data;
        var type = "promoter";
        if (parent.index == 2) {
            type = "receptor";
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
    this.view.mouseenter(function() {
        window.myRadar = new Chart(document.getElementById("radar" + data.id).getContext("2d")).Radar(radarChartData, {
                responsive: true
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
            currentcircuit.view.find(".logiccontainer").droppable({
                accept: that.view,
            activeClass: "ui-state-highlight",
            drop: function( event, ui ) {
                var index = $(this).parent().children().index($(this));
                var newLogic = new Logic(that.data);
                newLogic.littleview.replaceAll($(this));
                currentcircuit.outputsArr[index].logicview = newLogic.littleview;
                currentcircuit.outputsArr[index].logic = newLogic;
            }
            });
        }
    });
    this.littleview.find(".delete").click(function() {
        var index = $(this).parent().parent().children().index($(this).parent());
        var newview = logiccontainer.clone(true);
        newview.replaceAll($(this).parent());
        currentcircuit.outputsArr[index].logicview = newview;
        currentcircuit.outputsArr[index].logic = null;
    });
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
        for (var i = 0; i < data["result"].length; ++i) {
            var logic = new Logic(data["result"][i]);
            that.logiclist.append(logic.view);
            console.log(document.getElementById("radar" + logic.data.id));
            /*window.myRadar = new Chart(document.getElementById("radar" + logic.data.id).getContext("2d")).Radar(radarChartData, {
                responsive: true
            });*/
        }
    });
}

function Recommend(data) {
    this.data = data;
    this.index = 0;
    this.view = $("#recommend");
    this.logiclist = $("#recommendlogics");
    this.steps = $("#logic-steps");
    this.steps.empty();
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
            var newlogic = new Logicitem(this);
            this.logiclist.append(newlogic.view);
        }
    } else {
        for (var i = 0; i < this.data.length; ++i) {
            var newlogic = new Logicitem(this);
            this.logiclist.append(newlogic.view);
        }
        this.confirmbut.show();
    }
    ++this.index;
    this.currentstep = this.currentstep.next();
}

function Logicitem(parent) {
    this.view = logic.clone(true);
    this.view.click(function() {
        parent.nextstep();
    });
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
