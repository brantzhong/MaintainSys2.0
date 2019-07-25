"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @file A simple and easy-to-use JS image compression tools
 * @author wangyulue(wangyulue@gmail.com)
 */
(function (factory) {
    (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : window.imageConversion = factory();
})(function () {
    var methods = {};
    /**
     * 通过一个图片的url加载所需要的image对象
     *
     * @param {string} url - 图片URL
     * @returns {Promise(Image)}
     */

    methods.urltoImage = function (url) {
        return new Promise(function (resolve, reject) {
            var img = new Image();

            img.onload = function () {
                return resolve(img);
            };

            img.onerror = function () {
                return reject(new Error('urltoImage(): Image failed to load, please check the image URL'));
            };

            img.src = url;
        });
    };
    /**
     * 通过一个图片的url加载所需要的File（Blob）对象
     *
     * @param {string} url - 图片URL
     * @returns {Promise(Blob)}
     *
     */


    methods.urltoBlob = function (url) {
        return fetch(url).then(function (response) {
            return response.blob();
        });
    };
    /**
     * 将一个image对象转变为一个canvas对象
     *
     * @param {image} image
     *
     * @typedef {Object=} config - 转变为canvas时的一些参数配置
     * 		@param {number} width - canvas图像的宽度，默认为image的宽度
     * 		@param {number} height - canvas图像的高度，默认为image的高度
     * 		@param {number} scale - 相对于image的缩放比例，范围0-10，默认不缩放；
     * 			设置config.scale后会覆盖config.width和config.height的设置；
     * 		@param {number} orientation - 图片旋转参数，默认不旋转，参考如下：
     * 			参数	 旋转方向
     * 			1		0°
     * 			2		水平翻转
     * 			3		180°
     * 			4		垂直翻转
     * 			5		顺时针90°+水平翻转
     * 			6		顺时针90°
     * 			7		顺时针90°+垂直翻转
     * 			8		逆时针90°
     * @type {config}
     *
     * @returns {Promise(canvas)}
     */


    methods.imagetoCanvas =
        /*#__PURE__*/
        function () {
            var _ref = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee(image) {
                    var config,
                        cvs,
                        ctx,
                        height,
                        width,
                        i,
                        scale,
                        _args = arguments;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    config = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                                    cvs = document.createElement('canvas');
                                    ctx = cvs.getContext('2d');

                                    // 设置宽高
                                    for (i in config) {
                                        if (Object.prototype.hasOwnProperty.call(config, i)) {
                                            config[i] = Number(config[i]);
                                        }
                                    }

                                    if (!config.scale) {
                                        width = config.width || config.height * image.width / image.height || image.width;
                                        height = config.height || config.width * image.height / image.width || image.height;
                                    } else {
                                        // 缩放比例0-10，不在此范围则保持原来图像大小
                                        scale = config.scale > 0 && config.scale < 10 ? config.scale : 1;
                                        width = image.width * scale;
                                        height = image.height * scale;
                                    } // 当顺时针或者逆时针旋转90时，需要交换canvas的宽高


                                    if ([5, 6, 7, 8].some(function (i) {
                                        return i === config.orientation;
                                    })) {
                                        cvs.height = width;
                                        cvs.width = height;
                                    } else {
                                        cvs.height = height;
                                        cvs.width = width;
                                    } // 设置方向


                                    _context.t0 = config.orientation;
                                    _context.next = _context.t0 === 3 ? 9 : _context.t0 === 6 ? 12 : _context.t0 === 8 ? 15 : _context.t0 === 2 ? 18 : _context.t0 === 4 ? 22 : _context.t0 === 5 ? 27 : _context.t0 === 7 ? 32 : 37;
                                    break;

                                case 9:
                                    ctx.rotate(180 * Math.PI / 180);
                                    ctx.drawImage(image, -cvs.width, -cvs.height, cvs.width, cvs.height);
                                    return _context.abrupt("break", 38);

                                case 12:
                                    ctx.rotate(90 * Math.PI / 180);
                                    ctx.drawImage(image, 0, -cvs.width, cvs.height, cvs.width);
                                    return _context.abrupt("break", 38);

                                case 15:
                                    ctx.rotate(270 * Math.PI / 180);
                                    ctx.drawImage(image, -cvs.height, 0, cvs.height, cvs.width);
                                    return _context.abrupt("break", 38);

                                case 18:
                                    ctx.translate(cvs.width, 0);
                                    ctx.scale(-1, 1);
                                    ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
                                    return _context.abrupt("break", 38);

                                case 22:
                                    ctx.translate(cvs.width, 0);
                                    ctx.scale(-1, 1);
                                    ctx.rotate(180 * Math.PI / 180);
                                    ctx.drawImage(image, -cvs.width, -cvs.height, cvs.width, cvs.height);
                                    return _context.abrupt("break", 38);

                                case 27:
                                    ctx.translate(cvs.width, 0);
                                    ctx.scale(-1, 1);
                                    ctx.rotate(90 * Math.PI / 180);
                                    ctx.drawImage(image, 0, -cvs.width, cvs.height, cvs.width);
                                    return _context.abrupt("break", 38);

                                case 32:
                                    ctx.translate(cvs.width, 0);
                                    ctx.scale(-1, 1);
                                    ctx.rotate(270 * Math.PI / 180);
                                    ctx.drawImage(image, -cvs.height, 0, cvs.height, cvs.width);
                                    return _context.abrupt("break", 38);

                                case 37:
                                    ctx.drawImage(image, 0, 0, cvs.width, cvs.height);

                                case 38:
                                    return _context.abrupt("return", cvs);

                                case 39:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee);
                }));

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        }();
    /**
     * 将一个canvas对象转变为一个File（Blob）对象
     * 该方法可以做压缩处理
     *
     * @param {canvas} canvas
     * @param {number=} quality - 传入范围 0-1，表示图片压缩质量，默认0.92
     * @param {string=} type - 确定转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif",默认"image/jpeg"
     * @returns {Promise(Blob)}
     */


    methods.canvastoFile = function (canvas, quality) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'image/jpeg';
        return new Promise(function (resolve) {
            return canvas.toBlob(function (blob) {
                return resolve(blob);
            }, type, quality);
        });
    };
    /**
     * 将一个Canvas对象转变为一个dataURL字符串
     * 该方法可以做压缩处理
     *
     * @param {canvas} canvas
     * @param {number=} quality - 传入范围 0-1，表示图片压缩质量，默认0.92
     * @param {string=} type - 确定转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif",默认"image/jpeg"
     * @returns {Promise(string)} Promise含有一个dataURL字符串参数
     */


    methods.canvastoDataURL =
        /*#__PURE__*/
        function () {
            var _ref2 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2(canvas, quality, type) {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    if (!checkImageType(type)) {
                                        type = 'image/jpeg';
                                    }

                                    return _context2.abrupt("return", canvas.toDataURL(type, quality));

                                case 2:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2);
                }));

            return function (_x2, _x3, _x4) {
                return _ref2.apply(this, arguments);
            };
        }();
    /**
     * 将File（Blob）对象转变为一个dataURL字符串
     *
     * @param {Blob} file
     * @returns {Promise(string)} Promise含有一个dataURL字符串参数
     */


    methods.filetoDataURL = function (file) {
        return new Promise(function (resolve) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                return resolve(e.target.result);
            };

            reader.readAsDataURL(file);
        });
    };
    /**
     * 将dataURL字符串转变为image对象
     *
     * @param {srting} dataURL - dataURL字符串
     * @returns {Promise(Image)}
     */


    methods.dataURLtoImage = function (dataURL) {
        return new Promise(function (resolve, reject) {
            var img = new Image();

            img.onload = function () {
                return resolve(img);
            };

            img.onerror = function () {
                return reject(new Error('dataURLtoImage(): dataURL is illegal'));
            };

            img.src = dataURL;
        });
    };
    /**
     * 将一个dataURL字符串转变为一个File（Blob）对象
     * 转变时可以确定File对象的类型
     *
     * @param {string} dataURL
     * @param {string=} type - 确定转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif"
     * @returns {Promise(Blob)}
     */


    methods.dataURLtoFile =
        /*#__PURE__*/
        function () {
            var _ref3 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee3(dataURL, type) {
                    var arr, mime, bstr, n, u8arr;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    arr = dataURL.split(',');
                                    mime = arr[0].match(/:(.*?);/)[1];
                                    bstr = atob(arr[1]);
                                    n = bstr.length;
                                    u8arr = new Uint8Array(n);

                                    while (n--) {
                                        u8arr[n] = bstr.charCodeAt(n);
                                    }

                                    if (checkImageType(type)) {
                                        mime = type;
                                    }

                                    return _context3.abrupt("return", new Blob([u8arr], {
                                        type: mime
                                    }));

                                case 8:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee3);
                }));

            return function (_x5, _x6) {
                return _ref3.apply(this, arguments);
            };
        }();
    /**
     * 将图片下载到本地
     *
     * @param {Blob} file - 一个File（Blob）对象
     * @param {string=} fileName - 下载后的文件名（可选参数，不传以时间戳命名文件）
     */


    methods.downloadFile = function (file, fileName) {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = fileName || Date.now().toString(36);
        document.body.appendChild(link);
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
    };
    /** *以下是进一步封装** */

    /**
     * 压缩File（Blob）对象
     * @param {Blob} file - 一个File（Blob）对象
     * @param {(number|object)} config - 如果传入是number类型，传入范围 0-1，表示图片压缩质量,默认0.92；也可以传入object类型，以便更详细的配置
     * @example
     * 		imageConversion.compress(file,0.8)
     *
     * 		imageConversion.compress(file,{
     * 			quality: 0.8, //图片压缩质量
     * 			type："image/png", //转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif"
     * 			width: 300, //生成图片的宽度
     * 			height：200， //生产图片的高度
     * 			scale: 0.5， //相对于原始图片的缩放比率,设置config.scale后会覆盖config.width和config.height的设置；
     * 			orientation:2, //图片旋转方向
     * 		})
     *
     * @returns {Promise(Blob)}
     */


    methods.compress =
        /*#__PURE__*/
        function () {
            var _ref4 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee4(file) {
                    var config,
                        dataURL,
                        originalMime,
                        mime,
                        image,
                        canvas,
                        compressDataURL,
                        compressFile,
                        _args4 = arguments;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    config = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};

                                    if (file instanceof Blob) {
                                        _context4.next = 3;
                                        break;
                                    }

                                    throw new Error('compress(): First arg must be a Blob object or a File object.');

                                case 3:
                                    if (_typeof(config) !== 'object') {
                                        config = Object.assign({
                                            quality: config
                                        });
                                    }

                                    config.quality = Number(config.quality);

                                    if (!Number.isNaN(config.quality)) {
                                        _context4.next = 7;
                                        break;
                                    }

                                    return _context4.abrupt("return", file);

                                case 7:
                                    _context4.next = 9;
                                    return methods.filetoDataURL(file);

                                case 9:
                                    dataURL = _context4.sent;
                                    originalMime = dataURL.split(',')[0].match(/:(.*?);/)[1]; // 原始图像图片类型

                                    mime = 'image/jpeg'; // 默认压缩类型

                                    if (checkImageType(config.type)) {
                                        mime = config.type;
                                        originalMime = config.type;
                                    }

                                    _context4.next = 15;
                                    return methods.dataURLtoImage(dataURL);

                                case 15:
                                    image = _context4.sent;
                                    _context4.next = 18;
                                    return methods.imagetoCanvas(image, Object.assign({}, config));

                                case 18:
                                    canvas = _context4.sent;
                                    _context4.next = 21;
                                    return methods.canvastoDataURL(canvas, config.quality, mime);

                                case 21:
                                    compressDataURL = _context4.sent;
                                    _context4.next = 24;
                                    return methods.dataURLtoFile(compressDataURL, originalMime);

                                case 24:
                                    compressFile = _context4.sent;
                                    return _context4.abrupt("return", compressFile);

                                case 26:
                                case "end":
                                    return _context4.stop();
                            }
                        }
                    }, _callee4);
                }));

            return function (_x7) {
                return _ref4.apply(this, arguments);
            };
        }();
    /**
     * 根据体积压缩File（Blob）对象
     *
     * @param {Blob} file - 一个File（Blob）对象
     * @param {(number|object)} config - 如果传入是number类型，则指定压缩图片的体积,单位Kb;也可以传入object类型，以便更详细的配置
     * 		@param {number} size - 指定压缩图片的体积,单位Kb
     * 		@param {number} accuracy - 相对于指定压缩体积的精确度，范围0.8-0.99，默认0.95；
     *        如果设置 图片体积1000Kb,精确度0.9，则压缩结果为900Kb-1100Kb的图片都算合格；
     * @example
     *  	imageConversion.compress(file,100) //压缩后图片大小为100kb
     *
     * 		imageConversion.compress(file,{
     * 			size: 100, //图片压缩体积，单位Kb
     * 			accuracy: 0.9, //图片压缩体积的精确度，默认0.95
     * 			type："image/png", //转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif"
     * 			width: 300, //生成图片的宽度
     * 			height: 200, //生产图片的高度
     * 			scale: 0.5, //相对于原始图片的缩放比率,设置config.scale后会覆盖config.width和config.height的设置；
     * 			orientation:2, //图片旋转方向
     * 		})
     *
     * @returns {Promise(Blob)}
     */


    methods.compressAccurately =
        /*#__PURE__*/
        function () {
            var _ref5 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee5(file) {
                    var config,
                        resultSize,
                        dataURL,
                        originalMime,
                        mime,
                        image,
                        canvas,
                        proportion,
                        imageQuality,
                        compressDataURL,
                        tempDataURLs,
                        x,
                        CalculationSize,
                        compressFile,
                        _args5 = arguments;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
                                case 0:
                                    config = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};

                                    if (file instanceof Blob) {
                                        _context5.next = 3;
                                        break;
                                    }

                                    throw new Error('compressAccurately(): First arg must be a Blob object or a File object.');

                                case 3:
                                    if (_typeof(config) !== 'object') {
                                        config = Object.assign({
                                            size: config
                                        });
                                    } // 如果指定体积不是数字或者数字字符串，则不做处理


                                    config.size = Number(config.size);

                                    if (!Number.isNaN(config.size)) {
                                        _context5.next = 7;
                                        break;
                                    }

                                    return _context5.abrupt("return", file);

                                case 7:
                                    if (!(config.size * 1024 > file.size)) {
                                        _context5.next = 9;
                                        break;
                                    }

                                    return _context5.abrupt("return", file);

                                case 9:
                                    config.accuracy = Number(config.accuracy);

                                    if (!config.accuracy || config.accuracy < 0.8 || config.accuracy > 0.99) {
                                        config.accuracy = 0.95; // 默认精度0.95
                                    }

                                    resultSize = {
                                        max: config.size * (2 - config.accuracy) * 1024,
                                        accurate: config.size * 1024,
                                        min: config.size * config.accuracy * 1024
                                    };
                                    _context5.next = 14;
                                    return methods.filetoDataURL(file);

                                case 14:
                                    dataURL = _context5.sent;
                                    originalMime = dataURL.split(',')[0].match(/:(.*?);/)[1]; // 原始图像图片类型

                                    mime = 'image/jpeg';

                                    if (checkImageType(config.type)) {
                                        mime = config.type;
                                        originalMime = config.type;
                                    } // const originalSize = file.size;
                                    // console.log('原始图像尺寸：', originalSize); //原始图像尺寸
                                    // console.log('目标尺寸：', config.size * 1024);
                                    // console.log('目标尺寸max：', resultSize.max);
                                    // console.log('目标尺寸min：', resultSize.min);


                                    _context5.next = 20;
                                    return methods.dataURLtoImage(dataURL);

                                case 20:
                                    image = _context5.sent;
                                    _context5.next = 23;
                                    return methods.imagetoCanvas(image, Object.assign({}, config));

                                case 23:
                                    canvas = _context5.sent;

                                    /**
                                     * 经过测试发现，blob.size与dataURL.length的比值约等于0.75
                                     * 这个比值可以同过dataURLtoFile这个方法来测试验证
                                     * 这里为了提高性能，直接通过这个比值来计算出blob.size
                                     */
                                    proportion = 0.75;
                                    imageQuality = 0.5;
                                    tempDataURLs = [null, null];
                                    /**
                                     * HTMLCanvasElement.toBlob()以及HTMLCanvasElement.toDataURL()压缩参数
                                     * 的最小细粒度为0.01，而2的7次方为128，即只要循环7次，则会覆盖所有可能性
                                     */

                                    x = 1;

                                case 28:
                                    if (!(x <= 7)) {
                                        _context5.next = 50;
                                        break;
                                    }

                                    _context5.next = 31;
                                    return methods.canvastoDataURL(canvas, imageQuality, mime);

                                case 31:
                                    compressDataURL = _context5.sent;
                                    CalculationSize = compressDataURL.length * proportion; // console.log("当前图片尺寸", CalculationSize);
                                    // console.log("当前压缩率", CalculationSize / originalSize);
                                    // console.log("与目标体积偏差", CalculationSize / (config.size * 1024) - 1);
                                    // console.groupEnd();
                                    // 如果到循环第七次还没有达到精确度的值，那说明该图片不能达到到此精确度要求
                                    // 这时候最后一次循环出来的dataURL可能不是最精确的，需要取其周边两个dataURL三者比较来选出最精确的；

                                    if (!(x === 7)) {
                                        _context5.next = 36;
                                        break;
                                    }

                                    if (resultSize.max < CalculationSize || resultSize.min > CalculationSize) {
                                        compressDataURL = [compressDataURL].concat(tempDataURLs).filter(function (i) {
                                            return i;
                                        }) // 去除null
                                            .sort(function (a, b) {
                                                return Math.abs(a.length * proportion - resultSize.accurate) - Math.abs(b.length * proportion - resultSize.accurate);
                                            })[0];
                                    }

                                    return _context5.abrupt("break", 50);

                                case 36:
                                    if (!(resultSize.max < CalculationSize)) {
                                        _context5.next = 41;
                                        break;
                                    }

                                    tempDataURLs[1] = compressDataURL;
                                    imageQuality -= Math.pow(0.5, x + 1);
                                    _context5.next = 47;
                                    break;

                                case 41:
                                    if (!(resultSize.min > CalculationSize)) {
                                        _context5.next = 46;
                                        break;
                                    }

                                    tempDataURLs[0] = compressDataURL;
                                    imageQuality += Math.pow(0.5, x + 1);
                                    _context5.next = 47;
                                    break;

                                case 46:
                                    return _context5.abrupt("break", 50);

                                case 47:
                                    x++;
                                    _context5.next = 28;
                                    break;

                                case 50:
                                    _context5.next = 52;
                                    return methods.dataURLtoFile(compressDataURL, originalMime);

                                case 52:
                                    compressFile = _context5.sent;

                                    if (!(compressFile.size > file.size)) {
                                        _context5.next = 55;
                                        break;
                                    }

                                    return _context5.abrupt("return", file);

                                case 55:
                                    return _context5.abrupt("return", compressFile);

                                case 56:
                                case "end":
                                    return _context5.stop();
                            }
                        }
                    }, _callee5);
                }));

            return function (_x8) {
                return _ref5.apply(this, arguments);
            };
        }();

    function checkImageType(type) {
        return ['image/png', 'image/jpeg', 'image/gif'].some(function (i) {
            return i === type;
        });
    }

    return methods;
});