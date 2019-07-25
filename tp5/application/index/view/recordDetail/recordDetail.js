/*
edit by zsp 2019-04-01



*/

var id_num = "";
var record_type = "";


$(function(){

    var url = window.location.href;
    var GetInfoPhpFile = "http://2278i36g67.iok.la/MaintainSys/src/php/RecordDetail.php";
    var str = new Array();

    if(url.indexOf('id_num') >= 0)
    {
        str = url.split("&&");
        id_num = (str[0].split("="))[1];
        record_type = (str[1].split("="))[1];
        //sessionStorage.setItem('Token', token);
        //sessionStorage.setItem('TimeStamp',timestamp);
    }


    jQuery.ajax(GetInfoPhpFile,{

        type:"POST",   //你选择get或者post最后都是get，跨域情况下都是get
        async:false,
        //dataType: "text",
        dataType: "json",//指定服务器返回的类型
        //contentType: "application/json", //不确定什么用

        //data: {"start":"-1"},         //这里是要传递的参数，格式为data: "{paraName:paraValue}",
        data: {"id_num":id_num},

        //jsonp:'callback',                          //服务器端获取回调函数名的key，对应后台有$_GET['callback']='getName';callback是默认值

        //jsonpCallback:'getJson',                   //回调函数名

        //beforeSend:function(x) { x.setRequestHeader("Content-Type","application/json; charset=utf-8"); },

        success:function (result) {     //回调函数，result，返回值
            //var RecordInfo = JSON.parse(result);

            LoadContent(result);
        },

        error:function(XMLHttpRequest, textStatus, errorThrown){

        }

    });

/*
    var PageFooter = '           <div class="weui-footer logistic-m-footer">\n' +
        '                <p class="weui-footer__links">\n' +
        '                    <a href="" class="weui-footer__link">西北院公共设施报修管理系统</a>\n' +
        '                </p>\n' +
        '                <p class="weui-footer__text">Copyright ©2019 中国电建集团西北勘测设计研究院有限公司</p>\n' +
        '                <p class="weui-footer__text">技术支持：信息中心 联系人：仲施平 联系方式：029-88280321</p>';
*/






    /*var mySwiper = new Swiper('.swiper-container', {
        //speed: 400,
        //spaceBetween: 100,
        pagination:{
            el: '.swiper-pagination',
        }

    });*/
});


function LoadContent(RecordContent){
    var InfoList =  document.getElementsByClassName("weui-cell__ft");
    var PageList_WeCell = document.getElementsByClassName("weui-cell");
    var checkbox;


    if(record_type == "user")
    {   /*Do not Mass the hidden sequence*/
        PageList_WeCell[4].setAttribute("class","hidden_none");
        PageList_WeCell[3].setAttribute("class","hidden_none");

    }else if(record_type == "admin")
    {
        if((RecordContent.data[0][8] == 0)&&(RecordContent.data[0][7] == 0))
        {

            //conncect click motion
            checkbox = PageList_WeCell[3].getElementsByClassName("weui-cell__ft");
            checkbox[0].onclick = function(){
                var t = this;
                var thisNode = checkbox[0];
                $.actions({
                    title: "是否选择接受维修单",
                    onClose: function() {
                        console.log("close");
                    },
                    actions: [
                        {
                            text: "是",
                            /*className: "color-primary",*/
                            className: "color-warning",
                            onClick: function() {
                                //删除入队列的上传图像
                                ChangeRepaireFlag(id_num,1);
                                //清除预览图像
                                DisableWidget("switchCP1");
                                var that = t;
                                that.onclick = null;

                                updateRepaireProgress("维修中");
                            }
                        },
                        {
                            text: "否",
                            /*className: "color-primary",*/
                            className: "color-primary",
                            onClick: function() {
                                var that = t;
                                var inputnode = that.children[0].children[0];
                                inputnode.checked = "";
                                //var node = that.getElementById("switchCP1");
                                //var inputCheckBox = thisNode.getElementById();
                                //inputCheckBox.setAttribute("checked","false");
                                //清除预览图像
                            }
                        }
                    ]
                });
            };

            PageList_WeCell[4].setAttribute("class","hidden_none");//hide
        }
        else
        {
            checkbox = PageList_WeCell[4].getElementsByClassName("weui-cell__ft");
            checkbox[0].onclick = function(){
                var t = this;

                $.actions({
                    title: "是否选择结束维修单",
                    onClose: function() {
                        console.log("close");
                    },
                    actions: [
                        {
                            text: "是",
                            className: "color-warning",
                            onClick: function() {

                                ChangeRepaireFlag(id_num,2);

                                DisableWidget("switchCP2");

                                var that = t;
                                that.onclick = null;

                                updateRepaireProgress("已完成");


                            }
                        },
                        {
                            text: "否",
                            /*className: "color-primary",*/
                            className: "color-primary",
                            onClick: function() {
                                var that = t;
                                var inputnode = that.children[0].children[0];
                                inputnode.checked = "";
                                //var node = that.getElementById("switchCP1");
                                //var inputCheckBox = thisNode.getElementById();
                                //inputCheckBox.setAttribute("checked","false");
                                //清除预览图像

                            }
                        }
                    ]
                });
            };

            PageList_WeCell[3].setAttribute("class","hidden_none");
        }
        PageList_WeCell[2].setAttribute("class","hidden_none");
    }

    InfoList[0].innerHTML = RecordContent.data[0][1]; //Set the submit time

    if(RecordContent.data[0][8] != 0)//repairing status
    {
        InfoList[1].innerHTML = "维修中";
        InfoList[2].innerHTML = "维修未完成，暂时不能评价";
    }
    else if(RecordContent.data[0][7] != 0)//repaired status
    {
        InfoList[1].innerHTML = "已修复";



        if(RecordContent.data[0][9] != 0)//show the rates
        {
            ConfirmScore(RecordContent.data[0][10]);
        }
        else
        {
            ResetScore();

        }

    }
    else
    {
        InfoList[1].innerHTML = "维修未受理";
        InfoList[2].innerHTML = "维修未完成，暂时不能评价";
    }


    var user_discrpt = document.getElementById("submit_text_id");
    user_discrpt.innerText = RecordContent.data[0][4];

    //var Record = '<a href="RecordDetail.html?id_num=#RecordID#" class="weui-media-box weui-media-box_appmsg"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="data:#imgtype#;base64,#imgsrc#" alt=""></div> <div class="weui-media-box__bd"> <h4 class="weui-media-box__title">#SubmitTime#</h4> <p class="weui-media-box__desc">#UserText#</p> </div> </a>';
    var width = $(document).width();
    var Record = '<div class="swiper-slide"><img src="http://2278i36g67.iok.la/MaintainSys/src/php/ImageHandle.php?path=#imgPath#&&status=full&&width=#width#" alt=""></div>';
    //load the img
    if(RecordContent.data[0][2] != "")
    {
        $("#img_slide_box_id").append(Record.replace("#imgPath#",RecordContent.data[0][2]).replace("#width#",width));
    }

    if(RecordContent.data[0][3] != "")
    {
        $("#img_slide_box_id").append(Record.replace("#imgPath#",RecordContent.data[0][3]).replace("#width#",width));
    }

    var mySwiper = new Swiper('.swiper-container', {
        //speed: 400,
        //spaceBetween: 100,
        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // 如果需要滚动条
        scrollbar: {
            el: '.swiper-scrollbar',
        },

    });//initialize the image slider




}

