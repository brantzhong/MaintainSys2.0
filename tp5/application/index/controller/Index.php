<?php
namespace app\index\controller;


use think\Controller;
use think\Db;
use think\Image;


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


class Index extends Controller
{
    //fengbo corp1
    //public static $corpid ="ww419c367ed050cb15";
    //public static $secret ="LiaDVQ4TjuYnbVLswgXmtHT_38kAHJ0tCqVM8i2AZEE";
    //public static $key = "44E881ef65d09949D5CA70Cb1D4c118d";
    //public static $agentid = "1000002";

    //fengbo corp2 new
    public static $corpid ="ww419c367ed050cb15";
    public static $secret ="gdviA8GHNJYMxJBlYLx2dQ4tMyONyblHefFRDrur0XU";
    public static $key = "1Ef5A8271Dc1A68771E2Fbf394Cf520c";
    public static $agentid = "1000004";

    //NWE corp
    //public static $corpid ="wxd503fdfb29221b05";
    //public static $secret ="1oTZMs4HAabGHls93Sxp1NQFOJTgZ7H3CswZricrXVg";
    //public static $key = "1Ef5A8271Dc1A68771E2Fbf394Cf520c";
    //public static $agentid = "1000029";

    public function index()
    {
        return '<style type="text/css">*{ padding: 0; margin: 0; } .think_default_text{ padding: 4px 48px;} a{color:#2E5CD5;cursor: pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family: "Century Gothic","Microsoft yahei"; color: #333;font-size:18px} h1{ font-size: 100px; font-weight: normal; margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"> <h1>:)</h1><p> ThinkPHP V5<br/><span style="font-size:30px">十年磨一剑 - 为API开发设计的高性能框架</span></p><span style="font-size:22px;">[ V5.0 版本由 <a href="http://www.qiniu.com" target="qiniu">七牛云</a> 独家赞助发布 ]</span></div><script type="text/javascript" src="https://tajs.qq.com/stats?sId=9347272" charset="UTF-8"></script><script type="text/javascript" src="https://e.topthink.com/Public/static/client.js"></script><think id="ad_bd568ce7058a1091"></think>';
    }

