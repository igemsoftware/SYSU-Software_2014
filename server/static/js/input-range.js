$(ShowOutput = function() {
  var el, newPoint, newPlace, offset;
  $(".adjust_input").unbind('mouseup').bind('mouseup', function() {
    el = $(this);
    width = el.width();
    newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
    if ($(this).parent().prop('id') == 'static_adjust_input') {
      offset = 15.5;
    } else if ($(this).prop('name') == 'RIPS') {
      offset = -2;
    } else {
      offset = 8;
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
      });
      if ($(this).prop('name') == 'RIPS') {
        el.next("output").text(alphaList[parseInt(el.val())]);
      } else {
        el.next("output").text(el.val());
      }
    });
});
