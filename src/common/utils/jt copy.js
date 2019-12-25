import Store from 'web-storage-cache'

const store = {
    ls: new Store({ storage: 'localStorage' }),
    ss: new Store({ storage: 'sessionStorage' })
}

const date = {
    format (date, format) {
        if (!date) {
            return
        }
        date = date + ''
        if (date.length === 10) {
            date = parseInt(date) * 1000
        } else {
            date = parseInt(date)
        }
        date = new Date(date)
        if (!format) {
            format = 'yyyy-MM-dd hh:mm:ss'
        }
        const map = {
            'M': date.getMonth() + 1,
            'd': date.getDate(),
            'h': date.getHours(),
            'm': date.getMinutes(),
            's': date.getSeconds(),
            'q': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        }
        format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
            let v = map[t]
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v
                    v = v.substr(v.length - 2)
                }
                return v
            } else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length)
            }
            return all
        })
        return format
    },
    /**
     * 获取当天0点
     */
    getTodayZero () {
        let number = +new Date()
        const difference = number % 86400000
        // 减去当天多余时间 并 减去时区偏差值
        number = number - difference - 28800000
        return new Date(number)
    },
    /**
     * 获取当天23:59:59:000
     */
    getTodayLast () {
        return new Date(+this.getTodayZero() + 86399000)
    }
}

const object = {
    removeEmptyAttr (obj) {
        if (_.isObject(obj)) {
            for (let key in obj) {
                if (_.isObject(obj[key]) || _.isArray(obj[key])) {
                    if ( _.isArray(obj[key]) && obj[key].length === 0 ) {
                        delete obj[key]
                    }
                    object.removeEmptyAttr(obj[key])
                } else {
                    if (_.isUndefined(obj[key]) || _.isNull(obj[key]) || (_.isString(obj[key]) && _.trim(obj[key]) === '')) {
                        delete obj[key]
                    }
                }
            }
        } else if (_.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                object.removeEmptyAttr(obj[i])
            }
        }
    }
}

const loader = (function () {
    const map = {}

    function loadScripts (scripts, callback, parent = 'body') {
        scripts = scripts.filter(function (script) {
            if (!map[script] || !map[script].status !== 2) {
                return true
            }
            return false
        })
        if (scripts.length === 0) {
            callback && callback()
            return
        }
        let loaded = 0
        for (let i = 0, len = scripts.length; i < len; i++) {
            if (!map[scripts[i]]) {
                map[scripts[i]] = { status: 0, callbacks: [] }
            }
            map[scripts[i]].callbacks.push(function () {
                loaded++
                if (loaded === scripts.length) {
                    callback && callback()
                }
            })
            if (map[scripts[i]].status === 0) {
                parent = document.getElementsByTagName(parent)[0] || document.body
                let node = document.createElement('script')
                node.onload = node.onreadystatechange = function () {
                    const rs = this.readyState
                    if (typeof rs === 'undefined' || rs === 'loaded' || rs === 'complete') {
                        const src = node.getAttribute('src')
                        // 当前处于加载完成状态
                        map[src].status = 2
                        const callbacks = map[src].callbacks
                        callbacks.forEach(function (cb) {
                            cb()
                        })
                        // 清空回调数组
                        map[src].callbacks.length = 0
                        this.onload = this.onreadystatechange = null
                        node = null
                    }
                }
                node.onerror = function () {
                    const src = node.getAttribute('src')
                    // 当前处于出错状态
                    map[src].status = 3
                    map[src].callbacks.length = 0
                    console.log(`${src} 加载出错！`)
                }
                node.src = scripts[i]
                parent.appendChild(node)
                // 当前处于loading状态
                map[scripts[i]].status = 1
            }
        }
    }

    return {
        loadScripts
    }
})()

