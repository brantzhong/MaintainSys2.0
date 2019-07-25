/*
edit by zsp 2019-04-01



*/
var X_axis_content=["维修分类","维修地点"];
var Y_axis_content=["用户评分","平均维修时间"];
var Y_axis_unit=["分","小时"];

$(function() {
    var $ChartTab = $('#ChartTab');
    var $RateTab  = $('#RateTab');

    var $Tab1 = $('#tab1');
    var $Tab2 = $('#tab2');
    //var $Panel= $('#showpanel_1');



    var $LoadmoreSign_tab1= $("#loadmore_sign_1");
    var LoadRecordNum = 8;//browser load 8 records every time when user drags.
    var LoadTimes_tab1 = 1;//request times send to server
    var option = '';
    var previousOption = '';



    $ChartTab.on('click', function () {
        $ChartTab.addClass('weui-bar__item_on');
        $ChartTab.addClass('bolden_text');

        $RateTab.removeClass('weui-bar__item_on');
        $RateTab.removeClass('bolden_text');
        $Tab1.addClass('weui-tab__bd-item--active');
        $Tab2.removeClass('weui-tab__bd-item--active');
    });

    $RateTab.on('click', function () {
        $RateTab.addClass('weui-bar__item_on');
        $RateTab.addClass('bolden_text');

        $ChartTab.removeClass('weui-bar__item_on');
        $ChartTab.removeClass('bolden_text');
        $Tab2.addClass('weui-tab__bd-item--active');
        $Tab1.removeClass('weui-tab__bd-item--active');
    });



    $("#form-picker").picker({
        title: "请选择报修单",
        cols: [
            {
                textAlign: 'center',
                values: ['管理员未评分', '管理员已评分']
            }
        ],
        onChange: function(p, v, dv) {
            console.log(p, v, dv);
        },
        onClose: function(p, v, d) {
            LoadTimes_tab1 = 1;//request times send to server

            if(previousOption != p.displayValue[0])
            {
                /*remove all the records*/
                var Panel = document.getElementById("showpanel_1");
                var children = Panel.childNodes;
                for(var i = children.length -1; i > 0; i--)
                {
                    Panel.removeChild(children[i]);
                }

                switch (p.displayValue[0])
                {
                    case '管理员未评分':
                        option = 'super_unrate';
                        break;
                    case '管理员已评分':
                        option = 'super_rated';
                        break;
                    default:
                        break;

                }

                ajaxRequest.fetch(SERVER_ROOT_URL + SERVER_COMMAND.FETCH,"POST",{
                    "LoadTimes":LoadTimes_tab1,
                    "Option":option,
                }).then(function (result) {
                    LoadInfoToPage(result.data, $("#showpanel_1"));
                });
                LoadTimes_tab1++;
                previousOption = p.displayValue[0];
            }
            else
            {

            }

            console.log("close");
        }
    });

    $Tab2.infinite().on("infinite", function() {
        var self = this;
        $LoadmoreSign_tab1.removeClass("hidden");

        if (self.loading) {
            return;
        }

        console.log(self)
        self.loading = true;
        console.log(self);
        ajaxRequest.fetch(SERVER_ROOT_URL + SERVER_COMMAND.FETCH,"POST",{
            "LoadTimes":LoadTimes_tab1,
            "Option":option,
        }).then(function (result) {
            LoadInfoToPage(result.data, $("#showpanel_1"));
        });

        self.loading = false;
        LoadTimes_tab1++;
    });



    $("#X_axis").picker({
        title: "请对X轴进行选择",
        cols: [
            {
                textAlign: 'center',
                values: X_axis_content
            }
        ],
        onChange: function(p, v, dv) {
            console.log(p, v, dv);
        },
        onClose: function(p, v, d) {
            console.log("close");
        }
    });

    $("#Y_axis").picker({
        title: "请对Y轴进行选择",
        cols: [
            {
                textAlign: 'center',
                values: Y_axis_content
            }
        ],
        onChange: function(p, v, dv) {
            console.log(p, v, dv);
        },
        onClose: function(p, v, d) {

            console.log("close");
        }
    });


})