    /*visit http://localhost/MaintainSys2.0/tp5/index.php/index/index/mainpage*/
    public function mainpage($user)
    {
        return $user;
    }
    public function userInfo(){

        $urldata = $this->request->post("data");
        $token = $this->request->post("token");
        $Target = $this->request->post("Target");

        /*Get User Code*/
        if($urldata != null)
        {
            $PostEncryptedData = $urldata;

            $mcrypt = new \McryptAES();

            $DecryptedData = json_decode($mcrypt->decrypt($PostEncryptedData,self::$key));
            if(($DecryptedData->account != null)&&($DecryptedData->timestamp != null))
            {
                $UserCode = $DecryptedData->account;

            }
            else
            {
                $result = array(
                    'RetCode' =>'8',
                    'Memo'=>'Data decrypted error'
                );

                echo json_encode($result);
                return;
            }
        }
        else if(($token != null)&&($Target != null))
        {
            /********************************Get UserCode***********************************************/
            $SSOService = new \SoapClient("http://10.0.6.19:8008/SSOService.asmx?WSDL");
            $SSOService->soap_defencoding = 'utf-8';
            $SSOService->decode_utf8 = false;
            $SSOService->xml_encoding = 'utf-8';
            $TokenTarget = array(
                "Token"=>$token,
                "Target"=>$Target);
            $SSOServiceParam = array(
                "info"=>json_encode($TokenTarget)
            );
            $json_para = json_encode($SSOServiceParam);
            //$SSOServiceParam = "{\"Token\":\"" + $Token +"\"" +","  +"\"Target\":\"" +$Target+"\"}";
            $RetVal = $SSOService->__Call("getUserInfoByToken", array($SSOServiceParam));
            if (is_soap_fault($RetVal))
            {
                trigger_error("SOAP Fault: (faultcode: {$RetVal->faultcode}, faultstring: {$RetVal->faultstring})", E_USER_ERROR);
                $result = array(
                    'RetCode' =>'2',
                    'Memo'=>'call webservice(getUserInfoByToken) failed'
                );

                echo json_encode($result);
                return;
            }
            else
            {
                $data = json_decode($RetVal->getUserInfoByTokenResult); //这里返回的是类，必须使用->得到元素的值

                if($data->Result== 1)
                {
                    $UserCode = $data->Memo;
                }
                else
                {
                    $result = array(
                        'RetCode' =>'3',
                        'Memo'=>$data->Memo
                    );

                    echo json_encode($result);
                    return;
                }

                //$obj = json_decode($data);
            }
        }
        else
        {
            //user identity missed,return error
            $result = array(
                'RetCode' =>'1',
                'Memo'=>'No token and data'
            );

            echo json_encode($result);

            return;
        }

        /********************************Get UserName and User Department*******************************************/
        //$UserCode ="02661";

        $OrgService = new \SoapClient("http://10.0.6.19:8008/OrgService.asmx?WSDL");
        $OrgService->soap_defencoding = 'utf-8';
        $OrgService->decode_utf8 = false;
        $OrgService->xml_encoding = 'utf-8';

        $OrgServiceParams1 = array(
            "start"=>"-1"
        );
        $OrgServiceParams2 = array(
            "start"=>"-2"
        );
        $OrgServiceParams3 = array(
            "start"=>"-3"
        );

        $RetVal = $OrgService->__Call("getNWHOrgInfo", array($OrgServiceParams2));
        if (is_soap_fault($RetVal))
        {
            trigger_error("SOAP Fault: (faultcode: {$RetVal->faultcode}, faultstring: {$RetVal->faultstring})", E_USER_ERROR);
            $result = array(
                'RetCode' =>'4',
                'Memo'=>'call webservice(getNWHOrgInfo) failed'
            );

            echo json_encode($result);
            return;
        }
        else
        {
            $data = json_decode($RetVal->getNWHOrgInfoResult);
            $UserInfo = $data->UserInfo;
            $arrLength=count($UserInfo);
            for($fornum=0;$fornum<$arrLength;$fornum++)
            {
                if($UserInfo[$fornum]->UserCode == $UserCode)
                {
                    $UserID = $UserInfo[$fornum]->UserID;
                    $UserName = $UserInfo[$fornum]->UserName;
                    break;
                }
                else
                {
                    continue;
                }

            }
        }

        $RetVal = $OrgService->__Call("getNWHOrgInfo", array($OrgServiceParams3));
        if (is_soap_fault($RetVal))
        {
            trigger_error("SOAP Fault: (faultcode: {$RetVal->faultcode}, faultstring: {$RetVal->faultstring})", E_USER_ERROR);
            $result = array(
                'RetCode' =>'5',
                'Memo'=>'call webservice(getNWHOrgInfo) failed'
            );

            echo json_encode($result);
            return;
        }
        else
        {
            $data = json_decode($RetVal->getNWHOrgInfoResult);
            $DeptUserInfo = $data->DeptUserInfo;
            $arrLength=count($DeptUserInfo);
            for($fornum=0;$fornum<$arrLength;$fornum++)
            {
                if($DeptUserInfo[$fornum]->UserID == $UserID)
                {
                    $DeptID = $DeptUserInfo[$fornum]->DeptID;
                    break;
                }
                else
                {
                    continue;
                }

            }
        }

        $RetVal = $OrgService->__Call("getNWHOrgInfo", array($OrgServiceParams1));
        if (is_soap_fault($RetVal))
        {
            trigger_error("SOAP Fault: (faultcode: {$RetVal->faultcode}, faultstring: {$RetVal->faultstring})", E_USER_ERROR);
            $result = array(
                'RetCode' =>'6',
                'Memo'=>'call webservice(getNWHOrgInfo) failed'
            );

            echo json_encode($result);
            return;
        }
        else
        {
            $data = json_decode($RetVal->getNWHOrgInfoResult);
            $DeptInfo = $data->DeptInfo;
            $arrLength=count($DeptInfo);
            for($fornum=0;$fornum<$arrLength;$fornum++)
            {
                if($DeptInfo[$fornum]->DeptID == $DeptID)
                {
                    $DeptName = $DeptInfo[$fornum]->DeptName;
                    break;
                }
                else
                {
                    continue;
                }

            }
        }
        /************************************Get user mobile number*********************************************************/

        $MobileInfo = array(
            "Account"=>$UserCode,
            "Info" =>"mobile"
        );

        $OrgServiceMoblie = array(
            "info" =>json_encode($MobileInfo)
        );


        $RetVal = $OrgService->__Call("userInfomation", array($OrgServiceMoblie));
        if (is_soap_fault($RetVal))
        {
            trigger_error("SOAP Fault: (faultcode: {$RetVal->faultcode}, faultstring: {$RetVal->faultstring})", E_USER_ERROR);
            $result = array(
                'RetCode' =>'6',
                'Memo'=>'call webservice(userInfomation) failed'
            );

            echo json_encode($result);
            return;
        }
        else
        {
            $data = json_decode($RetVal->userInfomationResult);
            $MobileNo = $data;

        }

        if(($UserName == null)||($DeptName == null))
        {
            $result = array(
                'RetCode' =>'7',
                'Memo'=>'can not find user name and user department'
            );

            echo json_encode($result);
            return;
        }
        else
        {
            $result = array(
                'RetCode' =>'0',
                'UserName'=>$UserName,
                'UserCode'=>$UserCode,
                'UserDept'=>$DeptName,
                'UserDeptID'=>$DeptID,
                'UserMobile'=>$MobileNo
            );

            echo json_encode($result);
            return;
        }

    }
    public function userPriority()
    {
        $usercode = $this->request->post("UserCode");


        $selectKey = ['priority','info_recv_location'];
        $res = Db::table('employee_authority_tab')
            ->where('user_code','=', $usercode)
            ->field($selectKey)
            ->select();

        if(sizeof($res) == 0)
        {
            return json_encode(array(
                "priorty" => "employee"
            ),JSON_UNESCAPED_UNICODE);
        }
        else
        {

            return json_encode(array(
                "priorty" => $res[0]['priority']
            ),JSON_UNESCAPED_UNICODE);
        }


    }



