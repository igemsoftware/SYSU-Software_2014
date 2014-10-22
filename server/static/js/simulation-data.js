/**
 * @file simulation-data.js
 * @get relevant data of simulation page.
 * @author Jiewei Wei
 * @mail weijieweijerry@163.com
 * @github https://github.com/JieweiWei
 * @data Oct 19 2014
 * @copyright 2014 SYSU-Software. All rights reserved.
 *
 */

/* The default reaction time. */
window.TIME = 60;

/* Default concentration of reactants. */
window.CONCENTRATION = 1e-9;

/* Default ajust concentration of reactants. */
window.ADJUST_CONCENTRATION = 0.0001;

/* Fixed concentration of defaults. */
window.FIXED_C = CONCENTRATION;


/* Access to relevant data of all circuits. */
$(function() {
    window.reactionData = JSON.parse(sessionStorage.getItem('preprocess'));
    if (reactionData == null || reactionData.length == 0) {
        $("#nodata").modal("show");
    } else {
        /* Store reaction information. */
        window.reactionInfos = [];
        /* Store dynamic data. */
        window.dynamicDrawData = [];
        /* Store static data. */
        window.staticDrawData = [];

        /* Get all reaction information. */
        for (var j = 0; j < reactionData.length; ++j) {
            $.ajax({
                type: 'POST',
                url: 'simulation/preprocess',
                contentType: "application/json",
                data: JSON.stringify([reactionData[j]]),
                async: false,
                success: function(reactionInfo) {
                    reactionInfo['t'] = TIME;
                    reactionInfo['x0'] = {};
                    reactionInfo['c_static'] = FIXED_C;
                    for (var i = 0; i < reactionInfo['inputs'].length; ++i) {
                        reactionInfo['x0'][reactionInfo['inputs'][i]] = CONCENTRATION;
                    }
                    reactionInfos.push(reactionInfo);

                    /* Get static data. */
                    $.ajax({
                        type: 'POST',
                        url: '/simulation/simulate/static',
                        contentType: 'application/json',
                        dataType: 'json',
                        data: JSON.stringify(reactionInfos[j]),
                        async: false,
                        complete: function(data) {
                            if (data.responseText.indexOf('NaN') >= 0) {
                                staticDrawData.push({
                                    'x': undefined,
                                    'y': undefined,
                                });
                            } else {
                                var staticData = JSON.parse(data.responseText);
                                staticDrawData.push({
                                    'x': staticData['c_input'],
                                    'y': staticData['c_output'],
                                });
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
                        data: JSON.stringify(reactionInfos[j]),
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
                },
                    fail: function() {
                        $("#nodata").modal("show");
                    },
            });
        }
    }
});

/* Get all information of logics. */
$(function() {
    window.circuits = JSON.parse(sessionStorage.getItem('circuits'));
    /* Store logcis of each circuits. */
    window.logics = [];
    for (var i = 0; i < circuits.length; ++i) {
        logics.push(circuits[i]['logics']);
    }
});

/* Get RIPS of current logic of current circuit. */
$(function() {
    window.RBSList = [];
    window.alphaList = [];
    $.ajax({
        url: '/biobrick/RBS',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            for (var i = 0; i < data['result'].length; ++i) {
                RBSList.push(data['result'][i]['name']);
                alphaList.push(data['result'][i]['alpha']);
            }
        },
        fail: function() {
            $("#nodata").modal("show");
        },
    });
});

$(function() {
    /* Record the adjusted values. */
    window.recordAdjustValues = [];
    /* For each circuit. */
    for (var i = 0; i < logics.length; ++i) {
        recordAdjustValues.push({
            't': TIME,
            'c_static': {},
            'circuitRBS': [],
        });
        for (var j = 0; j < reactionData.length; ++j) {
            var input = reactionData[i]['inputs'];
            for (var k = 0; k < input.length; ++k) {
                $.ajax({
                    url: '/biobrick/input?id=' + input[k]['id'],
                    type: 'GET',
                    contentType: 'application/json',
                    dataType: 'json',
                    async: false,
                    success: function(data) {
                        recordAdjustValues[i]['c_static'][data['result']['name']] = ADJUST_CONCENTRATION;
                    }
                });
            }
        }
        /* For each logic. */
        for (var j = 0; j < logics[i].length; ++j) {
            var allParts = logics[i][j]['inputparts'].concat(logics[i][j]['outputparts']);
            var logicRBS = [];
            /* For each part. */
            for (var k = 0; k < allParts.length; ++k) {
                logicRBS.push($.inArray(allParts[k][1]['name'] ,RBSList));
            }
            recordAdjustValues[i]['circuitRBS'].push(logicRBS);
        }
    }
});

/* Show data in console for test. */
function ShowData() {
    console.log('reactionInfos: ');
    console.log(reactionInfos);

    console.log('staticDrawData: ');
    console.log(staticDrawData);

    console.log('dynamicDrawData: ');
    console.log(dynamicDrawData);

    console.log('circuits: ');
    console.log(circuits);

    console.log('logics: ');
    console.log(logics);

    console.log('RBSList: ');
    console.log(RBSList);

    console.log('alphaList: ');
    console.log(alphaList);

    console.log('recordAdjustValues: ');
    console.log(recordAdjustValues);

    return reactionInfos.length == circuits.length &&
        staticDrawData.length == circuits.length &&
        dynamicDrawData.length == circuits.length &&
        logics.length == circuits.length &&
        RBSList.length == 54 &&
        recordAdjustValues.length == circuits.length;
}
