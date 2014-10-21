/**
 * @file dna.js
 * @Control the components in dna page.
 * @author Jiewei Wei
 * @mail weijieweijerry@163.com
 * @github https://github.com/JieweiWei
 * @data Oct 19 2014
 * @copyright 2014 SYSU-Software. All rights reserved.
 * 
 */

/* Color list. */
window.colors = {
    'promoter' : 'rgb(255, 128, 0)',
    'RBS': 'rgb(0, 127, 255)',
    'terminator': 'rgb(210, 0, 0)',
    'output': 'rgb(160, 32, 240)',
    'biobrick_scar': 'rgb(128,128,128)',
    'poly_A': 'rgb(128,128,128)',
};

/* Number of rows in each new DNA. */
window.LINE_OF_SHOW = 4;
/* The number of DNA cell line displayed. */
window.LEN_OF_LINE = 42;
/* Color coefficient. */
window.COLOR_PERCENTAGE = 1.4;
};

/* Get input and output data. */
$(function() {
    $("#progress").modal('setting', 'closable', false).modal("show");
    var preprocess = JSON.parse(sessionStorage.getItem('preprocess'));
    if (preprocess == null) {
        $("#progress").hide();
        $("#nodata").modal("show");
    } else {
        for (var j = 0; j < preprocess.length; ++j) {
            $('<ul class="ui segment blackglass"></ul>')
              .append($('<li class="ui teal horizontal label">Circult'+ (j+1) +'</li>'))
              .append($('<li class="inputs"><div class="ui red horizontal label equal">Inputs </div></li>'))
              .append($('<li class="outputs"><div class="ui purple horizontal label equal">Outputs</div></li>'))
              .appendTo($('#dna_header'));
        }
        for (var i = 0; i < preprocess.length; ++i) {
            var inputs = preprocess[i]['inputs'];
            var outputs = preprocess[i]['outputs'];
            for (var j = 0; j < inputs.length; ++j) {
                $.ajax({
                    type: 'GET',
                    url: '/biobrick/input?id=' + inputs[j]['id'],
                    contentType: 'application/json',
                    async: false,
                    success: function(data) {
                        var input = $('#dna_header ul').eq(i).find('li.inputs');
                        input.append("[" + data['result']['name'] + "] ");
                    },
                });
            }
            for (var j = 0; j < outputs.length; ++j) {
                $.ajax({
                    type: 'GET',
                    url: '/biobrick/output?id=' + outputs[j],
                    contentType: 'application/json',
                    async: false,
                    success: function(data) {
                        var output = $('#dna_header ul').eq(i).find('li.outputs');
                        output.append("[" + data['result']['name'] + "] ");
                    },
                });
            }
        }
    }
});

/* Get dna data. */
$(function() {
    var circuits = JSON.parse(sessionStorage.getItem('circuits'));
    if (circuits == null) {
        $("#progress").hide();
        $("#nodata").modal("show");
    } else {
        window.dnaData = [];
        for (var i = 0; i < circuits.length; ++i) {
            dnaData = dnaData.concat(circuits[i]['dna']);
        }
    }
});

/* Init dna. */
$(function () {
    strHaveShow =  0;
    allFrtStr = '';
    for (var i = 0; i < dnaData.length; ++i) {
        allFrtStr += dnaData[i][2];
    }
    reArrange();
});


/**
 * @dna match.
 *
 * @param {astrand} one of astrand of dna.
 * 
 * @return another astrand of dna.
 */
function MatchDNA(astrand) {
    var dnaMatch = {
        'A' : 'T', 'T' : 'A', 'C' : 'G', 'G' : 'C',
    };
    var otherStrand = '';
    for (var i = 0; i < astrand.length; ++i) {
        otherStrand += dnaMatch[astrand[i]];
    }
    return otherStrand;
}

/* Arrange the secone astrand according to the first astrand. */
function reArrange() {
    frtStr = allFrtStr.substr(strHaveShow, LEN_OF_LINE * LINE_OF_SHOW);
    strHaveShow += frtStr.length;
    for (var i = 0; i < frtStr.length; i += LEN_OF_LINE) {
        var line1Str = frtStr.substr(i, LEN_OF_LINE);
        var line2Str = MatchDNA(line1Str);
        var tagTR = $('<div class="dna_tag"></div>');
        var frtTR = $('<div class="first_line"></div>');
        var sndTR = $('<div class="second_line"></div>');
        for (var j = 0; j < line1Str.length; ++j) {
            tagTR.append($('<span>&nbsp</span>'));
            frtTR.append($('<span>' + line1Str[j] + '</span>'));
            sndTR.append($('<span>'+ line2Str[j] + '</span>'));
        }
        $('<div class="dna_line"></div>')
            .append(tagTR).append(frtTR)
            .append(sndTR)
            .appendTo($('#dna_content'));
    }
    initColor();
    setName();
}

$('#dna_content').scroll(function(){ 
    if ($(this).scrollTop() + $(this).height() >= $(this)[0].scrollHeight) {
        reArrange();
        if (strHaveShow == allFrtStr.length) {
            $(this).hide();
        }
    }
});

$(function() {
    $('#showNewDna').click(function() {
        reArrange();
        if (strHaveShow == allFrtStr.length) {
            $(this).hide();
        }
    });
});

/* Add tag name. */
$(setName = function() {
    var lens = 0;
    for (var i = 0; i < dnaData.length; ++i) {
        $('.dna_tag span').eq(lens).append($('<p>'+dnaData[i][0]+'</p>'));
        lens += dnaData[i][2].length;
    }
});

/* Init color. */
$(initColor = function () {
    var left = 0, right = dnaData[0][2].length;
    for (var i = 0; i < dnaData.length-1; ++i) {
        $('.first_line span:eq('+left+')').css('background-color', colors[dnaData[i][1]]);
        $('.first_line span:gt('+left+'):lt('+right+')').css('background-color', colors[dnaData[i][1]]);
        $('.second_line span:eq('+left+')').css('background-color', getSecondColor(colors[dnaData[i][1]]));
        $('.second_line span:gt('+left+'):lt('+right+')').css('background-color', getSecondColor(colors[dnaData[i][1]]));
        left += dnaData[i][2].length;
        right += dnaData[i+1][2].length;
    }
});

/* Get color of second astrand. */
function getSecondColor(color) {
    var rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i);
    return 'rgb(' + parseInt(parseInt(rgb[1])*COLOR_PERCENTAGE) + ','
        + parseInt(parseInt(rgb[2])*COLOR_PERCENTAGE) + ','
        + parseInt(parseInt(rgb[3])*COLOR_PERCENTAGE) + ')';
}