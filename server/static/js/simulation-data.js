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

/* Fixed concentration of defaults. */
window.FIXED_C = CONCENTRATION;

/* The horizontal accuracy in static graph. */
window.STATIC_PRECISION_X = 4;

/* The horizontal accuracy in dynamic graph. */
window.DYNAMIC_PRECISION_X= 2;

/* The Vertical accuracy in static graph. */
window.STATIC_PRECISION_Y = 3;

/* The Vertical accuracy in dynamic graph. */
window.DYNAMIC_PRECISION_Y = 3;

/* Access to relevant data of all circuits. */
$(function() {
  var reactionData = JSON.parse(sessionStorage.getItem('preprocess'));
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

  return reactionInfos.length == circuits.length &&
              staticDrawData.length == circuits.length &&
              dynamicDrawData.length == circuits.length &&
              logics.length == circuits.length;
}