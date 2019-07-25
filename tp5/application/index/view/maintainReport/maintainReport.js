/*
edit by zsp 2019-04-01



*/
$(function() {

    var url = "http://2278i36g67.iok.la/MaintainSys/src/php/GetSts.php";

    jQuery.ajax(url,{

        type:"POST",   //你选择get或者post最后都是get，跨域情况下都是get
        async:false,

        data: {
        },

        success:function (result) {     //回调函数，result，返回值
            var InfoArray = JSON.parse(result);

            if(InfoArray.ServerResult)
            {
                ChartConfig(InfoArray);
            }
            else {
                alert("无法加载图表",InfoArray.ServerResult);
            }


        },

        error:function(XMLHttpRequest, textStatus, errorThrown){
            //return textStatus;
        }

    });







})



function ChartConfig(InfoArray)
{
    var totalCase= parseInt(InfoArray.UnacceptCase) + parseInt(InfoArray.RepairedCase) + parseInt(InfoArray.RepairingCase);
    var pctUnacceptCase = InfoArray.UnacceptCase*100/totalCase;
    var pctRepairedCase = InfoArray.RepairedCase*100/totalCase;
    var pctRepairingCase = InfoArray.RepairingCase*100/totalCase;
    var totalStar = 0;


    var pctStar=new Array();

    for(var i = 0;i < 5;i++)
    {
        totalStar = totalStar + parseInt(InfoArray.RatedStarNum[i]);
    }
    for(i = 0;i < 5;i++)
    {
        pctStar[i] = InfoArray.RatedStarNum[i]*100/totalStar;
    }

    // Build the chart
    Highcharts.chart('container1', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '报修情况分析'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: '维修情况',
            colorByPoint: true,
            data: [{
                name: '未受理',
                y: pctUnacceptCase,
                sliced: true,
                selected: true
            }, {
                name: '维修中',
                y: pctRepairingCase
            }, {
                name: '已完成',
                y: pctRepairedCase
            }]
        }]
    });


    Highcharts.chart('container2', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '服务评价分析'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            name: '服务评价',
            colorByPoint: true,
            data: [{
                name: '很糟糕',
                y: pctStar[0],
                sliced: true,
                selected: true
            }, {
                name: '一般般',
                y: pctStar[1]
            }, {
                name: '还不错',
                y: pctStar[2]
            }, {
                name: '挺好的',
                y: pctStar[3]
            }, {
                name: '非常棒',
                y: pctStar[4]
            }]
        }]
    });
}