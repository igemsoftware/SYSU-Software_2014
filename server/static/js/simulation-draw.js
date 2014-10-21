/**
 * @file simulation-draw.js
 * @draw a line graph in simulation page.
 * @author Jiewei Wei
 * @mail weijieweijerry@163.com
 * @github https://github.com/JieweiWei
 * @data Oct 19 2014
 * @copyright 2014 SYSU-Software. All rights reserved.
 * 
 */

/* Color output curve. */
window.OUTPUT_COLORS = ['#FF0000', '#00FF00', '#0000FF'];

/* The number of horizontal displayed points in dynamic graph. */
window.NUM_OF_SCALE = 10;

/* The Vertical accuracy in  graph. */
window.PRECISION_Y = 3;

/* Common property of line graph. */
window.SAME_PROPERTIES = {
  align: 'center',
  tip: {
    enable: true,
    shadow: true,
    move_duration: 400,
    border: {
        enable: true,
        radius: 5,
        width: 0,
    },
    listeners: {
      parseText:function(tip,name,value,text,i){
        return name + " : " + (parseFloat(value).toFixed(PRECISION_Y));
    },
  },
  },
  legend: {
      enable: true,
      row: 1,
      column: 'max',
      valign: 'top',
      sign: 'bar',
      background_color: null,
      offsetx: -80,
      border: true,
      color: 'gray',
  },
  sub_option: {
      smooth : true,
      label: false,
      point_size: 0,
  },
  background_color: null,
  border: {
      enable: false,
      width:0,
  },
  crosshair: {
    enable:true,
    line_color:'#62bce9',
  },
};

/**
 * @Adjustment data accuracy.
 *
 * @param {rowData} raw data.
 *
 * @return {data} data adjusted.
 * 
 * @return {min} the accuracy.
 * 
 */
function AdjustDataY(rowData) {
  var newData = new Array();
  var minAll = 999999;
  for (var key in rowData) {
    var min = 99999;
    for (var i = 0; i < rowData[key].length; ++i) {
      var num = parseFloat(rowData[key][i]).toExponential(PRECISION_Y) ;
      var e = parseInt(num.split('e')[1]);
      if (e < min) {
        min = e;
      }
    }
    if (min < minAll) {
      minAll = min;
    }
  }
  for (var key in rowData) {
    var aNewData = new Array();
    for (var i = 0; i < rowData[key].length; ++i) {
      aNewData.push(rowData[key][i] * Math.pow(10, -minAll))
    }
    newData[key] = aNewData;
  }
  return {'data': newData, 'e': minAll};
}

/**
 * @Create static_box. 
 *
 * @param {numOfInput} number of inputs.
 *
 */
function CreateStaticBox(numOfInput) {
  if (numOfInput == 1) {
    $('#Static_main').css('padding', '0 25% 0 25%');
    $(
        '<div class="static_box">' +
        '<div class="ui segment blackglass s_graph" id="graph1"></div>' +
        '</div>'
     ).appendTo('#Static_main');
  } else {
    $('#Static_main').css('padding', '0');
    for (var i = 1; i <= numOfInput; ++i) {
      $(
          '<div class="static_box">' +
          '<i class="search icon show_static_box"></i>' +
          '<div class="ui segment blackglass s_graph" id="graph'+i+'"></div>' +
          '</div>'
       ).appendTo('#Static_main');
    }
  }
  ShowStaticModal();
  AdjustStatic();
}

/*  Paint graph(s) in static performance. */
function DrawStaticPerformance(labels, output) {
    /* Reset the components. */
    $('.static_box').remove();
    CreateStaticBox(output.length);

    inputDatas = new Array();
    var es = new Array();
    for (var i = 0; i < output.length; ++i) {
        var inputData = new Array();
        inputData['var'] = output[i]['variable'];
        inputData['output'] = [];
        var count = 0;
        var rowData = new Array();
        for (var outputName in output[i]['c']) {
          rowData[outputName] = output[i]['c'][outputName];
        }
        var newData = AdjustDataY(rowData);
        es.push(newData['e']);
        for (var outputName in output[i]['c']) {
            inputData['output'].push({
                name: outputName,
                value: newData['data'][outputName],
                color: OUTPUT_COLORS[count++],
                line_width: 3,
            });
        }
        inputDatas.push(inputData);
    }

    /* Setting all properties of graph. */
    window.chartDirs = new Array();
    for (var i = 0; i < inputDatas.length; ++i) {
        chartDirs.push({
            render: 'graph' + (i+1),
            data: inputDatas[i]['output'],
            title: {text: 'Static performance', color: 'gray'},
            width : 450,
            height : 300,
            background_color: SAME_PROPERTIES['background_color'],
            tip: SAME_PROPERTIES['tip'],
            legend: SAME_PROPERTIES['legend'],
            sub_option: SAME_PROPERTIES['sub_option'],
            subtitle: {
              text: 'Concentration of output(s)/10^' + es[i] + 'mM',
              fontsize:12,
              color:'gray',
              textAlign:'left',
              padding:'0 0 0 0',
              height:30,
            },
            crosshair: SAME_PROPERTIES['crosshair'],
            footnote:{
              text: inputDatas[i]['var']+'/mM',
              padding:'20 20',
              height:30,
            },
            coordinate: {
              width: 360,
              height: 250,
              grid_color: 'gray',
              axis:{
                color:'gray',
                width:1
              },
            scale:[{
                position:'left',
                scale_color:'gray',
                label: {color: 'gray'},
            },{
                position:'bottom',
                labels: labels,
                label: {color: 'gray'},
            }],
            },
                border: {
                    enable: false,
                    width:0,
                },
        });
        /* Pain the graph. */
        var chart = new iChart.LineBasic2D(chartDirs[i]);
        chart.draw();
    }
}

