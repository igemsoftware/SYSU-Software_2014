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
    obj.view.find(".truthcolumn").each(function() {
        $(this).append(truthele.clone(true).checkbox());
    });
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

$(".trigger-right").click(function() {
    var right = $("#right-container").css("right");

    //$("#left-container").css("left", "-270px");

    if (parseInt(right) == 0) {
        $("#right-container").css({
            right: '-455px'
        });

        $("#operate").css({
            left: '0px'
        });
    } else {
        $("#right-container").css({
            right: '0px'
        });

        $("#operate").css({
            left: '-455px'
        });
    }
});

$(".accordion").accordion();

var data = new Array();
for (var i = 0; i < 20; ++i) {
    var bio = {"type": "XXXX", "name": "XXXX", "id": i};
    data.push(bio);
}

var input = $("#template .item.input");
var promoter = $("#template .item.promoter");
var receptor = $("#template .item.receptor");
var output = $("#template .item.output");

for (var i = 0; i < data.length; ++i) {
    $("#biolist").append(input.clone());
}

$("#biolist").unbind("selected");

$("#right-container .input").draggable({
    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
    revert: "invalid", // when not dropped, the item will revert back to its initial position
    containment: "document",
    helper: "clone",
    cursor: "move"
});

$("#right-container .output").draggable({
    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
    revert: "invalid", // when not dropped, the item will revert back to its initial position
    containment: "document",
    helper: "clone",
    cursor: "move"
});

/*$("#circuits").droppable({
    accetp: "#right-container .output",
    //activeClass: "ui-state-highlight",
    drop: function(event, ui) {
        //currentcircuit.addOutput();
        if (ui.draggable.attr("name") == "input") {
            currentcircuit.addPart();
        } else if (ui.draggable.attr("name") == "output") {
            currentcircuit.addOutput();
        }
    }
});*/

$("#right-container .input").bind("click", function() {
    $("#chose-steps > .step.first").removeClass("active");
    $("#chose-steps > .step.second").addClass("active");
    $("#biolist").empty();
    for (var i = 0; i < data.length; ++i) {
        var pro = promoter.clone();
        $("#biolist").append(pro);
        pro.click(function() {
            $("#chose-steps > .step.second").removeClass("active");
            $("#chose-steps > .step.third").addClass("active");
            $("#biolist").empty();
            for (var i = 0; i < data.length; ++i) { 
                var rec = receptor.clone();
                $("#biolist").append(rec);
                rec.click(function() {
                    $("#chose-steps > .step.third").removeClass("active");
                    $("#chose-steps > .step.fourth").addClass("active");
                    $("#biolist").empty();
                });
            }
        });
    }    
});
