// Global variable
var MAXCIRCUITSNUM = 3;
var MAXPARTSNUM = 2;
var MAXOUTPUTSNUM;

// view template
var circuit = $("#circuit");
var part = $("#template .part");
var output = $("#template .output");

function Circuit() {
    this.view = circuit.clone(true);
    this.view.attr("id", "circuit" + circuitNum);
    //this.view = $("#" + viewid);
    this.partsArr = new Array();
    this.outputsArr = new Array();
    this.addPart();
    this.addOutput();
    this.view.find("[name='addPart']").click(function(){
        //alert("test");
        Circuit.addPart();
    });
}

Circuit.prototype.addPart = function() {
    var newPart = new Part();
    this.partsArr.push(newPart);
    this.view.find(".parts").append(newPart.view);
}

Circuit.prototype.addOutput = function() {
    var newOutput = new Output();
    this.outputsArr.push(newOutput);
    this.view.find(".outputs").append(newOutput.view);
}

function Part() {
    this.view = part.clone(true);
}

function Output()  {
    this.view = output.clone(true);
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
        while (circuitFlag[circuitNum - 1])
            ++circuitNum;
        circuitFlag[circuitNum - 1] = true;
        var newCircuit = new Circuit();
        //var newCircuit = $("#circuit").clone(true);
        var newli = $("#template").find('li').clone(true);
        //newCircuit.attr('id', "circuit" + circuitNum);
        newli.find("a").attr('href', "#circuit" + circuitNum).append("Circuits" + circuitNum);
        circuits.append(newCircuit.view);
        $("#circuits>ul").append(newli);
        circuits.tabs("refresh");
        circuits.tabs({active: circuitCounter - 1});
    }
    if (circuitCounter == MAXCIRCUITSNUM)
        $("#addCircuit").addClass("disabled");
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

// open biobrick selector
$(".ui.modal").modal();
$("#circuits img").unbind("click").click(function() {
    $(".biobrickselector").modal("show");
});