    public function uploadForm()
    {
        $ImageFilePath = "../UserImageFolder/";
        $username = $this->request->post("UserName");
        $userid = $this->request->post("UserID");
        $userDept = $this->request->post("UserDept");
        $userDeptID = $this->request->post("UserDeptID");
        $userTele = $this->request->post("UserTele");
        $Location = $this->request->post("Location");
        $userTime = $this->request->post("Time");
        $userText = $this->request->post("Text");
        $ifAnonymous = $this->request->post("ifAnonymous");
        $userFileName= $this->request->post("FileName");
        $imagePath1 = "";
        $ImgType1 = "";
        $imagePath2 = "";
        $ImgType2 = "";

        if($userFileName != null)
        {
            $FileNames = explode(",",$userFileName);

            if(isset($FileNames[0]))
            {
                $file = request()->file($FileNames[0]);
                $ImgType = request()->file($FileNames[0])->getMime();
                switch(explode("/",$ImgType)[1])
                {
                    case "jpeg":
                        $ImageFileSuffix = ".jpg";
                        break;
                    case "jpg":
                        $ImageFileSuffix = ".jpg";
                        break;
                    case "png":
                        $ImageFileSuffix = ".png";
                        break;
                    case "gif":
                        $ImageFileSuffix = ".gif";
                        break;
                    default:

                }

                $imageName =  $FileNames[0].$ImageFileSuffix;
                $info = $file->move($ImageFilePath,$imageName);
                if($info)
                {
                    $imagePath1 = $ImageFilePath.$imageName;
                    $ImgType1 = $ImgType;
                }
                else
                {
                    //echo $file->getError();
                }

            }
            else
            {
                $imagePath1 = "";
                $ImgType1 = "";
            }

            if(isset($FileNames[1]))
            {
                $file = request()->file($FileNames[1]);
                $ImgType = request()->file($FileNames[1])->getMime();
                switch(explode("/",$ImgType)[1])
                {
                    case "jpeg":
                        $ImageFileSuffix = ".jpg";
                        break;
                    case "jpg":
                        $ImageFileSuffix = ".jpg";
                        break;
                    case "png":
                        $ImageFileSuffix = ".png";
                        break;
                    case "gif":
                        $ImageFileSuffix = ".gif";
                        break;
                    default:

                }

                $imageName =  $FileNames[1].$ImageFileSuffix;
                $info = $file->move($ImageFilePath,$imageName);
                if($info)
                {
                    $imagePath2 = $ImageFilePath.$imageName;
                    $ImgType2 = $ImgType;
                }
                else
                {
                    //echo $file->getError();
                }
            }
            else
            {
                $imagePath2 = "";
                $ImgType2 = "";
            }
        }




        $updateRecord = ['user_name' => $username, 'user_id' => $userid, 'user_dept' =>$userDept, 'uer_dept_id' =>$userDeptID, 'user_tele' => $userTele, 'user_discrpt' =>$userText, 'report_date' => $userTime, 'location' => $Location, 'img1Path' => $imagePath1, 'img2Path' => $imagePath2, 'img1type' => $ImgType1, 'img2type' =>$ImgType2,'if_Anonymous'=>$ifAnonymous];

        $res = Db::table('maintain_report')->insert($updateRecord);


        //notice the faculties that new job has been arrived

        $content = '综合服务报修：您收到一个新的报修单，请及时处理';


        $text = array(
            'content' => '您收到一个新的报修单，请及时处理',
            );
        $facultyCode = Db::table('employee_authority_tab')
            ->where('info_recv_location','like','%'.$Location.'%')
            ->field('user_code')
            ->select();

        for($fornum = 0;$fornum < sizeof($facultyCode);$fornum++)
        {
            //send message to wework
            $this->sendNoticeToMember($facultyCode[$fornum]['user_code'],$text);
            //send message in wexin information notice
            \NWEWebservice::SendMessage($facultyCode[$fornum]['user_code'],$content);

        }

        if($res == 1)
        {
            $result = array(
                'ServerResult'=>'0'
            );
            return json_encode($result);
        }
        else
        {
            $result = array(
                'ServerResult'=>'101'
            );
            return json_encode($result);
        }



    }

