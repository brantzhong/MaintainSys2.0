/*
*
*
*
*
*
*
* */

var progressBar = (function(){


    var init = function(domID)
    {
        //set progress bar style
        var elem = document.getElementById(domID);
        elem.setAttribute("width",'10%');
        elem.setAttribute("height",'5px');
        elem.setAttribute("background-color",'#4CAF50');
        elem.setAttribute("text-align",'center');
        elem.setAttribute("line-height",'5px');
        elem.setAttribute("color",'white');

        //var width = 10;
        //var id = setInterval(frame, 10);


    }

    var setProgressBarBg = function(Percentage)
    {
        var styleString = '    width:20%;' +
            '    height: 15px;' +
            '    background-color: ##bgcolor#;' +  //set this
            '    border-radius: 3px;' +
            '    text-align:center;' +
            '    font-size:12px;' +
            '    vertical-align:middle;'

        if(Percentage < 35)
        {
            return styleString.replace("#bgcolor#",'dbf4bf');
        }
        else if(Percentage < 70)
        {
            return styleString.replace("#bgcolor#",'fff3cd');
        }
        else
        {
            return styleString.replace("#bgcolor#",'f9e1e3');
        }

    }


    var setProgressBar = function(Percentage)
    {
        var styleString = '    width: #Percentage#%;' +
            '    height: 100%;' +
            '    background-color: ##bgcolor#;' +
            '    border-radius: 3px;'

        if(Percentage < 35)
        {
            return styleString.replace("#bgcolor#",'179b16').replace("#Percentage#",Percentage);
        }
        else if(Percentage < 70)
        {
            return styleString.replace("#bgcolor#",'df8e00').replace("#Percentage#",Percentage);
        }
        else
        {
            return styleString.replace("#bgcolor#",'e46a70').replace("#Percentage#",Percentage);
        }

    }



    var styleGet = function(Percentage)
    {
        var styleString = '  width: 10%;' +
                          '  height: 5px;' +
                          '  background-color: #4CAF50;' +
                          '  text-align: center;' +
                          '  line-height: 5px;' +
                          '  color: white;';


        return styleString;
    }



    return {
        styleGet:styleGet,
        setProgressBarBg:setProgressBarBg,
        setProgressBar:setProgressBar
    }

})();


