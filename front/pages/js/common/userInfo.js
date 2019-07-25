
/*
Edit by zhong shiping 2019-6-1

* */

var WebUrl = (function(){
    "use strict";

    var getUrlParams = function (url,seperator) {
        var rawParams = {};
        var cleanParams = {};
        //alert("WebUrl1");
        if(url.indexOf('?') >= 0)
        {
            rawParams = url.split("?")[1].split(seperator);

            for (var i in rawParams) {
                cleanParams[rawParams[i].split("=")[0]] = rawParams[i].split("=")[1];
            }
            return cleanParams;


        }
        else {
            return cleanParams

        }

    };
    
    var generateUrlParam = function () {

    } 
    
    
    
    return {
        getUrlParams:getUrlParams
    }

})()


var userInfo = (function(jQuery,ajaxRequest,SERVER_ROOT_URL,SERVER_COMMAND){

    "use strict";


    var UserInfoGet =  function(token){

        var userInfo = ajaxRequest.updateSync(SERVER_ROOT_URL+SERVER_COMMAND['USERINFO'],"POST",token);

        return userInfo;

    };

    var UserPriorityGet = function(UserCode){
        var userPri = ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND['USERPRIO'],"POST",UserCode);

        return userPri;
    }

    var setInfoIntoSession = function (usrInfo) {

        sessionStorage.setItem("UserName",usrInfo.UserName);
        sessionStorage.setItem("UserCode",usrInfo.UserCode);
        sessionStorage.setItem("UserDept",usrInfo.UserDept);
        sessionStorage.setItem("UserDeptID",usrInfo.UserDeptID);
        sessionStorage.setItem("UserMobile",usrInfo.UserMobile);

    };
    
    var setUserPriority = function (Priority) {
        sessionStorage.setItem("Priority",Priority);
    }

    var getUserPriority = function () {
        return sessionStorage.getItem("Priority");
    }

    var getInfoFromSession = function () {
        var username = sessionStorage.getItem("UserName");
        var usercode = sessionStorage.getItem("UserCode");
        var userdept = sessionStorage.getItem("UserDept");
        var userdeptid = sessionStorage.getItem("UserDeptID");
        var usermobile = sessionStorage.getItem("UserMobile");

        return {
            "UserName":username,
            "UserCode":usercode,
            "UserDept":userdept,
            "UserDeptID":userdeptid,
            "UserMobile":usermobile
        };
    };

    var ifUserInfoExists = function()
    {
        if((sessionStorage.getItem("UserName"))&&(sessionStorage.getItem("UserCode"))&&(sessionStorage.getItem("UserDept"))&&(sessionStorage.getItem("UserDeptID"))&&(sessionStorage.getItem("Priority")))
        {
            if((sessionStorage.getItem("UserName") != "undefined")&&(sessionStorage.getItem("UserCode")!= "undefined")&&( sessionStorage.getItem("UserDept")!= "undefined")&&( sessionStorage.getItem("UserDeptID") != "undefined")&&( sessionStorage.getItem("Priority") != "undefined"))
            {
                return true;
            }
        }

        return false;
    }

    return {
        set:setInfoIntoSession,
        get:getInfoFromSession,
        setPriority:setUserPriority,
        getPriority:getUserPriority,
        userInfoGet:UserInfoGet,
        userPriGet:UserPriorityGet,
        ifExists:ifUserInfoExists
    };


})(jQuery,ajaxRequest,SERVER_ROOT_URL,SERVER_COMMAND);




