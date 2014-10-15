/* 反应默认时间 */
TIME = 3600;

/* 反应物默认浓度 */
CONCENTRATION = 0.01;

/* 固定浓度默认值 */
FIXED_C = 1;

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
function precisionControl(dataArray) {
  var dataArray_ = [];
  for (var i = 0; i < dataArray.length; ++i) {
    dataArray_.push(Math.round(dataArray[i] * 100) / 100);
  }
  return dataArray_;
}

/* 获取数据 */
$(function() {
  var reactionData = JSON.parse(sessionStorage.getItem('preprocess'));
  if (reactionData == null || reactionData.length == 0) {
    alert('数据获取失败');
    window.location = '/';
  } else {
    circuitsData = new Array();
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
          /* 获取dynamic数据 */
          $.ajax({
            type: 'POST',
            url: '/simulation/simulate/dynamic',
            contentType: 'application/json',
            data: JSON.stringify(reactionOutput),
            async: false,
            success: function(dynamicData) {
              drawDynamicPerformance(precisionControl(dynamicData['t']), dynamicData['c']);
            },
            fail: function() {
              alert('获取数据失败');
              window.location = '/';
            },
          });

          reactionOutput['c_static'] = FIXED_C;
          reactionOutputs.push(reactionOutput);
          /* 获取static数据 */
          $.ajax({
             type: 'POST',
             url: '/simulation/simulate/static',
             contentType: 'application/json',
             data: JSON.stringify(reactionOutput),
             async: false,
             success: function(staticData) {
               drawStaticPerformance(staticData['c_input'], staticData['c_output']);
               console.log(staticData['c_output']);
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
    reactionOutputs[0]['t'] = parseFloat($(this).val()) * 60;
    /* 获取dynamic数据 */
    $.ajax({
      type: 'POST',
      url: '/simulation/simulate/dynamic',
      contentType: 'application/json',
      data: JSON.stringify(reactionOutputs[0]),
      async: false,
      success: function(dynamicData) {
        drawDynamicPerformance(precisionControl(dynamicData['t']), dynamicData['c']);
      },
      fail: function() {
        alert('获取数据失败');
        window.location = '/';
      },
    });
    $('#show_dynamic_box').click();
  });
});

/* 画出circuits图 */
$(function() {
  
});