    public function CmpltRecord()
    {
        $ImageFilePath = "../CmpltTaskImageFolder/";
        $idnum = $this->request->post("id_num");
        $repaired_date = $this->request->post("repaired_date");
        $userFileName= $this->request->post("FileName");

        if($userFileName != null)
        {
            $FileNames = explode(",",$userFileName);

            if(isset($FileNames[0]))
            {
                $file = request()->file($FileNames[0]);
                $ImgType = request()->file($FileNames[0])->getMime();
                switch(explode("/",$ImgType)[1])
                {
                    case "jpeg":
                        $ImageFileSuffix = ".jpg";
                        break;
                    case "jpg":
                        $ImageFileSuffix = ".jpg";
                        break;
                    case "png":
                        $ImageFileSuffix = ".png";
                        break;
                    case "gif":
                        $ImageFileSuffix = ".gif";
                        break;
                    default:

                }

                $imageName =  $FileNames[0].$ImageFileSuffix;
                $info = $file->move($ImageFilePath,$imageName);
                if($info)
                {
                    $imagePath1 = $ImageFilePath.$imageName;
                    $ImgType1 = $ImgType;
                }
                else
                {
                    //echo $file->getError();
                }

            }
            else
            {
                $imagePath1 = "";
                $ImgType1 = "";
            }

            if(isset($FileNames[1]))
            {
                $file = request()->file($FileNames[1]);
                $ImgType = request()->file($FileNames[1])->getMime();
                switch(explode("/",$ImgType)[1])
                {
                    case "jpeg":
                        $ImageFileSuffix = ".jpg";
                        break;
                    case "jpg":
                        $ImageFileSuffix = ".jpg";
                        break;
                    case "png":
                        $ImageFileSuffix = ".png";
                        break;
                    case "gif":
                        $ImageFileSuffix = ".gif";
                        break;
                    default:

                }

                $imageName =  $FileNames[1].$ImageFileSuffix;
                $info = $file->move($ImageFilePath,$imageName);
                if($info)
                {
                    $imagePath2 = $ImageFilePath.$imageName;
                    $ImgType2 = $ImgType;
                }
                else
                {
                    //echo $file->getError();
                }
            }
            else
            {
                $imagePath2 = "";
                $ImgType2 = "";
            }
        }
        $updateContent = [ 'repaired_date' => $repaired_date, 'img1repaired' => $imagePath1, 'img2repaired' => $imagePath2, 'img1repairedType' => $ImgType1, 'img2repairedType' => $ImgType2,'if_repaired'=>1,'if_repairing'=>0];
        $res = Db::table('maintain_report')
            ->where('id_num','=', $idnum)
            ->update($updateContent);

        //create send url
        //$wxUrl = new \wxParamsUrl();
        //$url = $wxUrl->sendMessage.'access_token='.$Token[0]["params_content"];
        //send a message to supervisor that the job has been completed
        $selectKey = ['id_num','user_id','wx_superid','wx_superdeptid','workerName','repaired_date'];
        $queryResult = Db::table('maintain_report')
            ->where('id_num','=', $idnum)
            ->field($selectKey)
            ->select();

        //send message to wework
        $text = array(
            'content' =>'您派发的报修单已经完成 单号：'.$idnum.PHP_EOL.'完成人：'.$queryResult[0]['workerName'].PHP_EOL.'完成时间：'.$queryResult[0]['repaired_date'],
        );
        $this->sendNoticeToMember($queryResult[0]['wx_superid'],$text);


        $text = array(
            'content' =>'您提交的维修已经完成',
        );
        $Res = $this->sendNoticeToMember($queryResult[0]['user_id'],$text);

        //send message to wexin information notice

        $content = '综合服务报修：您派发的报修单已经完成 单号：'.$idnum.PHP_EOL.'完成人：'.$queryResult[0]['workerName'].PHP_EOL.'完成时间：'.$queryResult[0]['repaired_date'];

        \NWEWebservice::SendMessage($queryResult[0]['wx_superid'],$content);

        $content = '综合服务报修：您提交的维修已经完成,欢迎在已完成的报修单中对维修服务进行评价';
        \NWEWebservice::SendMessage($queryResult[0]['user_id'],$content);






        if($Res)
        {
            $result = array(
                'ServerResult'=>'0'
            );
            return json_encode($result);
        }
        else
        {
            $result = array(
                'ServerResult'=>'401'
            );
            return json_encode($result);
        }

/*
        if($res == 1)
        {
            $result = array(
                'ServerResult'=>'0'
            );
            return json_encode($result);
        }
        else
        {
            $result = array(
                'ServerResult'=>'101'
            );
            return json_encode($result);
        }
*/
    }


