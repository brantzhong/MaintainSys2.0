/*
edit by zsp 2019-04-01



*/
var id_num = '';
$(function() {
    var url = window.location.href;
    var GetInfoPhpFile = "http://2278i36g67.iok.la/MaintainSys2.0/tp5/index.php/index/index/recordDetail";
    var str = new Array();
    id_num = WebUrl.getUrlParams(url,'&')['id_num'];


    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.RECORDDETAIL,"POST",{"id_num":id_num}).then(function (result) {
        LoadContent(result);
    });


})
function LoadContent(RecordContent){
    var InfoList =  document.getElementsByClassName("weui-cell__ft");
    var PageList_WeCell = document.getElementsByClassName("weui-cell");
    var checkbox;

    InfoList[0].innerHTML = RecordContent.data[0]['user_name']; //Set the submit time
    InfoList[1].innerHTML = RecordContent.data[0]['user_dept']; //Set the submit time
    InfoList[2].innerHTML = RecordContent.data[0]['report_date']; //Set the submit time
    InfoList[3].innerHTML = RecordContent.data[0]['accept_date']; //Set the submit time
    InfoList[4].innerHTML = RecordContent.data[0]['expect_repairing_time']; //Set the submit time
    InfoList[5].innerHTML = RecordContent.data[0]['repaired_date']; //Set the submit time
    InfoList[6].innerHTML = RecordContent.data[0]['classification']; //Set the submit time
    InfoList[8].innerHTML = RecordContent.data[0]['form_cmplt_comment']; //Set the submit time


    ConfirmScore(RecordContent.data[0]['rate']);



    if(RecordContent.data[0]['if_administration_rate'] != '0')
    {
        PageList_WeCell[9].setAttribute("class","hidden_none");//hide

        $('#supervisor_rate').val(RecordContent.data[0]['administration_rate']);
        $("#supervisor_rate").attr("readonly",true);
        $('.weui-textarea').val(RecordContent.data[0]['administration_comment']);
        $(".weui-textarea").attr("readonly",true);

        $('#admin_comment').css("display","");
        $('#admin_comment').find('.weui-cell').css("display","-webkit-box");
        //$('#admin_comment').css("display","-webkit-box");
        $('#AdminCommBtn').css("display","none");
        $('.weui-textarea-counter').css("display","none");
    }
    else
    {
        $("#switchCP").click(function () {
            $('#admin_comment').toggle(1000, function () {
                //$('#admin_comment').css("display","");
                $('#admin_comment').find('.weui-cell').css("display","-webkit-box");
            });
        });

        $("#supervisor_rate").picker({
            title: "请选择报修单",
            cols: [
                {
                    textAlign: 'center',
                    values: ['100', '95', '90', '85', '80', '75', '70', '65', '60','50', '40', '30', '20', '10', '0']
                }
            ],
            onChange: function(p, v, dv) {
                console.log(p, v, dv);
            },
            onClose: function(p, v, d) {
                /*var data = {
                    "id_num":id_num,
                    "administration_rate":p.displayValue[0],
                    "if_administration_rate":1,
                }
                ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.UPDATE,"POST",data).then(function (result) {

                    $.alert("管理员评分成功");

                });
                $("#supervisor_rate").attr("disabled","disabled");
                console.log("close");*/
            }
        });
    }




    var user_discrpt = document.getElementById("submit_text_id");
    user_discrpt.innerText = RecordContent.data[0]['user_discrpt'];

    //var Record = '<a href="RecordDetail.html?id_num=#RecordID#" class="weui-media-box weui-media-box_appmsg"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="data:#imgtype#;base64,#imgsrc#" alt=""></div> <div class="weui-media-box__bd"> <h4 class="weui-media-box__title">#SubmitTime#</h4> <p class="weui-media-box__desc">#UserText#</p> </div> </a>';
    var width = $(document).width();
    var requestSite = SERVER_ROOT_URL + SERVER_COMMAND.IMAGESHOW;
    var Record = '<div class="swiper-slide"><img src="#requestSite#?path=#imgPath#&&status=full&&width=#width#" alt=""></div>';
    //load the img
    if((RecordContent.data[0]['img1Path'] != "")&&(RecordContent.data[0]['img1Path'] != null))
    {
        $("#img_slide_box_id1").append(Record.replace("#requestSite#",requestSite).replace("#imgPath#",RecordContent.data[0]['img1Path']).replace("#width#",width));
    }

    if((RecordContent.data[0]['img2Path'] != "")&&(RecordContent.data[0]['img2Path'] != null))
    {
        $("#img_slide_box_id1").append(Record.replace("#requestSite#",requestSite).replace("#imgPath#",RecordContent.data[0]['img2Path']).replace("#width#",width));
    }

    if((RecordContent.data[0]['img1repaired'] != "")&&(RecordContent.data[0]['img1repaired'] != null))
    {
        $("#img_slide_box_id2").append(Record.replace("#requestSite#",requestSite).replace("#imgPath#",RecordContent.data[0]['img1repaired']).replace("#width#",width));
    }

    if((RecordContent.data[0]['img2repaired'] != "")&&(RecordContent.data[0]['img2repaired'] != null))
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

function submitComment(obj)
{
    var AdminComm = $('.weui-textarea').val();

    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.UPDATE,"POST",{
        "id_num":id_num,
        "if_administration_rate":1,
        "administration_rate":$('#supervisor_rate').val(),
        "if_administration_comment":1,
        "administration_comment":AdminComm
    }).then(function (result) {
        if(result.errcode == 0)
        {
            //push the application successfully,and redirect webpage to RecordManage.html
            //disable return button
            var CmpltCommBtn = document.getElementById("AdminCommBtn");
            CmpltCommBtn.classList.value = "weui-btn weui-btn_primary weui-btn_disabled";
            CmpltCommBtn.onclick = null;

            //pop up sign
            $.toast("评价成功", function() {
                console.log('close');
            });
        }
        else
        {
            //push the application unsuccessfully,need print out the error code
            //toastShowup()
            $.toast("评价失败,请检查网络或稍后再试", function() {
                console.log('close');
            });
        }
    });
}