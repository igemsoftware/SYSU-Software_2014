/**
 * @file simulation-ctrl.js
 * @Control the components in simulation page.
 * @author Jiewei Wei
 * @mail weijieweijerry@163.com
 * @github https://github.com/JieweiWei
 * @data Oct 19 2014
 * @copyright 2014 SYSU-Software. All rights reserved.
 * 
 */

/* The horizontal accuracy in static graph. */
window.STATIC_PRECISION_X = 4;

/* The horizontal accuracy in dynamic graph. */
window.DYNAMIC_PRECISION_X= 2;

/* Switching tabs of #simulation_main_draw. */
$(function() {
    $('#simulation_main_draw>div').click(function() {
        /* Set the animation time. */
        var animationTime = 250;

        /* Get and curent Properties and another Properties. */
        var another = {'Static': 'Dynamic', 'Dynamic': 'Static', };
        var anotherEle = $('#'+another[$(this).prop('id')]);
        var curProp = {
            'top' : $(this).css('top'),
        'left' : $(this).css('left'),
        'zIndex' : $(this).css('z-index'),
        'opacity' : $(this).css('opacity'),
        };

        /* Exchange property between them. */
        if (curProp['zIndex'] > anotherEle.css('z-index')) {
            $(this).addClass("modal-active");
            anotherEle.removeClass("modal-active");
        } else {
            anotherEle.addClass("modal-active");
            $(this).removeClass("modal-active");
        }
        $(this).animate({
            'top': anotherEle.css('top'),
            'left': anotherEle.css('left'),
            'z-index': anotherEle.css('z-index'),
            'opacity': anotherEle.css('opacity'),
        }, animationTime);
        anotherEle.animate(curProp, animationTime);
    });
});

/* Show bottom bar. */
$(".toolbar").click(function() {
    var bottom = $("#simulation_adjust").css("bottom");
    if (bottom === "-200px") {
        $("#simulation_adjust").css({
            bottom: '0px'
        });
        $(".toolbar i").removeClass("up").addClass("down");
    } else {
        $("#simulation_adjust").css({
            bottom: '-200px'
        });
        $(".toolbar i").removeClass("down").addClass("up");
    }
});



/* Produce drop-down menu by Logics. */
$(function() {
    for (var i = 0; i < logics.length; ++i) {
        var circuitItem =
    $('<div class="ui dropdown item">Circuit ' + (i+1) + '</div>')
    .append($('<i class="dropdown icon"></i>'))
    .append($('<div class="menu"></div>'));
/* Get all of logics in a circuit. */
for (var j = 0; j < logics[i].length; ++j) {
    circuitItem.find('.menu').append($('<a class="item">Logic ' + (j+1) + '</a>'));
}
$('#simulation_circuit .ui.menu').append(circuitItem);
}
});

/* Select item of circuits and logics. */
$(function() {
    $('#simulation_circuit .ui.dropdown.item').mouseover(function() {
        $(this).find('.menu').show();
    }).mouseout(function() {
        $(this).find('.menu').hide();
    });

    $('#simulation_circuit .ui.dropdown.item .item')
    .unbind('click').bind('click', function() {
        $('#simulation_circuit .ui.dropdown.item .item').removeClass('active');
        $('#simulation_circuit .ui.dropdown.item').removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().addClass('active');

        /* Record the current circuit and logic. */
        window.curCircuit = $('#simulation_circuit a.item.active').parent().parent().prevAll('.ui.dropdown.item').length;
        window.curLogic = $('#simulation_circuit a.item.active').prevAll('a.item').length;

        SwitchLogic();
        ChartAllGraphs();
        SetCircuits();
    });
});


/**
 * @Switch logic image and ajust line. 
 *
 */
function SwitchLogic() {
    $('<div class="ui segment logic_item">' +
            '<div class="ui bottom attached label labelbg">' + logics[curCircuit][curLogic]['name'] + '</div>' +
            '<img src="/static/images/frame/' + logics[curCircuit][curLogic]['name'] + '.png" />' +
            '</div>'
     ).appendTo($('#logic_box').html(''));
}

