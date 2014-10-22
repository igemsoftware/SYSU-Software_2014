/* 反应默认时间 */
TIME = 60; // sec

/* 反应物默认浓度 */
CONCENTRATION = 0.000000001;

/* 固定浓度默认值 */
FIXED_C = CONCENTRATION;

/* static图横坐标精度 */
STATIC_PRECISION = 4;

/* dynamic图横坐标精度 */
DYNAMIC_PRECISION = 2;

/* 一次获取所有circuit的数据并存在变量中 */
$(function() {
    var reactionData = JSON.parse(sessionStorage.getItem('preprocess'));
    if (reactionData == null || reactionData.length == 0) {
        $("#nodata").modal("show");
    } else {
        /* 存所有输入/simulate/的数据 */
        window.reactionOutputs = [];
        /* 存储获取的dynamic做图数据 */
        window.dynamicDrawData = [];
        /* 存储获取的static做图数据 */
        window.staticDrawData = [];

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
                    reactionOutput['c_static'] = FIXED_C;
                    for (var i = 0; i < reactionOutput['inputs'].length; ++i) {
                        reactionOutput['x0'][reactionOutput['inputs'][i]] = CONCENTRATION;
                    }
                    reactionOutputs.push(reactionOutput);
                    /* 获取dynamic数据 */
                    $.ajax({
                        type: 'POST',
                        url: '/simulation/simulate/dynamic',
                        contentType: 'application/json',
                        data: JSON.stringify(reactionOutputs[j]),
                        async: false,
                        success: function(dynamicData) {
                            dynamicDrawData.push({
                                'x': dynamicData['t'],
                            'y': dynamicData['c'],
                            });
                        },
                        fail: function() {
                            $("#nodata").modal("show");
                        },
                    });

                    /* 获取static数据 */
                    $.ajax({
                        type: 'POST',
                        url: '/simulation/simulate/static',
                        contentType: 'application/json',
                        data: JSON.stringify(reactionOutputs[j]),
                        async: false,
                        success: function(staticData) {
                            staticDrawData.push({
                                'x': staticData['c_input'],
                            'y': staticData['c_output'],
                            });
                        },
                        fail: function() {
                            $("#nodata").modal("show");
                        },
                    });
                },
                    fail: function() {
                        $("#nodata").modal("show");
                    },
            });
        }
    }
});

/* 将浮点数组的进度保留指定位数， */
function precisionControl(dataArray, p) {
    var dataArray_ = [];
    for (var i = 0; i < dataArray.length; ++i) {
        dataArray_.push(Math.round(dataArray[i] * Math.pow(10, p)) / Math.pow(10, p));
    }
    return dataArray_;
}


/* 做图 */
function drawAllGraph() {
    console.log(staticDrawData[cur_circuit]);
    drawStaticPerformance(
            precisionControl(staticDrawData[cur_circuit]['x'], STATIC_PRECISION),
            staticDrawData[cur_circuit]['y']
            );
    drawDynamicPerformance(
            precisionControl(dynamicDrawData[cur_circuit]['x'], DYNAMIC_PRECISION),
            dynamicDrawData[cur_circuit]['y']
            );
}

/* 选择circuits */
$(function() {
    cur_circuit = 0;
    allCircuits = JSON.parse(sessionStorage.getItem('circuits'));
    circuitsLogicName = [];
    for (var i = 0; i < allCircuits.length; ++i) {
        var acircuitLogicName = [];
        for (var j = 0; j < allCircuits[i]['logics'].length; ++j) {
            acircuitLogicName.push(allCircuits[i]['logics'][j]['name']);
        }

        circuitsLogicName.push(acircuitLogicName);
        $('#simulation_circuit .ui.teal.inverted.menu').append($('<a class="item">Circuit'+(i+1)+'</a>'));
    }
    $('#simulation_circuit a').click(function() {
        cur_circuit = $(this).prevAll('a').length;
        $('#logic_box').html('');
        for (var i = 0; i < circuitsLogicName[cur_circuit].length; ++i) {
            $(
                '<div class="item logic_item">' +
                '<div class="ui bottom attached label labelbg">' + circuitsLogicName[cur_circuit][i] + '</div>' +
                '<img src="/static/images/frame/' + circuitsLogicName[cur_circuit][i] + '.png" />' +
                '</div>'
             ).appendTo($('#logic_box'));
        }
        $('#dynamic_adjust_input input[type=range]').val(60).next('output').hide();
        $('#simulation_circuit a').removeClass('active');
        $(this).addClass('active');
        drawAllGraph();
        setCircuits();
    });
    $('#simulation_circuit a').eq(0).click();
});

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
        if (zIndex > otherEle.css('z-index')) {
            $(this).addClass("modal-active");
            otherEle.removeClass("modal-active");
        } else {
            otherEle.addClass("modal-active");
            $(this).removeClass("modal-active");
        }
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



