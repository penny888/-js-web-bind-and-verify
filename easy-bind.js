/**
 * this script is used for Two-way binding.
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

    window.easyBind = function () {
        // 声明数据绑定的对象data
        var data = {};
        // 获取页面中函数属性easy-bind的元素
        var document = window.document;
        var targetElements = document.querySelectorAll('[easy-bind]');
        // 循环获取并定义绑定变量，给目标元素绑定事件
        for (var i = 0, len = targetElements.length; i < len; i++) {
            (function (i) {
                // 判断元素类型
                var canInput;
                if (targetElements[i].value === '') {
                    canInput = true;
                }
                // 获取元素绑定变量
                var bind_var = targetElements[i].getAttribute('easy-bind');
                // 定义变量到全局变量data并初始赋值
                data['_' + bind_var] = canInput ? targetElements[i].value : targetElements[i].innerHTML;
                // 定义存取器
                Object.defineProperty(data, bind_var, {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return data['_' + bind_var];
                    },
                    set: function (newVal) {
                        console.log('旧值：', data['_' + bind_var], '新值：', newVal);
                        data['_' + bind_var] = newVal;
                        // 根据元素类型改变视图
                        if (canInput) {
                            targetElements[i].value = newVal;
                        } else {
                            targetElements[i].innerHTML = newVal;
                        }
                    }
                });
                console.log(targetElements[i]);
                // 给元素绑定事件
                if (targetElements[i].tagName.toLowerCase() === 'input') {
                    targetElements[i].addEventListener('keyup', function (e) {
                        console.log('输入值：', e.target.value);
                        data['_' + bind_var] = e.target.value;
                        console.log('输入值后data：', data);
                    }, false);
                } else if (targetElements[i].tagName.toLowerCase() === 'select') {
                    targetElements[i].addEventListener('change', function (e) {
                        console.log('选择值：', e.target.value);
                        data['_' + bind_var] = e.target.value;
                        console.log('选择值后data：', data);
                    }, false);
                }
            }(i))
        }
        return data;
    }
}(window);
