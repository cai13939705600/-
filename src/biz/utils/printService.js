/**
 * Created by wangtianli on 2019/6/7.
 * 支持chrome
 */
/**
 * 弹出窗口层
 */
var version2_clodop_task_status = 0
var version2_clodop_check_print_status = true

//clodop 执行回调对象
var version2_clodop_on_return_map = {}


const printService = (function () {
    var isHttps = false;
    var protocolStr = document.location.protocol;
    isHttps = protocolStr == "https:";

    var cLodopPort = isHttps ? 8443 : 8000;
    // var cLodopPortBack = 18000;
    
    const prtPrm = CNST.PRINT_ENUMS.jcloudPrintParam

    function changeServiceUrl (serviceUrl) {
        if (/^\d+$/.test(serviceUrl)) {
            cLodopPort = serviceUrl
            if (isHttps) {
                changeServiceUrl("https://localhost:" + serviceUrl + "/CLodopfuncs.js");
            } else {
                changeServiceUrl("http://localhost:" + serviceUrl + "/CLodopfuncs.js");
            }
            return;
        }
        jt.loader.loadScripts([serviceUrl])
    }
    changeServiceUrl(cLodopPort);

    //对json对象进行多层级取值
    function getValueOfObject(obj, filedNames) {
        var result = obj;
        if (!obj) {
            return null;
        }

        for (var filedLevel in filedNames) {
            result = result[filedNames[filedLevel]];
            if (typeof (result) == "undefined" || !result) {
                return null;
            }
        }
        return result;
    }

    //对数据进行格式化处理
    function formatValue(obj, filedType, filedFormat) {
        switch (filedType) {
            case "date": {
                /*var time = new Date(obj);
                if (!filedFormat) {
                    return time;
                }
                return jt.date.format(time);*/
                return obj
            }
            case "short":
            case "int":
            case "long": {
                if (!filedFormat) {
                    return parseInt(obj);
                }
                return parseInt(obj, parseInt(filedFormat));
            }
            case "float":
            case "double":
            case "number": {
                var number = parseFloat(obj);
                if (!filedFormat) {
                    return number;
                }
                return number.format(filedFormat);
            }
            case "jcloudenums": {
                if (jcloudEnums) {
                    var enums = getValueOfObject(jcloudEnums, filedFormat.split('.'));
                    if (enums) {
                        var enumValue = enums[obj];
                        if (enumValue) {
                            return enumValue;
                        }
                    }
                }
                break;
            }
            case "chnnumber": {
                if (obj) {
                    try {
                        return (obj + "").formatCHN();
                    } catch (e) {
                        return obj;
                    }
                }
                return "";
            }
        }
        return obj;
    }

    // 转换长度单位
    function convertUnit(sourceLength, destUnit) {
        if (!sourceLength) {
            return sourceLength;
        }
        var srcNum;
        var srcUnit;
        if (typeof sourceLength == "number") {
            srcNum = sourceLength;
            srcUnit = "px";
        }
        else {
            var matches = sourceLength.match(/^(\d+(\.\d+)?)([a-z|A-Z]*)$/);
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
        var dpi = getDpi();
        var cmPin = 2.54;
        var mmPcm = 10;
        var mmPin = 25.4;
        var ptPin = 72;
        switch (srcUnit) {
            case "px": {
                switch (destUnit) {
                    case  "cm": {
                        return srcNum / (dpi.xDpi / cmPin);
                    }
                    case  "mm": {
                        return srcNum / (dpi.xDpi / mmPin);
                    }
                    case  "in": {
                        return srcNum / dpi.xDpi;
                    }
                    case "pt": {
                        return srcNum / dpi.xDpi * ptPin;
                    }
                }
                break;
            }
            case "cm": {
                switch (destUnit) {
                    case  "px": {
                        return srcNum / cmPin * dpi.xDpi;
                    }
                    case  "mm": {
                        return srcNum * mmPcm;
                    }
                    case  "in": {
                        return srcNum / cmPin;
                    }
                    case "pt": {
                        return srcNum / cmPin * ptPin;
                    }
                }
                break;
            }
            case "mm": {
                switch (destUnit) {
                    case  "px": {
                        return srcNum / mmPin * dpi.xDpi;
                    }
                    case  "cm": {
                        return srcNum / mmPcm;
                    }
                    case  "in": {
                        return srcNum / mmPin;
                    }
                    case "pt": {
                        return srcNum / mmPin * ptPin;
                    }
                }
                break;
            }
            case "in": {
                switch (destUnit) {
                    case  "px": {
                        return srcNum * dpi.xDpi;
                    }
                    case  "cm": {
                        return srcNum * cmPin;
                    }
                    case  "mm": {
                        return srcNum * mmPin;
                    }
                    case "pt": {
                        return srcNum * ptPin;
                    }
                }
                break;
            }
            case "pt": {
                switch (destUnit) {
                    case  "px": {
                        return srcNum / ptPin * dpi.xDpi;
                    }
                    case  "cm": {
                        return srcNum / ptPin * cmPin;
                    }
                    case  "mm": {
                        return srcNum / ptPin * mmPin;
                    }
                    case "in": {
                        return srcNum / ptPin;
                    }
                }
                break;

            }
        }
        return sourceLength;
    }

    function convertStyle(style) {
        if (typeof style == "number") {
            return style;
        }
        switch (style) {
            case "dashed": {
                return 1;
            }
            case "dotted": {
                return 2;
            }
            case "dotdashed": {
                return 3;
            }
            case "double": {
                return 4;
            }
            case "solid":
            default : {
                return 0;
            }
        }
    }


    // 初始化lodop
    function initLodop() {
        var lodop = getCLodop();
        //todo 正式版本此处设置注册码
        lodop.SET_LICENSES("北京京东尚科信息技术有限公司", "F0DAE247AF89CE5613654F57BC24FE43", "北京京東尚科信息技術有限公司", "7336D116FF38A4B823F45517D52B6D26");
        lodop.SET_LICENSES("THIRD LICENSE", "", "Beijing Jingdong Shangke Information Technology Co., Ltd", "8561E3D099350E5FB28D860B18F7C3D2");
        return lodop;
    }

    // 加载一组数据
    function lodopOneItem(needInit, lodop, printParam, dataItem) {
        
        var type = printParam[prtPrm.type];
        console.debug("打印类型：" + type)

        if (prtPrm.type_enum.USE_FIELD == type && !dataItem.carrierNo) {
            alert("数据没有承运商编号，无法进行打印运单操作！")
            return false;
        }

        if (type != prtPrm.type_enum.ONLY_TEMPLATE && !printParam[prtPrm.fieldValTemplateMap]) {
            alert("没有找到字段对应模板信息，无法进行打印运单操作！")
            return false;
        }

        if (type != prtPrm.type_enum.ONLY_TEMPLATE && !printParam[prtPrm.field]) {
            alert("没有找到字段信息，无法进行打印运单操作！")
            return false;
        }

        var template = {};
        if (type == prtPrm.type_enum.ONLY_TEMPLATE) {
            template = printParam[prtPrm.template];
        } else {
            var field = printParam[prtPrm.field];
            template = printParam[prtPrm.fieldValTemplateMap][dataItem[field]];
        }

        template.items = template.items || [];

        if (needInit) {
            var taskName = printParam[prtPrm.documentName] || "";
            lodop.PRINT_INITA(template.top, template.left, template.width, template.height, taskName);
            if (template.pageSize) {
                lodop.SET_PRINT_PAGESIZE(template.pageOrient, 0, 0, template.pageSize);
            }
        }

        //没有设置打印机时使用模板的
        if (!printParam[prtPrm.printer] && !printParam[prtPrm.printer]) {
            printParam[prtPrm.printer] = template.printerName;
        }
        var filedNameMap = printParam[prtPrm.filedNameMap];
        var items_size = template.items.length;
        for (var j = 0; j < items_size; j++) {
            var templateItem = template.items[j];
            var allowPrintAlways = true;
            var objValue = templateItem.content;
            if (filedNameMap) {
                objValue = objValue.replace(/@\{[^\}]+\}/g, function (word) {
                    var filedInfo = word.substring(2, word.length - 1);
                    if (filedNameMap.hasOwnProperty(filedInfo)) {
                        return filedNameMap[filedInfo];
                    }
                    return word;
                });
            }
            if (objValue) {
                objValue = objValue.replace(/@\{\w+(\.\w+)*(,[^\}]+)?\}/g, function (word) {
                    var filedInfo = word.substring(2, word.length - 1);
                    var filedNames;
                    var filedType = null;
                    var filedFormat = null;
                    var commaIndex = filedInfo.indexOf(",");
                    if (commaIndex > 0) {
                        filedNames = filedInfo.substring(0, commaIndex).split('.');
                        var commaIndex2 = filedInfo.indexOf(",", commaIndex + 1);
                        if (commaIndex2 > 0) {
                            filedType = filedInfo.substring(commaIndex + 1, commaIndex2);
                            filedFormat = filedInfo.substring(commaIndex2 + 1);
                        }
                        else {
                            filedType = filedInfo.substring(commaIndex + 1);
                        }
                    }
                    else {
                        filedNames = filedInfo.split('.');
                    }
                    var valueOfObject = getValueOfObject(dataItem, filedNames);
                    if (valueOfObject == null) {
                        valueOfObject = "";
                    }
                    else if (typeof (valueOfObject) != "undefined" && filedType) {
                        valueOfObject = formatValue(valueOfObject, filedType.toLowerCase(), filedFormat);
                    }
                    return valueOfObject;
                });
            }

            if (templateItem.fontSize) {
                lodop.SET_PRINT_STYLE("FontSize", templateItem.fontSize);
            }
            if (templateItem.fontName) {
                lodop.SET_PRINT_STYLE("FontName", templateItem.fontName);
            }
            if (templateItem.fontBold) {
                lodop.SET_PRINT_STYLE("Bold", templateItem.fontBold);
            }
            switch (templateItem.type) {
                case "barcode": {
                    var barCodeType;
                    if (templateItem.codeType) {
                        barCodeType = templateItem.codeType
                    }
                    else {
                        barCodeType = "128Auto";
                    }
                    if (templateItem.hasIntercept && templateItem.subStringIndex && templateItem.subStringLength) {
                        var index = parseInt(templateItem.subStringIndex);
                        var length = parseInt(templateItem.subStringLength);
                        if (index < 0) {
                            objValue = objValue.substr(index, length);
                        }
                        else if (index < objValue.length) {
                            objValue = objValue.substring(index, index + length);
                        }
                    }
                    lodop.ADD_PRINT_BARCODE(templateItem.top, templateItem.left, templateItem.width, templateItem.height, barCodeType, objValue);
                    lodop.SET_PRINT_STYLEA(0, "ShowBarText", 0);
                    break;
                }
                case "qrcode": {
                    if (templateItem.hasIntercept && templateItem.subStringIndex && templateItem.subStringLength) {
                        var index = parseInt(templateItem.subStringIndex);
                        var length = parseInt(templateItem.subStringLength);
                        if (index < 0) {
                            objValue = objValue.substr(index, length);
                        }
                        else if (index < objValue.length) {
                            objValue = objValue.substring(index, index + length);
                        }
                    }
                    lodop.ADD_PRINT_BARCODE(templateItem.top, templateItem.left, templateItem.width, templateItem.height, "QRCode", objValue);
                    lodop.SET_PRINT_STYLEA(0, "DataCharset", "UTF-8");
                    break;
                }
                case "line": {
                    if (templateItem.orient == "v") {
                        lodop.ADD_PRINT_SHAPE(0, templateItem.top, templateItem.left, templateItem.width, templateItem.height, convertStyle(templateItem.lineStyle), convertUnit(templateItem.lineWidth, "px"), templateItem.backgroundColor);
                    }
                    else {
                        lodop.ADD_PRINT_SHAPE(1, templateItem.top, templateItem.left, templateItem.width, templateItem.height, convertStyle(templateItem.lineStyle), convertUnit(templateItem.lineWidth, "px"), templateItem.backgroundColor);
                    }
                    //if (templateItem.orient == "v") {
                    //    lodop.ADD_PRINT_LINE(templateItem.top, templateItem.left, templateItem.top + templateItem.height, templateItem.left, convertStyle(templateItem.lineStyle), convertUnit(templateItem.lineWidth, "px"));
                    //}
                    //else {
                    //    lodop.ADD_PRINT_LINE(templateItem.top, templateItem.left, templateItem.top, templateItem.left + templateItem.width, convertStyle(templateItem.lineStyle), convertUnit(templateItem.lineWidth, "px"));
                    //}
                    //if (templateItem.backgroundColor) {
                    //    lodop.SET_PRINT_STYLEA(0, "FontColor", templateItem.backgroundColor);
                    //}
                    break;
                }
                case "rect": {
                    lodop.ADD_PRINT_RECT(templateItem.top, templateItem.left, templateItem.width, templateItem.height, convertStyle(templateItem.border.style), convertUnit(templateItem.border.width, "px"));
                    if (templateItem.border.color) {
                        lodop.SET_PRINT_STYLEA(0, "FontColor", templateItem.border.color);
                    }
                    break;
                }
                case "image": {
                    lodop.ADD_PRINT_IMAGE(templateItem.top, templateItem.left, templateItem.width, templateItem.height, objValue);
                    lodop.SET_PRINT_STYLEA(0, "Stretch", 2);//按原图比例(不变形)缩放模式
                    break;
                }
                case "ellipse": {
                    lodop.ADD_PRINT_ELLIPSE(templateItem.top, templateItem.left, templateItem.width, templateItem.height, convertStyle(templateItem.border.style), convertUnit(templateItem.border.width, "px"));
                    if (templateItem.border.color) {
                        lodop.SET_PRINT_STYLEA(0, "FontColor", templateItem.border.color);
                    }
                    break;
                }
                case "html": {
                    var $html = $(templateItem.content);
                    allowPrintAlways = false;
                    $html.find("table[dataTableTemplate]").each(function () {
                        var $table = $(this);
                        var dataTableTemplate = eval("(" + $table.attr("dataTableTemplate") + ")");
                        if (dataTableTemplate && dataTableTemplate.data) {
                            $table.dataTableTemplate({
                                data: getValueOfObject(dataItem, dataTableTemplate.data.split('.'))
                            })
                        }
                    });
                    var newHtml = $html[0].outerHTML.replace(/@\{\w+(\.\w+)*(,[^\}]+)?\}/g, function (word) {
                        var filedInfo = word.substring(2, word.length - 1);
                        var filedNames;
                        var filedType = null;
                        var filedFormat = null;
                        var commaIndex = filedInfo.indexOf(",");
                        if (commaIndex > 0) {
                            filedNames = filedInfo.substring(0, commaIndex).split('.');
                            var commaIndex2 = filedInfo.indexOf(",", commaIndex + 1);
                            if (commaIndex2 > 0) {
                                filedType = filedInfo.substring(commaIndex + 1, commaIndex2);
                                filedFormat = filedInfo.substring(commaIndex2 + 1);
                            }
                            else {
                                filedType = filedInfo.substring(commaIndex + 1);
                            }
                        }
                        else {
                            filedNames = filedInfo.split('.');
                        }
                        var valueOfObject;
                        if (filedNames.length == 1 && filedNames[0] == "__rowIndexOfPage__") {
                            valueOfObject = i;
                        } else if (filedNames.length == 1 && filedNames[0] == "__rowIndexOfPage1__") {
                            valueOfObject = i + 1;
                        }
                        else {
                            valueOfObject = getValueOfObject(dataItem, filedNames);
                        }
                        if (valueOfObject == null) {
                            valueOfObject = "";
                        }
                        else if (typeof (valueOfObject) != "undefined" && filedType) {
                            valueOfObject = formatValue(valueOfObject, filedType.toLowerCase(), filedFormat);
                        }
                        return valueOfObject;
                    });
                    lodop.ADD_PRINT_HTM(templateItem.top, templateItem.left, templateItem.width, templateItem.height, newHtml);
                    var stringifyItems = JSON.stringify(template.items);
                    var reg = new RegExp('\\"printAlways\":\"1\"');
                    if (!stringifyItems.match(reg)) {
                        lodop.SET_PRINT_STYLEA(0, "Offset2Top", Number("-" + templateItem.top) + 10); //设置次页偏移把区域向上扩
                    }
                    allowPrintAlways = false;
                    break;
                }
                case "stable": {
                    var $html = $(templateItem.content);
                    $html.find("table[dataTableTemplate]").each(function () {
                        var $table = $(this);
                        var dataTableTemplate = eval("(" + $table.attr("dataTableTemplate") + ")");
                        if (dataTableTemplate && dataTableTemplate.data) {
                            $table.dataTableTemplate({
                                data: getValueOfObject(dataItem, dataTableTemplate.data.split('.'))
                            })
                        }
                    });
                    var newHtml = $html[0].outerHTML.replace(/@\{\w+(\.\w+)*(,[^\}]+)?\}/g, function (word) {
                        var filedInfo = word.substring(2, word.length - 1);
                        var filedNames;
                        var filedType = null;
                        var filedFormat = null;
                        var commaIndex = filedInfo.indexOf(",");
                        if (commaIndex > 0) {
                            filedNames = filedInfo.substring(0, commaIndex).split('.');
                            var commaIndex2 = filedInfo.indexOf(",", commaIndex + 1);
                            if (commaIndex2 > 0) {
                                filedType = filedInfo.substring(commaIndex + 1, commaIndex2);
                                filedFormat = filedInfo.substring(commaIndex2 + 1);
                            }
                            else {
                                filedType = filedInfo.substring(commaIndex + 1);
                            }
                        }
                        else {
                            filedNames = filedInfo.split('.');
                        }
                        var valueOfObject;
                        if (filedNames.length == 1 && filedNames[0] == "__rowIndexOfPage__") {
                            valueOfObject = i;
                        } else if (filedNames.length == 1 && filedNames[0] == "__rowIndexOfPage1__") {
                            valueOfObject = i + 1;
                        }
                        else {
                            valueOfObject = getValueOfObject(dataItem, filedNames);
                        }
                        if (valueOfObject == null) {
                            valueOfObject = "";
                        }
                        else if (typeof (valueOfObject) != "undefined" && filedType) {
                            valueOfObject = formatValue(valueOfObject, filedType.toLowerCase(), filedFormat);
                        }
                        return valueOfObject;
                    });
                    lodop.ADD_PRINT_TABLE(templateItem.top, templateItem.left, templateItem.width, templateItem.height, newHtml);
                    var stringifyItems = JSON.stringify(template.items);
                    var reg = new RegExp('\\"printAlways\":\"1\"');
                    if (!stringifyItems.match(reg)) {
                        lodop.SET_PRINT_STYLEA(0, "Offset2Top", Number("-" + templateItem.top) + 10); //设置次页偏移把区域向上扩
                    }
                    lodop.SET_PRINT_STYLEA(0, "ItemType", 0);
                    allowPrintAlways = false;
                    break;
                }
                case "paging":
                {
                    lodop.ADD_PRINT_TEXT(templateItem.top, templateItem.left, templateItem.width, templateItem.height, objValue);
                    lodop.SET_PRINT_STYLEA(0,"ItemType",2);
                    break;
                }
                case "header":
                {
                    //替换所有@并替换相应值
                    var $headerHtml=templateItem.content;
                    var headerHtml=$headerHtml.replace(/@\{\w+(\.\w+)*(,[^\}]+)?\}/g,function (replaceValue) {
                        var filedInfo = replaceValue.substring(2, replaceValue.length - 1);
                        var filedNames;
                        var filedType = null;
                        var filedFormat = null;
                        var commaIndex = filedInfo.indexOf(",");
                        if (commaIndex > 0) {
                            filedNames = filedInfo.substring(0, commaIndex).split('.');
                            var commaIndex2 = filedInfo.indexOf(",", commaIndex + 1);
                            if (commaIndex2 > 0) {
                                filedType = filedInfo.substring(commaIndex + 1, commaIndex2);
                                filedFormat = filedInfo.substring(commaIndex2 + 1);
                            }
                            else {
                                filedType = filedInfo.substring(commaIndex + 1);
                            }
                        }
                        else {
                            filedNames = filedInfo.split('.');
                        }
                        var valueOfObject= getValueOfObject(dataItem, filedNames);
                        if (valueOfObject == null) {
                            valueOfObject = "";
                        }
                        else if (typeof (valueOfObject) != "undefined" && filedType) {
                            valueOfObject = formatValue(valueOfObject, filedType.toLowerCase(), filedFormat);
                        }
                        return valueOfObject;
                    });
                    lodop.ADD_PRINT_TEXT(templateItem.top, templateItem.left, templateItem.width, templateItem.height, headerHtml);
                    lodop.SET_PRINT_STYLEA(0,"ItemType",1);
                    break;
                }

                case "footer":
                {
                    var $headerHtml=templateItem.content;
                    var headerHtml=$headerHtml.replace(/@\{\w+(\.\w+)*(,[^\}]+)?\}/g,function (replaceValue) {
                        var filedInfo = replaceValue.substring(2, replaceValue.length - 1);
                        var filedNames;
                        var filedType = null;
                        var filedFormat = null;
                        var commaIndex = filedInfo.indexOf(",");
                        if (commaIndex > 0) {
                            filedNames = filedInfo.substring(0, commaIndex).split('.');
                            var commaIndex2 = filedInfo.indexOf(",", commaIndex + 1);
                            if (commaIndex2 > 0) {
                                filedType = filedInfo.substring(commaIndex + 1, commaIndex2);
                                filedFormat = filedInfo.substring(commaIndex2 + 1);
                            }
                            else {
                                filedType = filedInfo.substring(commaIndex + 1);
                            }
                        }
                        else {
                            filedNames = filedInfo.split('.');
                        }
                        var valueOfObject= getValueOfObject(dataItem, filedNames);
                        if (valueOfObject == null) {
                            valueOfObject = "";
                        }
                        else if (typeof (valueOfObject) != "undefined" && filedType) {
                            valueOfObject = formatValue(valueOfObject, filedType.toLowerCase(), filedFormat);
                        }
                        return valueOfObject;
                    });
                    lodop.ADD_PRINT_TEXT(templateItem.top, templateItem.left, templateItem.width, templateItem.height, headerHtml);
                    lodop.SET_PRINT_STYLEA(0,"ItemType",1);
                    break;
                }
                case "text": {
                    if (objValue) {
                        //如果需要截取字符串，进行截取
                        if (templateItem.hasIntercept && templateItem.subStringIndex && templateItem.subStringLength) {
                            var index = parseInt(templateItem.subStringIndex);
                            var length = parseInt(templateItem.subStringLength);
                            if (index < 0) {
                                objValue = objValue.substr(index, length);
                            }
                            else if (index < objValue.length) {
                                objValue = objValue.substring(index, index + length);
                            }
                        }
                        lodop.ADD_PRINT_TEXT(templateItem.top, templateItem.left, templateItem.width, templateItem.height, objValue);
                        if (templateItem.foreColor) {
                            lodop.SET_PRINT_STYLEA(0, "FontColor", templateItem.foreColor);
                        }
                    }
                    break;
                }
                default : {
                    if (objValue) {
                        lodop.ADD_PRINT_TEXT(templateItem.top, templateItem.left, templateItem.width, templateItem.height, objValue);
                        if (templateItem.foreColor) {
                            lodop.SET_PRINT_STYLEA(0, "FontColor", templateItem.foreColor);
                        }
                    }
                    break;
                }
            }
            if (templateItem.printAlways && '1' == templateItem.printAlways) {
                if (allowPrintAlways) lodop.SET_PRINT_STYLEA(0, "ItemType", 1);
            }
        }
    }

    function onReturnMap(printParam, callback) {
        var map = {};
        //重新copy一份防止引用问题
        printParam = _.cloneDeep(printParam);
        map[prtPrm.callBack] = callback;
        map[prtPrm.printParam] = printParam;
        return map;
    }

    // 完成打印
    function complateLodop(lodop, printParam, needComplatePrintTask, lodop_print_size) {
        if (lodop_print_size == 0) {
            //没有本地打印的 需要释放
            if (needComplatePrintTask) {
                //更改任务状态
                version2_clodop_task_status = 0;
            }
            return true;
        }

        if (printParam[prtPrm.printerIndex]) {
            lodop.SET_PRINTER_INDEX(printParam[prtPrm.printerIndex]);
        } else {
            lodop.SET_PRINTER_INDEX(printParam[prtPrm.printer]);
        }

        //增加打印份数 yx
        if (printParam[prtPrm.intCopys]) {
            lodop.SET_PRINT_COPIES(printParam[prtPrm.intCopys]);
            console.log("打印份数--------：" + printParam.intCopys);
        }

        lodop.SET_PRINT_MODE("PRINT_DUPLEX", 1);//指定为单面打印
        lodop.SET_SHOW_MODE("HIDE_PAPER_BOARD", 1); //隐藏打印预览背景进纸版的图案
        lodop.SET_SHOW_MODE("BKIMG_IN_PREVIEW", 1);//打印预览时是否包含背景图

        //todo 设置打印状态捕获
        if (version2_clodop_check_print_status) {
            lodop.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);
        }

        var printData = printParam[prtPrm.data] || [];
        var printType = printParam[prtPrm.printType];
        var printSource = printParam[prtPrm.printSource];
        var templateCode = printParam[prtPrm.templateCode];
        var printerName = printParam[prtPrm.printer];
        switch (printType) {
            case "preview": {
                lodop.PREVIEW();
                break;
            }
            case "design": {
                var code = lodop.PRINT_DESIGN();
                break;
            }
            case "setup": {
                lodop.PRINT_SETUP();
                break;
            }
            case "print":
            default: {

                var on_return = function (TaskID, printJobId, printParam) {
                    // saveErrorLog(printParam[prtPrm.taskUUID] + "》》》生成打印机任务" + TaskID, printJobId, {});
                    //保存打印数据到日志
                    // savePrintDataLog(TaskID, printParam, printParam[prtPrm.data]);
                    //加入回调队列
                    // addClodopCallbackTaskStack(TaskID, printJobId, printParam);
                };
                initClodopOnReturn(lodop);
                var task_id = lodop.PRINT();
                version2_clodop_on_return_map[task_id] = onReturnMap(printParam, on_return);

                var uuid = printParam[prtPrm.taskUUID];
                console.log("打印任务ID", task_id, new Date(), uuid);

                // saveErrorLog(uuid + "》》》打印任务" + task_id, temaplteService.getBillNos(printData), {});

                //存入taskid uuid用于追溯
                templateCode = templateCode + ">>>>>" + uuid;
                /*var record_source={
                    1:true,3:true,
                    20:true, 21:true, 23:true, 24:true, 25:true, 34:true
                }
                if (record_source[printSource]) {*/
                //全部记录
                for (var t = 0; t < printData.length; t++) {
                    var dataItem = printData[t];
                    //记录打印信息
                    // temaplteService.recordPrintInfo(printSource, dataItem, templateCode, printerName);
                }

                /*}*/
                break;
            }
        }
        if (needComplatePrintTask) {
            //更改任务状态
            version2_clodop_task_status = 0;
        }
    }

    // lodop打印组装数据
    function commonLodopPrint(lodop, printParam) {
        debugger
        var data = printParam[prtPrm.data] || [];
        var data_size = data.length;

        var printSource = printParam[prtPrm.printSource];
        var templateCode = printParam[prtPrm.templateCode];
        var printerName = printParam[prtPrm.printer];

        var lodop_print_size = 0;

        for (var t = 0; t < data_size; t++) {
            var dataItem = data[t];
            // 根据数据的template判断菜鸟和普通模板 根据printSource来判断是运单还是清单
            var platformFlag=dataItem["platformFlag"] || prtPrm.PlatformFlagEnums.NOTHING;
            if (platformFlag!=prtPrm.PlatformFlagEnums.NOTHING && printSource == prtPrm.printSource_enum.waybill) {
                var dataItemList = [];
                dataItemList.push(dataItem);
                var printParamNew = printParam || {};
                printParamNew[prtPrm.data] = dataItemList;
                if (platformFlag == prtPrm.PlatformFlagEnums.CNMD) {
                    try {
                        // $.printService_version2.do_printcainiao(printParamNew);
                    } catch (err) {
                        alert("连接菜鸟打印失败！");
                        console.log("连接菜鸟打印失败：" + err);
                        version2_clodop_cnmd_socket = null;
                    }
                } else if (platformFlag==prtPrm.PlatformFlagEnums.PDDMD){
                    try {
                        // $.printService_version2.do_printpinduoduo(printParamNew);
                    } catch (err) {
                        alert("连接拼多多打印失败！");
                        console.log("连接拼多多打印失败：" + err);
                        version2_clodop_pddmd_socket = null;
                    }
                }

                continue;
            }

            lodopOneItem(lodop_print_size == 0, lodop, printParam, dataItem);

            lodop_print_size++;
        }
        return lodop_print_size;
    }

    function initClodopOnReturn(lodop) {
        //延时处理 防止调用比设置时间短问题
        var doReturn = function (tryCnt, taskId, value) {
            var startCallBack = function (map) {
                console.log("taskId:" + taskId + "执行回调开始", map)
                var doFunc = map[prtPrm.callBack];
                var printParam = map[prtPrm.printParam];
                doFunc(taskId, value, printParam);
                delete version2_clodop_on_return_map[taskId];
            }

            if (tryCnt > reprint_try_cnt) {
                alert("没有找到" + taskId + "对应的clodop回调方法！");
                return;
            }

            var taskMap = version2_clodop_on_return_map[taskId];
            if (taskMap) {
                startCallBack(taskMap);
            } else {
                window.setTimeout(function () {
                    tryCnt++;
                    doReturn(tryCnt, taskId, value);
                }, 50)
            }
        }
        lodop.On_Return = function (taskId, value) {
            doReturn(0, taskId, value);
        }
    }

    return {
        isSupClodp: function () {
            return typeof getCLodop === "function"
        },
        /**
         * @property {number} currentPort 当前端口号
         */
        currentPort: cLodopPort,
        /**
         * @function changeProt
         * @description 修改端口号
         * @param {number} port 新端口号
         */
        changeProt: changeServiceUrl,
        // return { default:'', list:[] }
        getPrinters: function () {
            if (typeof getCLodop != "function") {
                return { default: '', list:[] }
            }
            var lodop = getCLodop()
            return lodop.Printers
        },
        doprint: function (printParam, callBackFunc, callBackFuncArgs) {
            debugger
            if (typeof getCLodop != "function") {
                return;
            }
            var lodop = initLodop();
            // 只是用模板打印
            printParam[prtPrm.type] = prtPrm.type_enum.ONLY_TEMPLATE

            var lodop_print_size = commonLodopPrint(lodop, printParam);
            complateLodop(lodop, printParam, true, lodop_print_size);
            return lodop;
        }
    }
})()

export {
    printService
}
