$(function() {
  var el, newPoint, newPlace, offset;
  $(".adjust_input").change(function() {
    el = $(this);
    width = el.width();
    newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
    if ($(this).parent().prop('id') == 'static_adjust_input') {
      offset = 11.5;
    } else {
      offset = 8.6;
    }
    if (newPoint < 0) { newPlace = 0;  }
    else if (newPoint > 1) { newPlace = width; }
    else { newPlace = width * newPoint + offset; offset -= newPoint;}
    el
      .next("output")
      .css({
        display: 'inline-block',
        left: newPlace,
        marginLeft: offset + "%"
      })
      .text(el.val());
    });
});
