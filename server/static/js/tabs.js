/*
 * @file tabs.js
 * @description Process tabs change of experiment and help.
 * @author Xiangyu Liu
 * @mail liuxiangyu@live.com
 * @data Oct 19 2014
 * @copyright 2014 SYSU-Software. All rights reserved.
 * 
 */

$(function() {
    $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
});
