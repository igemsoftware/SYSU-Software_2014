SAME_PROPERTIES = {
  align: 'center',
  background_color:'#FEFEFE',
  tip: {
    enable: true,
    shadow: true,
    move_duration: 400,
    border: {
      enable: true,
      radius: 5,
      width: 2,
      color: '#3f8695'
    },
  },
  legend: {
    enable: true,
    row: 1,//设置在一行上显示，与column配合使用
    column: 'max',
    valign: 'top',
    sign: 'bar',
    background_color: null,//设置透明背景
    offsetx: -80,//设置x轴偏移，满足位置需要
    border: true
  },
  sub_option: {
    label: false,
    point_size: 10
  },
};

/* 画出static performance中的两张图 */
function drawStaticPerformance(labels, output) {
  /*
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
 */
  var inputData = new Array();
  for (var i = 0; i < output.length; ++i) {
    inputData['var'] = output[i]['variable'];
    inputData['otherCon'] = [];
    for (var input_ in output[i]['c']) {
      if (inputData['var'] != input_) {
        inputData['otherCon'].push({
          name: input_,
          value: output[i]['c'][input_],
          color: '#FF0000',
          line_width: 3,
        });
      }
    }
  }
  chartDirs = new Array();
  for (var i = 0; i < inputData.length; ++i) {
    chartDirs.push({
      render: 'graph' + i,
      data: inputData[i]['otherCon'],
      title: 'Static performance',
      width : 400,
      height : 200,
      background_color:'#FEFEFE',
      tip: SAME_PROPERTIES['tip'],
      legend: SAME_PROPERTIES['legend'],
      sub_option: SAME_PROPERTIES['sub_option'],
      coordinate: {
        width: 300,
        height: 160,
        axis:{
          color:'#dcdcdc',
          width:1
        },
        scale:[{
          position:'left',
        },{
          position:'bottom',
          labels: tLabel,
        }]
      },
    });
    var chart = new iChart.LineBasic2D(chartDirs[i]);
    chart.draw();
  }
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
    render : 'graph3',
    data: all_data,
    align: SAME_PROPERTIES['align'],
    title : 'Dynamic performance',
    width : 770,
    height : 320,
    background_color:'#FEFEFE',
    footnote: 'time/sec',
    tip: SAME_PROPERTIES['tip'],
    subtitle: {
      text: 'concentration of output(s)',//利用副标题设置单位信息
      fontsize:12,
      color:'#000000',
      textAlign:'left',
      padding:'0 0',
      height:30
    },
    legend: SAME_PROPERTIES['legend'],
    sub_option: SAME_PROPERTIES['sub_option'],
    coordinate:{
      width: 640,
      height: 240,
      axis:{
        color:'#dcdcdc',
        width:1
      },
      scale:[{
         position:'left',
      },{
         position:'bottom',
         labels: tLabel,
      }]
    }
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
    chartDir['tip']['listeners'] = {
         //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
        parseText:function(tip,name,value,text,i){
          return name+"浓度为: "+value+"unit";
        }
    };
    chartDir['crosshair'] ={
      enable:true,
      line_color:'#62bce9'//十字线的颜色
    };
    delete chartDir.sub_option.label;
    chartDir.width = 720;
    chartDir.height = 400;
    chartDir.coordinate.width = 650;
    chartDir.coordinate.height = 350;
    var chart = new iChart.LineBasic2D(chartDir);
    chart.draw();
    var adjustBox = $(
      '<div>' +
        '<fieldset>' +
          '<legend>time interval</legend>' +
          '<div><span>0.5min</span><input type="range" min="0.5" max="5.0" step="0.5" value="1.0" name="timeInterval" /><span>5.0min</span></div>' +
        '</fieldset>' +
      '</div>'
    );
    $('#draw_modal').modal('show').find('.right').html('').append(adjustBox);
    event.stopPropagation();
  });
});

