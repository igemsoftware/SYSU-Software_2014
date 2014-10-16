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


/* 画出circuits图 */
$(function() {
  cur_circuit = 0;
  allCircuits = JSON.parse(sessionStorage.getItem('circuits'));
  for (var i = 0; i < allCircuits.length; ++i) {
    $('#simulation_circuit .ui.teal.inverted.menu').append($('<a class="item">Circuit'+(i+1)+'</a>'));
  }
  $('#simulation_circuit a').eq(0).addClass('active');
  $('#simulation_circuit a').click(function() {
    $('#dynamic_adjust_input input[type=range]').val(60).next('output').hide();
    cur_circuit = $(this).prev('a').length;
    $('#simulation_circuit a').removeClass('active');
    $(this).addClass('active');
    drawAllGraph();
  });
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

/* 将浮点数组的进度保留指定位数， */
function precisionControl(dataArray, p) {
  var dataArray_ = [];
  for (var i = 0; i < dataArray.length; ++i) {
    dataArray_.push(Math.round(dataArray[i] * Math.pow(10, p)) / Math.pow(10, p));
  }
  return dataArray_;
}

/* 获取数据 */
$(drawAllGraph = function() {
  var reactionData = JSON.parse(sessionStorage.getItem('preprocess'));
  if (reactionData == null || reactionData.length == 0) {
    alert('数据获取失败');
    window.location = '/';
  } else {
    window.reactionOutputs = [];
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
          for (var i = 0; i < reactionOutput['inputs'].length; ++i) {
            reactionOutput['x0'][reactionOutput['inputs'][i]] = CONCENTRATION;
          }
          reactionOutputs.push(reactionOutput);
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

          reactionOutputs[j]['c_static'] = FIXED_C;
          /* 获取static数据 */
          $.ajax({
             type: 'POST',
             url: '/simulation/simulate/static',
             contentType: 'application/json',
             data: JSON.stringify(reactionOutputs[cur_circuit]),
             async: false,
             success: function(staticData) {
               drawStaticPerformance(precisionControl(staticData['c_input'], STATIC_PRECISION), staticData['c_output']);
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
/*
$(changeStatic = function() {
  $('#static_adjust_box input[type=range]').change(function() {
    $('#graph1').html('');
    $('#graph2').html('');
    reactionOutputs[0]['t'] = TIME;
    var adjustVar = $(this).prop('id');
    var cur_c = parseFloat($(this).val());
    reactionOutputs[0]['c_static'] = cur_c;
    $.ajax({
      type: 'POST',
      url: '/simulation/simulate/static',
      contentType: 'application/json',
      data: JSON.stringify(reactionOutputs[0]),
      async: false,
      success: function(staticData) {
        console.log(staticData['c_output']);
        for (var i = 0; staticData['c_output'].length; ++i) {
          if (staticData['c_output'][i]['variable'] != adjustVar) {
            RECORD_C[staticData['c_output'][i]['variable']] = cur_c;
            drawSingleStaticPerformance(precisionControl(staticData['c_input'], STATIC_PRECISION), staticData['c_output'][i], i);
            break;
          }
        }
      },
      fail: function() {
        alert('数据获取失败');
        window.location = '/';
      },
    });
  });
});
*/


