/*
edit by zsp 2019-04-01
*/

var id_num = "";
var record_type = "";
var SubmitForm = new FormData();


$(function(){

    var url = window.location.href;
    var GetInfoPhpFile = "http://2278i36g67.iok.la/MaintainSys2.0/tp5/index.php/index/index/recordDetail";
    var str = new Array();
    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)" title ="#title#"></li>',
        $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
        $uploaderInput = $("#uploaderInput"),
        $uploaderFiles = $("#uploaderFiles");
    var fileArray = [];

    if(url.indexOf('id_num') >= 0)
    {
        id_num = url.split("=")[1];
        //id_num = (str[0].split("="))[1];
        //record_type = (str[1].split("="))[1];
        //sessionStorage.setItem('Token', token);
        //sessionStorage.setItem('TimeStamp',timestamp);
    }

    $uploaderInput.on("change", function(e){
        var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files,filePath;


        uploadImages.addImage(url,files[0],SubmitForm);

            /*clear the file name*/
        $uploaderInput.val("");


    });

    $uploaderFiles.on("click", "li", function(){
        $galleryImg.attr("style", this.getAttribute("style"));
        $gallery.fadeIn(100);
        uploadImages.removeImage(SubmitForm);

    });


    ajaxRequest.update(SERVER_ROOT_URL + SERVER_COMMAND.RECORDDETAIL,"POST",{"id_num":id_num}).then(function (result) {
        LoadContent(result);
    });
/*
    jQuery.ajax(GetInfoPhpFile,{

        type:"POST",   //你选择get或者post最后都是get，跨域情况下都是get
        async:false,
        dataType: "json",//指定服务器返回的类型

        data: {"id_num":id_num},


        success:function (result) {     //回调函数，result，返回值
            if(typeof result == 'string')
            {
                result = JSON.parse(result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
            }


            LoadContent(result);
        },

        error:function(XMLHttpRequest, textStatus, errorThrown){

        }

    });
    */

});


