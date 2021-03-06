/*
2019-04-10
edit by zhong sp
 */



$(function(){
    var $AdminUncomplishTab = $('#AdminUncomplishTab');
    var $AdminUnacceptTab = $('#AdminUnacceptTab');
    var $AdminComplishTab = $('#AdminComplishTab');
    var $Tab1 = $('#tab1');
    var $Tab2 = $('#tab2');
    var $Tab3 = $('#tab3');
    var $LoadmoreSign_tab1= $("#loadmore_sign_1");
    var $LoadmoreSign_tab2= $("#loadmore_sign_2");
    var $LoadmoreSign_tab3= $("#loadmore_sign_3");
    var LoadRecordNum = 8;//browser load 8 records every time when user drags.
    var LoadTimes_tab1 = 1;//request times send to server
    var LoadTimes_tab2 = 1;//request times send to server
    var LoadTimes_tab3 = 1;//request times send to server

    var recordList = new Array();

    //get weixin user id
    var url = window.location.href;
    var params = WebUrl.getUrlParams(url,"&");
    var wxCode = params['code'];

    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.WXSUPERINFO,"POST",{'code':wxCode}).then(function (result) {
    	  
    	  if(typeof (result['UserId']) != 'undefined')
    	  {
    	  	 sessionStorage.setItem("SuperUserID",result['UserId']);
    	  }
        
    });


    $AdminUnacceptTab.addClass('bolden_text');

    $AdminUnacceptTab.on('click', function () {
        $AdminUnacceptTab.addClass('weui-bar__item_on');
        $AdminUnacceptTab.addClass('bolden_text');

        $AdminUncomplishTab.removeClass('weui-bar__item_on');
        $AdminUncomplishTab.removeClass('bolden_text');
        $AdminComplishTab.removeClass('weui-bar__item_on');
        $AdminComplishTab.removeClass('bolden_text');

        $Tab1.addClass('weui-tab__bd-item--active');
        $Tab2.removeClass('weui-tab__bd-item--active');
        $Tab3.removeClass('weui-tab__bd-item--active');


        /*Get Login user infos*/

        /*Send info to server to grab the first 10 records */



    });

    $AdminUncomplishTab.on('click', function () {
        $AdminUncomplishTab.addClass('weui-bar__item_on');
        $AdminUncomplishTab.addClass('bolden_text');

        $AdminUnacceptTab.removeClass('weui-bar__item_on');
        $AdminUnacceptTab.removeClass('bolden_text');
        $AdminComplishTab.removeClass('weui-bar__item_on');
        $AdminComplishTab.removeClass('bolden_text');

        $Tab2.addClass('weui-tab__bd-item--active');
        $Tab1.removeClass('weui-tab__bd-item--active');
        $Tab3.removeClass('weui-tab__bd-item--active');

        recordList = {
            "UserID":sessionStorage.getItem("UserCode"),
            "LoadTimes":LoadTimes_tab2,
            "Option":"adminuncomplish"
        }

        ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.FETCH,"POST",recordList).then(function(result)
        {
            LoadInfoToPage(result.data,$("#showpanel_2"));
        });

        LoadTimes_tab2++;



    });

    $AdminComplishTab.on('click', function () {
        $AdminComplishTab.addClass('weui-bar__item_on');
        $AdminComplishTab.addClass('bolden_text');

        $AdminUncomplishTab.removeClass('weui-bar__item_on');
        $AdminUncomplishTab.removeClass('bolden_text');
        $AdminUnacceptTab.removeClass('weui-bar__item_on');
        $AdminUnacceptTab.removeClass('bolden_text');

        $Tab3.addClass('weui-tab__bd-item--active');
        $Tab1.removeClass('weui-tab__bd-item--active');
        $Tab2.removeClass('weui-tab__bd-item--active');

        recordList = {
            "UserID":sessionStorage.getItem("UserCode"),
            "LoadTimes":LoadTimes_tab3,
            "Option":"admincomplish"
        }

        ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.FETCH,"POST",recordList).then(function(result)
        {
            LoadInfoToPage(result.data,$("#showpanel_3"));
        });


        LoadTimes_tab3++;



    });



    $Tab1.infinite().on("infinite", function() {
        var self = this;
        $LoadmoreSign_tab1.removeClass("hidden");

        if(self.loading){
            return;
        }

        console.log(self)
        self.loading = true;
        recordList = {
            "UserID":sessionStorage.getItem("UserCode"),
            "LoadTimes":LoadTimes_tab1,
            "Option":"adminunaccept"
        }

        ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.FETCH,"POST",recordList).then(function(result)
        {
            LoadInfoToPage(result.data,$("#showpanel_1"));
        });

        self.loading = false;
        LoadTimes_tab1++;

    });
    $Tab2.infinite().on("infinite", function() {
        var self = this;
        $LoadmoreSign_tab2.removeClass("hidden");

        if(self.loading){
            return;
        }

        console.log(self)
        self.loading = true;
        recordList = {
            "UserID":sessionStorage.getItem("UserCode"),
            "LoadTimes":LoadTimes_tab2,
            "Option":"adminuncomplish"
        }

        ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.FETCH,"POST",recordList).then(function(result)
        {
            LoadInfoToPage(result.data,$("#showpanel_2"));
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

    $Tab3.infinite().on("infinite", function() {
        var self = this;
        $LoadmoreSign_tab3.removeClass("hidden");

        if(self.loading){
            return;
        }

        console.log(self)
        self.loading = true;
        recordList = {
            "UserID":sessionStorage.getItem("UserCode"),
            "LoadTimes":LoadTimes_tab3,
            "Option":"admincomplish"
        }

        ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.FETCH,"POST",recordList).then(function(result)
        {
            LoadInfoToPage(result.data,$("#showpanel_3"));
        });



        self.loading = false;
        LoadTimes_tab3++;

    });

    recordList = {
        "UserID":sessionStorage.getItem("UserCode"),
        "LoadTimes":LoadTimes_tab1,
        "Option":"adminunaccept"
    }

    ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.FETCH,"POST",recordList).then(function(result)
    {
        LoadInfoToPage(result.data,$("#showpanel_1"));
    });

    LoadTimes_tab1++;



});


