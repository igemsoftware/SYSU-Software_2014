$('.ui.checkbox').checkbox();
$('.ui.sidebar').sidebar();
$('.ui.dropdown').dropdown();
$('.ui.modal').modal();

searchInit();

function searchInit() {
    var searchFormS = $('#search-form-small'),
        searchInputS = $('#search-small-input'),
        databaseCheckS = searchFormS.find('.database-check'),
        searchFormB = $('#search-form-big'),
        searchInputB = $('#search-big-input'),
        searchWindow = $('#search-window'),
        resultMenu = $('#result-menu'),
        sortToggleBtn = $('#search-window-sortToggle-btn'),

        // 需要提取的数据tag
        dataTag =   ['part_id',     'part_name',        'part_short_name',  'part_short_desc',
        'part_type',    'release_status',   'sample_status',    'part_results',
        'part_url',     'part_entered',     'part_author'],

        // 属性所对应的显示内容，没定义的按照原名显示
        dataView    = {
            'part_name'         : '',
            'part_short_desc'   : 'Description'
        },

        // 搜索下拉框的value值对应的排序属性
        dataSort    = {
            'name'  : 'part_short_name',
            'type'  : 'part_type',
            'author': 'part_author',
            'date'  : 'part_entered',
            'status': 'sample_status',
            'id'    : 'part_id',
            'reStatus':'release_status', 
            'result': 'part_results'
        },

        // 搜索结果中的 摘要属性 
        briefAttr = ['part_name', 'part_short_desc', 'part_type', 'sample_status'],

        // 搜索结果 展开后详细属性
        moreAttr  = ['part_id', 'part_short_name', 'release_status', 'part_results', 'part_url', 'part_entered', 'part_author'],
        lastResult;

    // search window sort button's popup
    sortToggleBtn.popup()
        // toggle sort
        .click(function (){
            $(this).children().toggleClass('ascending').toggleClass('descending');
            if (lastResult.length >=2){
                var items = resultMenu.find('.item'),
            itsLen = items.length;

        for (var i = 0; i < (itsLen-1)/2; i++){
            var a = items.eq(i).find('li'),
            k = itsLen - 1 - i,
            b = items.eq(k).find('li');
        for (var j = 0; j < a.length; j++){
            var temp = a.eq(j).html();
            a.eq(j).html(b.eq(j).html());
            b.eq(j).html(temp);
        }
        } 
            }

        });

    // checkbox show and hide
    /*searchInputS.focus(function() {
    /*if (!this.lastWidth) {
    this.lastWidth = $(this).css('width');
    }
    $(this).animate({
    width: '420px'
    }, 'fast', function() {
    databaseCheckS.slideDown();
    });*/
    //$('#search-small-submit-btn').click();
    //var el = $('#search-form-small .database-check').children().clone()
    /*searchFormS.hide();
    //searchFormB.find('.database-check').html(el);
    searchWindow.sidebar('show').find('.ui.checkbox').checkbox();
    });*/



    searchInputS.keyup(function() {
        var el = $('#search-form-small .database-check').children().clone(),
    val = searchInputS.val();
    searchFormS.hide();
    searchFormB.find('.database-check').html(el);
    searchInputB.val(val);
    searchWindow.sidebar('show').find('.ui.checkbox').checkbox();
    searchInputB.focus();
    searchInputB.keyup();
    });

    searchInputB.keyup(function() {
        if (validForm(searchFormB)) {
            var val = searchInputB.val();
            $.ajax({
                type: 'POST',
                url: '/biobrick',
                data: searchFormB.serialize(),
                datatype: 'xml'
            }).done(function(data) {
                searchResultShow(data, val);
            });
        }
    });

    searchFormS.click(function(e) {
        e.stopPropagation();
    });
    $('.ui.action.input').click(function (e){
        e.stopPropagation();
    })

    $('html').click(function() {
        /*databaseCheckS.slideUp('fast', function() {
            searchInputS.animate({
                width: searchInputS[0].lastWidth
            });
        });
        $('input').popup('remove');*/
    });

    // small search submit
    $('#search-small-submit-btn').click(function() {
        var _icon = $(this).children();

        if (validForm(searchFormS)) {
            _icon.removeClass('search').addClass('loading');
            var el = $('#search-form-small .database-check').children().clone(),
        val = searchInputS.val();
    $.ajax({
        type: 'POST',
        url: '/biobrick',
        data: searchFormS.serialize(),
        datatype: 'xml'
    }).done(function(data) {
        searchFormS.hide();
        _icon.removeClass('loading').addClass('search');
        searchResultShow(data, val);
        searchWindowShow(el, val);
    });
        }

    });

    // search window search submit
    $('#search-big-submit-btn').click(function (){
        var _icon = $(this).children();
        if (validForm(searchFormB)) {
            _icon.removeClass('search').addClass('loading');
            var val = searchInputB.val();
            $.ajax({
                type: 'POST',
                url: '/biobrick',
                data: searchFormB.serialize(),
                datatype: 'xml'
            }).done(function(data) {
                _icon.removeClass('loading').addClass('search');
                searchResultShow(data, val);
            });
        }
    });

    // result sort
    $('#result-sort-select').change(function (){
        var _t = this,
        sortAttr = dataSort[this.value];
    sortToggleBtn.children().removeClass('descending').addClass('ascending');
    lastResult.sort(sortAlphaNum(sortAttr));
    if (!isInBrief(sortAttr)){
        var brief = briefAttr.concat(sortAttr),
        more = moreAttr.concat(),
        i = more.indexOf(sortAttr);
    more.splice(i,i);
    paintResult(brief, more);
    } else {
        paintResult(briefAttr, moreAttr);
    }
    });

    // search window close
    $('#search-window-close').click(function() {
        searchWindow.sidebar('hide');
        searchFormS[0].reset();
        searchFormS.show();
    });



    function validForm(form) {
        var re = true;
        if (form.attr('id').slice(0, 11) === "search-form") {
            form.find('input:text').each(function() {
                if (!this.value) {
                    $(this).popup({
                        inline: true,
                        on: '',
                        position: 'bottom center',
                        color: 'red',
                        content: 'Can not be empty'
                    }).popup('show');
                    $(this).keydown(function (){
                        $(this).popup('remove')
                    })
                    re = false;
                    return false;
                }
            });
        }
        return re;
    }

    function searchWindowShow(el, val) {
        searchFormB.find('.database-check').html(el);
        searchInputB.val(val);
        searchWindow.sidebar('show').find('.ui.checkbox').checkbox();
    }

    function newResultItem(briefArr, moreArr) {
        var re = $('<div>').addClass('item').append(
                $('<div>').addClass('title').append(
                    $('<i>').addClass('dropdown icon'),
                    $('<ul>').html('<li>' + briefArr.join('</li><li>') + '</li>')
                    ),
                $('<div>').addClass('content menu').append(
                    $('<ul>').html('<li>' + moreArr.join('</li><li>') + '</li>')
                    )
                );
        re.find('li').first().addClass('strong');
        return re;
    }

    function formatXML(data, keyword){
        var result = [],
            total = 1000;
        $(data).find('part_id').each(function (){
            var item = {},
            itemXML = $(this).nextUntil('part_id').add($(this));
        for (var i = 0; i < dataTag.length; i++){
            item[dataTag[i]] = itemXML.filter(dataTag[i]).text();
            item[dataTag[i]] = item[dataTag[i]].replace(keyword, '<span class="search-keyword">' + keyword + '</span>')
        }
        result.push(item);
        if(! --total){ return false; }
        });
        return result;
    }

    function searchResultShow(data, keyword){
        lastResult = formatXML(data, keyword);
        paintResult(briefAttr, moreAttr);
        $('#result-sort-select').next().text('Sort By');
        $('#result-total span.blue').text(lastResult.length);
        $('#total-text').text(lastResult.length<=1 ? 'result' : 'results');
    }

    function paintResult(brief, more){
        var briefArr, moreArr;
        resultMenu.html('');
        for (var i = 0; i < lastResult.length; i++){
            briefArr = filterAttr(lastResult[i], brief);
            moreArr = filterAttr(lastResult[i], more);
            resultMenu.append(newResultItem(briefArr, moreArr));
        }
        $('.ui.accordion').accordion();
    }

    function filterAttr(obj, attrArr){
        var arr = [];
        for (var i = 0; i < attrArr.length; i++){
            var head = typeof dataView[attrArr[i]] === 'undefined' ? attrArr[i] : dataView[attrArr[i]];
            head === '' ? '' :  head = '<span class="strong">' + head +'</span> : ';
            arr.push(head + obj[ attrArr[i] ]);
        }
        return arr;
    }

    function sortAlphaNum(attr){
        return function (x, y){
            var a = filterAlphaNum(x[attr]),
                b = filterAlphaNum(y[attr]);
            alpha = a.alpha.localeCompare(b.alpha);
            if (alpha===0){
                if (a.num > b.num){
                    return 1;
                }
                if (a.num < b.num){
                    return -1;
                }

                return 0;
            } else return alpha;
        }
    }
    function filterAlphaNum(s) {
        var re = {},
            s = s.replace(/<.+?>/g,''),
            x = parseFloat(s),
            i = 0;
        while (isNaN(x) && i < s.length) {
            i++;
            x = parseFloat(s.slice(i));
        }
        re.num = x;
        re.alpha =  s.slice(0, i);
        return re;
    }

    function isInBrief(s){
        for (var i = 0; i < briefAttr.length; i++){
            if (s === briefAttr[i]){
                return true;
            }
        }
        return false;
    }

}
// login-box, register-box 初始化
$('.register-box').modal('setting',{
    'duration': .1,
'closable': true
});