    public function fetchRecord(){
        $RecordNumEveryReq = 8;

        $userid = $this->request->post("UserID");
        $loadtimes = $this->request->post("LoadTimes");
        $option = $this->request->post("Option");

        /*zsp test*/
        //$userid = "02661";

        if(($option == "complete")||($option == "uncomplete"))
        {
            switch($option) {
                case "complete":
                    $option_if_repaired = 1;
                    break;
                case  "uncomplete":
                    $option_if_repaired = 0;
                    break;
                default:
                    break;
            }
            $selectKey = ['id_num','report_date','img1Path','user_discrpt','img1type','if_rated','if_repaired','if_form_returned'];

            $queryResult = Db::table('maintain_report')
                ->where('user_id','=', $userid)
                ->where('if_repaired','=',$option_if_repaired)
                ->order('report_date','desc')
                ->limit($RecordNumEveryReq*($loadtimes-1),$RecordNumEveryReq)
                ->field($selectKey)
                ->select();
        }
        elseif (($option == "adminunaccept")||($option == "adminuncomplish")||($option == "admincomplish"))
        {
            switch($option){
                case "adminunaccept":
                    $option_if_repaired = 0;
                    $option_if_repairing = 0;
                    break;
                case "adminuncomplish":
                    $option_if_repaired = 0;
                    $option_if_repairing = 1;
                    break;
                case "admincomplish":
                    $option_if_repaired = 1;
                    $option_if_repairing = 0;
                    break;
                default:
                    break;
            }


            $adminLocation = Db::table('employee_authority_tab')
                ->where('user_code','=',$userid)
                ->field('info_recv_location')
                ->select();



            $selectKey = ['id_num','report_date','img1Path','user_discrpt','img1type','if_repairing','expect_repairing_time','accept_date','if_form_returned'];
            $queryResult = Db::table('maintain_report')
                ->where('if_repaired','=',$option_if_repaired)
                ->where('if_repairing','=',$option_if_repairing)
                ->where('location','IN',$adminLocation[0]['info_recv_location'])
                ->order('report_date','desc')
                ->limit($RecordNumEveryReq*($loadtimes-1),$RecordNumEveryReq)
                ->field($selectKey)
                ->select();
        }
        elseif(($option == "super_all")||($option == "super_rated")||($option == "super_unrate"))
        {
            $option_if_repaired = 1;
            switch($option){
                case "super_all":
                    break;
                case "super_rated":
                    $option_if_administration_rate = 1;
                    break;
                case "super_unrate":
                    $option_if_administration_rate = 0;
                    break;
                default:
                    break;
            }
            $selectKey = ['id_num','report_date','img1Path','user_discrpt','img1type'];
            $queryResult = Db::table('maintain_report')
                ->where('if_repaired','=',$option_if_repaired)
                ->where('if_administration_rate','=',$option_if_administration_rate)
                ->where('if_form_returned','=',0)
                ->order('report_date','desc')
                ->limit($RecordNumEveryReq*($loadtimes-1),$RecordNumEveryReq)
                ->field($selectKey)
                ->select();


        }
        else
        {
            /*other options*/
        }


        return json_encode(array(
            "data" => $queryResult
        ),JSON_UNESCAPED_UNICODE);
    }

    public function recordDetail(){
        $id_num = $this->request->post("id_num");

        $selectKey = ['id_num','user_name','user_dept','user_tele','report_date','img1Path','img2Path','user_discrpt','img1type','img2type','if_repaired','if_repairing','if_rated','rate','repaired_date','if_Anonymous','expect_repairing_time','img1repaired','img2repaired','accept_date','if_administration_rate','administration_rate','classification','location','if_form_returned','form_return_comment','form_cmplt_comment','form_return_super_name','administration_comment'];

        $queryResult = Db::table('maintain_report')
            ->where('id_num','=', $id_num)
            ->order('report_date','desc')
            ->field($selectKey)
            ->select();

        return json_encode(array(
            "data" => $queryResult
        ),JSON_UNESCAPED_UNICODE);
    }