function GenerateChart()
{
    var x_axis_value = $('#X_axis').val();
    var y_axis_value = $('#Y_axis').val();

    if(x_axis_value == y_axis_value)
    {
        $.alert("X轴参数不可以和Y轴参数相同");
        return;
    }


    var ChartData = {
        "x_axis":x_axis_value,
        "y_axis":y_axis_value,
    };

    ajaxRequest.update(SERVER_ROOT_URL + SERVER_COMMAND.DRAWCHART,"POST",ChartData).then(function (result) {
        ChartConfig(x_axis_value,y_axis_value,result.data);
    });

}

function ChartConfig(xAxisString,yAxisString,data)
{

    var xAxisCategory =new Array();

    var yAxisCategory =new Array();

    var unit = "";

    for(var i=0;i < data.length;i++)
    {
        xAxisCategory[i] = data[i]['x_axis'];
    }

    for(i=0;i < data.length;i++)
    {
        yAxisCategory[i] = parseFloat(data[i]['y_axis']);
    }

    for(i = 0;i < Y_axis_content.length;i++)
    {
        if(yAxisString == Y_axis_content[i])
        {
            unit = Y_axis_unit[i];
        }
    }



    var chart = {
        type: 'column'
    };
    var title = {
        text: yAxisString+'/'+xAxisString
    };
    var subtitle = {
        text: 'source:NWE information center'
    };

    var xAxis = {
        categories: xAxisCategory,
        crosshair: true
    };
    var yAxis = {
        min: 0,
        title: {
            text: yAxisString
        }
    };

    var tooltip = {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} '+unit+'</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    };

    var plotOptions = {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    };
    var series =  [{
        data: yAxisCategory
    }];


    var credits = {
        enabled: true
    };

    var json = {};
    json.chart = chart;
    json.title = title;
    json.subtitle = subtitle;
    json.tooltip = tooltip;
    json.xAxis = xAxis;
    json.yAxis = yAxis;
    json.series = series;
    json.plotOptions = plotOptions;
    json.credits = credits;
    $('#container').highcharts(json);

}



function LoadInfoToPage(Data,$Label){
    var RecordNum = Data.length;
    var requestSite = SERVER_ROOT_URL + SERVER_COMMAND.IMAGESHOW;
    var ImageSrc = "";
    var Record = '<a href="SupervisorRateDetail.html?id_num=#RecordID#" class="weui-media-box weui-media-box_appmsg">' +
        '<div class="weui-media-box__hd">' +
        '<img class="weui-media-box__thumb" src="#ImageSrc#" alt="">' +
        '</div> ' +
        '<div class="weui-media-box__bd">' +
        ' <h4 class="weui-media-box__title">#SubmitTime#</h4> ' +
        '<p class="weui-media-box__desc">#UserText#</p> ' +
        '</div>' +
        ' </a>';
    //var WarningSign = '';
    var currentTime = new Date().toLocaleString('zh',{hour12:false});
    var expectTime = '';

    if(RecordNum == 0)
    {
        $Label.next().addClass("hidden");
    }
    else
    {



        for(var i = 0;i < RecordNum;i++)
        {
            //if no images uploaded by users
            if((Data[i]['img1Path'] == null)||(Data[i]['img1Path'] == ""))
            {
                ImageSrc= SERVER_URL + 'front/pages/html/image/noImage.png';
            }
            else
            {
                ImageSrc = requestSite + '?path='+ Data[i]['img1Path'] +'&&status=thumb';
            }


            $Label.append($(Record.replace("#ImageSrc#",ImageSrc).replace("#RequestSite#",requestSite).replace("#RecordID#",Data[i]['id_num']).replace("#imgPath#",Data[i]['img1Path']).replace("#SubmitTime#",Data[i]['report_date']).replace("#UserText#",Data[i]['user_discrpt'])));
        }
    }
}
