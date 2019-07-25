/*
2019-04-10
edit by zhong sp
 */



$(function(){
    var $AdminUncomplishTab = $('#AdminUncomplishTab');
    var $AdminUnacceptTab = $('#AdminUnacceptTab');
    var $Tab1 = $('#tab1');
    var $Tab2 = $('#tab2');
    var $LoadmoreSign_tab1= $("#loadmore_sign_1");
    var $LoadmoreSign_tab2= $("#loadmore_sign_2");
    var LoadRecordNum = 8;//browser load 8 records every time when user drags.
    var LoadTimes_tab1 = 1;//request times send to server
    var LoadTimes_tab2 = 1;//request times send to server

    $AdminUnacceptTab.addClass('bolden_text');

    $AdminUnacceptTab.on('click', function () {
        $AdminUnacceptTab.addClass('weui-bar__item_on');
        $AdminUnacceptTab.addClass('bolden_text');

        $AdminUncomplishTab.removeClass('weui-bar__item_on');
        $AdminUncomplishTab.removeClass('bolden_text');

        $Tab1.addClass('weui-tab__bd-item--active');
        $Tab2.removeClass('weui-tab__bd-item--active');


        /*Get Login user infos*/

        /*Send info to server to grab the first 10 records */



    });

    $AdminUncomplishTab.on('click', function () {
        $AdminUncomplishTab.addClass('weui-bar__item_on');
        $AdminUncomplishTab.addClass('bolden_text');

        $AdminUnacceptTab.removeClass('weui-bar__item_on');
        $AdminUnacceptTab.removeClass('bolden_text');

        $Tab2.addClass('weui-tab__bd-item--active');
        $Tab1.removeClass('weui-tab__bd-item--active');


        FetchAdminRecord(sessionStorage.getItem("UserID"),LoadTimes_tab2,"adminuncomplish",function(RequestData){
            LoadInfoToPage(RequestData,$("#showpanel_2"));
        });

        LoadTimes_tab2++;



    });



    $Tab1.infinite().on("infinite", function() {
        var self = this;
        $LoadmoreSign_tab1.removeClass("hidden");

        if(self.loading){
            return;
        }

        console.log(self)
        self.loading = true;
        console.log(self);
        //setTimeout(function(){},2000);
        FetchAdminRecord(sessionStorage.getItem("UserID"),LoadTimes_tab1,"adminunaccept",function(RequestData){
            LoadInfoToPage(RequestData,$("#showpanel_1"));
        });


        self.loading = false;
        LoadTimes_tab1++;
        /*
        setTimeout(function() {
            $Tab1.find("#showpanel").append("<p>我是加载的新内容内容。</p>");
            self.loading = false;
        }, 2000);   //模拟延迟
        */
    });
    $Tab2.infinite().on("infinite", function() {
        var self = this;
        $LoadmoreSign_tab2.removeClass("hidden");

        if(self.loading){
            return;
        }

        console.log(self)
        self.loading = true;
        console.log(self);
        FetchAdminRecord(sessionStorage.getItem("UserID"),LoadTimes_tab1,"adminuncomplish",function(RequestData){
            LoadInfoToPage(RequestData,$("#showpanel_2"));
        });


        self.loading = false;
        LoadTimes_tab2++;
        /*
        setTimeout(function() {
            $Tab1.find("#showpanel").append("<p>我是加载的新内容内容。</p>");
            self.loading = false;
        }, 2000);   //模拟延迟
        */
    });


    //firstLoad the 10 records
    /*var $RecordContent= document.getElementsByClassName("weui-panel__bd");
    var $Tab1_panel = $("#showpanel_1");

    var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==";

    var Record = '<a href="RecordDetail.html" class="weui-media-box weui-media-box_appmsg"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="#src#" alt=""></div> <div class="weui-media-box__bd"> <h4 class="weui-media-box__title">标题一</h4> <p class="weui-media-box__desc">由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。首先纠正一下问题,宇宙中的星球并不都是圆(球)形的,应该说是"几乎"都是圆的,如果那些小行星,很小的星体也算"星球的话。</p> </div> </a>';
    var testRecord = '<a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg"></a>';


    for(var i = 0;i < 10;i++)
    {
        $Tab1_panel.append($(Record.replace("#src",img)));
    }*/
    FetchAdminRecord(sessionStorage.getItem("UserID"),LoadTimes_tab1,"adminunaccept",function(RequestData){
        LoadInfoToPage(RequestData,$("#showpanel_1"));
    });

    LoadTimes_tab1++;



});


function LoadInfoToPage(Data,$Label){
    var RecordNum = Data.length;
    var Record = '<a href="RecordDetail.html?id_num=#RecordID#&&record_type=admin" class="weui-media-box weui-media-box_appmsg"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="http://2278i36g67.iok.la/MaintainSys/src/php/ImageHandle.php?path=#imgPath#&&status=thumb" alt=""></div> <div class="weui-media-box__bd"> <h4 class="weui-media-box__title">#SubmitTime#</h4> <p class="weui-media-box__desc">#UserText#</p> </div> </a>';

    if(RecordNum == 0)
    {
        $Label.next().addClass("hidden");
    }
    else
    {
        for(var i = 0;i < RecordNum;i++)
        {
            $Label.append($(Record.replace("#RecordID#",Data[i][0]).replace("#imgPath#",Data[i][2]).replace("#SubmitTime#",Data[i][1]).replace("#UserText#",Data[i][3])));
        }
    }


}



/**

 * 获取指定用户的信息

 * @author zsp

 * @param  string UserID      用户ID
 *
 * @param  string LoadTimes      加载的数目
 *
 * @param  string Option      选项complete,uncomplete

 * @param  string CallBackFunc 回调函数

 * @return bool

 */


function FetchAdminRecord(UserID,LoadTimes,Option,CallBackFunc)
{
    var url = "http://2278i36g67.iok.la/MaintainSys/src/php/AdminRecordManagement.php";

    jQuery.ajax(url,{

        type:"POST",   //你选择get或者post最后都是get，跨域情况下都是get
        async:false,
        //dataType: "text",
        //dataType: "text",//指定服务器返回的类型
        //contentType: "application/json", //不确定什么用

        //data: {"start":"-1"},         //这里是要传递的参数，格式为data: "{paraName:paraValue}",
        data: {
            "LoadTimes":LoadTimes,
            "Option":Option,
        },

        //jsonp:'callback',                          //服务器端获取回调函数名的key，对应后台有$_GET['callback']='getName';callback是默认值

        //jsonpCallback:'getJson',                   //回调函数名

        //beforeSend:function(x) { x.setRequestHeader("Content-Type","application/json; charset=utf-8"); },

        success:function (result) {     //回调函数，result，返回值
            var RecordInfo = JSON.parse(result);
            if(RecordInfo.ServerResult == 0)
            {
                CallBackFunc(RecordInfo.data);
            }
            //var RecordInfo = JSON.stringify(result);
            /*if(result.RetCode == '0')
            {
                sessionStorage.setItem("HostName",result.HostName);
                sessionStorage.setItem("HostDept",result.HostDept);
                sessionStorage.setItem("HostDeptID",result.HostDeptID);


            }
            else if(result.RetCode == '3')
            {
                alert(result.Memo + '\n请重新登陆系统');
                window.close();
            }
            else
            {
                alert("sucess but retcode error" + result.Memo);
            }*/


        },

        error:function(XMLHttpRequest, textStatus, errorThrown){
            //return textStatus;
        }

    });
}
