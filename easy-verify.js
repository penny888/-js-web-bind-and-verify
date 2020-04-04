/**
 * this script is used for verify input formatter.
 *
 * @author: jack
 * @since 2020-01-08
 * */

!function (window) {
    'user strict'
    // 检查是否浏览器环境
    if (typeof window === 'undefined') {
        throw new Error('this script requires browser environment');
    }
    // 声明验证初始化标记
    var verifyInitFlag = true;
    window.easyVerify = function () {
        // 声明验证返回结果
        var result = {
            success: false,
            msg: ''
        };
        // 声明验证规则
        var rules = {
            required: [/[\S]+/, "必填项不能为空"],
            phone: [/^1\d{10}$/, "请输入正确的手机号"],
            email: [/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, "邮箱格式不正确"],
            url: [/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/, "url格式不正确"],
            number: [/^\d+$/, "只能填写数字"],
            date: [/^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/, "日期格式不正确"],
            identity: [/(^\d{15}$)|(^\d{17}(x|X|\d)$)/, "请输入正确的身份证号"]
        };
        // 获取页面中函数属性easy-verify的元素
        var document = window.document;
        var targetElements = document.querySelectorAll('[easy-verify]');
        // 循环验证并绑定事件
        for (var i = 0, len1 = targetElements.length; i < len1; i++) {
            console.log(targetElements[i]);
            var _result = verify(targetElements[i], rules, result, true);
            if (!_result.success) {
                result.success = false;
                result.msg = _result.msg;
            }
            if (verifyInitFlag) {
                bindEvent(targetElements[i], rules, result);
            }
        }
        // 设置验证初始化标记
        verifyInitFlag = false;
        // 验证通过返回
        return result;

        // 根据验证规则验证输入并返回结果
        function verify(targetElement, rules, result, initFlag) {
            console.log('当前元素', targetElement);
            console.log('当前元素值', targetElement.value);
            // 判断元素类型
            if (targetElement.value === undefined) {
                result.msg = '不能绑定' + targetElement.tagName.toLowerCase() + '元素';
                return result;
            }
            // 初始化验证获取当前元素轮廓背景样式
            if (initFlag) {
                targetElement.outline = getStyle(targetElement, 'outline');
                console.log('-----', targetElement.outline);
            }
            // 获取元素绑定验证规则并验证
            var bind_rule = targetElement.getAttribute('easy-verify');
            if (bind_rule) {
                if (bind_rule.indexOf('/')) {
                    var tmp = bind_rule.split('|');
                    if (!(tmp instanceof Array)) {
                        tmp = [bind_rule];
                    }
                    for (var j = 0, len2 = tmp.length; j < len2; j++) {
                        if (rules.hasOwnProperty(tmp[j])) {
                            if (!rules[tmp[j]][0].test(targetElement.value)) {
                                targetElement.style.outline = '#FF0033 solid thin';
                                result.success = false;
                                result.msg = targetElement.getAttribute('name') + rules[tmp[j]][1];
                                return result;
                            }
                        }
                    }
                } else if (Object.prototype.toString.call(eval(bind_rule)) === '[object RegExp]') {
                    if (!eval(bind_rule).test(targetElement.value)) {
                        targetElement[i].style.outline = '#FF0033 solid thin';
                        result.success = false;
                        result.msg = targetElement.getAttribute('name') + '格式不正确';
                        return result;
                    }
                } else {
                    targetElement.style.outline = '#FF0033 solid thin';
                    result.success = false;
                    result.msg = 'name为' + targetElement.getAttribute('name') + '的' + targetElement.tagName.toLowerCase() + '元素绑定验证规则不正确';
                    return result;
                }
            }
            targetElement.style.outline = targetElement.outline;
            result.success = true;
            result.msg = '验证通过';
            console.log('元素初始化轮廓', targetElement.outline);
            console.log('验证结果', result);
            return result;
        }

        // 绑定事件
        function bindEvent(targetElement, rules, result) {
            if (targetElement.tagName.toLowerCase() === 'input') {
                targetElement.addEventListener('keyup', function (e) {
                    verify(targetElement, rules, result);
                }, false);
            } else if (targetElement.tagName.toLowerCase() === 'select') {
                targetElement.addEventListener('change', function (e) {
                    verify(targetElement, rules, result);
                }, false);
            }
        }

        // 获取元素样式
        function getStyle(obj, attribute) {
            if (obj.currentStyle) {
                return obj.currentStyle[attribute];
            } else {
                return window.getComputedStyle(obj, null)[attribute];
            }
        }
    }
}(window);
