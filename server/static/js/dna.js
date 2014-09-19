window.dnaData = {
  'R0079' : 'GCCCCTCGCTGAGCGCGTCCCGGAGCTGGGGGCAACCTAGCTGCCACCTGCTTTTCTGCTAGCTATTCCAGCGAAAACATACAGATTTCCGGCGAAATCAAGGCTACCTGCCAGTTCTGGCAGGTTTGGCCGCGGGTTCTTTTTGGTACACGAAA',
  'none1' : 'GCTACTAGA',
  'B0030' : 'GATTAAAGAGGAGA',
  'none2' : 'AATAC',
  'E0040' : 'TAGATGCGTAAAGGAGAAGAACTTTTCACTGGAGTTGTCCCAATTCTTGTTGAATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCGGTTATGGTGTTCAATGCTTTGCGAGATACCCAGATCATATGAAACAGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAAAGAACTATATTTTTCAAAGATGACGGGAACTACAAGACACGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATAGAATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTTGGACACAAATTGGAATACAACTATAACTCACACAATGTATACATCATGGCAGACAAACAAAAGAATGGAATCAAAGTTAACTTCAAAATTAGACACAACATTGAAGATGGAAGCGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCCACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGAGAGACCACATGGTCCTTCTTGAGTTTGTAACAGCTGCTGGGATTACACATGGCATGGATGAACTATACAAATAATAA',
  'none3' : 'TCTACTA',
  'B0012' : 'GAGTCACACTGGCTCACCTTCGGGTGGGCCTTTCTGCGTTTATA',
}
/* 定义一行所显示的DNA单元数目 */
window.LEN_OF_LINE = 49;
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
      sndTR.find('input').val(sndTR.find('input').val()+line2Str[j]);
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

/* 重整DNA双链 */
$(function () {
  var frtStr = '';
    for (var partName in dnaData) {
    frtStr += dnaData[partName];
  }
  reArrange(frtStr);
});

/* 初始化所有链的颜色 */
$(initColor = function () {
  $('.first_strand').each(function() {
    chanegColor($(this));
  });
});

/* 设置第二条链的颜色比第一条链的颜色浅 */
function chanegColor(frtStrand) {
  var color = frtStrand.css('background-color');
  var rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
  color = 'rgb(' + parseInt(parseInt(rgb[1])*COLOR_PERCENTAGE) + ','
                 + parseInt(parseInt(rgb[2])*COLOR_PERCENTAGE) + ','
                 + parseInt(parseInt(rgb[3])*COLOR_PERCENTAGE) + ')';
  frtStrand.parent().next()
    .find('.second_strand')
    .css('background-color', color);
}


/* 第二条链根据第一条链改变 */
$(changeDNA = function () {
  $('.first_strand').keypress(function(event) {
    /* 只能输入AGCT和agct */
    if (event.which == 65 || event.which == 71 ||
        event.which == 67 || event.which == 84 ||
        event.which == 97 || event.which == 103 ||
        event.which == 99 || event.which == 116) {
      return true;
    } else {
      return false;
    }
  }).keyup(function(event) {
    /* 当输入AGCT,agct或者回退键结束后重整DNA链 */
    if (event.which == 65 || event.which == 71 ||
        event.which == 67 || event.which == 84 ||
        event.which == 97 || event.which == 103 ||
        event.which == 99 || event.which == 116 ||
        event.keyCode == 8) {
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

/* 两条链同步选中 */
$(selectBoth = function() {
  $('.first_strand').select(function(event) {
    var cursorR = $(this).getCursorRange();
    var a = $('<span>'+MatchDNA(cursorR.text)+'</span>').css({
      'position': 'fixed',
      'top': '212px',
      'left': '220px',
      'background': 'yellow',
    }).appendTo($('#dna_content'));
  });
});

