/*****************************************************/
/*
edit by zsp 20190401
 */

var SubmitData = {
    SubName:'',
    SubDept:'',
    SubTime:'',
    SubText:'',
    imgNum:0,
    imgArray:[]
}
var SubmitForm = new FormData();

function GetUserInfo()
{

    if((sessionStorage.getItem("UserName") == null) || ((sessionStorage.getItem("UserDept") == null)))
    {
        alert("无法加载登录用户信息，请重新登陆");
        window.close();
    }
    else
    {
        jQuery("#UserName").text(sessionStorage.getItem("UserName"));
        jQuery("#UserDept").text(sessionStorage.getItem("UserDept"));
        //jQuery("#TransactorNameInput").attr("value",sessionStorage.getItem("HostName"));
        //jQuery("#TransactorNameInput").attr("disabled","disabled");
        //jQuery("#HostDeptInput").attr("disabled","disabled");
    }

}

$(function(){
    //var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)" title ="#title#"></li>',
    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)" title ="#title#"></li>',
        $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
        $uploaderInput = $("#uploaderInput"),
        $uploaderFiles = $("#uploaderFiles")
    ;
    var fileArray = [];


    $uploaderInput.on("change", function(e){
        var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files,filePath;

        if(getImgCnt() < 2)
        {
            for (var i = 0, len = files.length; i < len; ++i) {
                var file = files[i];
                var fileNameByDate = GenNonDuplicateID();

                if(file.size > 1*1024*1024)
                {
                    photoCompress(file, {
                        quality: 0.1
                    }, function(base64Codes){

                        var blob = convertBase64UrlToBlob(base64Codes);

                        SubmitForm.append(fileNameByDate, blob);

                    });
                }
                else{
                    SubmitForm.append(fileNameByDate, file);
                }




                if (url) {
                    src = url.createObjectURL(file);
                }
                else {
                    src = e.target.result;
                }
                var tmpl1 = tmpl.replace('#title#',fileNameByDate);
                $uploaderFiles.append($(tmpl1.replace('#url#', src)));
            }
        }


        /*clear the file name*/
        $uploaderInput.val("");
        imgCntStat();


    });
    $uploaderFiles.on("click", "li", function(){
        $galleryImg.attr("style", this.getAttribute("style"));
        $gallery.fadeIn(100);
        imgRemove();

    });

    /*$gallery.on("click", function(){
        $gallery.fadeOut(100);
    });*/
});



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


function wordStat(input) {
    // 获取要显示已经输入字数文本框对象
    var content = document.getElementById('cnt');
    if (content && input) {
        // 获取输入框输入内容长度并更新到界面
        var value = input.value;
        // 将换行符不计算为单词数
        value = value.replace(/\n|\r/gi, "");
        // 更新计数
        content.innerText = value.length;
    }
}

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

function getImgCnt(){
    var content = document.getElementById('imgcnt');
    if(content)
    {
        return content.innerText;
    }

}

