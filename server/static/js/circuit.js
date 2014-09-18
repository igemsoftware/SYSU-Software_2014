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
var frame = $(".frame");
var recommend = $(".recommend");
var currentcircuit;

function Circuit() {
    this.view = circuit.clone(true);
    this.view.attr("id", "circuit" + circuitNum);
    this.truthrownum = 0;
    this.partsArr = new Array();
    this.outputsArr = new Array();
    //this.addPart();
    //this.addOutput();
    var that = this;
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
        if (that.truthrownum < MAXTRUTHABLEROWNUM) {
            addTruthTableRow(that);
            ++that.truthrownum;
        }
        if (that.truthrownum == MAXTRUTHABLEROWNUM) {
            $(this).addClass("disabled");
        }
    });
    this.view.find("[name='frame']").click(function() {
        frame.modal("show");
    });
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

Circuit.prototype.addPart = function() {
    var newPart = new Part(this.truthrownum);
    this.partsArr.push(newPart);
    this.view.find(".parts .items").append(newPart.view);
}

Circuit.prototype.addOutput = function() {
    var newOutput = new Output(this.truthrownum);
    this.outputsArr.push(newOutput);
    this.view.find(".outputs").append(newOutput.view);
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
            currentcircuit.addPart();
        }
    });
    /*for (var i = 0; i < truthrownum; ++i) {
      addTruthTableRow(this);
      }*/
}

function addTruthTableRow(obj) {
    obj.view.find(".truthcolumn").each(function() {
        $(this).append(truthele.clone(true).checkbox());
    });
}

function Output()  {
    var that = this;
    this.view = output.clone(true);
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
        cursor: "move"
    });

    $("#circuits .outputs .items").droppable({
        accept: that.view,
        activeClass: "ui-state-highlight",
        drop: function( event, ui ) {
            currentcircuit.addOutput();
        }
    });
    /*for (var i = 0; i < truthrownum; ++i) {
        addTruthTableRow(this);
    }*/
}

//init
$("#template").hide();
window.onload = addCircuit;

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

$("span.ui-icon-close").unbind("click").click(function() {
    if (circuitCounter == MAXCIRCUITSNUM) {
        $("#addCircuit").removeClass("disabled");
    }
    var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
    $( "#" + panelId ).remove();
    circuitNum = parseInt(panelId.charAt(7));
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

        $(".circuit").css({
            left: '0px'
        });
    } else {
        $("#right-container").css({
            right: '0px'
        });

        if (!addInputFlag) {
            $(".circuit").css({
                left: '-455px'
            });
        }
    }
});

$(".accordion").accordion();

$("#addInput").click(function() {
    $(".circuit").css({
        left: '0px'
    });
    addInputFlag = true;
});

/*$("#addOutput").click(function() {
    $(".circuit").css({
        left: '-455px'
    });
    addInputFlag = false;
});*/

$("#designframe").click(function() {
    $(".circuit").css({
        left: '-455px'
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

var inputselector = new Inputselector();


// Output Selector

function Outputselector() {
    this.outputlist = $("#outputlist");
    for (var i = 0; i < data[3].length; ++i) {
        var op = new Part();
        this.outputlist.append(op.view);
    }
}

var outputselect = new Outputselector();
// Design Frame Selector
