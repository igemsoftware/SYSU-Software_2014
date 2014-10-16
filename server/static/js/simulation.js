/* 反应默认时间 */
TIME = 3600;

/* 反应物默认浓度 */
CONCENTRATION = 0.01;

/* 固定浓度默认值 */
FIXED_C = 1;

/* static图横坐标精度 */
STATIC_PRECISION = 4;

/* dynamic图横坐标精度 */
DYNAMIC_PRECISION = 2;

/* 一次获取所有circuit的数据并存在变量中 */
$(function() {
  var reactionData = JSON.parse(sessionStorage.getItem('preprocess'));
  if (reactionData == null || reactionData.length == 0) {
    alert('数据获取失败');
    window.location = '/';
  } else {
    /* 存所有输入/simulate/的数据 */
    window.reactionOutputs = [];
    /* 存储获取的dynamic做图数据 */
    window.dynamicDrawData = [];
    /* 存储获取的static做图数据 */
    window.staticDrawData = [];

    for (var j = 0; j < reactionData.length; ++j) {
      $.ajax({
        type: 'POST',
        url: 'simulation/preprocess',
        contentType: "application/json",
        data: JSON.stringify([reactionData[j]]),
        async: false,
        success: function(reactionOutput) {
          reactionOutput['t'] = TIME;
          reactionOutput['x0'] = {};
          reactionOutput['c_static'] = FIXED_C;
          for (var i = 0; i < reactionOutput['inputs'].length; ++i) {
            reactionOutput['x0'][reactionOutput['inputs'][i]] = CONCENTRATION;
          }
          reactionOutputs.push(reactionOutput);
          /* 获取dynamic数据 */
          $.ajax({
            type: 'POST',
            url: '/simulation/simulate/dynamic',
            contentType: 'application/json',
            data: JSON.stringify(reactionOutputs[j]),
            async: false,
            success: function(dynamicData) {
              dynamicDrawData.push({
                'x': dynamicData['t'],
                'y': dynamicData['c'],
              });
            },
            fail: function() {
              alert('获取数据失败');
              window.location = '/';
            },
          });

          /* 获取static数据 */
          $.ajax({
            type: 'POST',
            url: '/simulation/simulate/static',
            contentType: 'application/json',
            data: JSON.stringify(reactionOutputs[j]),
            async: false,
            success: function(staticData) {
              staticDrawData.push({
                'x': staticData['c_input'],
                'y': staticData['c_output'],
              });
            },
            fail: function() {
              alert('数据获取失败');
              window.location = '/';
            },
          });
        },
        fail: function() {
          alert('请先进行设计');
          window.location = '/';
        },
      });
    }
  }
});

/* 将浮点数组的进度保留指定位数， */
function precisionControl(dataArray, p) {
  var dataArray_ = [];
  for (var i = 0; i < dataArray.length; ++i) {
    dataArray_.push(Math.round(dataArray[i] * Math.pow(10, p)) / Math.pow(10, p));
  }
  return dataArray_;
}


/* 做图 */
function drawAllGraph() {
  drawStaticPerformance(
    precisionControl(staticDrawData[cur_circuit]['x'], STATIC_PRECISION),
    staticDrawData[cur_circuit]['y']
  );
  drawDynamicPerformance(
    precisionControl(dynamicDrawData[cur_circuit]['x'], DYNAMIC_PRECISION),
    dynamicDrawData[cur_circuit]['y']
  );
}

/* 选择circuits */
$(function() {
  cur_circuit = 0;
  allCircuits = JSON.parse(sessionStorage.getItem('circuits'));
  circuitsLogicName = [];
  for (var i = 0; i < allCircuits.length; ++i) {
    var acircuitLogicName = [];
    for (var j = 0; j < allCircuits[i]['logics'].length; ++j) {
      acircuitLogicName.push(allCircuits[i]['logics'][j]['name']);
    }

    circuitsLogicName.push(acircuitLogicName);
    $('#simulation_circuit .ui.teal.inverted.menu').append($('<a class="item">Circuit'+(i+1)+'</a>'));
  }
  $('#simulation_circuit a').click(function() {
    cur_circuit = $(this).prevAll('a').length;
    $('#logic_box').html('');
    for (var i = 0; i < circuitsLogicName[cur_circuit].length; ++i) {
      $(
        '<div class="logic_item">' +
          '<img src="/static/images/frame/' + circuitsLogicName[cur_circuit][i] + '.png" />' +
          '<p class="logic_name">' + circuitsLogicName[cur_circuit][i] + '</p>' +
        '</div>'
      ).appendTo($('#logic_box'));
    }
    $('#dynamic_adjust_input input[type=range]').val(60).next('output').hide();
    $('#simulation_circuit a').removeClass('active');
    $(this).addClass('active');
    drawAllGraph();
  });
  $('#simulation_circuit a').eq(0).click();
});

/* 切换simulation_main_draw的选项目卡 */
$(function() {
  $('#simulation_main_draw>div').click(function() {
    var animateTime = 500;
    var other = {'Static': 'Dynamic', 'Dynamic': 'Static'};
    var otherEle = $('#'+other[$(this).prop('id')]);
    var top = $(this).css('top');
    var left = $(this).css('left');
    var zIndex = $(this).css('z-index');
    var opacity = $(this).css('opacity');
    $(this).animate({
      'top': otherEle.css('top'),
      'left': otherEle.css('left'),
      'z-index': otherEle.css('z-index'),
      'opacity': otherEle.css('opacity'),
    }, animateTime);
    otherEle.animate({
      'top': top, 'left': left,
      'z-index': zIndex,
      'opacity': opacity,
    }, animateTime);
  });
});



/* 修改dynamic曲线 */
$(function() {
  $('#dynamic_adjust_box input[type=range]').change(function() {
    $('#graph3').html('');
    reactionOutputs[cur_circuit]['t'] = parseFloat($(this).val()) * 60;
    /* 获取dynamic数据 */
    $.ajax({
      type: 'POST',
      url: '/simulation/simulate/dynamic',
      contentType: 'application/json',
      data: JSON.stringify(reactionOutputs[cur_circuit]),
      async: false,
      success: function(dynamicData) {
        drawDynamicPerformance(precisionControl(dynamicData['t'], DYNAMIC_PRECISION), dynamicData['c']);
      },
      fail: function() {
        alert('获取数据失败');
        window.location = '/';
      },
    });
    $('#show_dynamic_box').click();
  });
});

/* 记录浓度改变值 */
RECORD_C = {};

/* 修改static曲线 */
$(changeStatic = function() {
  $('#static_adjust_box input[type=range]').change(function() {
    var reactionOutput = reactionOutputs[cur_circuit];
    var adjustVar = $(this).prop('id');
    reactionOutput['c_static'] = parseFloat($(this).val());
    /* 获取static数据 */
    /*$.ajax({
      type: 'POST',
      url: '/simulation/simulate/static',
      contentType: 'application/json',
      data: JSON.stringify(reactionOutput),
      async: false,
      success: function(staticData) {
        for (var i = 0; i < staticData['c_output'].length; ++i) {
          if (staticData['c_output'][i]['variable'] != adjustVar) {
            drawSingleStaticPerformance(
              precisionControl(staticData['c_input'], STATIC_PRECISION),
              staticData['c_output'][staticData['c_output'][i]['variable']],
              i
            );
          }
        }
      },
      fail: function() {
        alert('数据获取失败');
        window.location = '/';
      },
    });
    */
  });
});

