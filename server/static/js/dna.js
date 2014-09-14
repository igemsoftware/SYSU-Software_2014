// 第二条链根据第一条链修改
$(function() {
  $('#dna_first_line').keyup(function() {
    var fstLineContent = $(this).html();
    var sndLineContent = "";
    $.each(fstLineContent.split(""), function(index, unit) {
      switch (unit) {
        case "A": sndLineContent += "T"; break;
        case "T": sndLineContent += "A"; break;
        case "C": sndLineContent += "G"; break;
        case "G": sndLineContent += "C"; break;
        default: sndLineContent += unit; break;
      }
    });
    $('#dna_second_line').html(sndLineContent);
  });
});

// 两条DNA链同时被选中,第而条链根据第一条链高高亮
$(function() {
});

// 选择DNA后添加评论的按钮出现
$(function() {
  $('#dna_first_line').click(function(event) {
    if (document.getSelection() != "") {
      $('#dna_aside>button:last-child').show();
    }
    event.stopPropagation();
  });
});

// 点击评论按钮消失
$(function() {
  $(document).click(function() {
    $('#dna_aside>button:last-child').hide();
  });
});

// 弹出评论模态框
$(function() {
  $('#dna_aside>button:last-child').click(function() {
  });
});
