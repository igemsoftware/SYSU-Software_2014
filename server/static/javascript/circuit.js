// Add circuit
var circuitNum = 0;
var circuitCounter = 0;
var circuitFlag = new Array(false, false, false);

var circuits = $("#circuits").tabs();

$("#template").hide();

$("#addCircuit").unbind('click').click(function() {
    addCircuit();
});

function addCircuit() {
    if (circuitCounter < 3) {
        circuitNum = 1;
        ++circuitCounter;
        while (circuitFlag[circuitNum - 1])
            ++circuitNum;
        circuitFlag[circuitNum - 1] = true;
        var newCircuit = $("#circuit").clone(true);
        var newli = $("#template").find('li').clone(true);
        newCircuit.attr('id', "circuit" + circuitNum);
        newli.find("a").attr('href', "#circuit" + circuitNum).append("Circuits" + circuitNum);
        circuits.append(newCircuit);
        $("#circuits>ul").append(newli);
        circuits.tabs("refresh");
        circuits.tabs({active: circuitCounter - 1});
    }
    if (circuitCounter == 3)
        $("#addCircuit").addClass("disabled");
}

$("span.ui-icon-close").unbind("click").click(function() {
    if (circuitCounter == 3) {
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
        if (circuitCounter == 3) {
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

window.onload = addCircuit;


// open biobrick selector
$(".ui.modal").modal();
$("#circuit img").unbind("click").click(function() {
    $(".biobrickselector").modal("show");
});
