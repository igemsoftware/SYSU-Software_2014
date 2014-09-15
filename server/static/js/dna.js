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
window.LEN_OF_LINE = 47;
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

/* 显示DNA链,DNA片段名,刻度 */
$(function() {
  var frtStr = '';
  var line1Str = '';
  var line2Str = '';
  var tagTR = '';
  var frtTR = '';
  var sndTR = '';
  var unitTR = '';
  for (var partName in dnaData) {
    frtStr += dnaData[partName];
  }
  for (var i = 0; i < frtStr.length; i += LEN_OF_LINE) {
    line1Str = frtStr.substr(i, LEN_OF_LINE);
    line2Str = MatchDNA(line1Str);
    tagTR = $('<tr class="dna_tag"></tr>');
    frtTR = $('<tr class="first_strand"></tr>');
    sndTR = $('<tr class="second_strand"></tr>');
    unitTR = $('<tr class="dna_unit"></tr>');
    for (var j = 0; j < line1Str.length; ++j) {
      tagTR.append($('<td>&nbsp</td>'));
      frtTR.append($('<td>'+line1Str[j]+'</td>'));
      sndTR.append($('<td>'+line2Str[j]+'</td>'));
      unitTR.append($('<td>&nbsp</td>'));
    }
    $('<table class="dna_line"><tbody></tbody></table>')
      .append(tagTR).append(frtTR).append(sndTR).append(unitTR)
      .appendTo($('#dna_content'));
  }
});

/* 初始化所有链的颜色 */
$(function() {
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
  frtStrand.next('.second_strand').css('background-color', color);
}

/* 第二条链随第一条链选中 */
$(function() {
  $('.first_strand').mousedown(function() {});
});

/*
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
*/