    /**

     * 生成缩略图函数（支持图片格式：gif、jpeg、png和bmp）

     * @author ruxing.li

     * @param  string $src      源图片路径

     * @param  int    $width    缩略图宽度（只指定高度时进行等比缩放）

     * @param  int    $width    缩略图高度（只指定宽度时进行等比缩放）

     * @param  string $filename 保存路径（不指定时直接输出到浏览器）

     * @return bool

     */
    public function imageShow($path, $status,$width = null){

        /*$status = $this->request->get('status');
        $imagePath = $this->request->get('path');
        $imagePath = $this->request->get('path');
         */
        if($status == 'thumb')
        {
            $result = ShowResizeImage($path, 60, 60);
        }
        else
        {
            ShowResizeImage($path,$width);
        }


        //return $image->thumb(150, 150);

    }


    private function ifAccessTokenExpire()
    {
        $CurrentTime = date("Y-m-d H:i:s");
        //dump("CurrentTime :".$CurrentTime);
        $LastTimeGetToken = DB::table("wx_config_params")
            ->where("params_name","=","access_token")
            ->select();

        $LastTime = $LastTimeGetToken[0]["access_time"];
        //dump("LastTime :".$LastTime);
        $diff = ceil((strtotime($CurrentTime) -strtotime($LastTime))/60);//minutes
        //dump("ifAccessTokenExpire diff:"+$diff);

        if($diff >119)
        {
            return true;
        }
        else
        {
            return false;
        }

    }


    public function wxConfigParam()
    {

        $url = $this->request->post('url');

        if ($url == '') {
            return "Params error";
        }


        $weworkImp = new \wxConfigParam(self::$corpid, self::$secret, $url);


        if($this->ifAccessTokenExpire())
        {
            $returnParam = $weworkImp->getWechatJsConfig();
            //dump($returnParam);
            //refresh the token and jsapi ticket
            $updateContent = [ 'params_content' => $returnParam['token'], 'access_time' => date("Y-m-d H:i:s")];
            $res = Db::table('wx_config_params')
                ->where('params_name','=', "access_token")
                ->update($updateContent);


            $updateContent = [ 'params_content' => $returnParam['jsapi_ticket'], 'access_time' => date("Y-m-d H:i:s")];
            Db::table("wx_config_params")
                ->where("params_name","=","jsapi_ticket")
                ->update($updateContent);
        }
        else
        {
           $JsTicket = Db::table("wx_config_params")
               ->where("params_name","=","jsapi_ticket")
               ->select();

            $ticket = $JsTicket[0]["params_content"];
            //dump("unexpired ticket:".$ticket);

            $returnParam = $weworkImp->getWechatJsConfig($ticket);

            $oldToken = Db::table("wx_config_params")
                ->where("params_name","=","access_token")
                ->select();
            $returnParam['token'] = $oldToken[0]["params_content"];
        }

        //remove ticket cause they are not needed on front
        unset($returnParam['jsapi_ticket']);


        return json_encode(array(
            "data" => $returnParam
        ), JSON_UNESCAPED_UNICODE);
    }



    /*push the application to the employee*/
    public function pushInfoToEmployee(){


        //$wxUrl = new \wxParamsUrl();
        //$requestUrl = $wxUrl->sendMessage.'access_token=';
        //$requestUserInfoUrl = $wxUrl->userGet;

        $wx_superid = $this->request->post("wx_superid");
        $token = $this->request->post("token");
        $id_num = $this->request->post("id_num");
        $workerId = $this->request->post("workerID");
        $workerDeptId = $this->request->post("workerDept");

        $updateContent = $this->request->except(['token','id_num']);



        //get supervisor user name and department id
        $wxImp = new \wxConfigParam(self::$corpid, self::$secret, '');

        $userInfo = $wxImp->wxGetUserInfoByID($token,$wx_superid);
        //dump($userInfo);

        $wxSuperName =$userInfo->name;
        $wxSuperDeptId = $userInfo->department;
        //dump($wxSuperName);
        //dump($wxSuperDeptId);

        $superContent = ['wx_supername' => $wxSuperName,'wx_superdeptid' => $wxSuperDeptId];
        $content = array_merge($updateContent, $superContent);
        Db::table("maintain_report")
            ->where("id_num","=","$id_num")
            ->update($content);


        //push info to selected worker
        $selectKey = ['id_num','report_date','user_discrpt'];
        $queryResult = Db::table('maintain_report')
            ->where('id_num','=', $id_num)
            ->field($selectKey)
            ->select();


        $textcard = array(
            'title' =>'综合服务报修单 单号：'.$id_num,
            'description' =>'报修时间:'.$queryResult[0]['report_date'].PHP_EOL.'描述:'.$queryResult[0]['user_discrpt'],
            'url'=>'http://2278i36g67.iok.la/MaintainSys2.0/front/pages/html/PushedRecordDetail.html?id_num='.$queryResult[0]['id_num'],
            'btntxt'=>'详情'
        );
        $message = array(
            'touser' =>$workerId,
            'toparty' =>$workerDeptId,
            'totag' =>'',
            'msgtype' =>'textcard',
            'agentid' =>self::$agentid,
            'textcard' =>$textcard,
        );

        //send notice to wexin information center
        $info = '综合服务报修：您收到一个新报修单，请在企业微信中查看';
        \NWEWebservice::SendMessage($workerId,$info);

        //send notice to wework
        $Res = $wxImp->wxSendMessage($token,$message);


        if($Res)
        {
            $result = array(
                'errcode'=>'0'
            );
            return json_encode($result);
        }
        else
        {
            $result = array(
                'errcode'=>'501'
            );
            return json_encode($result);
        }

    }

