/*****************************************************/
/*
edit by zsp 20190401
 */

var SubmitForm = new FormData();


$(function(){
    //alert("step1");
    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)" title ="#title#"></li>';
    var $gallery = $("#gallery");
    var $galleryImg = $("#galleryImg");
    var $uploaderInput = $("#uploaderInput");
    var $uploaderFiles = $("#uploaderFiles");
    var fileArray = [];

    //load user information
    loadUserInfo();
    //init location picker
    initLocationPicker();

    /*handle the image*/
    $uploaderInput.on("change", function(e){
        var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files,filePath;

        uploadImages.addImage(url,files[0],SubmitForm);

        /*clear the file name*/
        $uploaderInput.val("");
        //imgCntStat();


    });
    $uploaderFiles.on("click", "li", function(){
        $galleryImg.attr("style", this.getAttribute("style"));
        $gallery.fadeIn(100);
        uploadImages.removeImage(SubmitForm);

    });

    /*if Anonymously submit the form*/
    $("#Anonymous_switch").click(function () {
        $("#applicatant_info_title").toggle(1000,function () {

        });

        $("#applicatant_info").toggle(1000,function () {
            
        })
    })

    //alert("step4");

});
function loadUserInfo()
{

    if(userInfo.ifExists())
    {
        var usrInfo = userInfo.get();

        $('#UserName').text(usrInfo['UserName']);
        $('#UserDept').text(usrInfo['UserDept']);
        $('#UserTele').val(usrInfo['UserMobile']);


    }
    else {
        $.alert("未能获取用户登陆信息，请重新登陆");
    }

}
function initLocationPicker()
{
    var location = ['北山门办公区', '常宁办公区'];
    var building = {
        '北山门办公区':['北山门办公东楼','北山门办公西楼','北山门餐厅','其他'],
        '常宁办公区':['常宁办公楼','常宁餐厅','水工试验车间','材料实验楼','其他']
    }
    var floor = {
        '北山门办公东楼':['负2层','负1层','1层','2层','3层','4层','5层','6层','7层','8层','9层','10层','11层','12层','13层','14层','15层','16层'],
        '北山门办公西楼':['负2层','负1层','1层','2层','3层','4层','5层','6层','7层','8层','9层','10层','11层','12层','13层','14层','15层','16层','17层','18层','19层','20层','21层','22层','23层','24层','25层','26层'],
        '北山门餐厅':['1层','2层','3层'],
        '常宁办公楼':['1层','2层','3层','4层','5层','6层'],
        '常宁餐厅':['1层','2层','3层','4层'],
        '材料实验楼':['1层','2层'],
        '水工试验车间':['1层'],
        '其他':[]
    };

    var position = ['公共部位', '房间内'];


    $("#Location").picker({
        title: "请选择维修地点",
        cols: [
            {
                textAlign: 'center',
                values:location
            },
        ],
        onClose:function(p, v, d){
            //reset the connect option
            $("#Building").picker('destroy');
            $("#Building").val('');
            $("#Floor").val('');
            //init building picker
            $("#Building").picker({
                title: "请选择维修楼宇",
                cols: [
                    {
                        textAlign: 'center',
                        values:building[$('#Location').val()]
                    },

                ],

                onClose:function(p, v, d){
                    //reset the connect option
                    $("#Floor").picker('destroy');
                    $("#Floor").val('');


                    //init Floor picker
                    $("#Floor").picker({
                        title: "请选择维修楼层",
                        cols: [
                            {
                                textAlign: 'center',
                                values:floor[$('#Building').val()]
                            },

                        ],
                        onOpen:function(){
                            if($('#Building').val() == '')
                            {
                                $.alert("请先选择楼宇");
                                $("#Floor").picker("close");
                                $('#Floor').val('')
                            }
                        }
                    });
                    if($('#Building').val() == '其他')
                    {
                        $("#Floor").picker("open");
                        $("#Floor").picker("setValue", []);
                        $("#Floor").picker("close");
                    }
                    console.log($('#Building').val());

                }




            });

            console.log($('#Location').val());
        }
    });

    $("#Building").picker({
        title: "请选择维修楼宇",
        cols: [
            {
                textAlign: 'center',
                values:building['北山门办公区']
            },

        ],
        onClose:function(p, v, d){

            //reset the connect option
            $("#Floor").picker('destroy');
            $("#Floor").val('');

            $("#Floor").picker({
                title: "请选择维修楼层",
                cols: [
                    {
                        textAlign: 'center',
                        values:floor[$('#Building').val()]
                    },

                ],
                onOpen:function(){
                    if($('#Building').val() == '')
                    {
                        $.alert("请先选择楼宇");
                        $("#Floor").picker("close");
                        $('#Floor').val('')
                    }
                }
            });

            if($('#Building').val() == '其他')
            {
                $("#Floor").picker("open");
                $("#Floor").picker("setValue", []);
                $("#Floor").picker("close");
            }
        }
    });

    $("#Floor").picker({
        title: "请选择维修楼层",
        cols: [
            {
                textAlign: 'center',
                values:floor['北山门办公东楼']
            },

        ],
        onOpen:function(){
            if($('#Building').val() == '')
            {
                 $.alert("请先选择楼宇");
                $("#Floor").picker("close");
                $('#Floor').val('')
            }
        }
    });




    $("#Position").picker({
        title: "请选择维修地点",
        cols: [
            {
                textAlign: 'center',
                values:position
            },

        ]
    });





}




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

