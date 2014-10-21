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
    subtitle: {
        text: 'concentration of output(s)/mM',
        fontsize:12,
        color:'gray',
        textAlign:'left',
        padding:'0 0 0 0',
        height:30
    },
    background_color: null,
    border: {
        enable: false,
        width:0,
    },
    listeners: {
      parseText:function(tip,name,value,text,i){
        return name + " : " + value;
      }
    },
    crosshair: {
      enable:true,
      line_color:'#62bce9',
    }
};

/* Color output curve. */
window.OUTPUT_COLORS = ['#D95C5C', '#6ECFF5', '#00B5AD'];

/* The number of horizontal displayed points in dynamic graph. */
window.NUM_OF_SCALE = 10;

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
    for (var i = 0; i < output.length; ++i) {
        var inputData = new Array();
        inputData['var'] = output[i]['variable'];
        inputData['output'] = [];
        var count = 0;
        for (var outputName in output[i]['c']) {
            inputData['output'].push({
                name: outputName,
                value:  ArrayToExponential(output[i]['c'][outputName], STATIC_PRECISION_Y),
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
            subtitle: SAME_PROPERTIES['subtitle'],
            footnote:{
              text: inputDatas[i]['var']+'/mM',
              padding:'20 20',
              height:30,
            },
            coordinate: {
              width: 380,
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
    for (var key in data) {
        allData.push({
            name: key,
            value: ArrayToExponential(data[key], DYNAMIC_PRECISION_Y),
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
        tip: SAME_PROPERTIES['tip'],
        subtitle: SAME_PROPERTIES['subtitle'],
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
      chartDirs[index]['tip']['listeners'] = SAME_PROPERTIES['listeners'];
      chartDirs[index]['crosshair'] = SAME_PROPERTIES['crosshair'];
      chartDirs[index].width = 780;
      chartDirs[index].height = 400;
      chartDirs[index].coordinate.width = 650;
      chartDirs[index].coordinate.height = 350;
      $('#dynamic_adjust_box').hide();
      $('#static_adjust_box').show()
          .find('h3').text('concentration of ' + chartDirs[negate[index]]['footnote']['text']);
      $('#static_adjust_box').find('input[type=range]').prop('id', chartDirs[negate[index]]['footnote']['text']);

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
      chartDir['tip']['listeners'] = SAME_PROPERTIES['listeners'];
      chartDir['crosshair'] = SAME_PROPERTIES['crosshair'];
      chartDir.width = 780;
      chartDir.height = 400;
      chartDir.coordinate.width = 630;
      chartDir.coordinate.height = 350;
      $('#dynamic_adjust_box').show();
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
