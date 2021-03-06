/*
edit by zsp 2019-04-01
*/

var id_num = "";
var record_type = "";


$(function(){

    var url = window.location.href;
    //var GetInfoPhpFile = "http://2278i36g67.iok.la/MaintainSys2.0/tp5/index.php/index/index/recordDetail";
    var str = new Array();

    id_num = WebUrl.getUrlParams(url,'&')['id_num'];
    record_type = WebUrl.getUrlParams(url,'&')['record_type'];

    //Get wexin params in order to direct message or send alert to employee
    wxConfigParams();

    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.RECORDDETAIL,"POST",{"id_num":id_num}).then(function(result){
        LoadContent(result);
    });

});


function LoadContent(RecordContent){
    var InfoList =  document.getElementsByClassName("weui-cell__ft");
    var PageList_WeCell = document.getElementsByClassName("weui-cell");
    var checkbox;


    if((RecordContent.data[0]['if_repaired'] == 0)&&(RecordContent.data[0]['if_repairing'] == 0))
    {

        //conncect click motion
        //checkbox = PageList_WeCell[5].getElementsByClassName("weui-cell__ft");
        $("#switchCP1").click(function () {

            if($("#switchCP3").prop("checked") === true)
            {
                $("#switchCP3").prop("checked",false);
                $('#return_record_form').toggle(1000, function () {

                });
            }
            $('#accept_record_form').toggle(1000, function () {

            });
        })

        $("#switchCP3").click(function () {

            if($("#switchCP1").prop("checked") === true)
            {
                $("#switchCP1").prop("checked",false);
                $('#accept_record_form').toggle(1000, function () {

                });
            }
            $('#return_record_form').toggle(1000, function () {

            });
        })


        $("#Repair_classfication").picker({
            title: "请对维修服务进行分类",
            cols: [
                {
                    textAlign: 'center',
                    values: ['公共设施', '绿化服务','保洁服务','职工餐厅']
                }
            ],
            onChange: function(p, v, dv) {
                console.log(p, v, dv);
            },
            onClose: function(p, v, d) {
                console.log("close");
            }
        });

        $("#datetime-picker").datetimePicker({
            title: '预计完成任务时间',
            min: getNowFormatDate(),
            max: "2099-12-12",
            onChange: function (picker, values, displayValues) {
                console.log(values);
            }
        });
        //conceal complete task cell,the hidden sequence is the key
        PageList_WeCell[9].setAttribute("class","hidden_none");//hide
        //conceal the form_return_name,if_Anonymous and expect_repairing_time cell
        PageList_WeCell[7].setAttribute("class","hidden_none");
        PageList_WeCell[6].setAttribute("class","hidden_none");//hide
        PageList_WeCell[5].setAttribute("class","hidden_none");//hide


    }
    else if(RecordContent.data[0]['if_repairing'] == 1)
    {
        //checkbox = PageList_WeCell[6].getElementsByClassName("weui-cell__ft");
        $("#switchCP2").click(function () {
            if($("#switchCP3").prop("checked") === true)
            {
                $("#switchCP3").prop("checked",false);
                $('#return_record_form').toggle(1000, function () {

                });
            }
            $('#cmplt_record_form').toggle(1000, function () {

            });
        });

        $("#switchCP3").click(function () {

            if($("#switchCP2").prop("checked") === true)
            {
                $("#switchCP2").prop("checked",false);
                $('#cmplt_record_form').toggle(1000, function () {

                });
            }
            $('#return_record_form').toggle(1000, function () {

            });
        })


        //conceal accept task cell
        //PageList_WeCell[9].setAttribute("class","hidden_none");
        PageList_WeCell[8].setAttribute("class","hidden_none");
        //conceal form return name
        PageList_WeCell[7].setAttribute("class","hidden_none");
    }
    else
    {
        PageList_WeCell[10].setAttribute("class","hidden_none");
        PageList_WeCell[9].setAttribute("class","hidden_none");//hide
        PageList_WeCell[8].setAttribute("class","hidden_none");//hide
    }

    sessionStorage.setItem('id_num',RecordContent.data[0]['id_num']);
    InfoList[0].innerHTML = RecordContent.data[0]['user_name']; //Set the submit time
    InfoList[1].innerHTML = RecordContent.data[0]['user_dept']; //Set the submit time
    InfoList[2].innerHTML = RecordContent.data[0]['user_tele']; //Set the submit time
    InfoList[3].innerHTML = RecordContent.data[0]['report_date']; //Set the submit time
    InfoList[5].innerHTML = RecordContent.data[0]['expect_repairing_time']; //Set the submit time
    InfoList[7].innerHTML = RecordContent.data[0]['form_return_super_name']; //Set the form return super name

    if(RecordContent.data[0]['if_repairing'] != 0)//repairing status
    {
        InfoList[4].innerHTML = "维修中";
    }
    else if(RecordContent.data[0]['if_repaired'] != 0)//repaired status
    {
        if(RecordContent.data[0]['if_form_returned'] != 0)//returned status
        {
            InfoList[4].innerHTML = "表单已退回";
        }
        else
        {
            InfoList[4].innerHTML = "已修复";
        }

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
    //load the user description
    var user_discrpt = document.getElementById("submit_text_id");
    user_discrpt.innerText = RecordContent.data[0]['user_discrpt'];

    //load the img
    var width = $(document).width();
    var requestSite = SERVER_ROOT_URL + SERVER_COMMAND.IMAGESHOW;
    var Record = '<div class="swiper-slide"><img src="#requestSite#?path=#imgPath#&&status=full&&width=#width#" alt=""></div>';


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


function  DistributeAgenda() {

   /*check the distribute information (classification and expect time)*/
    var InfoList =  document.getElementsByClassName("weui-cell__ft");

    if($('#datetime-picker').val() == '')
    {
        $.alert("请填写预计维修完成时间");
        return;
    }


    $.actions({
        title: "是否选择派发维修单",
        onClose: function() {
            console.log("close");
        },
        actions: [
            {
                text: "确定",
                /*className: "color-primary",*/
                className: "color-warning",
                onClick: function() {
                    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.WXCONFIG,"POST",{"url":window.location.href}).then(function(result){
                        wxDisAgenda('direct',transParam);
                    });
                }
            },
        ]
    });
}


function wxConfigParams()
{
    var url = window.location.href;

    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.WXCONFIG,"POST",{"url":url}).then(function(result){
        //store token for promptMessage()
        sessionStorage.setItem("token",result.data.token);
        //config wexin once for all

        wx.config({
            beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: result.data.appId, // 必填，企业微信的corpID
            timestamp: result.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
            signature: result.data.signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: [
                'selectEnterpriseContact',

            ] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });


    });



}
function updateInfo(deptid,userid,data)
{
    var token = sessionStorage.getItem('token');
    var id_num = sessionStorage.getItem('id_num');
    var updateContent = {
        "departmentId":deptid,
        "userId":userid,
        "token":token,
        "id_num":id_num
    }
}

