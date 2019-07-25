/*
edit by zsp 2019-04-01
*/


var ajaxRequest = (function (jQuery) {
    "use strict";
    var uploadRecord = function(url,type,data){

        var promise = new Promise(function (resolve, reject) {
            jQuery.ajax(url,{

                type:type,   //你选择get或者post最后都是get，跨域情况下都是get
                async:true,
                dataType: "json",//指定服务器返回的类型
                processData:false,
                contentType: false,
                data: data,


                success:function (result) {     //回调函数，result，返回值
                    if(typeof result == 'string')
                    {
                        result = JSON.parse(result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
                    }

                    resolve(result);


                },

                error:function(XMLHttpRequest, textStatus, errorThrown){

                }

            });



        });
        return promise;
    }


    var fetchRecord = function(url,type,data){
        var promise = new Promise(function (resolve, reject) {
            jQuery.ajax(url,{

                type:type,   //你选择get或者post最后都是get，跨域情况下都是get
                async:true,
                dataType: "json",//指定服务器返回的类型
                //processData:false,
                //contentType: false,
                data: data,


                success:function (result) {     //回调函数，result，返回值
                    if(typeof result == 'string')
                    {
                        result = JSON.parse(result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
                    }

                    resolve(result);


                },

                error:function(XMLHttpRequest, textStatus, errorThrown){

                }

            });



        });
        return promise;
    }

    var updateRecord = function(url,type,data){
        var promise = new Promise(function (resolve, reject) {
            jQuery.ajax(url,{

                type:type,   //你选择get或者post最后都是get，跨域情况下都是get
                async:true,
                dataType: "json",//指定服务器返回的类型
                //processData:false,
                //contentType: false,
                data: data,


                success:function (result) {     //回调函数，result，返回值
                    if(typeof result == 'string')
                    {
                        result = JSON.parse(result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
                    }

                    resolve(result);


                },

                error:function(XMLHttpRequest, textStatus, errorThrown){

                }

            });



        });
        return promise;
    }

    var updateSync = function(url,type,data){
        var promise = new Promise(function (resolve, reject) {
            jQuery.ajax(url,{

                type:type,   //你选择get或者post最后都是get，跨域情况下都是get
                async:false,
                dataType: "json",//指定服务器返回的类型
                //processData:false,
                //contentType: false,
                data: data,


                success:function (result) {     //回调函数，result，返回值
                    if(typeof result == 'string')
                    {
                        result = JSON.parse(result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
                    }

                    resolve(result);


                },

                error:function(XMLHttpRequest, textStatus, errorThrown){

                }

            });



        });
        return promise;
    }


    return {
        upload:uploadRecord,
        fetch:fetchRecord,
        update:updateRecord,
        updateSync:updateSync
    }

})(jQuery);





