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

/* 画出static performance中的两张图 */
function drawStaticPerformance() {
  data = [{
    name: 'input1',
    value: [10, 12, 22, 19, 23, 23],
    color: '#1f7e92',
    line_width: 2,
  }, {
    name: 'input2',
    value: [0, 2, 12, 21, 22, 23],
    color: '#1f7e92',
    line_width: 2,
  }];
  window.chartDir1and2 = {
   render: '',
   data: [],
   title: '',
   width: 400,
   heigt: 200,
   coordinate: {height: '90%', background_color: '#f6f9fa', },
   sub_option: {
     hollow_inside: false,
     point_size: 8,
     label: false,
   },
   labels: [0, 1, 2, 3, 4, 5],
 };
 chartDir1and2.data = [data[0]];
 chartDir1and2.title = 'Concentration of Input 1';
 chartDir1and2.render = 'graph1';
 var chart1 = new iChart.LineBasic2D(chartDir1and2);
 chart1.draw();
 chartDir1and2.data = [data[1]];
 chartDir1and2.title = 'Concentration of Input 2';
 chartDir1and2.render = 'graph2';
 var chart2 = new iChart.LineBasic2D(chartDir1and2);
 chart2.draw();
}


/* 画出dynamic performance中的图 */
function drawDynamicPerformance(tLabel, data) {
  var all_data = new Array();
  for (var key in data) {
    all_data.push({
      name: key,
      value: data[key],
      color: '#FF0000',
      line_width: 3,
    });
  }
  chartDir = {
   render: 'graph3',
   data: all_data,
   title: 'Concentration of Input 2',
   width: 720,
   heigt: 400,
   coordinate: {height: '90%', background_color: '#f6f9fa', },
   sub_option:{
     hollow_inside: false,
     point_size: 16,
     label: false,
   },
   labels: tLabel,
 };
 var chart = new iChart.LineBasic2D(chartDir);
 chart.draw();
}

/* 点击图片打开模态框*/
$(function() {
  $('.static_box i').click(function(event) {
    var index = $(this).parent().prevAll('.static_box').length;
    var negate = [2, 1];
    chartDir1and2.render = 'showgraph';
    chartDir1and2.data = [data[index]];
    delete chartDir1and2.sub_option.label;
    chartDir1and2.title = 'Concentration of Input ' + (index+1);
    chartDir1and2.width = 700;
    chartDir1and2.height = 450;
    var chart = new iChart.LineBasic2D(chartDir1and2);
    chart.draw();
    $('#draw_modal').modal('show').find('.right').html('');
    $('<div class="adjust_box"></div>')
      .append($('<p></p>').text('Concentration of input'+negate[index]))
      .append($('<input type="range" min="1" max="100" step="5" />'))
      .appendTo($('#draw_modal').find('.right'));
      event.stopPropagation();
  });

  $('.dynamic_box i').click(function() {
    chartDir.render = 'showgraph';
    delete chartDir.sub_option.label;
    chartDir.width = 700;
    chartDir.height = 450;
    var chart = new iChart.LineBasic2D(chartDir);
    chart.draw();
    var adjustBox = $(
      '<div>' +
        '<fieldset>' +
          '<legend>time interval</legend>' +
          '<div><span>0.5min</span><input type="range" min="0.5" max="5.0" step="0.5" value="1.0" name="timeInterval" /><span>5.0min</span></div>' +
        '</fieldset>' +
        '<fieldset>' +
          '<legend>time length</legend>' +
          '<div><span>20min</span><input type="range" min="20" max="200" step="20" value="60" name="timeLength" /><span>60min</span>' +
        '</fieldset>' +
      '</div>'
    );
    $('#draw_modal').modal('show').find('.right').html('').append(adjustBox);
    event.stopPropagation();
  });
});

/* 反应默认时间 */
TIME = 3600;
/* 反应物默认浓度 */
CONCENTRATION = 0.01;

/* 获取preprocess中的数据 */
$(function() {
  var reactionData = JSON.parse(sessionStorage.getItem('preprocess'));
  if (reactionData == null || reactionData.length == 0) {
    alert('数据获取失败');
    window.location = '/';
  } else {
    circuitsData = new Array();
    for (var j = 0; j < reactionData.length; ++j) {
      $.ajax({
        type: 'POST',
        url: 'simulation/preprocess',
        contentType: "application/json",
        data: JSON.stringify([reactionData[j]]),
        async: false,
        success: function(reactionOutput) {
          reactionOutput['t'] = TIME;
          reactionOutput['x0'] = new Array();
          for (var i = 0; i < reactionOutput['inputs'].length; ++i) {
            reactionOutput['x0'].add(reactionOutput['inputs'][i], CONCENTRATION);
          }
          $.ajax({
            type: 'POST',
            url: '/simulation/simulate',
            contentType: 'application/json',
            data: JSON.stringify(reactionOutput),
            async: false,
            success: function() {
            },
            fail: function() {
              alert('获取数据失败');
              window.location = '/';
            },
          });
        },
        fail: function() {
          alert('请先进行设计');
          window.location = '/';
        }
      });
      /*
      $.post('/simulation/preprocess', JSON.stringify([preprocessReq[j]]), function(data, status) {
        if (status == 'success') {
          var preprocessResp = JSON.parse(data);
          preprocessResp['t'] = TIME;
          preprocessResp['x0'] = new Array();
          for (var i in preprocessResp['outputs']) {
            preprocessResp['x0'][preprocessResp['inputs'][i]] = CONCENTRATION;
          }
          $.post('/simulation/simulate', JSON.stringify(preprocessResp), function(data, status) {
            if (status == 'success') {
              var simulationResp = JSON.parse(data);
              var cs = new Array();
              for (var i in preprocessResp['outputs']) {
                cs.push({
                  preprocessResp['outputs'][i] : simulationResp['c'][preprocessResp['outputs'][i]]
                });
              }
              circuitsData.push({
                't': simulationResp['t'],
                'cs': cs,
              });
            } else {
              alert('数据获取失败');
              window.location = '/';
            }
          });
        } else {
          alert('数据获取失败');
          window.location = '/';
        }
      }, 'application/json');
      */
    }
  }
});
