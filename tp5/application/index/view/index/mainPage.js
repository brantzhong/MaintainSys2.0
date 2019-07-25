/*
edit by zhong sp at 2019-04-11
 */
var token = "";
var data = "";
var Target = "CA0C90F9526C7E12D1C0"; /*Target could change*/
var GetUserInfoPhpFile = "http://10.0.115.110/MaintainSys/src/php/WebserviceCall.php";

function GetTheUrlInfo()
{
    /*store the system token*/
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

    /*Send data/token to get User Info*/
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
                    sessionStorage.setItem("UserName",result.UserName);
                    sessionStorage.setItem("UserID", result.UserID);
                    sessionStorage.setItem("UserDept",result.UserDept);
                    sessionStorage.setItem("UserDeptID",result.UserDeptID);
                    /*jQuery("#HostNameInput").attr("value",result.HostName);
                    jQuery("#HostDeptInput").attr("value",result.HostDept);
                    jQuery("#HostNameInput").attr("disabled","disabled");
                    jQuery("#HostDeptInput").attr("disabled","disabled");*/

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
                /*弹出jqXHR对象的信息*/
                alert("error alert");
                alert(XMLHttpRequest.responseText);
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(XMLHttpRequest.statusText);
                /*弹出其他两个参数的信息*/
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
                    sessionStorage.setItem("UserName",result.UserName);
                    sessionStorage.setItem("UserID",result.UserID);
                    sessionStorage.setItem("UserDept",result.UserDept);
                    sessionStorage.setItem("UserDeptID",result.UserDeptID);
                    /*jQuery("#HostNameInput").attr("value",result.HostName);
                    jQuery("#HostDeptInput").attr("value",result.HostDept);
                    jQuery("#HostNameInput").attr("disabled","disabled");
                    jQuery("#HostDeptInput").attr("disabled","disabled");*/
                }
                else
                {
                    alert("用户登陆错误，请重新登陆 " + result.RetCode + result.RetResult);
                }
                //jQuery("#test_para").html(data);

            },

            error:function(XMLHttpRequest, textStatus, errorThrown){
                /*弹出jqXHR对象的信息*/
                alert("error alert");
                alert(XMLHttpRequest.responseText);
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(XMLHttpRequest.statusText);
                /*弹出其他两个参数的信息*/
                alert(textStatus);
                alert(errorThrown);
            }

        });
    }
    else
    {

    }

}