    public function PromptMessage()
    {
        $wxImp = new \wxConfigParam(self::$corpid, self::$secret, '');
        //$wxUrl = new \wxParamsUrl();
        //$requestUrl = $wxUrl->gettoken.'access_token=';
        $token = $this->request->post("token");
        $id_num = $this->request->post("id_num");
        //$url = $requestUrl.$token;

        $selectKey = ['id_num','workerID','workerDept'];
        $queryResult = Db::table('maintain_report')
            ->where('id_num','=', $id_num)
            ->field($selectKey)
            ->select();


        $text = array(
            'content' =>'您有一个报修单未及时处理，用户已发起了提醒，报修单单号：'.$id_num,
        );

        $message = array(
            'touser' =>$queryResult[0]['workerID'],
            'toparty' =>$queryResult[0]['workerDept'],
            'totag' =>'',
            'msgtype' =>'text',
            'agentid' =>self::$agentid,
            'text' =>$text,
        );

        //$JsonMessage = json_encode($message);

        //$wxCurl = new \curl();

        //$Res = $wxCurl->wxPost($url,$JsonMessage);

        //return $Res;
        $Res = $wxImp->wxSendMessage($token,$message);


        if($Res)
        {
            $result = array(
                'errcode'=>'0'
            );
            return json_encode($result);
        }
        else
        {
            $result = array(
                'errcode'=>'501'
            );
            return json_encode($result);
        }
    }
    public function getWXsuperInfo(){
        //$wxUrl = new \wxParamsUrl();
        //$requestUserIDUrl = $wxUrl->getUserInfo;
        //$requestUserInfoUrl = $wxUrl->userGet;
        //$wxImp = new \wxConfigParam();

        $code = $this->request->post("code");

        $weworkImp = new \wxConfigParam(self::$corpid, self::$secret, '');


        if($this->ifAccessTokenExpire())
        {
            $returnParam = $weworkImp->getWechatJsConfig();
            //dump($returnParam);
            //refresh the token and jsapi ticket
            $updateContent = [ 'params_content' => $returnParam['token'], 'access_time' => date("Y-m-d H:i:s")];
            $res = Db::table('wx_config_params')
                ->where('params_name','=', "access_token")
                ->update($updateContent);


            $updateContent = [ 'params_content' => $returnParam['jsapi_ticket'], 'access_time' => date("Y-m-d H:i:s")];
            Db::table("wx_config_params")
                ->where("params_name","=","jsapi_ticket")
                ->update($updateContent);
        }

        $token = Db::table("wx_config_params")
            ->where("params_name","=","access_token")
            ->select();

        //$url = $requestUserIDUrl.'access_token='.$token[0]["params_content"].'&code='.$code;

        $Res = $weworkImp->wxGetUserInfoByCode($token[0]["params_content"],$code);
        //$wxCurl = new \curl();

        //$Res = $wxCurl->wxcurl($url);

        return $Res;

/*
        $url = $requestUserInfoUrl .'access_token='.$token[0]["params_content"].'&userid='.$superUserid;

        $Res = $wxCurl->wxcurl($url);

        $wxSuperName = $Res["name"];
        $wxSuperDeptId = $Res["department"];
        dump($wxSuperName);
        dump($wxSuperDeptId);
        $superContent = [ 'wx_superid' => $superUserid, 'wx_supername' => $wxSuperName,'wx_superdeptid' => $wxSuperDeptId];
        Db::table("wx_config_params")
            ->where("params_name","=","jsapi_ticket")
            ->update($updateContent);
*/
    }
    public function drawChart()
    {
        $x_axis= $this->request->post("x_axis");
        $y_axis = $this->request->post("y_axis");

        $x_axis_sym = ' as x_axis';
        $y_axis_sym = ' as y_axis';
        $map = array();


        //$x_axis = "维修分类";
        //$y_axis = "用户评分";

        switch ($x_axis)
        {
            case "维修分类":

                $groupVar = "classification";
                break;
            case "维修地点":
                $groupVar = "location";
                break;
            default:
                break;
        }

        switch ($y_axis)
        {
            case "用户评分":
                $map['if_repaired'] = 1;
                $map['if_form_returned'] = 0;
                $map['if_rated'] = 1;
                $selectVar = "AVG(rate)";
                break;
            case "平均维修时间":
                $map['if_repaired'] = 1;
                $map['if_form_returned'] = 0;
                $selectVar = "AVG(TIMESTAMPDIFF(HOUR,report_date,repaired_date))";
                break;
            default:
                break;
        }


        $queryResult =Db::table('maintain_report')
            ->where($map)
            ->field($groupVar.$x_axis_sym.','.$selectVar.$y_axis_sym)
            ->group($groupVar)
            ->select();


        return json_encode(array(
            "data" => $queryResult
        ), JSON_UNESCAPED_UNICODE);
    }
    public function updateRecord()
    {
        $id_num = $this->request->post("id_num");
        $paramArray = $this->request->except("id_num");

        Db::table('maintain_report')
            ->where('id_num','=', $id_num)
            ->update($paramArray);

        return json_encode(array(
            "errcode" => 0
        ), JSON_UNESCAPED_UNICODE);

    }


