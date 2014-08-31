$(document).ready(function() {
  /* 定义record表格初始行数 */
  var initRow = 3;
  // 使用深拷贝，防止表格第一行样式被该后影响新增行
  var childTR =  $('#records_content').find('table').find('.records_input').clone(true);
  initRecordsTable(initRow, childTR);
  addTableItem(childTR);
  selectOtherOption();
  semanticMenu();
  selectMenu();
  recordTime();
  saveRecordsAsFile();
  showArticle();
  searchArticleByName();
});

/* 初始化记录表格 */
function initRecordsTable(initRow, childTR) {
  for (var i = 1; i < initRow; ++i) {
    $('#records_content').find('table').append('<tr>'+childTR.html()+'</tr>');
  }
}

/* 添加表格行 */
function addTableItem(childTR) {
  $('#records_add_item').click(function() {
    $('#records_content').find('table').append('<tr>'+childTR.html()+'</tr>');
    // 重新绑定事件
    selectOtherOption();
  });
}

/* 选择其他药剂 */
function selectOtherOption() {
  $('.select_option').each(function() {
    $(this).click(function() {
      if ($(this).val() == $(this).children('option:last-child').html()) {
        $(this).css('display', 'none');
        $(this).next().css('display', 'block');
      }
    });
  });
  $('.other_option_main').find('i').each(function() {
    $(this).click(function() {
      $(this).parent('.other_option_main').css('display', 'none');
      $(this).parent('.other_option_main').prev('select').css('display', 'block');
    });
  });
}

/* 控制semantic的菜单进行换选项卡 */
function semanticMenu() {
  // selector cache
  var $menuItem = $('.menu a.item, .menu .link.item'),
      $dropdown = $('.main.container .menu .dropdown'),
      // alias
      handler = {
        activate: function() {
          if(!$(this).hasClass('dropdown')) {
            $(this).addClass('active').closest('.ui.menu')
            .find('.item').not($(this)).removeClass('active');
          }
        }
      };
  $dropdown.dropdown({on: 'hover'});
  $menuItem.on('click', handler.activate);
};

/* 内页根据选项卡进行切换 */
function selectMenu() {
  $('.ui.top.attached.tabular.menu').children('a.item').each(function() {
    $(this).click(function() {
      if ($(this).html() == 'Experimental Procedure') {
        $('#experimental_records').removeClass('ui bottom attached segment').css('display', 'none');
        $('#experimental_procedure').addClass('ui bottom attached segment').css('display', 'block');
        $('#experiment_sub_menu').css('display', 'none');
      } else {
        $('#experimental_procedure').removeClass('ui bottom attached segment').css('display', 'none');
        $('#experimental_records').addClass('ui bottom attached segment').css('display', 'block');
        $('#experiment_sub_menu').css('display', 'block');
      }
    });
  });
}

/* 显示record时间 */
function recordTime(){
  var now = new Date();
  $('#records_time').find('span').html(now.getFullYear() + "-" + now.getMonth() + "-" + now.getDay() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
  var mm = setTimeout("recordTime()","1000");
}

/* 将records导出为word文档 */
function saveRecordsAsFile() {
  $('#save_as_word').click(function() {

    var file = new ActiveXObject('Scripting.FileSystemObject');
    var tfile = file.createTextFile('/static/files/temp.txt', true);

    var heading = $('#records_header_input').find('input').val();
    var tableHeader = $('table').eq(0).find('tr').children('th');
    tfile.write(heading);
    for (var i = 0; i < tableHeader.length; ++i) {
      tfile.write(tableHeader[i].innerHTML);
    }
  });
}

/* 显示不同文章的内容 */
function showArticle() {
  $('.article_name').each(function () {
    $(this).click(function() {
      $('#show_article_content').html(' ');
      var articleName = $(this).html().replace('<mark>', '').replace('</mark>', '');
      $('#show_article_content').html('<embed src="/static/files/' + articleName + '" width="900" height="700" />');
    });
  });
}

/* 搜索文件名 */
function searchArticleByName() {
  $('#search_article_by_name').change(function() {
    var searchContent = $(this).val();
    var articleName = '';
    $('.article_name').each(function() {
      articleName = $(this).html().replace('<mark>', '').replace('</mark>', '');
      $(this).html(articleName);
    });
    $('.article_name').each(function() {
      articleName = $(this).html();
      if (articleName.indexOf(searchContent) >= 0) {
        articleName = articleName.replace(searchContent, '<mark>' + searchContent + '</mark>');
      } else {
        articleName = articleName.replace('<mark>', '').replace('</mark>', '');
      }
      $(this).html(articleName);
    });
  });
}
