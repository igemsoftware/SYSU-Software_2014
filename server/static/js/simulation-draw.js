/* 画图共同属性 */
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
    smooth : true,//平滑曲线
    label: false,
    point_size: 0,
  },
  subtitle: {
    text: 'concentration of output(s)',//利用副标题设置单位信息
    fontsize:12,
    color:'gray',
    textAlign:'left',
    padding:'0 0 0 0',
    height:30
  },
  //background_color: '#FEFEFE',
  background_color: null,
  border: null,
};

/* 输出的曲线颜色 */
OUTPUT_COLORS = ['#FF0000', '#0000FF', '#00FF00'];

/* dynamic横坐标显示点的个数 */
NUM_OF_SCALE = 10;

/* 创建静态画图box */
function createStaticBox(numOfInput) {
  if (numOfInput == 1) {
    $('#Static_main').css('padding', '0 25% 0 25%');
    $(
      '<div class="static_box">' +
        '<div class="s_graph" id="graph1"></div>' +
      '</div>'
    ).appendTo('#Static_main');
  } else {
    $('#Static_main').css('padding', '0');
    for (var i = 1; i <= numOfInput; ++i) {
      $(
        '<div class="static_box">' +
          '<i class="search icon" class="show_static_box"></i>' +
            '<div class="s_graph" id="graph'+i+'"></div>' +
        '</div>'
      ).appendTo('#Static_main');
    }
  }
  showStaticModal();
  changeStatic();
}

/* 画出static performance中的两张图 */
function drawStaticPerformance(labels, output) {
  $('.static_box').remove();
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
      background_color: SAME_PROPERTIES['background_color'],
      tip: SAME_PROPERTIES['tip'],
      legend: SAME_PROPERTIES['legend'],
      sub_option: SAME_PROPERTIES['sub_option'],
      subtitle: SAME_PROPERTIES['subtitle'],
      footnote: inputDatas[i]['var'],
      coordinate: {
        width: 380,
        height: 250,
        axis:{
          color:'#dcdcdc',
          width:1
        },
        scale:[{
           position:'left',
           scale_color:'#9f9f9f'
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

/* 点击static打开模态框 */
$(showStaticModal = function() {
  $('.static_box i').click(function(event) {
    $('#showgraph').html('');
    var index = $(this).parent().prevAll('.static_box').length;
    var negate = [1, 0];
    chartDirs[index].render = 'showgraph';
    chartDirs[index]['tip']['listeners'] = {
      //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
      parseText:function(tip,name,value,text,i){
        return name+"浓度为: "+value;
      }
    };
    chartDirs[index]['crosshair'] ={
      enable:true,
      line_color:'#62bce9'//十字线的颜色
    };
    chartDirs[index].width = 780;
    chartDirs[index].height = 400;
    chartDirs[index].coordinate.width = 650;
    chartDirs[index].coordinate.height = 350;
    var chart = new iChart.LineBasic2D(chartDirs[index]);
    chart.draw();
    $('#dynamic_adjust_box').hide();
    if (chartDirs.length == 2) {
      $('#static_adjust_box').show()
        .find('h3').text('concentration of '+chartDirs[negate[index]]['footnote']);
      $('#static_adjust_box').find('input[type=range]').prop('id', chartDirs[negate[index]]['footnote']);
    }
    $('#draw_modal').modal('show');
    event.stopPropagation();
    return false;
  });
});


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
    background_color: SAME_PROPERTIES['background_color'],
    footnote: 'time/sec',
    tip: SAME_PROPERTIES['tip'],
    subtitle: SAME_PROPERTIES['subtitle'],
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
        scale_color:'#9f9f9f'
      },{
        position:'bottom',
        labels: tLabel_,
      }]
    }
  };
  var chart = new iChart.LineBasic2D(chartDir);
  chart.draw();
}

/* 点击dynamic打开模态框*/
$(function() {
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
    $('#static_adjust_box').hide();
    $('#draw_modal').modal('show');
    event.stopPropagation();
    return false;
  });
});

