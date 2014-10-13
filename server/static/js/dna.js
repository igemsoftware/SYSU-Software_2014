/* 有命名片段的颜色列表 */
window.colors = {
  'promoter' : 'rgb(255, 128, 0)',
  'RBS': 'rgb(0, 127, 255)',
  'terminator': 'rgb(210, 0, 0)',
  'output': 'rgb(160, 32, 240)',
  /* 默认颜色 */
  'biobrick_scar': 'rgb(128,128,128)',
  'poly_A': 'rgb(128,128,128)',
  /* 酶切位点颜色 */
  'restriction': 'rgb(0,250,145)',
};
/* 定义一行所显示的DNA单元数目 */
window.LEN_OF_LINE = 40;
/* 定义第二条链比第一条链浅色比例 */
window.COLOR_PERCENTAGE = 1.4;
/* 酶切片段 */
window.restrictionPart = {
  'EcoRI': {
    'fir' : [[1,1,0,1], [1,0,1,1], [1,0,1,0], [1,0,1,0], [1,0,1,0], [1,1,0,0]],
    'sec' : [[0,0,1,1], [1,0,1,0], [1,0,1,0], [1,0,1,0], [1,1,1,0], [0,1,1,1]],
    'firStr' : 'GAATTC',
  },
  'XbaI': {
    'fir' : [[1,1,0,1], [1,0,1,1], [1,0,1,0], [1,0,1,0], [1,0,1,0], [1,1,0,0]],
    'sec' : [[0,0,1,1], [1,0,1,0], [1,0,1,0], [1,0,1,0], [1,1,1,0], [0,1,1,1]],
    'firStr' : 'TCTAGA',
  },
  'SpeI': {
    'fir' : [[1,1,0,1], [1,0,1,1], [1,0,1,0], [1,0,1,0], [1,0,1,0], [1,1,0,0]],
    'sec' : [[0,0,1,1], [1,0,1,0], [1,0,1,0], [1,0,1,0], [1,1,1,0], [0,1,1,1]],
    'firStr' : 'ACTAGT',
  },
  'PstI': {
    'fir' : [[0,1,0,0], [1,0,1,1], [1,0,1,0], [1,0,1,0], [1,1,1,0], [0,0,0,1]],
    'sec' : [[0,1,0,0], [1,0,1,1], [1,0,1,0], [1,0,1,0], [1,1,1,0], [0,0,0,1]],
    'firStr' : 'CTGCAG',
  },
};

/* 获取输入和输出名字 */
$(function() {
  var preprocess = JSON.parse(sessionStorage.getItem('preprocess'));
  for (var j = 0; j < preprocess.length; ++j) {
    $('<ul></ul>').append($('<li>circult'+ (j+1) +'</li>'))
                            .append($('<li class="inputs">Inputs: </li>'))
                            .append($('<li class="outputs">outputs: </li>'))
                            .appendTo($('#dna_header'));
  }
  for (var i = 0; i < preprocess.length; ++i) {
    var inputs = preprocess[i]['inputs'];
    var outputs = preprocess[i]['outputs'];
    for (var j = 0; j < inputs.length; ++j) {
      $.ajax({
        type: 'GET',
        url: '/biobrick/input?id=' + inputs[j]['id'],
        contentType: 'application/json',
        async: false,
        success: function(data) {
          var input = $('#dna_header ul').eq(i).find('li.inputs');
          input.text(input.text()+data['result']['name']);
        },
      });
    }
    for (var j = 0; j < outputs.length; ++j) {
      $.ajax({
        type: 'GET',
        url: '/biobrick/output?id=' + outputs[j],
        contentType: 'application/json',
        async: false,
        success: function(data) {
          var output = $('#dna_header ul').eq(i).find('li.outputs');
          output.text(output.text()+data['result']['name']);
        },
      });
    }
  }
});

/* 获取DNA链的数据 */
$(function() {
  var circuits = JSON.parse(sessionStorage.getItem('circuits'));
  window.dnaData = [];
  for (var i = 0; i < circuits.length; ++i) {
    dnaData = dnaData.concat(circuits[i]['dna']);
  }
});

/* DNA双链匹配工具函数 */
function MatchDNA(astrand) {
  var dnaMatch = {
    'a' : 't', 't' : 'a', 'c' : 'g', 'g' : 'c',
    'A' : 'T', 'T' : 'A', 'C' : 'G', 'G' : 'C',
  };
  var otherStrand = '';
  for (var i = 0; i < astrand.length; ++i) {
    otherStrand += dnaMatch[astrand[i]];
  }
  return otherStrand;
}