function redirectAgenda()
{
    wxDisAgenda("redirect",transParam);
}


function wxDisAgenda(distType,callbackFunc)
{
    wx.ready(function(){

        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.invoke("selectEnterpriseContact", {
                "fromDepartmentId": -1,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
                "mode": "single",// 必填，选择模式，single表示单选，multi表示多选
                "type": [ "user"],// 必填，选择限制类型，指定department、user中的一个或者多个
                "selectedDepartmentIds": [],// 非必填，已选部门ID列表。用于多次选人时可重入，single模式下请勿填入多个id
                "selectedUserIds": []// 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
            },function(res){
                var departmentId = '';
                var userId = '';
                if (res.err_msg == "selectEnterpriseContact:ok")
                {
                    //alert(res.result);
                    //alert(JSON.stringify(res.result));
                    //document.write(JSON.stringify(res.result));
                    if(typeof res.result == 'string')
                    {
                        res.result = JSON.parse(res.result); //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
                    }
                    var selectedDepartmentList = res.result.departmentList;// 已选的部门列表
                    for (var i = 0; i < selectedDepartmentList.length; i++)
                    {
                        var department = selectedDepartmentList[i];
                        var departmentId = department.id;// 已选的单个部门ID
                    }
                    var selectedUserList = res.result.userList; // 已选的成员列表
                    for (var i = 0; i < selectedUserList.length; i++)
                    {
                        var user = selectedUserList[i];
                        var userId = user.id; // 已选的单个成员ID
                        var userName = user.name;// 已选的单个成员名称
                    }
                    callbackFunc(departmentId,userId,userName,distType);


                }
            }
        );
    });
}
function transParam(departmentId,userId,userName,directType)
{
    var token = sessionStorage.getItem('token');
    var id_num = sessionStorage.getItem('id_num');
    var superUserId =  sessionStorage.getItem('SuperUserID');



    if(directType == "direct")
    {

        var data = {
            "workerDept":departmentId,
            "workerID":userId,
            "workerName":userName,
            "token":token,
            "id_num":id_num,
            "wx_superid":superUserId,
            "classification":$('#Repair_classfication').val(),
            "expect_repairing_time":$('#datetime-picker').val(),
            "accept_date":new Date().toLocaleString('zh',{hour12:false}),
            "if_repairing":1
        }

    }
    else
    {
        var data = {
            "workerDept":departmentId,
            "workerID":userId,
            "workerName":userName,
            "wx_superid":superUserId,
            "token":token,
            "id_num":id_num,
        }
    }


    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.PUSHINFO,"POST",data).then(function(result){

        if(result.errcode == 0)
        {
            //push the application successfully,and redirect webpage to RecordManage.html
            //toastShowup()
            //disable distribution button
            var RtnBtn = document.getElementById("DstbtBtn");
            RtnBtn.classList.value = "weui-btn weui-btn_primary weui-btn_disabled";
            RtnBtn.onclick = null;

            var RedirectBtn = document.getElementById("RedirectBtn");
            RedirectBtn.classList.value = "weui-btn weui-btn_primary btn_space_round_fill weui-btn_disabled";
            RedirectBtn.onclick = null;


            $.toast("派单成功", function() {

                //console.log('close');
            });
        }
        else
        {
            //push the application unsuccessfully,need print out the error code
            //toastShowup()
            $.toast("派单失败", function() {
                //console.log('close');
            });
        }
    });



}