function ChangeRepaireFlag(id_num,RepaireStatus)
{

    var url = 'http://2278i36g67.iok.la/MaintainSys/src/php/RecordStatusManagement.php';
    var LocalTime = new Date().toLocaleString('chinese',{hour12:false});
    jQuery.ajax(url,{

        type:"POST",   //你选择get或者post最后都是get，跨域情况下都是get
        async:false,
        //dataType: "text",
        dataType: "json",//指定服务器返回的类型
        //contentType: "application/json", //不确定什么用

        //data: {"start":"-1"},         //这里是要传递的参数，格式为data: "{paraName:paraValue}",
        data: {
            "id_num":id_num,
            "status":RepaireStatus,
            "LocalTime":LocalTime
        },

        //jsonp:'callback',                          //服务器端获取回调函数名的key，对应后台有$_GET['callback']='getName';callback是默认值

        //jsonpCallback:'getJson',                   //回调函数名

        //beforeSend:function(x) { x.setRequestHeader("Content-Type","application/json; charset=utf-8"); },

        success:function (result) {     //回调函数，result，返回值
            //var RecordInfo = JSON.parse(result);

            //LoadContent(result);
        },

        error:function(XMLHttpRequest, textStatus, errorThrown){

        }

    });
}

function SetupScore(score)
{
    var url = 'http://2278i36g67.iok.la/MaintainSys/src/php/ScoreSet.php';

    jQuery.ajax(url,{

        type:"POST",   //你选择get或者post最后都是get，跨域情况下都是get
        async:false,
        //dataType: "text",
        dataType: "json",//指定服务器返回的类型
        //contentType: "application/json", //不确定什么用

        //data: {"start":"-1"},         //这里是要传递的参数，格式为data: "{paraName:paraValue}",
        data: {
            "id_num":id_num,
            "score":score,
        },

        //jsonp:'callback',                          //服务器端获取回调函数名的key，对应后台有$_GET['callback']='getName';callback是默认值

        //jsonpCallback:'getJson',                   //回调函数名

        //beforeSend:function(x) { x.setRequestHeader("Content-Type","application/json; charset=utf-8"); },

        success:function (result) {     //回调函数，result，返回值
            //var RecordInfo = JSON.parse(result);

            //LoadContent(result);
            ConfirmScore(score);
        },

        error:function(XMLHttpRequest, textStatus, errorThrown){

        }

    });
}


function ConfirmScore(score)
{
    $("#score_id").children("ul").remove();


    $("#score_id").lqScore({
        $tipEle: $("#score_tip"),
        tips: ["很糟糕", "一般般", "还不错", "挺好的", "非常棒"],
        score: score
        //如果需要设置后还能评分，请添加[isReScore:true]属性
    });

}

function ResetScore()
{
    $("#score_id").children("ul").remove();


    $("#score_id").lqScore({
        $tipEle: $("#score_tip"),
        tips: ["很糟糕", "一般般", "还不错", "挺好的", "非常棒"],
        isReScore:true,
        zeroTip: "未评分",
        //如果需要设置后还能评分，请添加[isReScore:true]属性
        callBack: function (score, ele) {
            $.actions({
                title: "确定提交评分 "+score+" 分？",
                onClose: function() {
                    console.log("close");
                },
                actions: [
                    {
                        text: "确定",
                        /*className: "color-primary",*/
                        onClick: function() {
                            SetupScore(score);
                        }
                    },
                    {
                        text: "取消",
                        /*className: "color-primary",*/
                        /*onClick: function() {

                        }*/
                        onClick: function() {
                            ResetScore();
                        }

                    }
                ]
            });

        }
    });

}

function DisableWidget(widget_id)
{
    document.getElementById(widget_id).disabled = true;

}

function updateRepaireProgress(status)
{
    var NodeList = document.getElementsByClassName("weui-cell__ft");

    NodeList[1].innerHTML = status;
}