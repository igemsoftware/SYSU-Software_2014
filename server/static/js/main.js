/*$('.ui.checkbox').checkbox();
$('.ui.sidebar').sidebar();
$('.ui.dropdown').dropdown();
$('.ui.modal').modal();*/

// index sidebar
/*$('#index').first().sidebar('attach events', '#showIndex');
  $('#showIndex').removeClass('disabled');*/
$('#showIndex').click(function() {
    $("#indexmenu").dimmer("show");
    /*$('#dock2').Fisheye({
        maxWidth: 220,
        items: 'a',
        itemsText: 'span',
        container: '.dock-container2',
        itemWidth: 150,
        proximity: 80,
        alignment : 'left',
        valign: 'bottom',
        halign : 'center'
    });
    $("#indexmenu").click(function() {
        console.log("helo");
    });*/
});
