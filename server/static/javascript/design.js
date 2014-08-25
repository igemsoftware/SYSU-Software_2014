// slider
$(function() {
    var $tabs = $(".main").tabs({active: 3,
        activate: function( event, ui) {
            slider.slider("value", 4 - ui.newTab.index());
        }
    }); 

    var slider = $( "#slider-vertical" ).slider({
        orientation: "vertical",
        range: "max",
        min: 0,
        max: 4,
        value: 1,
        slide: function( event, ui ) {
            $(".main").tabs({active: 4 - ui.value});
        }
    }); 


});


$(function() {
    var dialogHeight = 600, dialogWidth = 500;
    function viewRegistry() {
    }

    var dialogReceptors = $("#dialog-receptors").dialog({
        autoOpen: false,
        height: dialogHeight,
        width: dialogWidth,
        modal: true,
        buttons: {
            "View Registry" : viewRegistry(),
        "Search Biobirck" : searchBiobirck(),
        "OK" : function() {
            dialogReceptors.dialog("close");
            dialogReporters.dialog("open");
        }
        }
    });
    var dialogPromoters = $("#dialog-promoters").dialog({
        autoOpen: false,
        height: dialogHeight,
        width: dialogWidth,
        modal: true,
        buttons: {
            "View Registry" : viewRegistry(),
        "Search Biobirck" : searchBiobirck(),
        "OK": function() {
            dialogPromoters.dialog("close");
            dialogReceptors.dialog("open");
        }
        }
    });

    var dialogSignals = $("#dialog-signals").dialog({
        autoOpen: false,
        height: dialogHeight,
        width: dialogWidth,
        modal: true,
        buttons: {
            "OK" : function() {
                dialogSignals.dialog("close");
                dialogPromoters.dialog("open");
            }
        }       
    });

    $("#add-signal").on("click", function() {
        dialogSignals.dialog("open");
    });

    var dialogReporters = $("#dialog-reporters").dialog({
        autoOpen: false,
        height: dialogHeight,
        width: dialogWidth,
        modal: true
    });

    dialogReporters.dialog( "option", "buttons", [ {text: "View Registry", click: viewRegistry()}, { text: "Search Biobirck", click: function() {
        dialogReporters.dialog("close");
        showSearch();
    }} , { text: "OK", click: function() {dialogReporters.dialog("close");}}] );

    dialogReceptors.dialog( "option", "buttons", [ {text: "View Registry", click: viewRegistry()}, { text: "Search Biobirck", click: function() {
        dialogReceptors.dialog("close");
        showSearch();
    }} , { text: "OK", click: function() {dialogReceptors.dialog("close");
        dialogReporters.dialog("open");}}] );

    dialogPromoters.dialog( "option", "buttons", [ {text: "View Registry", click: viewRegistry()}, { text: "Search Biobirck", click: function() {
        dialogPromoters.dialog("close");
        showSearch();
    }} , { text: "OK", click: function() {dialogPromoters.dialog("close");
        dialogReceptors.dialog("open");}}] );

    $("#add-reporter").on("click", function() {
        dialogReporters.dialog("open");
    });

    var dialogDesignFrame = $("#dialog-design-frame").dialog({
        autoOpen: false,
        height: dialogHeight,
        width: dialogWidth,
        modal: true
    });

    $("#design-frame").on("click", function() {
        dialogDesignFrame.dialog("open");
    });

    var dialogLogicGate = $("#dialog-logic-gate").dialog({
        autoOpen: false,
        height: dialogHeight,
        width: dialogWidth,
        modal: true
    });

    $("#logic-gate").on("click", function() {
        dialogLogicGate.dialog("open");
    });

    function searchBiobirck() {
    }

});

function showSearch() {
    $('#search-form-small').hide();
    $('#search-window').sidebar('show').find('.ui.checkbox').checkbox();
    $('#search-big-input').focus();
}