function LoadInfoToPage(Data,$Label){
    var RecordNum = Data.length;
    var requestSite = SERVER_ROOT_URL + SERVER_COMMAND.IMAGESHOW;
    var ImageSrc = "";
    var Record = '<a href="RecordManageDetail.html?id_num=#RecordID#&&record_type=admin" class="weui-media-box weui-media-box_appmsg">' +
                    '<div class="weui-media-box__hd">' +
                        '<img class="weui-media-box__thumb" src="#ImageSrc#" alt="">' +
                    '</div> ' +
                    '<div class="weui-media-box__bd">' +
                        ' <h4 class="weui-media-box__title">#SubmitTime#</h4> ' +
                        '<p class="weui-media-box__desc">#UserText#</p> ' +
                        '#WarningSign#'+ '#ReturnFormSign#'+
                    '</div>' +
                ' </a>';
    var WarningSignTemplate = '<div class="content"><ol class="clearfix"><div style="#ProgressBg#"><div style="#Progress#">#Percentage#%</div></div></ol></div>';

    var ReturnFormSignTemplate = '<span class="weui-badge" style="margin-left: 5px;">已退回</span>';
    var ReturnFormSign = "";
    var WarningSign = "";

    //var currentTime = new Date().toLocaleString('chinese',{hour12:false});

    var currentTime = new Date();
    var currentTimeFormatted =  new Date().toLocaleString('zh',{hour12:false})




    if(RecordNum == 0)
    {
        $Label.next().addClass("hidden");
    }
    else
    {
        for(var i = 0;i < RecordNum;i++)
        {
            var expectTimeFormatted = Data[i]['expect_repairing_time'];
            var acceptTimeFormatted = Data[i]['accept_date'];
            var expectTime = new Date(Date.parse(expectTimeFormatted.replace(/-/g,"/")));

            //if the repairing job was over due
            if((expectTime < currentTime)&&(Data[i]['if_repairing'] == 1))
            {
                WarningSign = WarningSignTemplate.replace("#ProgressBg#",progressBar.setProgressBarBg(100)).replace("#Progress#",progressBar.setProgressBar(100)).replace("#Percentage#",100);
            }
            else if((expectTime >= currentTime)&&(Data[i]['if_repairing'] == 1))
            {
                var repaireTimeInterval = otherTools.GetDateDiff(acceptTimeFormatted,expectTimeFormatted,"minute");
                var repaireTimePast = otherTools.GetDateDiff(acceptTimeFormatted,currentTimeFormatted,"minute");
                var Percentage = Math.ceil(repaireTimePast*100/repaireTimeInterval);
                WarningSign = WarningSignTemplate.replace("#ProgressBg#",progressBar.setProgressBarBg(Percentage)).replace("#Progress#",progressBar.setProgressBar(Percentage)).replace("#Percentage#",Percentage);

            }
            else
            {
                WarningSign = '';
            }

            //if it's a returned form
            if(Data[i]['if_form_returned'] == 1)
            {
                ReturnFormSign = ReturnFormSignTemplate;
            }
            else
            {
                ReturnFormSign = "";
            }

            //if no images uploaded by users
            if((Data[i]['img1Path'] == null)||(Data[i]['img1Path'] == ""))
            {
                ImageSrc= SERVER_URL + 'front/pages/html/image/noImage.png';
            }
            else
            {
                ImageSrc = requestSite + '?path='+ Data[i]['img1Path'] +'&&status=thumb';
            }

            $Label.append($(Record.replace("#ImageSrc#",ImageSrc).replace("#RecordID#",Data[i]['id_num']).replace("#imgPath#",Data[i]['img1Path']).replace("#SubmitTime#",Data[i]['report_date']).replace("#UserText#",Data[i]['user_discrpt']).replace("#WarningSign#",WarningSign).replace("#ReturnFormSign#",ReturnFormSign)));
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
    var url = "http://2278i36g67.iok.la/MaintainSys2.0/tp5/index.php/index/index/fetchRecord";

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
            if(typeof result == 'string')
            {
                result = JSON.parse(result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
            }
            CallBackFunc(result.data);
            /*if(RecordInfo.ServerResult == 0)
            {
                CallBackFunc(RecordInfo.data);
            }*/
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
