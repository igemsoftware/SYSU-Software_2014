/* 控制光标选择的范围,当二者一样的时候,光标定位在start=end处 */
;(function($) {
    $.fn.selectRange = function(start, end) {
        return this.each(function() {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };
})(jQuery);

/* 获取光标所在位置 */
;(function($) {
    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if ('selectionStart' in el) {
            pos = el.selectionStart;
        } else if ('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    }
})(jQuery);

/* 获取光标的选择范围,反胡起始位置,结束位置及选中内容 */
;(function($) {
    $.fn.getCursorRange = function() {
        var elem = $(this).get(0);
        var rangeData = {start: 0, end: 0, text: ''};
        elem.focus();
        　  if(typeof(elem.selectionStart) == 'number') { //W3C
            rangeData.start = elem.selectionStart; //光标起始位置
            rangeData.end = elem.selectionEnd; //光标末尾位置
            rangeData.text = elem.value.substring(rangeData.start,rangeData.end); //获取文本框value
            　  } else if (document.selection) { //IE
                var sRange = document.selection.createRange();
                var oRange = document.body.createTextRange();
                var i = 0;
                oRange.moveToElementText(elem);
                rangeData.text = sRange.text;
                rangeData.bookmark = sRange.getBookmark();
                for(; sRange.moveStart("character", -1) !== 0; i++) {
                    if (elem.value.charAt(i) == '\r') {
                        i++; //IE的特殊处理，遇到enter键需要加1
                        　}
                }
                rangeData.start = i;
                rangeData.end = rangeData.text.length + rangeData.start;
                rangeData.text = elem.value.substring(rangeData.start,rangeData.end);
                　  }
        　  return rangeData;
    }
})(jQuery);
