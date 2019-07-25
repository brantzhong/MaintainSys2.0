/*****************************************************/
/*
edit by zsp 20190401
 */

var gOperateResult = "";
var gOperateCode = "";

function PageLoad()
{
    var url = window.location.href;
    var str1 = new Array();
    var str2 = new Array();
    var MsgIcon = document.getElementById("icon");
    var MsgTitle = document.getElementsByClassName("weui-msg__title");
    var MsgDesc  = document.getElementsByClassName("weui-msg__desc");

    //split the result and the operate code

    str1 = url.split("Result=");
    str2 = str1[1].split("ErrorCode=");

    if(str2[0].indexOf("ok")>=0)
    {
        MsgIcon.className = "weui-icon-success weui-icon_msg";
        MsgTitle[0].innerHTML = "操作成功";
        MsgDesc[0].innerHTML = "点击按钮跳转至登陆页面";
    }
    else
    {
        MsgIcon.className = "weui-icon-warn weui-icon_msg";
        MsgTitle[0].innerHTML = "操作失败";
        MsgDesc[0].innerHTML = "操作失败代码"+str2[1];
    }

}