function submitAppForm(obj){

    var LoadingLable = '<i class="weui-loading"></i>';
    var thisObj=$(obj);
    /*if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }*/
    var imgUpload = document.getElementsByClassName("weui-uploader__file");
    var url = "http://2278i36g67.iok.la/MaintainSys/src/php/AppFormHandle.php";
    var FileNameArray = Array();
    //thisObj.appendChild(LoadingLable);
    thisObj[0].childNodes[0].className = "weui-loading";
    thisObj[0].childNodes[1].nodeValue = "上传表单中";
    thisObj[0].classList.add("weui-btn_disabled");
    thisObj[0].attributes.removeNamedItem("onclick");
    //thisObj.addClass("weui-btn_plain-disabled");
    //thisObj.textbox("上传表单中");


    for (var i = 0; i < imgUpload.length; i++){
        FileNameArray.push(imgUpload[i].title);
    }

    if(FileNameArray.length>0){
        SubmitForm.append("FileName",FileNameArray);
    }

    //this.removeClass("");
    //this.addClass("weui-btn_loading")
    /*Orgnize the data form*/
    SubmitForm.append("UserName","仲施平");
    SubmitForm.append("UserID","02661");
    SubmitForm.append("UserDept","信息中心信息化科");
    SubmitForm.append("UserDeptID","115802");

    //SubmitForm.append("UserName",sessionStorage.getItem("UserName"));
    //SubmitForm.append("UserID",sessionStorage.getItem("UserID"));
    //SubmitForm.append("UserDept",sessionStorage.getItem("UserDept"));
    //SubmitForm.append("UserDeptID",sessionStorage.getItem("UserDeptID"));
    SubmitForm.append("Time",new Date().toLocaleString('chinese',{hour12:false}));
    SubmitForm.append("Text",$('.weui-textarea').val());

    /*for(var pair of SubmitForm.entries()) {
        console.log(pair);
    }*/

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
            //var HostInfo = JSON.stringify(result);
            /*alert(result.name);
            alert(result.Dept);
            alert(result.Time);
            alert(result.Text);
            alert(result.FileName);

            var binaryData = [];

            var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)" title ="#title#"></li>';
            var url = window.URL || window.webkitURL || window.mozURL
            $uploaderFiles = $("#uploaderFiles");*/

            /*binaryData.push(result.file1);
            var src = url.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
            $uploaderFiles.append($(tmpl.replace('#url#', src)));*/

            /*src = url.createObjectURL(new Blob(result.file1));
            $uploaderFiles.append($(tmpl.replace('#url#', src)));*/

            /*if(result.TransCode == SignupInfoRespond)
            {
                if(result.ServerResult == ResultOK)
                {
                    window.location.href =("GuestSignupResult.html");
                }
                else
                {
                    alert("Respond Result Err, ErrCode ="+ result.ServerResult);
                }

            }
            else
            {
                alert("Server Respond Err, ErrCode ="+ result.TransCode);
                //error should print error log
            }*/
            //jQuery("#test_para").html(data);

        },

        error:function(jqXHR,textStatus,errorThrown){
            /*弹出jqXHR对象的信息*/
            /*alert(jqXHR.responseText.toString());
            alert(jqXHR.status.toString());
            alert(jqXHR.readyState);
            alert(jqXHR.statusText);*/
            /*弹出其他两个参数的信息*/
            /*alert(textStatus);
            alert(errorThrown);*/
        }

    });
    /*SubmitData.SubDept = "";
    SubmitData.SubName = "";
    SubmitData.SubText = "";
    SubmitData.SubTime = "";
    SubmitData.imgArray =*/

    /*var ImageUploadFiles = document.getElementById('uploaderFiles');
    var count= ImageUploadFiles.childElementCount;
    var reader = new FileReader();

    for(var i = 0;i<count;i++){
        var url = splitUrlOutOfString(ImageUploadFiles.children[i].getAttribute("style"));
        var result = reader.readAsDataURL(url);
    }*/





    //alert("ok");
}


function splitUrlOutOfString(string){
    var RawData1,RawData2;
    RawData1 = string.split("blob:");
    RawData2 = RawData1[1].split(")");

    return RawData2[0];

}

/**
 三个参数
 file：一个是文件(类型是图片格式)，
 w：一个是文件压缩的后宽度，宽度越小，字节越小
 objDiv：一个是容器或者回调函数
 photoCompress()
 */
function photoCompress(file,w,objDiv){
    var reader=new FileReader();
    /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
    reader.readAsDataURL(file);
    reader.onloadend=function(e){
        var re=this.result;
        canvasDataURL(re,w,objDiv);
    }
}
function canvasDataURL(path, obj, callback) {
    var img = new Image();
    img.src = path;
    img.onload = function () {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        var quality = 0.7;  // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        callback(base64);
    }
}

/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 * 用url方式表示的base64图片数据
 */
function convertBase64UrlToBlob(urlData){
    var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    var b = new Blob([u8arr], {type:mime});
    return b;
}


function GenNonDuplicateID(){
    var idStr = Date.parse(new Date()).toString();
    idStr += '_' + Math.random().toString(36).substr(3);
    return idStr
}