    private function sendNoticeToMember($UserId,$text)
    {

        $wxParams = $this->getValidTokenAndTicket();

        $wxImp = new \wxConfigParam(self::$corpid, self::$secret, '');
        //dump($UserId);
        //dump($wxParams['token']);
        $message = array(
            'touser' =>$UserId,
            'toparty' =>'',
            'totag' =>'',
            'msgtype' =>'text',
            'agentid' =>self::$agentid,
            'text' =>$text,
        );

        $res = $wxImp->wxSendMessage($wxParams['token'],$message);
        //dump($res);

    }

    private function getValidTokenAndTicket()
    {

        $weworkImp = new \wxConfigParam(self::$corpid, self::$secret, '');

        if($this->ifAccessTokenExpire())
        {
            $returnParam = $weworkImp->getWechatJsConfig();
            //dump($returnParam);
            //refresh the token and jsapi ticket
            $updateContent = [ 'params_content' => $returnParam['token'], 'access_time' => date("Y-m-d H:i:s")];
            $res = Db::table('wx_config_params')
                ->where('params_name','=', "access_token")
                ->update($updateContent);


            $updateContent = [ 'params_content' => $returnParam['jsapi_ticket'], 'access_time' => date("Y-m-d H:i:s")];
            Db::table("wx_config_params")
                ->where("params_name","=","jsapi_ticket")
                ->update($updateContent);
        }

        $WxParams = Db::table("wx_config_params")
            ->select();

        return ['token'=>$WxParams[0]['params_content'],'jsapi_ticket'=>$WxParams[1]['params_content']];

    }

    public function returnForm()
    {
        $id_num = $this->request->post("id_num");
        $paramArray = $this->request->except("id_num");
        $form_return_super_name = \NWEWebservice::getUserNameByCode($this->request->post("form_return_super_id"));

        Db::table('maintain_report')
            ->where('id_num','=', $id_num)
            ->update($paramArray);

        Db::table('maintain_report')
            ->where('id_num','=', $id_num)
            ->update(["form_return_super_name"=>$form_return_super_name]);

        $res = Db::table('maintain_report')
            ->where('id_num','=', $id_num)
            ->field('user_id')
            ->select();
        //send notice to user in weword
        $text = array(
            'content' =>'您有一个报修单被退回，请在已完成报修单中查看',
        );

        $this->sendNoticeToMember($res[0]['user_id'],$text);
        //send notice in information center wexin

        $content = '综合服务报修：您有一个报修单被退回，请在已完成报修单中查看';
        \NWEWebservice::sendMessage($res[0]['user_id'],$content);



        return json_encode(array(
            "errcode" => 0
        ), JSON_UNESCAPED_UNICODE);
    }

    public function upload(){

        //$file = request()->file('image');
        echo '请求方法：' . request()->method() . '<br/>';
        echo '资源类型：' . request()->type() . '<br/>';
        echo '访问ip地址：' . request()->ip() . '<br/>';
        echo '是否AJax请求：' . var_export(request()->isAjax(), true) . '<br/>';
        echo '请求参数：'.DS;
        dump(request()->param());
        $userFileName= $this->request->post("FileName");
        $FileNames = explode(",",$userFileName);
        dump(request()->file($FileNames[0])->getFilename());
        dump(request()->file($FileNames[0])->getPathname());
        dump(request()->file($FileNames[0])->getBasename());
        dump(request()->file($FileNames[0])->getExtension());
        dump(request()->file($FileNames[0])->getPathInfo());
        dump(request()->file($FileNames[0])->getMime());

    }




}