/**
 * @Retain p decimal places. 
 *
 * @param {dataArray} array of float.
 *
 * @param {p} accuracy.
 * 
 *@return array with p decimal places.
 */
function PrecisionControl(dataArray, p) {
    var dataArray_ = [];
    for (var i = 0; i < dataArray.length; ++i) {
        dataArray_.push(dataArray[i].toFixed(p));
    }
    return dataArray_;
}


/* Chart all graphs. */
function ChartAllGraphs() {
    if (staticDrawData[curCircuit]['x'] != undefined &&
            staticDrawData[curCircuit]['y'] != undefined) {
                DrawStaticPerformance(
                        PrecisionControl(staticDrawData[curCircuit]['x'], STATIC_PRECISION_X),
                        staticDrawData[curCircuit]['y']
                        );
            } else {
                //alert('Simulate Error');
            }
    DrawDynamicPerformance(
            PrecisionControl(dynamicDrawData[curCircuit]['x'], DYNAMIC_PRECISION_X),
            dynamicDrawData[curCircuit]['y']
            );
}


/* Adjust time interval. */
$(function() {
    $('#dynamic_adjust_box input[type=range]').change(function() {
        $('#graph3').html('');
        reactionInfos[curCircuit]['t'] = parseFloat($(this).val());

        /* Get dynamic data. */
        $.ajax({
            type: 'POST',
            url: '/simulation/simulate/dynamic',
            contentType: 'application/json',
            data: JSON.stringify(reactionInfos[curCircuit]),
            async: false,
            success: function(dynamicData) {
                /* Record the time interval in the current circuit. */
                recordAdjustValues[curCircuit]['t'] = reactionInfos[curCircuit]['t'];

                dynamicDrawData[curCircuit]['x'] = dynamicData['t'];
                dynamicDrawData[curCircuit]['y'] = dynamicData['c'];
                ChartAllGraphs();
                $('#show_dynamic_box').click();
            },
            fail: function() {
                $("#nodata").modal("show");
            },
        });
    });
});

/* Adjust the concentration of anther input. */
$(AdjustStatic = function() {
    //ShowOutput();
    $('#static_adjust_box input[type=range]').unbind('change').bind('change', function() {
        var adjustVar = $(this).prop('id');
        reactionInfos[curCircuit]['c_static'] = parseFloat($(this).val());

        /* Get static data. */
        $.ajax({
            type: 'POST',
            url: '/simulation/simulate/static',
            contentType: 'application/json',
            data: JSON.stringify(reactionInfos[curCircuit]),
            async: false,
            success: function(staticData) {
                for (var i = 0; i < staticData['c_output'].length; ++i) {
                    var variable = staticData['c_output'][i]['variable'];
                    if (adjustVar.indexOf(variable) < 0) {
                        /* Record the c_static of current circuit. */
                        recordAdjustValues[curCircuit]['c_static'][adjustVar.substring(0, adjustVar.length-3)] = reactionInfos[curCircuit]['c_static'];

                        staticDrawData[curCircuit]['y'][i] = staticData['c_output'][i];
                        ChartAllGraphs();
                        $('.show_static_box').eq(i).click();
                    }
                }
            },
            fail: function() {
                $("#nodata").modal("show");
            },
        });
    });
});

