/*
edit by zhong sp at 2019-04-11
 */

$(function(){
    var url = window.location.href;
    var str = new Array();
    var entryNode = document.getElementsByClassName("weui-grid");

    //if user information has been extracted from server,return
    if(userInfo.ifExists())
    {
        switch(userInfo.getPriority())
        {
            case "employee":
                $(".weui-grid").css("margin-left","11%");
                break;
            case "faculty":
                entryNode[2].className = "weui-grid js_grid";
                break;
            case "admin":
                entryNode[3].className = "weui-grid js_grid";
                entryNode[2].className = "weui-grid js_grid";
                break;
            default:
                break;
        }

        return;
    }
    else
    {
        //split the form from windows.url
        var params = WebUrl.getUrlParams(url,"&");

        //get user info
        var usrInfo = userInfo.userInfoGet(params);


        usrInfo.then(function(result){
            //set user information
            userInfo.set(result);

            //get user priority
            var priorty = userInfo.userPriGet({'UserCode':result.UserCode});
            priorty.then(function(result) {

                userInfo.setPriority(result.priorty);
                switch(result.priorty)
                {

                    case "employee":
                        //entryNode[3].remove();
                        //entryNode[2].remove();
                        //entryNode[3].setAttribute("class","hidden_none");
                        //entryNode[2].setAttribute("class","hidden_none");
                        $(".weui-grid").css("margin-left","11%");
                        break;
                    case "faculty":
                        entryNode[3].className = "hidden_none";
                        entryNode[2].className = "weui-grid js_grid";
                        

                        //entryNode[3].remove();
                        // /entryNode[3].setAttribute("class","hidden_none");
                        break;
                    case "admin":
                        entryNode[3].className = "weui-grid js_grid";
                        entryNode[2].className = "weui-grid js_grid";
                        break;
                    default:
                        break;
                }
            })

        });
    }



})

