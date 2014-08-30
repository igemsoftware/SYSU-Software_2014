$(document).ready(function() {
  simulation_select();
  drawStaticPerformance();
  selectDrawDynamicPerformance();
  drawDynamicPerformance();
  drawExpressionEfficiency();
  adjust_param();
});

/* 选择显示不同的图像 */
function simulation_select() {
  $('#simulation_select').find('select').click(function() {
    var select_id = $(this).val().split(' ').join('_');
    $('.select_item').each(function() {
      if ($(this).prop('id') == select_id) {
        $(this).css('display', 'block');
      } else {
        $(this).css('display', 'none');
      }
    });
  });
}

/* 画出static performance中的两张图 */
function drawStaticPerformance() {
  var data = [{
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
  var chartDir1and2 = {
    render: '',
    data: [],
    title: 'Concentration of Input 1',
    width: 400,
    heigt: 200,
    coordinate: {height: '90%', background_color: '#f6f9fa', },
    sub_option:{
      hollow_inside: false,
      point_size: 16
    },
    labels: [0, 1, 2, 3, 4, 5],
  };
  chartDir1and2.data = [data[0]];
  chartDir1and2.render = 'graph1';
  var chart1 = new iChart.LineBasic2D(chartDir1and2);
  chart1.draw();
  chartDir1and2.data = [data[1]];
  chartDir1and2.render = 'graph2';
  var chart2 = new iChart.LineBasic2D(chartDir1and2);
  chart2.draw();
}

/* 画出dynamic performance中的图 */
function drawDynamicPerformance() {
  window.all_data = [{
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
  window.chartDir = {
    render: 'graph3',
    data: all_data,
    title: 'Concentration of Input 2',
    width: 1100,
    heigt: 800,
    coordinate: {height: '90%', background_color: '#f6f9fa', },
    sub_option:{
      hollow_inside: false,
      point_size: 16
    },
    labels: [1, 2, 3, 4, 5, 6, 7],
  };
  var chart = new iChart.LineBasic2D(chartDir);
  chart.draw();
}

/* 选择显示dynamic performance中的折线 */
function selectDrawDynamicPerformance() {
  $('#Dynamic_Performance').find('select').click(function() {
    if ($(this).val() == 'all') {
      chartDir.data = all_data;
      var chart = new iChart.LineBasic2D(chartDir);
      chart.draw();
    } else {
      var index = parseInt($(this).val());
      chartDir.data = [all_data[index]];
      var chart = new iChart.LineBasic2D(chartDir);
      chart.draw();
    }
  });
}

/* 画出expression efficiency中的图 */
function drawExpressionEfficiency() {
  var data = [{
    name : 'BBa_C0061',
    value:  [0, 24, 30, 30, 30, 30],
    color:  '#0d8ecf',
    line_width:  2,
  }, {
    name : 'BBa_C0062',
    value:  [0, 18, 24, 24, 24, 24],
    color:  '#8e0dcf',
    line_width:  2,
  }];
  var labels = [0, 1200, 2400, 3600, 4800, 6000];
  var line = new iChart.LineBasic2D({
    render :  'graph4',
    data:  data,
    align: 'center',
    title :  'Simulation',
    width :  500,
    height :  300,
    sub_option: {
      smooth :  true,//平滑曲线
      point_size: 10
    },
    tip: {
      enable: true,
      shadow: true
    },
    legend :  {
      enable :  false
    },
    crosshair: {
      enable: true,
      line_color: '#62bce9'
    },
    coordinate: {
      width: 450,
      valid_width: 400,
      height: 260,
      axis: {
        color: '#9f9f9f',
        width: [0,0,2,2]
      },
      grids: {
        vertical: {
          way: 'share_alike',
          value: 12
        }
      },
      scale: [{
         position: 'left',
         start_scale: 0,
         end_scale: 36,
         scale_space: 6,
         scale_size: 2,
         scale_color: '#9f9f9f'
      },{
         position: 'bottom',
         labels: labels
      }]
    }
  });
  //开始画图
  line.draw();
}