function LoadContent(RecordContent){
    var InfoList =  document.getElementsByClassName("weui-cell__ft");
    var PageList_WeCell = document.getElementsByClassName("weui-cell");
    var WecellsTitle = document.getElementsByClassName("weui-cells__title");
    var Wecells = document.getElementsByClassName("weui-cells");
    var checkbox;


    if((RecordContent.data[0]['if_repaired'] == 0)&&(RecordContent.data[0]['if_repairing'] == 1))
    {
        $("#switchCP2").click(function () {
            $('#cmplt_record_form').toggle(1000, function () {

            });
        })

        /*conceal the complete item images*/
        WecellsTitle[4].setAttribute("class","hidden_none");
        Wecells[5].setAttribute("class","hidden_none");

    }
    else
    {
        //conceal accept task cell
        PageList_WeCell[8].setAttribute("class","hidden_none");
        PageList_WeCell[7].setAttribute("class","hidden_none");



    }

    sessionStorage.setItem('id_num',RecordContent.data[0]['id_num']);
    InfoList[0].innerHTML = RecordContent.data[0]['user_name']; //Set the submit time
    InfoList[1].innerHTML = RecordContent.data[0]['user_dept']; //Set the submit time
    InfoList[2].innerHTML = RecordContent.data[0]['user_tele']; //Set the submit time
    InfoList[3].innerHTML = RecordContent.data[0]['report_date']; //Set the submit time
    InfoList[5].innerHTML = RecordContent.data[0]['expect_repairing_time']; //Set the submit time

    if(RecordContent.data[0]['if_repairing'] != 0)//repairing status
    {
        InfoList[4].innerHTML = "维修中";
    }
    else if(RecordContent.data[0]['if_repaired'] != 0)//repaired status
    {
        InfoList[4].innerHTML = "已修复";
    }
    else
    {
        InfoList[4].innerHTML = "维修未受理";
    }

    if(RecordContent.data[0]['if_Anonymous'] != 0)//repairing status
    {
        InfoList[6].innerHTML = "是";
    }
    else
    {
        InfoList[6].innerHTML = "否";
    }



    var user_discrpt = document.getElementById("submit_text_id");
    user_discrpt.innerText = RecordContent.data[0]['user_discrpt'];

    //var Record = '<a href="RecordDetail.html?id_num=#RecordID#" class="weui-media-box weui-media-box_appmsg"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="data:#imgtype#;base64,#imgsrc#" alt=""></div> <div class="weui-media-box__bd"> <h4 class="weui-media-box__title">#SubmitTime#</h4> <p class="weui-media-box__desc">#UserText#</p> </div> </a>';
    var width = $(document).width();
    var requestSite = SERVER_ROOT_URL + SERVER_COMMAND.IMAGESHOW;
    var Record = '<div class="swiper-slide"><img src="#requestSite#?path=#imgPath#&&status=full&&width=#width#" alt=""></div>';
    ///*unrepaired items image*/
    if((RecordContent.data[0]['img1Path'] != null)&&(RecordContent.data[0]['img1Path'] != ""))
    {
        $("#img_slide_box_id1").append(Record.replace("#requestSite#",requestSite).replace("#imgPath#",RecordContent.data[0]['img1Path']).replace("#width#",width));
    }

    if((RecordContent.data[0]['img2Path'] != null)&&(RecordContent.data[0]['img2Path'] != ""))
    {
        $("#img_slide_box_id1").append(Record.replace("#requestSite#",requestSite).replace("#imgPath#",RecordContent.data[0]['img2Path']).replace("#width#",width));
    }
    /*Repaired items image*/
    if((RecordContent.data[0]['img1repaired'] != null)&&(RecordContent.data[0]['img1repaired'] != ""))
    {
        $("#img_slide_box_id2").append(Record.replace("#requestSite#",requestSite).replace("#imgPath#",RecordContent.data[0]['img1repaired']).replace("#width#",width));
    }

    if((RecordContent.data[0]['img2repaired'] != null)&&(RecordContent.data[0]['img2repaired'] != ""))
    {
        $("#img_slide_box_id2").append(Record.replace("#requestSite#",requestSite).replace("#imgPath#",RecordContent.data[0]['img2repaired']).replace("#width#",width));
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
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function getImgCnt(){
    var content = document.getElementById('imgcnt');
    if(content)
    {
        return content.innerText;
    }

}
function GenNonDuplicateID(){
    var idStr = Date.parse(new Date()).toString();
    idStr += '_' + Math.random().toString(36).substr(3);
    return idStr
}


function imgRemove() {
    var imgList = document.getElementsByClassName("weui-uploader__file");
    var mask = document.getElementById("mask_layer");
    var cancel = document.getElementById("cancel_btn");
    var sure = document.getElementById("approve_btn");
    for (var j = 0; j < imgList.length; j++) {

        imgList[j].onclick = function(){
            var t = this;
            var img = imgList[j];
            $.actions({
                title: "是否选择删除所选照片",
                onClose: function() {
                    console.log("close");
                },
                actions: [
                    {
                        text: "删除",
                        /*className: "color-primary",*/
                        onClick: function() {
                            //删除入队列的上传图像
                            var DeleteTitle = t.title;
                            SubmitForm.delete(DeleteTitle);
                            //清除预览图像
                            t.remove();
                            //重新统计预览图象数量
                            imgCntStat();
                        }
                    }
                ]
            });
        }
    };
};


function imgCntStat(){
    var content = document.getElementById('imgcnt');
    if (content) {
        // 获取输入框输入内容长度并更新到界面
        var value = $("#uploaderFiles").children().length;
        // 将换行符不计算为单词数
        // 更新计数
        content.innerText = value;
    }
}

function SubmitPushedRecord(obj)
{
    var LoadingLable = '<i class="weui-loading"></i>';
    var ButtonObj=$(obj);

    var imgUpload = document.getElementsByClassName("weui-uploader__file");
    //var url = "http://2278i36g67.iok.la/MaintainSys2.0/tp5/index.php/index/index/CmpltRecord";
    var FileNameArray = Array();

    /*change the button status,freeze*/
    ButtonObj[0].childNodes[0].className = "weui-loading";
    ButtonObj[0].childNodes[1].nodeValue = "提交完成任务单";
    ButtonObj[0].classList.add("weui-btn_disabled");
    ButtonObj[0].attributes.removeNamedItem("onclick");

    for (var i = 0; i < imgUpload.length; i++){
        FileNameArray.push(imgUpload[i].title);
    }

    if(FileNameArray.length>0){
        SubmitForm.append("FileName",FileNameArray);
    }

    SubmitForm.append("repaired_date",new Date().toLocaleString('zh',{hour12:false}));
    SubmitForm.append("id_num",id_num);

    ajaxRequest.upload(SERVER_ROOT_URL + SERVER_COMMAND.CMPLTRECORD,"POST",SubmitForm).then(function () {
        window.location.href =("OperatorResult.html?Result=ok&&ErrorCode=0");
    });
    /*
    jQuery.ajax(url,{

        type:"POST",   //你选择get或者post最后都是get，跨域情况下都是get
        //dataType: "text",
        dataType: "json",//指定服务器返回的类型
        //contentType: "application/json", //不确定什么用

        //data: {"start":"-1"},         //这里是要传递的参数，格式为data: "{paraName:paraValue}",
        data: SubmitForm,
        processData:false,
        contentType: false,

        //jsonp:'callback',                          //服务器端获取回调函数名的key，对应后台有$_GET['callback']='getName';callback是默认值

        //jsonpCallback:'getJson',                   //回调函数名

        //beforeSend:function(x) { x.setRequestHeader("Content-Type","application/json; charset=utf-8"); },

        success:function (result) {     //回调函数，result，返回值
            var result1= result.ServerResult;
            window.location.href =("OperatorResult.html?Result=ok&&ErrorCode=0");



        },

        error:function(jqXHR,textStatus,errorThrown){

        }

    });*/





}


