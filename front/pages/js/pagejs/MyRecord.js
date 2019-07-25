/*
2019-04-10
edit by zhong sp
 */


$(function(){
    var $AcomplishTab = $('#AcomplishTab');
    var $UncomplishTab = $('#UncomplishTab');
    var $Tab1 = $('#tab1');
    var $Tab2 = $('#tab2');
    var $LoadmoreSign_tab1= $("#loadmore_sign_1");
    var $LoadmoreSign_tab2= $("#loadmore_sign_2");
    var LoadRecordNum = 8;//browser load 8 records every time when user drags.
    var LoadTimes_tab1 = 1;//request times send to server
    var LoadTimes_tab2 = 1;//request times send to server
    var recordList = new Array();

    $AcomplishTab.addClass('bolden_text');


    $UncomplishTab.on('click', function () {
        $UncomplishTab.addClass('weui-bar__item_on');
        $UncomplishTab.addClass('bolden_text');

        $AcomplishTab.removeClass('weui-bar__item_on');
        $AcomplishTab.removeClass('bolden_text');
        $Tab2.addClass('weui-tab__bd-item--active');
        $Tab1.removeClass('weui-tab__bd-item--active');

        recordList = {
            "UserID":sessionStorage.getItem("UserCode"),
            "LoadTimes":LoadTimes_tab2,
            "Option":"complete"
        }

        ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.FETCH,"POST",recordList).then(function(result)
        {
            LoadInfoToPage(result.data,$("#showpanel_2"));
        });

        LoadTimes_tab2++;

    });




    $AcomplishTab.on('click', function () {
        $AcomplishTab.addClass('weui-bar__item_on');
        $AcomplishTab.addClass('bolden_text');

        $UncomplishTab.removeClass('weui-bar__item_on');
        $UncomplishTab.removeClass('bolden_text');
        $Tab1.addClass('weui-tab__bd-item--active');
        $Tab2.removeClass('weui-tab__bd-item--active');


        /*Get Login user infos*/
        LoadTimes_tab1++;

        /*Send info to server to grab the first 10 records */



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


        recordList = {
            "UserID":sessionStorage.getItem("UserCode"),
            "LoadTimes":LoadTimes_tab1,
            "Option":"uncomplete"
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
            "Option":"complete"
        }

        ajaxRequest.fetch(SERVER_ROOT_URL+SERVER_COMMAND.FETCH,"POST",recordList).then(function(result)
        {
            LoadInfoToPage(result.data,$("#showpanel_2"));
        });

        self.loading = false;
        LoadTimes_tab2++;

    });


    recordList = {
        "UserID":sessionStorage.getItem("UserCode"),
        "LoadTimes":LoadTimes_tab1,
        "Option":"uncomplete"
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
    //var Record = '<a href="RecordDetail.html?id_num=#RecordID#&&record_type=user" class="weui-media-box weui-media-box_appmsg"><div class="weui-media-box__hd"><img class="weui-media-box__thumb" src="http://2278i36g67.iok.la/MaintainSys/src/php/ImageHandle.php?path=#imgPath#&&status=thumb" alt=""></div> <div class="weui-media-box__bd"> <h4 class="weui-media-box__title">#SubmitTime#</h4> <p class="weui-media-box__desc">#UserText#</p> </div> </a>';
    var Record = '<a href="RecordDetail.html?id_num=#RecordID#&&record_type=user" class="weui-media-box weui-media-box_appmsg">' +
                     '<div class="weui-media-box__hd">' +
                         '<img class="weui-media-box__thumb" src="#ImageSrc#" alt="">' +
                     '</div> ' +
                     '<div class="weui-media-box__bd">' +
                         '<h4 class="weui-media-box__title">#SubmitTime#</h4>' +
                         '<p class="weui-media-box__desc">#UserText#</p>' +
                         '#UnratedSign#'+ '#ReturnFormSign#'+
                     '</div>' +
                 '</a>';
    var UnratedSign = '';
    var ReturnFormSign = '';

    if(RecordNum == 0)
    {
        $Label.next().addClass("hidden");
    }
    else
    {
        for(var i = 0;i < RecordNum;i++)
        {
            //if repairement has been completed
            if((Data[i]['if_rated'] == 0) &&(Data[i]['if_repaired']==1))
            {
                UnratedSign = '<span class="weui-badge" style="margin-left: 5px;background-color: #d39e00">未评分</span>';
            }
            else
            {
                UnratedSign = '';
            }

            if(Data[i]['if_form_returned'] == 1)
            {
                ReturnFormSign = '<span class="weui-badge" style="margin-left: 5px;">已退回</span>';
            }
            else
            {
                ReturnFormSign = '';
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

            $Label.append($(Record.replace("#ImageSrc#",ImageSrc).replace("#RecordID#",Data[i]['id_num']).replace("#imgPath#",Data[i]['img1Path']).replace("#SubmitTime#",Data[i]['report_date']).replace("#UserText#",Data[i]['user_discrpt']).replace("#UnratedSign#",UnratedSign).replace("#ReturnFormSign#",ReturnFormSign)));
        }
    }


}



