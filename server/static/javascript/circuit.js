// Global variable
var MAXCIRCUITSNUM = 3;
var MAXPARTSNUM = 2;
var MAXOUTPUTSNUM = 3;
var MAXTRUTHABLEROWNUM = 4;

// view template
var circuit = $("#circuit");
var part = $("#template .part");
var output = $("#template .output");
var bioselector = $(".biobrickselector");
var truthele = $("#template .truthele");

function Circuit() {
    this.view = circuit.clone(true);
    this.view.attr("id", "circuit" + circuitNum);
    this.truthrownum = 0;
    this.partsArr = new Array();
    this.outputsArr = new Array();
    this.addPart();
    this.addOutput();
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
}

Circuit.prototype.addPart = function() {
    var newPart = new Part(this.truthrownum);
    this.partsArr.push(newPart);
    this.view.find(".parts").append(newPart.view);
}

Circuit.prototype.addOutput = function() {
    var newOutput = new Output(this.truthrownum);
    this.outputsArr.push(newOutput);
    this.view.find(".outputs").append(newOutput.view);
}

function Part(truthrownum) {
    var that = this;
    this.view = part.clone(true);
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
    for (var i = 0; i < truthrownum; ++i) {
        addTruthTableRow(this);
    }
}

function addTruthTableRow(obj) {
    obj.view.find(".truthcolumn").append(truthele.clone(true));
}

function Output(truthrownum)  {
    this.view = output.clone(true);
    this.view.find(".element").click(function(){
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
    });
    for (var i = 0; i < truthrownum; ++i) {
        addTruthTableRow(this);
    }
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
        var newli = $("#template").find('li').clone(true);
        newli.find("a").attr('href', "#circuit" + circuitNum).append("Circuits" + circuitNum);
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