/* 修改dynamic曲线 */
$(function() {
    $('#dynamic_adjust_box input[type=range]').change(function() {
        $('#graph3').html('');
        reactionOutputs[cur_circuit]['t'] = parseFloat($(this).val());
        /* 获取dynamic数据 */
        $.ajax({
            type: 'POST',
            url: '/simulation/simulate/dynamic',
            contentType: 'application/json',
            data: JSON.stringify(reactionOutputs[cur_circuit]),
            async: false,
            success: function(dynamicData) {
                drawDynamicPerformance(precisionControl(dynamicData['t'], DYNAMIC_PRECISION), dynamicData['c']);
                $('#show_dynamic_box').click();
            },
            fail: function() {
                $("#nodata").modal("show");
            },
        });
    });
});


/* 修改static曲线 */
$(changeStatic = function() {
    $('#static_adjust_box input[type=range]').change(function() {
        var reactionOutput = reactionOutputs[cur_circuit];
        var adjustVar = $(this).prop('id');
        reactionOutput['c_static'] = parseFloat($(this).val());
        /* 获取static数据 */
        $.ajax({
            type: 'POST',
            url: '/simulation/simulate/static',
            contentType: 'application/json',
            data: JSON.stringify(reactionOutput),
            async: false,
            success: function(staticData) {
                for (var i = 0; i < staticData['c_output'].length; ++i) {
                    var variable = staticData['c_output'][i]['variable'];
                    if (adjustVar.indexOf(variable) < 0) {
                        //alert(variable);
                        console.log('here');
                        console.log(staticData['c_output'][i]);
                        console.log(staticDrawData[cur_circuit]['y'][i]);
                        staticDrawData[cur_circuit]['y'][i] = staticData['c_output'][i];
                        drawDynamicPerformance(
                            precisionControl(dynamicDrawData[cur_circuit]['x'], DYNAMIC_PRECISION),
                            dynamicDrawData[cur_circuit]['y']
                            );
                        break;
                    }
                }
                $('.show_static_box').eq(i).click();

                console.log(staticDrawData[cur_circuit]);
            },
            fail: function() {
                $("#nodata").modal("show");
                window.location = '/';
            },
        });
    });
    $(this).val(CONCENTRATION);
});

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


/* 设置ciruits part */
$(setCircuits = function() {
    $('.adjust_line').remove();
    part2Img = {
        'promoter' : 'promoter.png',
    'RBS' : 'RBS2.png',
    'terminator': 'terminator2.png',
    };
    var logics = allCircuits[cur_circuit]['logics'];
    console.log('here');
    console.log(logics);
    var inputparts = [];
    var outputparts = [];
    for (var j = 0; j < logics.length; ++j) {
        for (var i = 0; i < logics[j]['inputparts'].length; ++i) {
            inputparts.push(logics[j]['inputparts'][i]);
        }
        for (var i = 0; i < logics[j]['outputparts'].length; ++i) {
            outputparts.push(logics[j]['outputparts'][i]);
        }
    }
    if (logics['logic type'] == 'toggle switch 1') {

    } else if (logics['logic type'] == 'toggle switch 2') {

    } else if (logics['logic type'] == 'or gate') {

    } else {
        for (var i = 0; i < inputparts.length; ++i) {
            var newLine = $('<tr class="adjust_line"></tr>');
            var newTD = $('<td></td>').append($('<div class="mid_line"></div>'));
            for (var j = 0; j < inputparts[i].length; ++j) {
                $(
                        '<div class="part">' +
                        '<div class="part_img">' +
                        '<img src="/static/images/circuit/' + (j == 2 ? 'output.png' : part2Img[inputparts[i][j]['type']])  + '">' +
                        '</div>' +
                        '<div class="ui label labelbg">' + inputparts[i][j]['name'] + '</div>' +
                        '</div>'
                 ).appendTo(newTD);
            }
            newLine.append(newTD).append($('<td><input type="range" min="0.00" max="1.00" step="0.1"></td>'));
            $('#simulation_adjust_main tbody:first-child').append(newLine);
        }
        for (var i = 0; i < outputparts.length; ++i) {
            var newLine = $('<tr class="adjust_line"></tr>');
            var newTD = $('<td></td>').append($('<div class="mid_line"></div>'));
            for (var j = 0; j < outputparts[i].length; ++j) {
                $(
                        '<div class="part">' +
                        '<div class="part_img">' +
                        '<img src="/static/images/circuit/' + (j == 2 ? 'outputfinal.png' : part2Img[outputparts[i][j]['type']])  + '">' +
                        '</div>' +
                        '<div class="ui label labelbg">' + outputparts[i][j]['name'] + '</div>' +
                        '</div>'
                 ).appendTo(newTD);
            }
            newLine.append(newTD).append($('<td><input type="range" min="0.00" max="1.00" step="0.1"></td>'));
            $('#simulation_adjust_main tbody:first-child').append(newLine);
        }
    }
});

/* 调节RIPS */
$(function() {
    $('.adjust_line input[type=range]').change(function() {

    });
});
