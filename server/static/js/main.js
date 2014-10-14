/*$('.ui.checkbox').checkbox();
$('.ui.sidebar').sidebar();
$('.ui.dropdown').dropdown();
$('.ui.modal').modal();*/

// index sidebar
/*$('#index').first().sidebar('attach events', '#showIndex');
  $('#showIndex').removeClass('disabled');*/
$('#showIndex').click(function() {
    $("#indexmenu").modal("show");
    $('#dock2').Fisheye({
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
});

$("#indexmenu").find("a").click(function() {
    var index = $(this).parent().children().index($(this));
    var loc = ["/circuit", "/shape", "/simulation", "/experiment", ""];
    window.location.href = loc[index];
});

$(".modal").modal("setting", {onShow: function() {
    $("#page").addClass("modal-active");
}});

$(".modal").modal("setting", {onHide: function() {
    $("#page").removeClass("modal-active");
}});
