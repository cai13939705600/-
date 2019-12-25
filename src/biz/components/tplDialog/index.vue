<script>
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'
import 'biz/styles/print/colpick.scss'
import 'biz/styles/print/designer.scss'
import { printService } from 'biz/utils/printService'
import Tpl from './minxins/tpl.js'

export default {
    name: 'pd',
    mixins: [Tpl],
    data () {
        return {
            prtDeft: printService.getPrinters().default,
            prtOpts: printService.getPrinters().list
        }
    },
    beforeCreate() {
        this.disFields = []
    },
    mounted () {
        this.getPrinterObj()
    },
    methods: {
        getPrinterObj () {
            if (!printService.isSupClodp()) {
                alert("未配置任何打印服务组件");
            } else {
                this.prtSel.printerName = this.tplCfg.printerName || this.prtDeft
            }
        },
        // 存在模板对象，则绘制
        renderPrintItems () {
            let vm = this;
            if (this.$refs.designerProperties) {
                if (!_.isEmpty(this.tplDt) && !_.isEmpty(this.tplDt.filedNameMap)) {
                    var str = '';
                    for (var filedName in this.tplDt.filedNameMap) {
                        str += "<option value='@{" + filedName + "}'>" + filedName + "</option>"
                        this.kjOpts.push = { value: '@{' + filedName + '}', label: filedName }
                    }
                    this.kjOpts.push = { value: '', label: '自定义内容' }
                }
            }
            if (!_.isEmpty(this.tplDt) && this.tplDt.items.length) {
                this.tplDt.items.forEach((item, index) => {
                    let prItm = this.fmtRespPrtItem(item)
                    prItm.w_attrs.name = item.type + (index+1)
                    prItm.zIndex = index

                    // 属性---控件选项添加
                    this.kjOpts.push({ value: item.type + (index + 1), label: item.type + (index + 1) })
                    
                    // 选中框选中最后一个
                    if (index == this.tplDt.items.length - 1) {
                        if (prItm.w_addTbCls.indexOf("selected") === -1) {
                            prItm.w_addTbCls.push('selected')
                        }
                        this.setPropertyTb(prItm)
                    }
                    this.drawItems.push(prItm)
                    //TODO dom没有渲染完成 window._Vue为undefined， DOM加载后才初始化条形码 加个延迟
                    if (item.type == 'barcode') {
                        window.setTimeout(() => {
                            let elem = document.getElementById('barcode_img' + parseInt(index + 1))
                            JsBarcode(elem, ' ',{
                                  format: "code128",
                                  width: 4,
                                  height: 30,
                                  displayValue: false
                            })
                        }, 0)
                    }
                    if (item.type == 'qrcode') {
                        window.setTimeout(() => {
                            // 获取页面的canvas
                            let msg = document.getElementById('qrcode_img' + parseInt(index + 1))
                            // 将数据画到（canvas）上
                            QRCode.toCanvas(msg, prItm.content, function (error) {
                                console.log(error)
                            })
                        }, 0)
                    }
                })
            }
        }
    }
}

</script>
