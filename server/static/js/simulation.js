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
function drawDynamicPerformance() {
  var all_data = [{
    name: 'input1=0&input2=0',
    value: [2, 1, 2, 3, 4, 5, 4],
    color: '#FF0000',
    line_width: 3,
  }, {
    name: 'input1=1&input2=0',
    value: [2, 2, 1, 3, 4, 5, 5],
    color: '#00FF00',
    line_width: 3,
 }, {
    name: 'input1=0&input2=1',
    value: [2, 5, 3, 4, 1, 1, 1],
    color: '#0000FF',
    line_width: 3,
 }, {
    name: 'input1=1&input2=1',
    value: [2, 14, 22, 30, 35, 40, 40],
    color: '#00FFFF',
    line_width: 3,
 }];
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
   labels: [1, 2, 3, 4, 5, 6, 7],
 };
 var chart = new iChart.LineBasic2D(chartDir);
 chart.draw();
}
/* 画图 */
$(function() {
  drawStaticPerformance();
  drawDynamicPerformance();
});

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
      .append($('<input type="range" min="0.0" max="1.0" step="0.1" />'))
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
      '<table class="adjust_box">' +
        '<tr><th>Noise</th><td><input type="checkbox" name="noise" /></td></tr>' +
        '<tr><th>Time Delay</th><td><input type="checkbox" name="timeDelay" /></td></tr>' +
        '<tr><th>Time Interval</th><td><input type="range" min="0.0" max="1.0" step="0.1" name="time" /></td></tr>' +
      '</table>'
    );
    $('#draw_modal').modal('show').find('.right').html('').append(adjustBox);
    event.stopPropagation();
  });
});
