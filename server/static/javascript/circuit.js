// Add circuit
var circuitNum = 0;

var circuits = $("#circuits");
var cTitle = $("#cTitle");
var lastCircuit = null;
var lastTitle = null;

$("#template").hide();

$("#addCircuit").unbind('click');

$("#addCircuit").click(function() {
    addCircuit();
});

function addCircuit() {
    ++circuitNum;
    var newCircuit = $("#circuit").clone(true);
    var newli = $("#template").find('.item').clone(true);
    newCircuit.attr('id', "circuit" + circuitNum);
    newli.prepend("circuit " + circuitNum);
    newli.addClass('active');
    newli.find("a").attr('href', "#circuit" + circuitNum);
    $("#addCircuit").before(newli);
    circuits.append(newCircuit);
    newCircuit.show();
    newli.show();
    if (lastCircuit != null) {
        lastCircuit.hide();
    }
    if (lastTitle != null) {
        lastTitle.removeClass("active");
    }
    lastTitle = newli;
    lastCircuit = newCircuit;
}

$("#cTitle>a").click(function() {
    $(this).
});