/* Paint graph in dynamic performance. */
function DrawDynamicPerformance(tLabel, data) {
    /* Set the horizontal scale. */
    var tLabel_ = [];
    for (var i = 0; i < tLabel.length; ++i) {
        if (i % parseInt(tLabel.length / NUM_OF_SCALE) == 0) {
            tLabel_.push(tLabel[i]);
        }
    }

    var allData = new Array();
    var count = 0;
    var rowData = new Array();
    for (var key in data) {
      rowData[key] = data[key];
    }
    var newData = AdjustDataY(rowData);
    for (var key in data) {
        allData.push({
          name: key,
          value: newData['data'][key],
          color: OUTPUT_COLORS[count++],
          line_width: 3,
        });
    }

    /* Setting all properties of graph. */
    chartDir = {
        render : 'graph3',
        data: allData,
        align: SAME_PROPERTIES['align'],
        title : {text: 'Dynamic performance', color: 'gray'},
        width : 770,
        height : 320,
        background_color: SAME_PROPERTIES['background_color'],
        footnote: SAME_PROPERTIES['footnote'],
        crosshair: SAME_PROPERTIES['crosshair'],
        tip: SAME_PROPERTIES['tip'],
          subtitle: {
            text: 'Concentration of output(s)/10^' + newData['e'] + 'mM',
            fontsize:12,
            color:'gray',
            textAlign:'left',
            padding:'0 0 0 0',
            height:30
        },
        footnote:{
          text: 'time/min',
          padding:'20 20',
          height:30,
        },
        legend: SAME_PROPERTIES['legend'],
        sub_option: SAME_PROPERTIES['sub_option'],
        coordinate:{
            width: 620,
            height: 240,
            grid_color: 'gray',
            axis:{
                color:'gray',
                width:1
            },
            scale:[{
                position:'left',
                scale_color:'gray',
                label: {color: 'gray'},
            },{
                position:'bottom',
                labels: tLabel_,
                label: {color: 'gray'},
            }],
        },
        border: {
            enable: false,
            width:0,
        },
    };

    /* Pain the graph. */
    var chart = new iChart.LineBasic2D(chartDir);
    chart.draw();
}

/* Show static modal. */
$(ShowStaticModal = function() {
  $('.static_box i').click(function(event) {
      /* Clear the graph in the modal box. */
      $('#showgraph').html('');
      var index = $(this).parent().prevAll('.static_box').length;
      var negate = [1, 0];

      /* Modify the properties of the graph. */
      chartDirs[index].render = 'showgraph';
      chartDirs[index].width = 780;
      chartDirs[index].height = 400;
      chartDirs[index].coordinate.width = 650;
      chartDirs[index].coordinate.height = 350;
      var anotherVarName = chartDirs[negate[index]]['footnote']['text'];
      $('#dynamic_adjust_box').hide();
      $('#static_adjust_box').show()
          .find('h3').text('Concentration of ' + anotherVarName);
      $('#static_adjust_box')
        .find('input[type=range]')
        .prop('id', anotherVarName)
        /* Set time interval value. */
        .val(recordAdjustValues[curCircuit]['c_static'][anotherVarName.substring(0, anotherVarName.length-3)]);
      $('.adjust_input').mouseup();
      /* Chart the graph in the modal box. */
      var chart = new iChart.LineBasic2D(chartDirs[index]);
      chart.draw();

      /* Show the modal box. */
      $('#draw_modal').modal('show');
      event.stopPropagation();
      return false;
  });
});

/* Show dynamic modal. */
$(function() {
  $('#show_dynamic_box').click(function() {
      /* Clear the graph in the modal box. */
      $('#showgraph').html('');

      /* Modify the properties of the graph. */
      chartDir.render = 'showgraph';
      chartDir.width = 780;
      chartDir.height = 400;
      chartDir.coordinate.width = 630;
      chartDir.coordinate.height = 350;
      $('#dynamic_adjust_box')
        .show()
        /* Set time interval value. */
        .find('input[type=range]').val(recordAdjustValues[curCircuit]['t']);
      $('.adjust_input').mouseup();
      $('#static_adjust_box').hide();

      /* Chart the graph in the modal box. */
      var chart = new iChart.LineBasic2D(chartDir);
      chart.draw();

      /* Show the modal box. */
      $('#draw_modal').modal('show');
      event.stopPropagation();
      return false;
  });
});