const template = {
    // 数组删除指定元素
    remove (arr, val) {
        var index = arr.indexOf(val)
        if (index > -1) {
            arr.splice(index, 1)
        }
        return arr
    },
    getDpi () {
        //设置默认Dpi
        var dpi = {
            xDpi: 96, //水平每英寸像素数
            yDpi: 96 //竖直每英寸像素数
        }
        return dpi
    },
    hex (x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    },
    // 获取字段
    getFieldFromContent(content) {
        var result = content;
        //正则表达式，匹配以@{开头和以}结尾的字符串
        var reg = /^\@\{[\w\W|\u4e00-\u9fa5]+\}$/;
        if (typeof (content) != "undefined" && content != null && content != "" && reg.test(content)) {
            var strStart = content.indexOf("{") + 1;
            var strEnd = content.lastIndexOf("}");
            result = content.substring(strStart, strEnd);
            if (typeof (result) == "undefined") {
                return content;
            }
        }
        return result;
    },
    // 获取值
    getValueOfObject (obj, fieldName) {
        var result = fieldName;
        if (typeof (obj) != "undefined" && obj != null && obj != ""
            && typeof (fieldName) != "undefined" && fieldName != null && fieldName != "" && fieldName != "自定义内容") {
            // result = "@{" + obj[fieldName] + "}";
            result = obj[fieldName];
            if (result == "undefined" || typeof (result) == "undefined") {
                return fieldName;
            }
        }
        return result;
    },
    // 获取字段
    getFieldOfObject(obj, fieldValue) {
        var result = template.getFieldFromContent(fieldValue);
        if (typeof (obj) != "undefined" && obj != null && obj != ""
            && typeof (fieldValue) != "undefined" && fieldValue != null && fieldValue != "") {
            // var fieldValue = template.getFieldFromContent(fieldValue);
            for (var mField in obj) {
                var mValue = obj[mField];
                if (mValue == fieldValue) {
                    result = mField;
                    return result;
                }
            }
        }
        return result;
    },
    // 转换为英文对应
    resolveContentToEnglish(code) {
        var result = code;
        var obj = CNST.PRINT_ENUMS.wayBillTemplate.master;
        if (!_.isEmpty(code)) {
            var strCode = JSON.stringify(code);
            var reg = /\@\{[\w\.|\u4e00-\u9fa5]+\}/g;
            var contents = strCode.match(reg);
            if (!_.isEmpty(contents)) {
                contents.forEach(function (mcon) {
                    var mfield = template.getFieldFromContent(mcon);
                    var mkey = "@{" + template.getValueOfObject(obj, mfield) + "}";
                    if (mcon != mkey) {
                        strCode = strCode.replace(mcon, mkey);
                    }
                });
                result = JSON.parse(strCode);
            }

        }
        return result;
    },
    //转换为中文
    resolveContentToChinese(code) {
        var result = code;
        var obj = CNST.PRINT_ENUMS.wayBillTemplate.master;
        if (typeof (code) != "undefined" && code != null && code != "") {
            var strCode = JSON.stringify(code);
            var reg = /\@\{[\w\.]+\}/g;
            var contents = strCode.match(reg);
            if (typeof (contents) != "undefined" && contents != null && contents != "") {
                for (var idx in contents) {
                    var mval = template.getFieldFromContent(contents[idx]);
                    var mkey = "@{" + template.getFieldOfObject(obj, mval) + "}";
                    strCode = strCode.replace(contents[idx], mkey);
                }
                result = JSON.parse(strCode);
            }
        }
        return result;
    },
    // 转换长度单位
    convertUnit (sourceLength, destUnit) {
        if (!sourceLength) {
            return sourceLength;
        }
        var srcNum;
        var srcUnit;
        if (typeof sourceLength == "number") {
            srcNum = sourceLength;
            srcUnit = "px";
        } else {
            var matches = sourceLength.match(/^(\d+(\.\d+)?)([a-z|A-Z]*)$/);
            if (!matches) {
                return sourceLength;
            }
            srcNum = parseFloat(matches[1]);
            srcUnit = matches[3];
        }
        if (srcUnit == destUnit) {
            return srcNum;
        }
        if (srcUnit == "") {
            srcUnit = "px";
        }
        if (srcUnit == destUnit) {
            return srcNum;
        }
        var dpi = template.getDpi();
        var cmPin = 2.54;
        var mmPcm = 10;
        var mmPin = 25.4;
        var ptPin = 72;
        switch (srcUnit) {
            case "px":
                {
                    switch (destUnit) {
                        case "cm":
                            {
                                return srcNum / (dpi.xDpi / cmPin);
                            }
                        case "mm":
                            {
                                return srcNum / (dpi.xDpi / mmPin);
                            }
                        case "in":
                            {
                                return srcNum / dpi.xDpi;
                            }
                        case "pt":
                            {
                                return srcNum / dpi.xDpi * ptPin;
                            }
                        }
                        break;
                    }
            case "cm":
                {
                    switch (destUnit) {
                        case "px":
                            {
                                return srcNum / cmPin * dpi.xDpi;
                            }
                        case "mm":
                            {
                                return srcNum * mmPcm;
                            }
                        case "in":
                            {
                                return srcNum / cmPin;
                            }
                        case "pt":
                            {
                                return srcNum / cmPin * ptPin;
                            }
                        }
                        break;
                    }
            case "mm":
                {
                    switch (destUnit) {
                        case "px":
                            {
                                return srcNum / mmPin * dpi.xDpi;
                            }
                        case "cm":
                            {
                                return srcNum / mmPcm;
                            }
                        case "in":
                            {
                                return srcNum / mmPin;
                            }
                        case "pt":
                            {
                                return srcNum / mmPin * ptPin;
                            }
                        }
                        break;
                    }
            case "in":
                {
                    switch (destUnit) {
                        case "px":
                            {
                                return srcNum * dpi.xDpi;
                            }
                        case "cm":
                            {
                                return srcNum * cmPin;
                            }
                        case "mm":
                            {
                                return srcNum * mmPin;
                            }
                        case "pt":
                            {
                                return srcNum * ptPin;
                            }
                        }
                        break;
                    }
            case "pt":
                {
                    switch (destUnit) {
                        case "px":
                            {
                                return srcNum / ptPin * dpi.xDpi;
                            }
                        case "cm":
                            {
                                return srcNum / ptPin * cmPin;
                            }
                        case "mm":
                            {
                                return srcNum / ptPin * mmPin;
                            }
                        case "in":
                            {
                                return srcNum / ptPin;
                            }
                        }
                        break;
                    }
        }
        return sourceLength;
    },
    // 获取带单位的长度值，默认为px
    getLengthWithUnit (sourceLength) {
        if (!sourceLength) {
            return sourceLength;
        }
        var length = sourceLength;
        if (typeof length != "string") {
            length = length.toString();
        }
        if (/^(-)?\d+(\.\d+)?$/.test(length)) {
            return length + "px";
        }
        return length;
    },
    //转换成utf-8格式
    toUtf8 (str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    },
    closest (el, selector) {
        var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
        while (el) {
            if (matchesSelector.call(el, selector)) {
                break;
            }
            el = el.parentElement;
        }
        return el;
    },
    rgbColorToHex (rgb) {
        if (rgb >= 0) {
            return rgb; //如果是一个hex值则直接返回
        }
        var matches = rgb.match(/^rgb(a?)\((\d+),\s*(\d+),\s*(\d+)(,\s*(\d+(\.\d+)?))?\)$/);

        if (!matches) {
            return "";
        }
        if (matches[1] == "a") {
            var opacity = parseFloat(matches[6]);
            if (opacity == 0) {
                return "";
            }
            if (opacity >= 1) {
                return "#" + template.hex(matches[2]) + template.hex(matches[3]) + template.hex(matches[4]);
            }
            return "#" + template.hex(matches[2] * opacity) + template.hex(matches[3] * opacity) + template.hex(matches[4] * opacity);
        }
        return "#" + template.hex(matches[2]) + template.hex(matches[3]) + template.hex(matches[4]);
    }
}

export {
    store,
    date,
    object,
    loader,
    template
}
