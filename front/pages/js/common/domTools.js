/*
*
*
* DOM related module
*
*
* */


var domWidget = (function(document){
    "use strict";
    var disableElement = function(element_id){
        document.getElementById(element_id).disabled = true;

        return;
    }


    var getValue = function(element_id){

        //var val = $jqueryTag.val();
        return document.getElementById(element_id).value;
    }



    return {
        disableElement:disableElement,
        getValue:getValue
    }


})(document)