/*
var token = "";
var data = "";
var Target = "CA0C90F9526C7E12D1C0";
var GetUserInfoPhpFile = "http://10.0.115.110/MaintainSys/src/php/WebserviceCall.php";

function GetTheUrlInfo()
{

    var url = window.location.href;
    var str = new Array();

    var timestamp = Date.parse(new Date());

    if(url.indexOf('token') >= 0)
    {
        str = url.split("=");
        token = str[1];
        sessionStorage.setItem('Token', token);
        sessionStorage.setItem('TimeStamp',timestamp);
    }
    else if(url.indexOf('data') >= 0)
    {
        str = url.split("=");
        data = str[1];
        sessionStorage.setItem('Data', data);
        sessionStorage.setItem('TimeStamp',timestamp);

    }
    else
    {
        if(sessionStorage.getItem('TimeStamp') == null)
        {
            alert("无法识别登陆用户信息，请重新登陆");
            window.close();
        }
        else if((timestamp - sessionStorage.getItem('TimeStamp')) > 300000)
        {
            alert("用户登陆过期，请重新登陆");
            window.close();
        }
        else
        {
            return;
        }
    }
}


function DefaultPageLoad()
{
    GetTheUrlInfo();


    if(token != '')
    {
        jQuery.ajax(GetUserInfoPhpFile,{

            type:"POST",   //你选择get或者post最后都是get，跨域情况下都是get
            async:false,
            //dataType: "text",
            dataType: "json",//指定服务器返回的类型
            //contentType: "application/json", //不确定什么用

            //data: {"start":"-1"},         //这里是要传递的参数，格式为data: "{paraName:paraValue}",
            data: {"Token":token,"Target":Target},

            //jsonp:'callback',                          //服务器端获取回调函数名的key，对应后台有$_GET['callback']='getName';callback是默认值

            //jsonpCallback:'getJson',                   //回调函数名

            //beforeSend:function(x) { x.setRequestHeader("Content-Type","application/json; charset=utf-8"); },

            success:function (result) {     //回调函数，result，返回值
                var HostInfo = JSON.stringify(result);
                if(result.RetCode == '0')
                {
                    sessionStorage.setItem("UserName",result.HostName);
                    sessionStorage.setItem("UserDept",result.HostDept);
                    sessionStorage.setItem("UserDeptID",result.HostDeptID);

                }
                else if(result.RetCode == '3')
                {
                    alert(result.Memo + '\n请重新登陆系统');
                    window.close();
                }
                else
                {
                    alert("sucess but retcode error" + result.Memo);
                }
                //jQuery("#test_para").html(data);

            },

            error:function(XMLHttpRequest, textStatus, errorThrown){

                alert("error alert");
                alert(XMLHttpRequest.responseText);
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(XMLHttpRequest.statusText);

                alert(textStatus);
                alert(errorThrown);
            }

        });
    }
    else if(data != '')
    {
        jQuery.ajax(GetUserInfoPhpFile,{

            type:"POST",   //你选择get或者post最后都是get，跨域情况下都是get
            async:false,
            //dataType: "text",
            dataType: "json",//指定服务器返回的类型
            //contentType: "application/json", //不确定什么用

            //data: {"start":"-1"},         //这里是要传递的参数，格式为data: "{paraName:paraValue}",
            data: {"data":data},

            //jsonp:'callback',                          //服务器端获取回调函数名的key，对应后台有$_GET['callback']='getName';callback是默认值

            //jsonpCallback:'getJson',                   //回调函数名

            //beforeSend:function(x) { x.setRequestHeader("Content-Type","application/json; charset=utf-8"); },

            success:function (result) {     //回调函数，result，返回值
                var HostInfo = JSON.stringify(result);
                if(result.RetCode == '0')
                {
                    sessionStorage.setItem("UserName",result.HostName);
                    sessionStorage.setItem("UserDept",result.HostDept);
                    //sessionStorage.setItem("TransactorName",result.HostName);
                    sessionStorage.setItem("UserDeptID",result.HostDeptID);

                }
                else
                {
                    alert("用户登陆错误，请重新登陆 " + result.RetCode + result.RetResult);
                }
                //jQuery("#test_para").html(data);

            },

            error:function(XMLHttpRequest, textStatus, errorThrown){

                alert("error alert");
                alert(XMLHttpRequest.responseText);
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(XMLHttpRequest.statusText);

                alert(textStatus);
                alert(errorThrown);
            }

        });
    }
    else
    {

    }

}*/