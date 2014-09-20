window.dnaData = {
  'R0079' : 'GCCCCTCGCTGAGCGCGTCCCGGAGCTGGGGGCAACCTAGCTGCCACCTGCTTTTCTGCTAGCTATTCCAGCGAAAACATACAGATTTCCGGCGAAATCAAGGCTACCTGCCAGTTCTGGCAGGTTTGGCCGCGGGTTCTTTTTGGTACACGAAA',
  'none1' : 'GCTACTAGA',
  'B0030' : 'GATTAAAGAGGAGA',
  'none2' : 'AATAC',
  'E0040' : 'TAGATGCGTAAAGGAGAAGAACTTTTCACTGGAGTTGTCCCAATTCTTGTTGAATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCGGTTATGGTGTTCAATGCTTTGCGAGATACCCAGATCATATGAAACAGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAAAGAACTATATTTTTCAAAGATGACGGGAACTACAAGACACGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATAGAATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTTGGACACAAATTGGAATACAACTATAACTCACACAATGTATACATCATGGCAGACAAACAAAAGAATGGAATCAAAGTTAACTTCAAAATTAGACACAACATTGAAGATGGAAGCGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCCACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGAGAGACCACATGGTCCTTCTTGAGTTTGTAACAGCTGCTGGGATTACACATGGCATGGATGAACTATACAAATAATAA',
  'none3' : 'TCTACTA',
  'B0012' : 'GAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATA',
};

/* 默认颜色 */
window.resetColor = 'rgb(128,128,128)';
/* 有命名片段的颜色列表 */
window.colorList = ['rgb(0, 255, 127)', 'rgb(160,32,240)', 'rgb(255, 128, 0)', 'rgb(106,90,205)'];

/* 定义一行所显示的DNA单元数目 */
window.LEN_OF_LINE = 40;
/* 定义第二条链比第一条链浅色比例 */
window.COLOR_PERCENTAGE = 1.4;

/* DNA双链匹配工具函数 */
function MatchDNA(astrand) {
  var dnaMatch = {'A' : 'T', 'T' : 'A', 'C' : 'G', 'G' : 'C',};
  var otherStrand = '';
  for (var i = 0; i < astrand.length; ++i) {
    otherStrand += dnaMatch[astrand[i]];
  }
  return otherStrand;
}


/* 根据第一条链重整DNA双链 */
function reArrange(frtStr) {
  $('.dna_line').remove();
  var line1Str = '';
  var line2Str = '';
  var tagTR = '';
  var frtTR = '';
  var sndTR = '';
  var unitTR = '';
  for (var i = 0; i < frtStr.length; i += LEN_OF_LINE) {
    line1Str = frtStr.substr(i, LEN_OF_LINE);
    line2Str = MatchDNA(line1Str);
    tagTR = $('<div class="dna_tag"></div>');
    frtTR = $('<div><input class="first_strand" type="text" /></div>');
    sndTR = $('<div><input class="second_strand" type="text" /></div>');
    unitTR = $('<div class="dna_unit"></div>');
    for (var j = 0; j < line1Str.length; ++j) {
      tagTR.append($('<span>&nbsp</span>'));
      frtTR.find('input').val(frtTR.find('input').val()+line1Str[j]);
      frtTR.append($('<span>&nbsp</span>'));
      sndTR.find('input').val(sndTR.find('input').val()+line2Str[j]);
      sndTR.append($('<span>&nbsp</span>'));
      unitTR.append($('<span>&nbsp</span>'));
    }
    $('<div class="dna_line"></div>')
      .append(tagTR).append(frtTR)
      .append(sndTR).append(unitTR)
      .appendTo($('#dna_content'));
  }
  initColor();
  changeDNA();
  selectBoth();
}

/* 初始化DNA双链 */
$(function () {
  var frtStr = '';
  for (var partName in dnaData) {
    frtStr += dnaData[partName];
  }
  reArrange(frtStr);
});

/* 在标签栏添加片段名称 */
$(function() {
  var lens = 0;
  for (var key in dnaData) {
    if (key.indexOf('none') >= 0) {
      continue;
    }
    $('.dna_tag span').eq(lens).append($('<p>'+key+'</p>'));
    lens += dnaData[key].length;
  }
});