function PromptMessage()
{
    var token = sessionStorage.getItem('token');
    var id_num = sessionStorage.getItem('id_num');

    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.PROPMSG,"POST",{
        "token":token,
        "id_num":id_num,
    }).then(function (result) {
        if(result.errcode == 0)
        {
            //push the application successfully,and redirect webpage to RecordManage.html
            //toastShowup()
            $.toast("催单成功", function() {
                console.log('close');
            });
        }
        else
        {
            //push the application unsuccessfully,need print out the error code
            //toastShowup()
            $.toast("催单失败", function() {
                console.log('close');
            });
        }
    });
}


function returnAgenda(obj)
{
    var formReturnComm = $('.weui-textarea').val();

    ajaxRequest.update(SERVER_ROOT_URL+SERVER_COMMAND.RETURNFORM,"POST",{
        "id_num":id_num,
        "if_form_returned":1,
        "if_repaired":1,
        "if_repairing":0,
        "form_return_comment":formReturnComm,
        "form_return_super_id":sessionStorage.getItem('SuperUserID')
    }).then(function (result) {
        if(result.errcode == 0)
        {
            //push the application successfully,and redirect webpage to RecordManage.html
            //disable return button
            var RtnBtn = document.getElementById("RtnBtn");
            RtnBtn.classList.value = "weui-btn weui-btn_primary weui-btn_disabled";
            RtnBtn.onclick = null;

            //pop up sign
            $.toast("退回成功", function() {
                console.log('close');
            });
        }
        else
        {
            //push the application unsuccessfully,need print out the error code
            //toastShowup()
            $.toast("退回失败", function() {
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


