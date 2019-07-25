/*
edit by zsp 2019-04-01



*/

var id_num = "";
var record_type = "";
alert("step 0");

$(function(){
    alert("step 0");
    var url = window.location.href;
    var str = new Array();

    //alert("step 1");
    id_num = WebUrl.getUrlParams(url,'&')['id_num'];
    //alert("step 2");
    record_type = WebUrl.getUrlParams(url,'&')['record_type'];
    //alert("step 3 asdasda  ");


    ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.RECORDDETAIL,"POST",{"id_num":id_num}).then(function(result){
        LoadContent(result);
    });

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
        if((RecordContent.data[0]['if_repaired'] == 0)&&(RecordContent.data[0]['if_repairing'] == 0))
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
                                var updateData = {
                                    "id_num":id_num,
                                    "if_repaired":0,
                                    "if_repairing":1,
                                    "accept_date":new Date().toLocaleString('zh',{hour12:false})
                                }

                                ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.UPDATE,"POST",updateData).then(function(result){
                                    DisableWidget("switchCP1");
                                    var that = t;
                                    that.onclick = null;

                                    updateRepaireProgress("维修中");
                                });

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
                                var updateData = {
                                    "id_num":id_num,
                                    "if_repaired":1,
                                    "if_repairing":0,
                                    "repaired_date":new Date().toLocaleString('zh',{hour12:false})
                                }

                                ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.UPDATE,"POST",updateData).then(function(result)
                                {
                                    DisableWidget("switchCP2");

                                    var that = t;
                                    that.onclick = null;

                                    updateRepaireProgress("已完成");
                                });
                                //ChangeRepaireFlag(id_num,2);

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


                            }
                        }
                    ]
                });
            };

            PageList_WeCell[3].setAttribute("class","hidden_none");
        }
        PageList_WeCell[2].setAttribute("class","hidden_none");
    }

    InfoList[0].innerHTML = RecordContent.data[0]['report_date']; //Set the submit time

    if(RecordContent.data[0]['if_repairing'] != 0)//repairing status
    {
        InfoList[1].innerHTML = "维修中";
        InfoList[2].innerHTML = "维修未完成，暂时不能评价";
    }
    else if(RecordContent.data[0]['if_repaired'] != 0)//repaired status
    {
        InfoList[1].innerHTML = "已修复";



        if(RecordContent.data[0]['if_rated'] != 0)//show the rates
        {
            ConfirmScore(RecordContent.data[0]['rate']);
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
    user_discrpt.innerText = RecordContent.data[0]['user_discrpt'];

    //var Record = '<a href="RecordDetail.html?id_num=#RecordID#" class="weui-media-box weui-media-box_appmsg"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="data:#imgtype#;base64,#imgsrc#" alt=""></div> <div class="weui-media-box__bd"> <h4 class="weui-media-box__title">#SubmitTime#</h4> <p class="weui-media-box__desc">#UserText#</p> </div> </a>';
    var width = $(document).width();
    var Record = '<div class="swiper-slide"><img src="http://2278i36g67.iok.la/MaintainSys2.0/tp5/index.php/index/index/imageShow?path=#imgPath#&&status=full&&width=#width#" alt=""></div>';
    //load the img
    if(RecordContent.data[0]['img1Path'] != "")
    {
        $("#img_slide_box_id").append(Record.replace("#imgPath#",RecordContent.data[0]['img1Path']).replace("#width#",width));
    }

    if(RecordContent.data[0]['img2Path'] != "")
    {
        $("#img_slide_box_id").append(Record.replace("#imgPath#",RecordContent.data[0]['img2Path']).replace("#width#",width));
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
                            let updateData = {
                                "id_num":id_num,
                                'if_rated':1,
                                "rate":score,
                            }
                            ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.UPDATE,"POST",updateData).then(function(result){
                                ConfirmScore(score);
                            });
                            //SetupScore(score);
                        }
                    },
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