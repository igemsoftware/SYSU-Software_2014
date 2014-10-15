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
    point_size: 0,
  },
};

OUTPUT_COLORS = ['#FF0000', '#00FF00', '#0000FF'];
INPUT_COLORS = ['#FFFF00', '#00FFFF'];


function createStaticBox(numOfInput) {
  for (var i = 1; i <= numOfInput; ++i) {
    $(
      '<div class="static_box">' +
        '<i class="search icon"></i>' +
          '<div class="s_graph" id="graph'+i+'"></div>' +
      '</div>'
    ).appendTo('#Static');
  }
}

/* 画出static performance中的两张图 */
function drawStaticPerformance(labels, output) {
  createStaticBox(output.length);
  inputDatas = new Array();
  for (var i = 0; i < output.length; ++i) {
    var inputData = new Array();
    inputData['var'] = output[i]['variable'];
    inputData['output'] = [];
    var count = 0;
    for (var outputName in output[i]['c']) {
      inputData['output'].push({
        name: outputName,
        value: output[i]['c'][outputName],
        color: OUTPUT_COLORS[count++],
        line_width: 3,
      });
    }
    inputDatas.push(inputData);
  }
  chartDirs = new Array();
  for (var i = 0; i < inputDatas.length; ++i) {
    chartDirs.push({
      render: 'graph' + (i+1),
      data: inputDatas[i]['output'],
      title: 'Static performance',
      width : 450,
      height : 300,
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
          labels: labels,
        }]
      },
    });
    var chart = new iChart.LineBasic2D(chartDirs[i]);
    chart.draw();
  }
}

NUM_OF_SCALE = 10;

/* 画出dynamic performance中的图 */
function drawDynamicPerformance(tLabel, data) {
  var tLabel_ = [];
  for (var i = 0; i < tLabel.length; ++i) {
    if (i % parseInt(tLabel.length / NUM_OF_SCALE) == 0) {
      tLabel_.push(tLabel[i]);
    }
  }
  var all_data = new Array();
  var count = 0;
  for (var key in data) {
    all_data.push({
      name: key,
      value: data[key],
      color: OUTPUT_COLORS[count++],
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
      color:'gray',
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
         labels: tLabel_,
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

  $('#show_dynamic_box').click(function() {
    $('#showgraph').html('');
    chartDir.render = 'showgraph';
    chartDir['tip']['listeners'] = {
      //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
      parseText:function(tip,name,value,text,i){
        return name+"浓度为: "+value;
      }
    };
    chartDir['crosshair'] ={
      enable:true,
      line_color:'#62bce9'//十字线的颜色
    };
    chartDir.width = 780;
    chartDir.height = 400;
    chartDir.coordinate.width = 650;
    chartDir.coordinate.height = 350;
    var chart = new iChart.LineBasic2D(chartDir);
    chart.draw();
    $('#dynamic_adjust_box').show();
    $('#draw_modal').modal('show');
    event.stopPropagation();
    return false;
  });
});

