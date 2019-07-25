<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件
/**

 * 生成缩略图函数（支持图片格式：gif、jpeg、png和bmp）

 * @author ruxing.li

 * @param  string $src      源图片路径

 * @param  int    $width    缩略图宽度（只指定高度时进行等比缩放）

 * @param  int    $width    缩略图高度（只指定宽度时进行等比缩放）

 * @param  string $filename 保存路径（不指定时直接输出到浏览器）

 * @return bool

 */
function ShowResizeImage($src, $width = null, $height = null, $filename = null) {

    if (!isset($width) && !isset($height))

        return false;

    if (isset($width) && $width <= 0)

        return false;

    if (isset($height) && $height <= 0)

        return false;

    $size = getimagesize($src);

    if (!$size)

        return false;

    list($src_w, $src_h, $src_type) = $size;

    $src_mime = $size['mime'];

    switch($src_type) {

        case 1 :

            $img_type = 'gif';

            break;

        case 2 :

            $img_type = 'jpeg';

            break;

        case 3 :

            $img_type = 'png';

            break;

        case 15 :

            $img_type = 'wbmp';

            break;

        default :

            return false;

    }

    if (!isset($width))

        $width = $src_w * ($height / $src_h);

    if (!isset($height))

        $height = $src_h * ($width / $src_w);

    $imagecreatefunc = "imagecreatefrom" . $img_type;

    ini_set('memory_limit', '256M');//temporarily increase the memory size for image processings
    $src_img = $imagecreatefunc($src);

    $dest_img = imagecreatetruecolor($width, $height);

    imagecopyresampled($dest_img, $src_img, 0, 0, 0, 0, $width, $height, $src_w, $src_h);

    $imagefunc = 'image' . $img_type;

    if ($filename) {

        $imagefunc($dest_img, $filename);

    } else {

        header('Content-Type: ' . $src_mime);

        $imagefunc($dest_img);

    }

    imagedestroy($src_img);

    imagedestroy($dest_img);

    return true;

}