function submitAppForm(obj){

    var url = SERVER_ROOT_URL + SERVER_COMMAND.UPLOAD;

    //change click button status
    var thisObj=$(obj);
    var sText = "";
    thisObj[0].childNodes[0].className = "weui-loading";
    thisObj[0].childNodes[1].nodeValue = "上传表单中";
    thisObj[0].classList.add("weui-btn_disabled");
    thisObj[0].attributes.removeNamedItem("onclick");

    //collect upload images names
    var imgUpload = document.getElementsByClassName("weui-uploader__file");
    var FileNameArray = Array();

    for (var i = 0; i < imgUpload.length; i++){
        FileNameArray.push(imgUpload[i].title);
    }

    if(FileNameArray.length>0){
        SubmitForm.append("FileName",FileNameArray);
    }

    //Get uerInfo
    var usrInfo = userInfo.get();

    //collect user information
    SubmitForm.append("UserName",usrInfo['UserName']);
    SubmitForm.append("UserID",usrInfo['UserCode']);
    SubmitForm.append("UserDept",usrInfo['UserDept']);
    SubmitForm.append("UserDeptID",usrInfo['UserDeptID']);
    SubmitForm.append("UserTele",domWidget.getValue('UserTele'));


    //collect upload form information
    //report date
    SubmitForm.append("Time",new Date().toLocaleString('zh',{hour12:false}));

    /*repaired discription*/
    sText = "办公区："+$('#Location').val() +'\n';
    sText = sText + "楼宇："+$('#Building').val() +'\n';
    sText = sText + "楼层："+$('#Floor').val() +'\n';
    sText = sText + "位置："+$('#Position').val() +'\n';
    sText = sText + "物品(描述)："+$('.weui-textarea').val();
    SubmitForm.append("Text",sText);

    SubmitForm.append("Location",$('#Location').val());

    //if upload form is anonymous
    if($("#Anonymous_switch").prop("checked")== true)
    {
        SubmitForm.append("ifAnonymous",1);
    }
    else
    {
        SubmitForm.append("ifAnonymous",0);
    }

    //start async upload
    ajaxRequest.upload(url,"POST",SubmitForm).then(function(result){
        //if success jump to other page
        window.location.href =("OperatorResult.html?Result=ok&&ErrorCode=0")
    });

}