/* Set ciruits part. */
function SetCircuits () {
    $('.adjust_line').remove;
    var partStr =
        '<div class="part">' +
        '<div class="part_img">' +
        '<img src="/static/images/circuit/">' +
        '</div>' +
        '<div class="ui label labelbg"></div>' +
        '</div>';
    $('.adjust_line').remove();
    var part2Img = {
        'promoter' : 'promoter.png',
        'RBS' : 'RBS2.png',
        'terminator': 'terminator2.png',
    };

    var logic = logics[curCircuit][curLogic];
    var allParts = logic['inputparts'].concat(logic['outputparts']);
    for (var m = 0; m < allParts.length; ++m) {
        var newLine = $(
                '<tr class="adjust_line">' +
                '<td class="main_parts"><div class="mid_line"></div></td>' +
                '<td class="adjust_part">' +
                '<button class="adjust_button"><i class="left arrow icon"></i></button>' +
                '<input name="RIPS" class="adjust_input" type="range" min="0" max="53" step="1" value="' +
                recordAdjustValues[curCircuit]['circuitRBS'][curLogic][m] + '"/>' +
                '<output for="RIPS"></output>' +
                '<button class="adjust_button"><i class="right arrow icon"></i><buttpn>' +
                '</td>' +
                '</tr>'
                );
        for (var n = 0; n < allParts[m].length; ++n) {
            var newPart = $(partStr);
            var imgSrc = '';
            if (n == 2) {
                if (logic['logic_type'] == 'toggle_switch_2') {
                    imgSrc = (m == 0 ? 'output.png' : 'outputfinal.png');
                } else if (logic['logic_type'] == 'or_gate' || logic['logic_type'] == 'simple_logic') {
                    imgSrc = 'outputfinal.png';
                } else {
                    imgSrc = (m < logic['inputparts'].length ? 'output.png' : 'outputfinal.png');
                }
            } else if (n == 3 && m == 1 && logic['logic_type'] == 'toggle_switch_1') {
                imgSrc = 'outputfinal.png';
                newLine.find('.mid_line').css('width', '80%');
            } else {
                imgSrc = part2Img[allParts[m][n]['type']];
            }
            newPart.find('img').prop('src', '/static/images/circuit/' + imgSrc);
            newPart.find('.ui.label.labelbg').text(allParts[m][n]['name']);
            newLine.find('.main_parts').append(newPart);
        }
        newLine.appendTo($('#simulation_adjust_main tbody'));
    }
    AdjustRBS();
    SelectRBS();
};

/* Adjust RIPS. */
$(AdjustRBS = function() {
    $('.adjust_line input[type=range]').unbind('change').bind('change', function() {
        var index = $(this).parent().parent('.adjust_line').prev().length;
        /* Modify RBS. */
        var RBS = RBSList[$(this).val()];
        /* Record the RBS type. */
        recordAdjustValues[curCircuit]['circuitRBS'][curLogic][index] = parseInt($(this).val());

        var curPart = $(this).parent().prev('td').children('.part');
        curPart.eq(1).find('.ui.label.labelbg').text(RBS);

        /* Modify the curve. */
        var outputName = curPart.eq(2).find('.ui.label.labelbg').text();
        reactionInfos[curCircuit]['output_RBS'][outputName] = RBS;
        /* Get static data. */
        $.ajax({
            type: 'POST',
            url: '/simulation/simulate/static',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(reactionInfos[curCircuit]),
            async: false,
            complete: function(data) {
                if (data.responseText.indexOf('NaN') >= 0) {
                    staticDrawData[curCircuit] = {
                        'x': undefined,
            'y': undefined,
                    };
                } else {
                    var staticData = JSON.parse(data.responseText);
                    staticDrawData[curCircuit] = {
                        'x': staticData['c_input'],
            'y': staticData['c_output'],
                    };
                }
            },
            fail: function() {
                $("#nodata").modal("show");
            },
        });

        /* Get dynamic data. */
        $.ajax({
            type: 'POST',
            url: '/simulation/simulate/dynamic',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(reactionInfos[curCircuit]),
            async: false,
            success: function(dynamicData) {
                dynamicDrawData[curCircuit] = {
                    'x': dynamicData['t'],
            'y': dynamicData['c'],
                };
            },
            fail: function() {
                $("#nodata").modal("show");
            },
        });
        ChartAllGraphs();
    });
});

$(SelectRBS = function() {
    ShowOutput();
    $('.left.arrow.icon').unbind('click').bind('click', function() {
        var input = $(this).parent().parent().find('input[type=range]');
        if (input.val() > 0) {
            input.val(parseInt(input.val()) -1).change().mouseup();
        }
    });
    $('.right.arrow.icon').unbind('click').bind('click', function() {
        var input = $(this).parent().parent().find('input[type=range]');
        if (input.val() < 53) {
            input.val(parseInt(input.val()) +1).change().mouseup();
        }
    });
});

/* The first logic of the first circuit selected by default. */
$(function() {
    $('#simulation_circuit .ui.dropdown.item:first-child').find('a.item:first-child').click();
});