/* 根据第一条链重整DNA双链 */
function reArrange(frtStr) {
  $('.dna_line').remove();
  for (var i = 0; i < frtStr.length; i += LEN_OF_LINE) {
    var line1Str = frtStr.substr(i, LEN_OF_LINE);
    var line2Str = MatchDNA(line1Str);
    var tagTR = $('<div class="dna_tag"></div>');
    var frtTR = $('<div class="first_line"><input class="first_strand" type="text" /></div>');
    var sndTR = $('<div class="second_line"><input class="second_strand" type="text" /></div>');
    var unitTR = $('<div class="dna_unit"></div>');
    for (var j = 0; j < line1Str.length; ++j) {
      tagTR.append($('<span>&nbsp</span>'));
      frtTR.find('input').val(frtTR.find('input').val()+line1Str[j]).prop('disabled', 'disabled');
      frtTR.append($('<span>&nbsp</span>'));
      sndTR.find('input').val(sndTR.find('input').val()+line2Str[j]).prop('disabled', 'disabled');
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
  setName();
}

/* 初始化DNA双链 */
$(function () {
  var frtStr = '';
  for (var i = 0; i < dnaData.length; ++i) {
    frtStr += dnaData[i][2];
  }
  reArrange(frtStr);
});

/* 在标签栏添加片段名称 */
$(setName = function() {
  var lens = 0;
  for (var i = 0; i < dnaData.length; ++i) {
    $('.dna_tag span').eq(lens).append($('<p>'+dnaData[i][0]+'</p>'));
    lens += dnaData[i][2].length;
  }
});

/* 初始化所有链的颜色 */
$(initColor = function () {
  var left = 0, right = dnaData[0][2].length;
  for (var i = 0; i < dnaData.length-1; ++i) {
    $('.first_line span:eq('+left+')').css('background-color', colors[dnaData[i][1]]);
    $('.first_line span:gt('+left+'):lt('+right+')').css('background-color', colors[dnaData[i][1]]);
    $('.second_line span:eq('+left+')').css('background-color', getSecondColor(colors[dnaData[i][1]]));
    $('.second_line span:gt('+left+'):lt('+right+')').css('background-color', getSecondColor(colors[dnaData[i][1]]));
    left += dnaData[i][2].length;
    right += dnaData[i+1][2].length;
  }
});

/* 获取第二条链的颜色 */
function getSecondColor(color) {
  var rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
  return 'rgb(' + parseInt(parseInt(rgb[1])*COLOR_PERCENTAGE) + ','
                + parseInt(parseInt(rgb[2])*COLOR_PERCENTAGE) + ','
                + parseInt(parseInt(rgb[3])*COLOR_PERCENTAGE) + ')';
}

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
      .find('span:nth-of-type('+cursorR.start+')').offset();
    var top = offset.top;
    var left = offset.left;
    /* 点击按钮出现评论框 */
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
/* 左键点击后，颜色初始化 */
$(function() {
  $('body').click(function() {
    $('#dna_aside button:eq(1)').hide();
  }).not('#comment_button').click(function() {
    if ($('#dna_modal_box').css('display') == 'none') {
      initColor();
    }
  });
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
  $('#dna_modal_box .remove').click(function() {
    $('#dna_modal_box').hide();
  });
});


/* 找出未标记DNA的酶切位点 */
$(function() {
  var circuits = JSON.parse(sessionStorage.getItem('circuits'));
  for (var k = 0; k < circuits.length; ++k) {
    var dna = circuits[k]['dna'];
    var start = 0;
    for (var i = 0; i < dna.length; ++i) {
      if (dna[i][1] == 'biobrick_scar' || dna[i][1] == 'poly_A') {
        var indexs = new Array();
        for (var name in restrictionPart) {
          var index = dna[i][2].indexOf(restrictionPart[name]['firStr'])
          if (index >= 0) {
            $('.first_line span:eq('+start+'):gt('+start+'):lt('+(start+index)+')')
              .css('background-color', colors['restriction']);
            $('.second_line span:eq('+start+'):gt('+start+'):lt('+(start+index)+')')
              .css('background-color', getSecondColor(colors['restriction']));
          }
        }
      }
      start += dna[i][2].length;
    }
  }
});
