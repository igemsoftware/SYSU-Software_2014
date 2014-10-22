/**
 * @file shape.js
 * @description display the designed circuits and logics in different way.
 * @author Xiangyu Liu
 * @mail liuxiangyu@live.com
 * @blog liuxiangyu.net
 * @data Oct 19 2014
 * @copyright 2014 SYSU-Software. All rights reserved.
 * 
 */

var progressbar = $(".progress > .bar");
var device;
var part;
var vector;
$(document).ready(function() {
    $("#information").hide();
    $("#information .hide").click(function() {
        $("#information").hide("slow");
    });
    var data = { "circuits": JSON.parse(sessionStorage.getItem("circuits"))};
    progressbar.animate({width: "0%"}, 10, function() {
        $(".shape").shape('flip right');
        vector = new g.Application(["vector"], data, "vector");
        $(".shape").shape('flip right');
        progressbar.animate({width: "0%"}, 0, function() {
            part = new g.Application(["input", "gene", "output"], data, "part");
            $(".shape").shape('flip right');
            progressbar.animate({width: "0%"}, 0, function() {
                device = new g.Application(["devices"], data, "device");
                progressbar.animate({width: "0%"}, 0, function() {
                    $("#progress").modal("hide");
                    var last = 1.0;
                    $("#slider").slider({
                        orientation: "vertical",
                        range: "min",
                        min: 0,
                        max: 100,
                        value: 50,
                        slide: function( event, ui ) {
                            device.zoom(0, 0, parseFloat(1) / last);
                            vector.zoom(0, 0, parseFloat(1) / last);
                            last = parseFloat((100 - ui.value) / 50) + 0.5;
                            device.zoom(0, 0, parseFloat((100 - ui.value) / 50) + 0.5);
                            vector.zoom(0, 0, parseFloat((100 - ui.value) / 50) + 0.5);
                        }
                    }); 
                });
            });
        });
    });

    $("#change").find("[name='device']").click(function() {
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
        $(".shape").shape('set next side', '.device.side').shape('flip right');
        $("#slider").show();
    });
    $("#change").find("[name='parts']").click(function() {
        $("#slider").hide();
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
        $(".shape").shape('set next side', '.parts.side').shape('flip right');
    });
    $("#change").find("[name='vector']").click(function() {
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
        $(".shape").shape('set next side', '.vector.side').shape('flip right');
        $("#slider").show();
    });
    $("#change").find("[name='dna']").click(function() {
        $("#slider").hide();
        $("#information").hide();
        $(this).parent().children().removeClass("active");
        $(this).addClass("active");
        $(".shape").shape('set next side', '.dna.side').shape('flip right');
    });
});