$('.login-box').modal('setting',{
    'duration': .1,
    'closable': true
});

$('.modal .open-register').click(function (){
    $('.login-box').modal('hide');
    setTimeout(function (){
        $('.register-box').modal('show');
    },50);
});

$('.open-login').click(function (){
    $('.login-box .green.message').hide();
    $('.login-box').modal('show');
});

$('.main-header .open-register').click(function (){
    $('.register-box').modal('show');
});

// 提交login, register表单
$('#login-form-submit').click(function (){
    if ($('#login-form').find('.red.pointing.prompt.label').length==0){
        var _t = $(this);
        _t.prev().children('error message').hide();
        $.ajax({
            type: 'POST',
            url: '/signin',
            data: $('#login-form').serialize(),
            success: function (data){
                if(data==1){
                    location.reload();
                } else {
                    _t.prev().children('error message').show();
                }
            }
        })
    }
});

$('#register-form-submit').click(function (){
    if ($('#register-form').find('.red.pointing.prompt.label').length==0){
        var _t = $(this);
        _t.prev().children('error message').hide();
        $.ajax({
            type: 'POST',
            url: '/signup',
            data: $('#register-form').serialize(),
            success: function (data){
                if(data==1){
                    $('.register-box').modal('hide');
                    setTimeout(function (){
                        $('.login-box').modal('show');
                        $('.login-box .green.message').show();
                    },50);
                } else {
                    _t.prev().children('error message').show();
                }
            }
        })
    }
});

$('#login-form').form({
    username: {
        identifier  : 'username',
    rules: [{
        type   : 'empty',
    prompt : 'Please enter user name'
    }]},
    password: {
        identifier  : 'pw',
    rules: [{
        type   : 'empty',
    prompt : 'Please enter password'
    }]}
}, {
    inline : true,
    on     : 'blur'
});
$('#register-form').form({
    username: {
        identifier  : 'username',
    rules: [{
        type   : 'empty',
    prompt : 'Please enter user name'
    }]},
    password: {
        identifier  : 'pw',
    rules: [{
        type    : 'empty',
    prompt  : 'Please enter password'
    }]},
    recon: {
        identifier  : 'recon',
    rules : [{
        type    : 'match[pw]',
    prompt  : 'not the same as password'
    }]
    }
}, {
    inline : true,
           on     : 'blur'
});

// index sidebar
$('#index').first().sidebar('attach events', '#showIndex');
$('#showIndex').removeClass('disabled');
