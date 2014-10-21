/**
 * @file main.js
 * @description Process software global operations.
 * @author Xiangyu Liu
 * @mail liuxiangyu@live.com
 * @blog liuxiangyu.net
 * @data Oct 19 2014
 * @copyright 2014 SYSU-Software. All rights reserved.
 * 
 */

$(document).ready(function() {
    $('#showIndex').click(function() {
        $("#indexmenu").modal("show");
        $('#dock2').Fisheye({
            maxWidth: 220,
            items: 'a',
            itemsText: 'span',
            container: '.dock-container2',
            itemWidth: 150,
            proximity: 80,
            alignment : 'left',
            valign: 'bottom',
            halign : 'center'
        });
    });

    $("#indexmenu").find("a").click(function() {
        var index = $(this).parent().children().index($(this));
        var loc = ["/circuit", "/shape", "/simulation", "/experiment", "/help"];
        window.location.href = loc[index];
    });

    $(".modal").modal("setting", {onShow: function() {
        $("#page").addClass("modal-active");
        $("#right-container").addClass("modal-active");
    }});

    $(".modal").modal("setting", {onHide: function() {
        $("#page").removeClass("modal-active");
        $("#right-container").removeClass("modal-active");
    }});

    $("#showIndex").mouseenter(function() {
        $(this).find("span").hide();
        $(this).find("span").empty();
        $(this).find("span").append($("title").html());
        $(this).find("span").show("slow");
    });

    $("#showIndex").mouseleave(function() {
        $(this).find("span").hide();
        $(this).find("span").empty();
        $(this).find("span").append("Flame");
        $(this).find("span").show("slow");
    });

    $("#nodata").modal("setting", {onHide: function() {
        window.location.href = "/circuit";
    }});
});