/* 初始化所有链的颜色 */
$(initColor = function () {
  /* 设置第二条链的颜色比第一条链的颜色浅 */
  var lens = [];
  var len = 0;
  var colors = [];
  var k = 0;
  for (var key in dnaData) {
    if (key.indexOf('none') >= 0) {
      colors.push(resetColor);
    } else {
      colors.push(colorList[k++]);
    }
    len += dnaData[key].length;
    lens.push(len);
  }
  $('.first_strand').parent().each(function() {
    chanegColor($(this), lens, colors);
  });
});

function chanegColor(frtStrand, lens, colors) {
  frtStrand.children('span').each(function() {
    var curSpanIndex = $(this).prevAll('span').length;
    var curIndex = frtStrand.parent('.dna_line').prevAll().length * LEN_OF_LINE + curSpanIndex;
    var i = 0;
    for (; i < lens.length; ++i) {
      if (curIndex <= lens[i]) {
        break;
      }
    }
    $(this).css('background-color', colors[i]);
    var color = $(this).css('background-color');
    var rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
    color = 'rgb(' + parseInt(parseInt(rgb[1])*COLOR_PERCENTAGE) + ','
                   + parseInt(parseInt(rgb[2])*COLOR_PERCENTAGE) + ','
                   + parseInt(parseInt(rgb[3])*COLOR_PERCENTAGE) + ')';
    frtStrand.next().children('span').eq(curSpanIndex)
      .css('background-color', color);
  });
}

/* 判断输入是否为AGCT或者agct */
function isUnit(event) {
  return event.which == 65 || event.which == 71 ||
         event.which == 67 || event.which == 84 ||
         event.which == 97 || event.which == 103 ||
         event.which == 99 || event.which == 116;
}

/* 第二条链根据第一条链改变 */
$(changeDNA = function () {
  $('.first_strand').keypress(function(event) {
    /* 只能输入AGCT和agct */
    if (isUnit(event)) {
      return true;
    } else {
      return false;
    }
  }).keyup(function(event) {
    /* 当输入AGCT,agct或者回退键结束后重整DNA链 */
    if (isUnit(event) || event.keyCode == 8) {
      var curIndex = $(this).parents('.dna_line').prevAll().length;
      var cursorPos = $(this).getCursorPosition();
      var fstAll = '';
      $('.first_strand').each(function() {
        fstAll += $(this).val();
      });
      reArrange(fstAll.toUpperCase());
      $('.first_strand').eq(curIndex).selectRange(cursorPos, cursorPos);
    }
  });
});

/* 是否进行多行选择 */
window.isMultiLine = false;

/* 两条链同步选中 */
$(selectBoth = function() {
  $('.first_strand').select(function(event) {
    var cursorR = $(this).getCursorRange();
    for (var i = cursorR.start+1; i <= cursorR.end; ++i) {
      $(this).parent().find('span:nth-of-type('+i+')')
        .css('background-color', 'rgb(255, 255, 0)');
      $(this).parent().next().find('span:nth-of-type('+i+')')
        .css('background-color', 'rgba(255, 255, 0, 0.6)');
    }
    var offset = $(this).parent()
      .find('span:nth-of-type('+(cursorR.start+1)+')').offset();
    var top = offset.top + 2 * $('.first_strand').parent().height();
    var left = offset.left;
    $('#dna_aside button:eq(1)').show().click(function(event) {
      $('#dna_modal_box').css({'top': top+'px', 'left': left+'px',})
        .show().find('input').focus();
    });
  }).keydown(function(event) {
    /* 输入AGCT,agct,CTRL或者方向键入 */
    if (isUnit(event) || event.keyCode == 8 ||
        event.which >= 37 && event.which <= 40) {
      initColor();
    }
  }).click(function(event) {
    if (!isMultiLine) {
      initColor();
    }
  }).keydown(function(event) {
    isMultiLine = event.which == 17;
  }).keyup(function() {
    isMultiLine = false;
  });
});

/* 左键点击后评论框和评论按钮消失 */
$(function() {
  $('body').click(function() {
    $('#dna_aside button:eq(1)').hide();
  })
});

/* 输入评论 */
$(function() {
  $('#dna_modal_box').find('input').change(function() {
    $('#dna_modal_box').hide();
  }).keydown(function(event) {
    /* 输入回车隐藏评论框 */
    if (event.which == 13) {
      $('#dna_modal_box').hide();
    }
  });
});
