/*
edit by zsp 2019-04-01



*/

var id_num = "";
var record_type = "";
var upload_score = "";


$(function(){

    var url = window.location.href;
    var str = new Array();

    id_num = WebUrl.getUrlParams(url,'&')['id_num'];

    record_type = WebUrl.getUrlParams(url,'&')['record_type'];


    $("#switchCP").click(function () {
        $('#cmplt_form_comment').toggle(1000, function () {

        });
    });

    ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.RECORDDETAIL,"POST",{"id_num":id_num}).then(function(result){
        LoadContent(result);
    });


});


function LoadContent(RecordContent){
    var InfoList =  document.getElementsByClassName("weui-cell__ft");
    var PageList_WeCell = document.getElementsByClassName("weui-cell");
    var checkbox;

    InfoList[0].innerHTML = RecordContent.data[0]['report_date']; //Set the submit time

    if(RecordContent.data[0]['if_repairing'] != 0)//repairing status
    {
        InfoList[1].innerHTML = "维修中";
        InfoList[2].innerHTML = "维修未完成，暂时不能评价";
    }
    else if(RecordContent.data[0]['if_repaired'] != 0)//repaired status
    {

        if(RecordContent.data[0]['if_form_returned'] == 1)
        {
            InfoList[1].innerHTML = "表单已退回";
        }
        else
        {
            InfoList[1].innerHTML = "已修复";

        }

        if(RecordContent.data[0]['if_rated'] != 0)//show the rates
        {
            ConfirmScore(RecordContent.data[0]['rate']);


            $(".weui-textarea").val(RecordContent.data[0]['form_cmplt_comment']);
            $(".weui-textarea").attr("readonly",true);
            $("#CmpltCommBtn").addClass("hidden_none");
            $(".weui-textarea-counter").addClass("hidden_none");
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

    //load the return comment if return flag is true
    if(RecordContent.data[0]['if_form_returned'] != 0)
    {
        var return_comment = RecordContent.data[0]['form_return_comment']
        var return_comment_html ='   <div class="weui-cell" style="color: red">\n' +
            '            <div class="weui-cell__bd">\n' +
            '                <p">#return_comment#</p>\n' +
            '            </div>\n' +
            '        </div>';

        $("#return_comment_title").text("表单退回原因");
        $("#return_comment").append(return_comment_html.replace('#return_comment#',return_comment));
    }

    //load the img
    var user_discrpt = document.getElementById("submit_text_id");
    user_discrpt.innerText = RecordContent.data[0]['user_discrpt'];

    var width = $(document).width();
    var requestSite = SERVER_ROOT_URL + SERVER_COMMAND.IMAGESHOW;
    var Record = '<div class="swiper-slide"><img src="#requestSite#?path=#imgPath#&&status=full&&width=#width#" alt=""></div>';

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
            upload_score = score;
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

function submitComment(obj)
{
    var CmlptComm = $('.weui-textarea').val();

    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.UPDATE,"POST",{
        "id_num":id_num,
        "rate":upload_score,
        "if_rated":1,
        "if_has_form_cmplt_comment":1,
        "form_cmplt_comment":CmlptComm
    }).then(function (result) {
        if(result.errcode == 0)
        {
            //push the application successfully,and redirect webpage to RecordManage.html
            //disable return button
            var CmpltCommBtn = document.getElementById("CmpltCommBtn");
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