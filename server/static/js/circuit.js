// Global variable
var MAXCIRCUITSNUM = 3;
var MAXPARTSNUM = 2;
var MAXOUTPUTSNUM = 3;
var MAXTRUTHABLEROWNUM = 4;

// view template
var circuit = $("#circuit");
var part = $("#template .part");
var output = $("#template .item.output");
var bioselector = $(".biobrickselector");
var truthele = $("#template .truthele");
var logiccontainer = $("#template .logiccontainer");
var frame = $(".frame");
var recommend = $(".recommend");
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
        recommend.modal("show");
        window.myRadar = new Chart(document.getElementById("radar").getContext("2d")).Radar(radarChartData, {
            responsive: true
        });
        /*recommend.find("#radar").bind("click", function(evt) {
          var index = window.myRadar.indexOf(window.myRadar.eachPoints, window.myRadar.getPointsAtEvent(evt)[0]);
          alert(index);
          });*/
    });
}

Circuit.prototype.addPart = function(newPart) {
    //var newPart = new Part(this.truthrownum);
    newPart.view.draggable({disabled: "true"});
    this.view.find(".parts .items").append(newPart.view);
    this.view.find(".truthtable > table > thead > tr > th").first().append("<th>Input" + (this.partsArr.length + 1) + "</th>");
    var row = this.view.find(".truthtable > table > tbody > tr");
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
}

Circuit.prototype.addOutput = function(newOutput) {
    //var newOutput = new Output(this.truthrownum);
    newOutput.view.draggable({disabled: "true"});
    this.view.find(".outputs .items").append(newOutput.view);
    this.view.find(".logic .items").append(newOutput.logic);
    this.view.find(".truthtable > table > thead > tr > th").last().append("<th>Output" + (this.outputsArr.length + 1) + "</th>");
    var row = this.view.find(".truthtable > table > tbody > tr").first();
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
}

Circuit.prototype.addTruthTableRow = function() {
    var tbody = this.view.find(".truthtable > table > tbody");
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
    this.view.find(".truthtable > table > tbody > tr").last().remove();
}

function Part() {
    var that = this;
    this.view = part.clone(true);
    this.view.draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document",
        helper: "clone",
        cursor: "move"
    });
    this.view.find(".element").click(function(){
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
    }); 

    $("#circuits .parts .items").droppable({
        accept: that.view,
        activeClass: "ui-state-highlight",
        drop: function( event, ui ) {
            inputselector.nextstep();
            currentcircuit.addPart(that);
        }
    });
    /*for (var i = 0; i < truthrownum; ++i) {
      addTruthTableRow(this);
      }*/
}

function Output()  {
    var that = this;
    this.view = output.clone(true);
    this.logic = logiccontainer.clone(true);
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
    /*this.view.click(function() {
        currentcircuit.addOutput(that);
    });*/
    this.view.draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document",
        helper: "clone",
        cursor: "move"
    });

    currentcircuit.view.find(".outputs .items").droppable({
        accept: that.view,
        activeClass: "ui-state-highlight",
        drop: function( event, ui ) {
            currentcircuit.addOutput(that);
        }
    });
    /*for (var i = 0; i < truthrownum; ++i) {
      addTruthTableRow(this);
      }*/
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
        $("#addCircuit").addClass("disabled");
    } 
}

circuits.tabs({
    activate: function(event, ui) {
        currentcircuit = circuitsArr[parseInt(ui.newTab.attr( "aria-controls" ).charAt(7)) - 1];
    }
});

$("span.ui-icon-close").unbind("click").click(function() {
    if (circuitCounter == MAXCIRCUITSNUM) {
        $("#addCircuit").removeClass("disabled");
    }
    var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
    $( "#" + panelId ).remove();
    circuitNum = parseInt(panelId.charAt(7));
    circuitsArr.splice(circuitNum - 1);
    circuitFlag[circuitNum - 1] = false;
    --circuitCounter;
    circuits.tabs( "refresh" );
});

circuits.bind( "keyup", function( event ) {
    if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
        if (circuitCounter == MAXCIRCUITSNUM) {
            $("#addCircuit").removeClass("disabled");
        }
        var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        circuitNum = parseInt(panelId.charAt(7));
        circuitFlag[circuitNum - 1] = false;
        --circuitCounter;
        circuits.tabs( "refresh" );
    }
});

$(".content").selectable();
//$('.ui.checkbox').checkbox();


// Radar
var radarChartData = {
    labels: ["item1", "item2", "item3", "item4", "item5"],
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
    } else {
        $("#right-container").css({
            right: '0px'
        });

        if (!addInputFlag) {
            $(".circuit").animate({
                left: '-300px'
            }, 1000);
        }
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


function Inputselector() {
    this.steps = $("#chose-steps > .step");
    this.steps.addClass("disabled");
    this.currentstep = $("#chose-steps > .first");
    this.index = 0;
    this.inputpart = $("#inputpart");
    this.nextstep();
}

Inputselector.prototype.nextstep = function() {
    this.inputpart.empty();
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
        for (var i = 0; i < data[this.index].length; ++i) {
            var bio = new Biobrick(this, data[this.index][i]);
            this.biolist.append(bio.view);
            //console.log(i);
        }
    } else {
        var newpart = new Part();
        this.biolist.append(newpart.view);
    }
    this.inputpart.append(this.biolist);
    this.index  = (this.index + 1) % 4;
}


function Biobrick(parent, data) {
    this.view = biobrick.clone(true);
    this.view.find("img")[0].src = "../static/images/circuit/" + data.type + ".png";
    this.view.click(function() {
        parent.nextstep();
    });
}

//var inputselector = new Inputselector();


// Output Selector

function Outputselector() {
    this.outputlist = olist; 
    //this.listOutput();
}

Outputselector.prototype.listOutput = function() {
    for (var i = 0; i < data[3].length; ++i) {
        var outp = new Output();
        this.outputlist.append(outp.view);
    }
}

var inputselector;
var outputselect;
$(document).ready(function() {
    addCircuit();
    inputselector = new Inputselector();
    outputselect = new Outputselector();
    outputselect.listOutput(); 
});
