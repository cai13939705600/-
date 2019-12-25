import qs from 'qs'
import Cookies from 'js-cookie'
import Vue from 'vue'
/**
 * @interface 
 * @property 
 * @property 
 */
/**
 * @param 
 */
import { getBOIS, getPort, getPrinters } from 'common/utils/lodop'
export  const print = (function(){
        function getPrintTem(par,billTypeId,machineCode,type,codeList){
            api.print.queryPrintConfigByPage({billTypeId:billTypeId,machineCode: machineCode, type:type, codeList:codeList}).then(({ head = {}, body = {} }) => {
                var n=0
                if (head.code === '200'&&body.records&&body.records.length>0) {
                    var printers = printService.getPrinters().list
                    printers.forEach(e=>{
                            if(e.name == body.records[0].printer){
                                n++
                                getTemContent(par,body.records[0].printTemplateId,body.records[0].printer)
                            }
                    })
                    if(n==0){
                        return Vue.prototype.$message.error('无对应打印机')
                    }
                }else{
                    return Vue.prototype.$message.error('无对应打印机')
                }
            })
        }
        function getTemContent(param,tempId,printer){
            api.print.getPrintTemplateContent({id:tempId}).then(({ head = {}, body = {} }) => {
                    var tems;
                    var printParams;
                    if (head.code === '200'&&body) {
                        debugger
                    // var tem ={"printerName":"","pageSize":"","pageOrient":"1","top":"0.00cm","left":"0.00cm","width":"39.69cm","height":"20.00cm","backgroundColor":"#ffffff","items":[{"type":"barcode","top":63,"left":510,"width":274,"height":43,"foreColor":"#000000","backgroundColor":"","content":"@{billCode1}","format":"code128","barWidth":"1"},{"type":"text","top":116,"left":564,"width":388,"height":18,"foreColor":"#000000","backgroundColor":"","content":"@{billCode1}","fontName":"黑体","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":28,"left":290,"width":200,"height":38,"foreColor":"#000000","backgroundColor":"","content":"入库清单\n","fontName":"黑体","fontSize":20,"lineHeight":"26.6667px","whiteSpace":"nowrap","textAlign":"center","verticalAlign":"middle"},{"type":"text","top":74,"left":35,"width":117,"height":18,"foreColor":"#000000","backgroundColor":"","content":"入库订单号：","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":74,"left":135,"width":250,"height":18,"foreColor":"#000000","backgroundColor":"","content":"@{billCode1}","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"pre-wrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":131,"left":49,"width":200,"height":22,"foreColor":"#000000","backgroundColor":"","content":"单据类型：","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":158,"left":49,"width":100,"height":22,"foreColor":"#000000","backgroundColor":"","content":"打印时间：","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":131,"left":135,"width":151,"height":22,"foreColor":"#000000","backgroundColor":"","content":"@{type}","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":187,"left":48,"width":117,"height":18,"foreColor":"#000000","backgroundColor":"","content":"物料总数：","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"html","top":249,"left":45,"width":1400,"height":804,"foreColor":"#000000","backgroundColor":"","content":"<div style=\"padding:0\">\n    <table class=\"NoColRsizer\" width=\"100%\" border=\"1\" style=\"border:1px solid black;border-collapse: collapse;\"\n           dataTableTemplate=\"{data:'printAsnDetailList'}\">\n        <thead>\n         <tr>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">序号</td>\n\t\t\t<td style=\"width:10%;text-align:center;font-size: 10pt;\">SKU</td>\n\t\t\t<td style=\"width:15%;text-align:center;font-size: 10pt;\">名称</td>\n\t\t\t<td style=\"width:10%;text-align:center;font-size: 10pt;\">简称</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">货号</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">条码</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">入库数量</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">待收数量</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">收货数量</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">总体积</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">总重量</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">单价</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">总金额</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">规格</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">库存类型</td>\n\t\t\t\n           </tr>\n        </thead>\n        <tbody>\n\t\t\t<tr>\n\t\t    <td style=\"width:8%;text-align:center;font-size: 10pt;\"></td>\n\t\t\t<td style=\"width:10%;text-align:center;font-size: 10pt;\">@{skuCode}</td>\n\t\t\t<td style=\"width:15%;text-align:center;font-size: 10pt;\">@{skuName}</td>\n\t\t\t<td style=\"width:10%;text-align:center;font-size: 10pt;\">@{skuShortName}</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">@{skuNo1}</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\"></td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">@{expectQty}</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">@{waitReceivingQty}</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">@{receivedQty}</td>\n\t\t\t<td style=\"width:8%;text-align:center;font-size: 10pt;\">@{volume}</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">@{weight}</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">@{retailPrice}</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">@{sumRetailPrice}</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">@{spec}</td>\n\t\t\t<td style=\"width:5%;text-align:center;font-size: 10pt;\">@{inventoryType}</td>\n            </tr>\n        </tbody>\n    </table>\n</div>","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":9,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":104,"left":20,"width":141,"height":22,"foreColor":"#000000","backgroundColor":"","content":"入库通知单号：","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":104,"left":135,"width":191,"height":27,"foreColor":"#000000","backgroundColor":"","content":"@{code}","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":160,"left":135,"width":162,"height":19,"foreColor":"#000000","backgroundColor":"","content":"@{printTime}","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":158,"left":303,"width":99,"height":18,"foreColor":"#000000","backgroundColor":"","content":"打印人：","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":158,"left":524,"width":152,"height":18,"foreColor":"#000000","backgroundColor":"","content":"签字操作人/日期：","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":74,"left":303,"width":93,"height":18,"foreColor":"#000000","backgroundColor":"","content":"供应商：","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":74,"left":369,"width":190,"height":18,"foreColor":"#000000","backgroundColor":"","content":"@{supplierName}","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":187,"left":135,"width":632,"height":41,"foreColor":"#000000","backgroundColor":"","content":"@{remark}","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"pre-wrap","textAlign":"start","verticalAlign":"baseline"},{"type":"text","top":158,"left":369,"width":127,"height":25,"foreColor":"#000000","backgroundColor":"","content":"@{printUser}","fontName":"\"Microsoft Yahei\", Arial, Verdana, sans-serif","fontSize":12,"lineHeight":"18px","whiteSpace":"nowrap","textAlign":"start","verticalAlign":"baseline"}]}
                        if(isBase64(body.printTemplateContent)){
                            try{
                                tems =JSON.parse(decode(body.printTemplateContent))
                            }catch(e){
                                return Vue.prototype.$message.error('模板数据不符合规范')
                            }
                        }else{
                            try{
                                tems =JSON.parse(body.printTemplateContent)
                            }catch(e){
                                return Vue.prototype.$message.error('模板数据不符合规范')
                            }
                        }
                        
                        if(!Array.isArray(param)){
                            printParams = {
                                documentName: "demo" + (new Date()).getTime(),
                                filedNameMap: "",
                                printType: 'print',
                                template:tems,
                                printerName: printer,
                                data: [param]
                            }
                            printService.doprint(printParams)
                        }else{
                            for(var a = 0;a<param.length;a++){
                                printParams = {
                                    documentName: "demo" + (new Date()).getTime(),
                                    filedNameMap: "",
                                    printType: 'print',
                                    template:tems,
                                    printerName: printer,
                                    data: [param[a]]
                                }
                                printService.doprint(printParams)
                            }
                        }
                    }else{
                        Vue.prototype.$message.error('无对应模板')
                    }
            })
        }
        function isBase64(str) {
            if (str ==='' || str.trim() ===''){ return false; }
            try {
                return btoa(atob(str)) == str;
            } catch (err) {
                return false;
            }
        }
        function decode(str){
            return decodeURIComponent(atob(str).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
        }
        return {
            init : function(data,billTypeId,type,codeList){
                //获取打印机配置的打印机
                debugger
                getBOIS().then(machineCode => {
                    if(type){
                        getPrintTem(data,billTypeId,machineCode,type,codeList)
                    }else{
                        getPrintTem(data,billTypeId,machineCode,0,[])
                    }
                   
                }, e => {
                    return Vue.prototype.$message.error(e)
                })
                
            }
        }
})()