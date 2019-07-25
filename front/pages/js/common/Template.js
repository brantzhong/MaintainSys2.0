


var Template = (function(){


    var CmpltFormComment = function () {

        return



    };


    var ReturnFormComment = function () {

        return  '<div class="weui-cell" style="color: red">\n' +
                     '<div class="weui-cell__bd">\n' +
                         '<p">#return_comment#</p>\n' +
                     '</div>\n' +
                 '</div>';



    };




    return {
        CmpltFormComment:CmpltFormComment,
        ReturnFormComment:ReturnFormComment,
    }
})();