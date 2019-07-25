/*
*
*
*
*
*
*
*
*
* */
var uploadImages = (function(){
    var _totoalImageNum = 0;
    var _templateView = '<li class="weui-uploader__file" style="background-image:url(#url#)" title ="#title#"></li>';
    var _compressedImageSize = 500;//compressed image size(KB)
    var _compressVault = 1*1024*1024;
    var _compressSize = 1*1024*1024;
    //var _imageFileName = new array();


    var addImage = function(url,file,submitForm) {

        if(_totoalImageNum >= 2)
        {
            $.alert("上传图片不能多于两张");
            return;
        }

        var uniqueKey = generateKey();

        //const blobFile = imageConversion.urltoBlob(url);
        //const comp_blob = imageConversion.compressAccurately(blobFile,_compressedImageSize);


        if(file.size > _compressVault)
        {
            photoCompress(file, {
                quality: 0.2
            }, function(base64Codes){

                var blob = convertBase64UrlToBlob(base64Codes);
                //var zsp_test = fileNameByDate + '.'+'jpg';

                submitForm.append(uniqueKey, blob,uniqueKey + '.'+'jpg');

            });
        }
        else
        {

            submitForm.append(uniqueKey, file);
        }

        if (url) {
            src = url.createObjectURL(file);
        }
        else {
            src = e.target.result;
        }
        showImage(src,uniqueKey,$("#uploaderFiles"));
/*
        var dataURL = await imageConversion.filetoDataURL(url);
        showImage(dataURL,uniqueKey,$("#uploaderFiles"));
        if(url.size > _compressVault)
        {
            var image =await imageConversion.compressAccurately(url,_compressedImageSize);
            submitForm.append(uniqueKey, image,uniqueKey + '.'+'jpg');
        }
        else
        {

            submitForm.append(uniqueKey, url);
        }
*/

        countImageNum(1);/**/
        return;


    }

    var removeImage = function(submitForm){

        var imgList = document.getElementsByClassName("weui-uploader__file");

        for (var i = 0; i < imgList.length; i++) {

            imgList[i].onclick = function(){
                var imageNode = this;
                var img = imgList[i];
                $.actions({
                    title: "是否选择删除所选照片",
                    onClose: function() {
                        console.log("close");
                    },
                    actions: [
                        {
                            text: "删除",
                            onClick: function() {
                                //删除入队列的上传图像
                                submitForm.delete(imageNode.title);
                                //清除预览图像
                                imageNode.remove();
                                //重新统计预览图象数量
                                countImageNum(-1);
                            }
                        }
                    ]
                });
            }
        };


    }

    var getImageNum = function(){
        return _totoalImageNum;
    }

    var countImageNum = function(count){
        _totoalImageNum = _totoalImageNum + count;

        var content = document.getElementById('imgcnt');
        if (content) {

            // 更新计数
            content.innerText = _totoalImageNum;
        }


    }

    var getImageFileName = function(blob){

    }

    var compressImage = function(blob){

    }



    function showImage(file,filename,$tag){

        $tag.append(_templateView.replace('#title#',filename).replace('#url#', file));

    }


    function generateKey() {
        var idStr = Date.parse(new Date()).toString();

        idStr += '_' + Math.random().toString(36).substr(3);

        return idStr
    }


    function convertBase64UrlToBlob(urlData){
        var arr = urlData.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var len = bstr.length;
        var u8arr = new Uint8Array(len);
        while(len--){
            u8arr[len] = bstr.charCodeAt(len);
        }
        var blob = new Blob([u8arr], {type:mime});
        return blob;
    }

    /**
     三个参数
     file：一个是文件(类型是图片格式)，
     w：一个是文件压缩的后宽度，宽度越小，字节越小
     objDiv：一个是容器或者回调函数
     photoCompress()
     */
    function photoCompress(file,width,callbackfunc){
        var reader = new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        reader.onloadend = function(e){
            var result=this.result;
            canvasDataURL(result,width,callbackfunc);
        }
        reader.onprogress = function(e){
            var result=this.result;

        }
        reader.onerror = function(e){
            var result=this.result;

        }
        reader.onbort = function(e){
            var result=this.result;

        }

        reader.readAsDataURL(file);

    }



    function canvasDataURL(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function () {
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            var quality = 0.7;  // 默认图片质量为0.7
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpeg', quality);
            // 回调函数返回base64的值
            callback(base64);
        }
    }

    return {

        addImage:addImage,
        removeImage:removeImage,
        getImageNum:getImageNum,
    }
})()