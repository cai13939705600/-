import BasicDialog from 'biz/components/basicDialog'

import { printService } from 'biz/utils/printService'

const FIELDS_DIS = {
    'barcode': ['barFormat', 'barWidth'],
    'borderLine': ['borderColor', 'borderStyle', 'borderWidth']
}

const PUBLIC_PATH = process.env.VUE_APP_PUBLIC_PATH

const ADD_PRINT_DEFAULTS = {
    TEXT_ADD: { type: "text", content: "自定义内容" },
    PAGE_ADD: { type: "paging", content: "第#页/共&页" },
    HEADER_ADD: { type: "header", content: "页眉" },
    FOOTER_ADD: { type: "footer", content: "页脚" },
    BARCODE_ADD: { type: "barcode", width: 100, height: 30, content: "自定义内容" },
    QRCODE_ADD: { type: "qrcode", width: 100, height: 100, content: "自定义内容" },
    RECT_ADD: { type: "rect", width: 100, height: 100, border: { width: 1 } },
    ELLIPSE_ADD: { type: "ellipse", width: 100, height: 100, border: { width: 1 } },
    LINE_H_ADD: { type: "line", orient: 'h', length: 100, content: "自定义内容" },
    LINE_V_ADD: { type: "line", orient: 'v', length: 100, content: "自定义内容" },
    HTML_ADD: { type: "html", content: "<div>  HTML Demo content  <br>Double click me and modify...   </div>", width: 100, height: 100 },
    TABLE_ADD: { type: "html", content: "<table border='1'><tr><td>11</td><td>12</td><td>13</td></tr><tr><td>21</td><td>22</td><td>23</td></tr></table>", width: 100, height: 100 },
    STABLE_ADD: { type: "stable", content: "<table border='1'><tr><td>11</td><td>12</td><td>13</td></tr><tr><td>21</td><td>22</td><td>23</td></tr></table>", width: 100, height: 100 },
    IMAGE_ADD: {
        type: "image",
        width: 100,
        height: 100,
        content: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAATCAYAAADMBm6RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAfOSURBVFhH3VZpcFRFEN4kgNyHKHIqFCIeUAiCCEVRYlkqaHmUYAS0FBSUKETOAhU5VO5L7oBgAhIwXCpgQI4knAHMnc2dsNlNdjchB8mGIyHw+fXse8tjCRj+OlVdM2+mZ15/3V/3jAlaM60y/y/Fu9Ue8Mpk1futNqMORXoftcZ5bU2Ndf2ahHq+7NU+z55ba/+5bvyuSWrQ8W61AKwZQoCmnzhenAjTwgSYFlGWJbnnRa8mg7Q5cY4uskfO8Vvj/tb3323dM6+fdy/R/2sQ73YPwNoBPEh5fGkSGqw146PDVnx/3oFpp+3oFpoB05JELdKGPWqf1ouTqGNaSmHfc0c2Hv45ze0wmRMRHfmmPPVrJh7ckArTgnjPnHKyZoeAFycZ5XaHaGNNvNvtgHUvGTYKxcSovtszEV/oQmh6MSYez8PSWCeSSl0Eb1frPmqPtp+inLA8CZ23ZGB1QjEW/nMR884VIM9VhcNWF+adKeAZRZjJ/hE6YFZ0AaafdKL6xg1E5lVgxnEH5p4rVDKRY59liXjldwuO2Spw0OJSZxzOdeEQReZ6/5ZNdiTS3ls2iHi3OyOsGe7xHI1uFZSC5IuX8eY+yy3Pk9Yt1yUjtrgMXxy3MQoJbucYhZFrsi4Fr/+ZixmnnVhA0NNPOTH7bAHmx1zE1FMO9KGhzYJSMWRXDo4QRErJVYwMt2J8lAPD/rLCP9yGIdyvWKAAmVGXdJc6ImNdPEyRsUG8W40RFrA63XwJbm60EyvjLsL0Y5z6mThCetOiRPQJy4S5pAL1VzPvuN9ILzXmfgFsLa/ChEg7pjGKkxgxiWzh5etotzld6bTZmIrU4mtoS+eKzobkEphmxbgdPD8ezUnzz47lYyxFHPHB33kYw/GYo/n4PMKOUUfyUH9tyh2gvdsdgBUVmWuv7cnBzrRSRFwoh7X0GgbuyoavhzIU0eXhjdabEeUoQYdg5t1COmkJi47mOD86QcCMPpyvwHUkOKFvGxo/YPcF3Lx5E123ZipQm1JKmDJXsYTUzqVznNRfRcpvMpdwfx6a0MGTTzgQEJGPK1U3kE6bAgn4SzpxHAEHsG9wX4CZszrYyZH5iM13YdgfFjwRkoF2m9LdtNEcovR00Bw/tDEFDdeZMXhfNt44kI0GHEtOqz1MiV7bs7AusRjBjJqjogpxhVcQQiATouyox3P8qNeE8skRAiCgkJRShFvKMYVMkMi1Ylr4yP/mxqL7tixUVt9A52AyY04MWtB5HX7hmCzQHV0rwAoEr4ReoZlItLvQghVZ5SoNNq3QDpJCJmOjF+UnCxLQMSSNp9xUZ/Xbxagx2spI0Wd+780uQw8aG5p2CZMYqRnM5SknHW5DVySpCLqqqvEcnTObUQ5JLVX5K6ngSxtEHiU7LpRV4lPSWIpYY6bMW/tzkc9CKPvddhlso3g3D2A93+afdWJqVL4qSpKnnoiqaCajPWmprg0BSqlPx3RghN8Jz4H9ylXYL1diTIRVzT2wJhnNSLNdmWUISy9FD0ZFqvS3zN9OPCOOFJ5C8C15xhGbC3M435UFLNpxmRF2wTQvTjFjd1YZ6pF533C99Fo1wjIu4SCr876ccmxn2rkqq93Oo/1+tQVcRxS4YVVMAYb/lQs//sC9WaMmv4eH56rDzzoq0JBG+nBuZrQd5ZXXcb6wnNQ2o0VQMiIdl1BedR3zYx1oxL1PSp6y4L3Ka0WqdMuNvIcXxsOHTu7ElBHDHgtmT4AfshjNOVvopqkwjKxTea4xrRWj3JxOkQLVeD1zljY8H5aD/jtzlK473WoBWEWY1AuMyENQXKH6eR1GWObrSc+KHXA0T+leIfVa/yxFKl7dy9LiiyrcRi1LwElnmZrbnMZzaPR7vGaeJVV77sjCCAIayIL1uIAglYey4gpIuZqeIeUFjDw+PmKhemnvBaUjTJL89j9oQ9P1qRjNvB7Myt96Uxr6EqxpXjxeYN+Ue++vSlNZcjfGVgb//YY7V0Sek/RgF3p+ECv2MWs5L3wXFjOK/belY8IJG844XTjlcGF6NEHtzED7X2gAHfUiAW5lTv7AR0R3psRXLEavsSD6E+x4Fq7BHAtt3zlgRb+wbOzhOJDzy+OK0JYRlatHrqTOvLpWJRQRrEXNbWbhi+IjZRDvcMltuQHE6cYoe7dbgPUqTVDdtqTjtOUSdiQX4WvmxlTm2TT2km/j+GPp9RZARpjmxOJx7tHbgN1Z9DodRAf6Lk/E2ywsa5mLs0nVPqSugAw87r47x7EqS+FZQyByrlw9KwhUCps8VISqMha93iHpWBxTyIeIBWMJWPSCkopxgBVdcv1RSYNaAxYFVZjcoOswd98/kIvv+BoSmSVyugBzWTikuATy3pvA66szjfBlbjXjgyEg0obxfHa2ZCR8tSJXlykx8pBNUbZHaBZG0dCepPfHpKxQUqI7guu+pK5Q/V1GXYqiVGK5grrwaSqPE4n+UFZtKYLy6Hh5r0XVAqkPcs7TTIMmpPv9UVpEB81eCoKH0t4iD3oR/cqSH+lzxp/q58ic5Lis06GeOXnRyViuPOO86KlCJaKdoa9JL/tkrK9LL9/6fzXxbncCFhEj2evv6buJvGc9zmGvz3vOMJwjvejKurGXNX1dvYu1sb6ui1FP1mRsXBeRNf2funi3mgH/j+T2BvwLm7ZyZ05pQc0AAAAASUVORK5CYII="
    }
}

const DEFAULTS = {
    anchorSize: 5,
    itemIndex: 1,
    kjOpts: [{
        value: '页面',
        label: '页面'
    }],
    prtSel: {
        printerVal: '',
        printerName: '',
        pageSize: '',
        pageOrient: ''
    },
    pageOpts: [],
    proSel: {},
    drawItems: [],
    tplCfg: {},
    tplCfg_new: {},
    tplDt: {},
    propertyFileds: [ 'kj', 'type', 'left', 'top', 'width', 'height','zIndexC',
        'fontName', 'fontSize', 'lineHeight', 'textAlign', 'verticalAlign',
        'whiteSpace', 'foreColor', 'backgroundColor', 'borderWidth', 'borderStyle',
        'borderColor', 'barFormat', 'barWidth', 'filedName', 'content']
}

export default {
    components: {
        BasicDialog
    },
    props: {
        params: Object,
        width: {
            type: Number,
            default: 1300
        },
        height: {
            type: Number,
            default: 723
        },
        visible: Boolean,
        updateVis: Function,
        handleSave: Function
    },
    data() {
        return {
            ..._.cloneDeep(DEFAULTS),
            designPage: null,
            rowsFileds:[
                { key: 'paging', name: '插入分页'},
                { key: 'stable', name: '插入统计表格'},
                { key: 'header', name: '插入页眉'},
                { key: 'footer', name: '插入页脚'},
                { key: 'text', name: '插入文本框'},
                { key: 'barcode', name: '插入条形码'},
                { key: 'qrcode', name: '插入二维码'},
                { key: 'image', name: '插入图片'},
                { key: 'html', name: '插入超文本'},
                { key: 'ellipse', name: '插入椭圆'},
                { key: 'line1', name: '插入水平直线'},
                { key: 'line2', name: '插入竖直直线'},
                { key: 'rect', name: '插入矩形'},
                { key: 'table', name: '插入表格'}
            ],
            noPrintDlgVis: false
        }
    },
    watch: {
        params (newVal) {
            console.log('newVal', newVal);
            if (this.visible) {
                this.tplCfg = this.tplCfg_new = { ..._.cloneDeep(newVal) }
                this.tplDt = jt.template.resolveContentToChinese(newVal)
                this.renderPrintItems()
            }
        }
    },
    computed: {
        // .page的内部样式
        pageStyle () {
            let td = this.tplDt || {}
            var obj = {
                width: td.width || '10cm',
                height: td.height || '10cm',
                top: td.top || '0',
                left: td.left || '0'
            }
            td.backgroundColor ? obj.backgroundColor = td.backgroundColor : ''
            td.backgroundImage ? obj.backgroundImage = 'url(' + td.backgroundImage + ')' : ''
            return obj
        }
    },
    render () {
        return (
            <div>
                <basic-dialog
                    visible={this.visible}
                    title="打印模板设计"
                    width={this.width}
                    height={this.height}
                    click-modal={false}
                    show-ft={false}
                    append-to-body={true}
                    handle-close={this.handleClose}
                    handle-closed={this.handleClosed}>
                    <div id="printTpl">
                        <table id="print_designer_table">
                            <tr>
                                <td style="height: 30px;line-height: 30px; padding: 1px;" colspan="2">
                                    <table valign="top" ref="designerToolbar" class="designer-toolbar">
                                        {this.getToolBarsTpl()}
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div
                                        class="designer"
                                        ref="designer"
                                        tabindex="0"
                                        onKeydown={(e) => this.handleKeyEvent(e)}>
                                        <div class="ruler top"></div>
                                        <div class="ruler left"></div>
                                        <div
                                            class="page"
                                            type="page"
                                            name="页面"
                                            style={this.pageStyle}
                                            ref="printDesignerPage">
                                            {this.getDrawPage()}
                                        </div>
                                    </div>
                                </td>
                                {this.getPropertiesTpl()}
                            </tr>
                        </table>
                    </div>
                </basic-dialog>
            </div>///
        )
    },
    mounted () {
        document.addEventListener('keydown', this.handleKeyEvent)
    },
    methods: {
        handleKeyEvent (event) {
            if (this.visible) {
                let pTb = document.getElementById('printTpl').getElementsByClassName('selected')[0]
                if (pTb) {
                    let tarIdx = parseInt(pTb.id.substring(12))
                    let curItem = this.drawItems[tarIdx]
                    let top_p = jt.template.convertUnit(pTb.style.top, "px")
                    let left_p = jt.template.convertUnit(pTb.style.left, "px")
                    switch (event.keyCode) {
                        //tab
                        case 9:
                        {
                            var nxPtb = null
                            if (!event.shiftKey) {
                                nxPtb = document.getElementById(pTb.id.substring(0,12) + parseInt(tarIdx + 1))
                                if (!nxPtb) {
                                    nxPtb = document.getElementById('print_table_0')
                                    if (!nxPtb) {
                                        return
                                    }
                                }
                                pTb.classList.remove('selected')
                                nxPtb.classList.add('selected')
                            }
                            this.setPropertyTb(this.drawItems[parseInt(tarIdx+1)])
                            return false
                        }
                        //上
                        case 38:
                        {
                            pTb.style.top = curItem.w_addTbSty.top = top_p - 1 + 'px'
                            break
                        }
                        //下
                        case 40:
                        {
                            pTb.style.top = curItem.w_addTbSty.top = top_p + 1 + 'px'
                            break
                        }
                        //左
                        case 37:
                        {
                            pTb.style.left = curItem.w_addTbSty.left = left_p - 1 + 'px'
                            break
                        }
                        //右
                        case 39:
                        {
                            pTb.style.left = curItem.w_addTbSty.left = left_p + 1 + 'px'
                            break
                        }
                        //删
                        case 46: 
                        {
                            if (curItem.w_addTbCls && curItem.w_addTbCls.indexOf("locked") !== -1) {
                                alert("锁定的元素不能删除")
                                return
                            }
                            this.removeDrawItem(tarIdx)
                            return
                        }
                        default : {
                            return
                        }
                    }
                    this.setPropertyTb(curItem)

                    if (event && event.preventDefault) {
                        event.preventDefault()
                    } else {
                        window.event.returnValue = false
                    }
                    return false
                }
                
            }
        },
        removeDrawItem (index) {
            _.remove(this.kjOpts, item => {
              return item.value == this.drawItems[index].type + (parseInt(index) + 1)
            })
            console.log(this.drawItems[index].type + index)
            this.drawItems.splice(index, 1)
            if (this.drawItems.length) {
                if (index === 0 && this.drawItems.length - 2 > 0) {
                    this.drawItems[this.drawItems.length - 2].w_addTbCls.push('selected')
                } else {
                    index > 2 ? this.drawItems[index - 2].w_addTbCls.push('selected') : null
                }
            }
            
        },
        //移动控件
        movePrintItem ($this, movedX, movedY) {
            if ($this.is(".locked")) {
                alert("锁定的元素不能移动")
                return
            }
            if (movedX != 0) {
                var left = parseInt($this.attr("startLeft")) + movedX;
                var minLeft = 0;
                if (left < minLeft) {
                    left = minLeft
                }
                var maxLeft = $printDesignerPage.width();
                if (left > maxLeft) {
                    left = maxLeft
                }
                $this.css(
                    {
                        left: (left - anchorSize) + 'px'
                    })
            }
            if (movedY != 0) {
                var top = jt.template.convertUnit(curItem.w_addTbSty.top, "px") + movedY
                var minTop = 0
                if (top < minTop) {
                    top = minTop
                }
                var maxTop = $printDesignerPage.height()
                if (top > maxTop) {
                    top = maxTop
                }
                $this.css(
                    {
                        top: (top - anchorSize) + 'px'
                    }
                )
            }
        },
        updateNoPrtDlgVis (vis) {
            this.noPrintDlgVis = vis
        },
        //---------打印机切换------------------------
        chgPrinters(val) {
            this.prtSel.printerName = !_.isEmpty(this.prtOpts) ? this.prtOpts[val].name : ''
            this.pageOpts = !_.isEmpty(this.prtOpts) ? this.prtOpts[val].pagelist : []
        },
        //---------设置属性------------------------
        isDisabled (field) {
            return this.disFields.indexOf(field) !== -1
        },
        // 属性更改
        handleProperties (e) {
            if (e.target && e.target.name) {
                // type=name 切换选中的物料
                // 否: 更改选中元素的样式
                let proName = e.target.name
                if (proName === "name" && e.target.value !== '页面') {
                    // 设置元素选中
                    this.delClassSel()
                    let ele = document.getElementsByClassName('print-item')
                    for (let i = 0; i < ele.length; i++) {
                        if (ele[i].getAttribute('name') === e.target.value) {
                            ele[i].classList.add('selected')
                            this.setPropertyTb(this.drawItems[ele[i].id.substring(12)])
                            return
                        }
                    }
                }
                // 切换控件
                if (proName === "name" && e.target.value === '页面') {
                    this.setPageProperty()
                    return
                }
            }
            // 事件: 颜色选择器 + 选择框 + 输入框
            if ( (!e.target && e.indexOf('#') !== -1)
                   || e.target.nodeName === 'SELECT' 
                   || e.target.nodeName === 'INPUT'
                   || e.target.nodeName === 'TEXTAREA'
                ) {
                    if (this.proSel.kj !== '页面') {
                        this.setSelPrtStyle(this.proSel)
                    } else {
                        this.setPageStyle(this.proSel)
                    }
                }
        },
        setPageProperty () {
            this.proSel = {
                kj: '页面',
                type: 'page',
                left: Math.round(jt.template.convertUnit(this.pageStyle.left, "px")),
                top: Math.round(jt.template.convertUnit(this.pageStyle.top, "px")),
                width: Math.round(jt.template.convertUnit(this.pageStyle.width, 'px')),
                height: Math.round(jt.template.convertUnit(this.pageStyle.height, 'px')),
                fontSize: 12 + 'px', //字号
                lineHeight: 18 + 'px', //行高
                foreColor: '#000000', //前景色
            }
            this.delClassSel()
        },
        // 设置page样式
        setPageStyle (confg) {
            // 设置dom
            let dom = this.$refs.printDesignerPage
            dom.style.width = confg.width + 'px'
            dom.style.height = confg.height + 'px'
            dom.style.top = confg.top + 'px'
            dom.style.left = confg.left + 'px'
        },
        // 去除选中元素样式
        delClassSel () {
            // 去除已选中
            let clas = document.querySelector('.page table.selected')
            if (clas && clas.classList.length) {
                clas.classList.remove('selected')
            }
        },
        // propertise 更改，修改画布元素值
        setSelPrtStyle (confg) {
            // 过滤不可用属性
            for (let key in confg) {
                if (confg.hasOwnProperty(key) && !confg[key]) delete confg[key]
            }
            let fmt = this.fmtRespPrtItem(confg)
            fmt.w_addTbCls.push('selected') // 单独拉出来--fmtRespPrtItem 无法确认选中哪个
            let el = document.querySelector('.page table.selected')
            let idx = [].indexOf.call(el.parentElement.children, el)
            this.drawItems.splice(idx, 1, fmt)
        },
        // 设置打印元素属性值
        setPropertyTb (cfg) {
            let fmt = {
                kj: cfg.w_attrs.name || '页面',
                type: cfg.type || 'text',
                zIndexC: cfg.zIndex,
                left: jt.template.convertUnit(cfg.w_addTbSty.left, "px"),
                top: jt.template.convertUnit(cfg.w_addTbSty.top, "px"),
                width: jt.template.convertUnit(cfg.w_contSty.width, "px"),
                height: jt.template.convertUnit(cfg.w_contSty.height, "px"),

                fontName: cfg.w_spanSty['font-family'], //字体
                fontSize: cfg.w_spanSty['font-size'] || 12, //字号
                lineHeight: cfg.w_spanSty['line-height'] || 18 + 'px', //行高
                whiteSpace: cfg.w_spanSty['white-space'] || '', // 空白换行
                textAlign: cfg.w_spanSty['text-align'] || '', //水平对齐
                verticalAlign: cfg.w_spanSty['vertical-align'] || '', //垂直对齐
                foreColor: cfg.w_spanSty.color || '#000', //前景色
                backgroundColor: cfg.w_spanSty["background-color"] ? jt.template.rgbColorToHex(cfg.w_spanSty["background-color"]) : '', //背景色
                zIndex: cfg.zIndex,
                filedName: cfg.w_attrs.content || '',
                content: cfg.w_attrs.content || ''
            }
            if (cfg.w_addTbCls.indexOf('rect') !== -1 || cfg.w_addTbCls.indexOf('ellipse') !== -1) {
                fmt.borderWidth = cfg.w_spanSty["border-width"] || ''
                fmt.borderStyle = cfg.w_spanSty["border-style"] || ''
                fmt.borderColor = cfg.w_spanSty["border-color"] || ''
            } else {
                this.disFields = FIELDS_DIS['borderLine']
            }

            if (cfg.w_addTbCls.indexOf('barcode') !== -1) {
                fmt.barFormat = cfg.w_attrs['barcode-format'] || 'code128'
                fmt.barWidth = cfg.w_attrs['barcode-width'] || ''
            } else {
                fmt.barFormat = ''
                this.disFields = this.disFields.concat(FIELDS_DIS['barcode'])
            }

            this.proSel = { ...this.proSel, ...fmt }

            // console.log('======>当前元素属性值', this.proSel)
        },
        getPos (ev, ele) {
            return { x: ev.clientX - ele.offsetLeft, y: ev.clientY - ele.offsetTop };
        },
        // 插入初始化
        addItem (type, direct) {
            let addObj = null
            switch (type) {
                case "text":
                    {
                        addObj = ADD_PRINT_DEFAULTS.TEXT_ADD
                        break;
                    }
                case "paging":
                    {
                        addObj = ADD_PRINT_DEFAULTS.PAGE_ADD
                        break;
                    }
                case "header":
                    {
                        addObj = ADD_PRINT_DEFAULTS.HEADER_ADD
                        break;
                    }
                case "footer":
                    {
                        addObj = ADD_PRINT_DEFAULTS.FOOTER_ADD
                        break;
                    }
                case "barcode":
                    {
                        addObj = ADD_PRINT_DEFAULTS.BARCODE_ADD
                        break;
                    }
                case "qrcode":
                    {
                        addObj = ADD_PRINT_DEFAULTS.QRCODE_ADD
                        break;
                    }
                case "rect":
                    {
                        addObj = ADD_PRINT_DEFAULTS.RECT_ADD
                        break;
                    }
                case "ellipse":
                    {
                        addObj = ADD_PRINT_DEFAULTS.ELLIPSE_ADD
                        break;
                    }
                case "line":
                    {
                        addObj = direct == 'h' ? ADD_PRINT_DEFAULTS.LINE_H_ADD : ADD_PRINT_DEFAULTS.LINE_V_ADD
                        break;
                    }
                case "html":
                    {
                        addObj = ADD_PRINT_DEFAULTS.HTML_ADD
                        break;
                    }
                case "table":
                    {
                        addObj = ADD_PRINT_DEFAULTS.TABLE_ADD
                        break;
                    }
                case "stable":
                    {
                        addObj = ADD_PRINT_DEFAULTS.STABLE_ADD
                        break;
                    }
                case "image":
                    {
                        addObj = ADD_PRINT_DEFAULTS.IMAGE_ADD
                        break;
                    }
            }
            addObj.zIndex = this.drawItems.length
            this.appendPrintItem(addObj)
        },
        // 插入绘制
        appendPrintItem (config) {
            let _this_ = this
            this.delClassSel()

            let prtObj = this.fmtRespPrtItem(config)
            // 选中新插入元素
            prtObj.w_addTbCls.push('selected')

            this.drawItems.push(prtObj)

            let idx = prtObj.type + parseInt(this.drawItems.length)
            this.kjOpts.push({ value: idx, label: idx })

            //TODO DOM加载后才初始化条形码 异步延时hack
            if (prtObj.type == 'barcode') {
                window.setTimeout(() => {
                    debugger
                    let elem = document.getElementById('barcode_img' + parseInt(_this_.drawItems.length == 0 ? 1 : _this_.drawItems.length))
                    JsBarcode(elem, ' ', {
                        format: "code128",
                        displayValue: false
                    })
                }, 30)
            }
            if (prtObj.type == 'qrcode') {
                prtObj.w_attrs["barcode-format"] = 'code128'
                window.setTimeout(() => {
                    // 获取页面的canvas
                    let ele2 = document.getElementById('qrcode_img' + parseInt(_this_.drawItems.length == 0 ? 1 : _this_.drawItems.length))
                    // 将数据画到（canvas）上
                    QRCode.toCanvas(ele2, ' ', error => {
                        console.log(error)
                    })
                }, 30)
            }
            this.setPropertyTb(prtObj)

            console.log('======>当前插入对象', prtObj)
            console.log('======>当前画板items', this.drawItems)
        },
        // 格式化返回的模板对象
        fmtRespPrtItem (cf) {
            /*w_addTbCls   table.print-item的class
            w_addTbSty   table.print-item的样式
            w_attrs      table.print-item的属性值
            w_contSty    table td.content 的样式
            w_spanSty       $span td.content 内部span的样式
            w_spanTxt        $span td.content 内部span的内容
            w_spanHtml

            var $printPage = this.refs.printDesignerPage
            var $newItem = this.refs.printDesignerPage.refs['table']*/

            let extSome = {
                w_addTbCls: [], // table内联样式 绘制的元素dom
                w_addTbSty: {},
                w_contSty: {}, // content内联样式 内容区dom
                w_spanSty: {},
                w_attrs: {}
            }

            let obj = { ...cf, ...extSome }

            let wd = cf.width
            if (wd) {
                if (typeof wd === "string" && wd.indexOf('%') !== -1) {
                    obj.w_contSty.width = this.pageStyle.style.width * parseFloat(wd.substr(0, wd.length - 1)) / 100
                } else {
                    obj.w_contSty.width = wd + 'px'
                }
            }
            let ht = cf.height
            if (ht) {
                if (typeof ht === "string" && ht.indexOf('%') !== -1) {
                    obj.w_contSty.height = this.pageStyle.style.height * parseFloat(ht.substr(0, ht.length - 1)) / 100
                } else {
                    obj.w_contSty.height = ht + 'px'
                }
            }
            obj.top = obj.w_addTbSty.top = cf.top ? jt.template.getLengthWithUnit(jt.template.convertUnit(cf.top, "px")) : 0
            obj.left = obj.w_addTbSty.left = cf.left ? jt.template.getLengthWithUnit(jt.template.convertUnit(cf.left, "px")) : 0

            cf.locked ? obj.w_addTbCls.push("locked") : ''
            cf.printAlways ? obj.w_attrs['printAlways'] = cf.printAlways : ''

            let __colrs__ = {}
            if (cf.backgroundColor) {
                __colrs__['background-color'] = cf.backgroundColor
            }
            if (cf.foreColor) {
                __colrs__['color'] = cf.foreColor
            }
            obj.w_spanSty = { ...obj.w_spanSty, ...__colrs__ }

            obj.w_attrs.type = cf.type
            obj.w_attrs.name = cf.type + parseInt(obj.zIndex + 1)
            switch (cf.type) {
                case "QRCode":
                case "qrcode":
                    obj.w_addTbCls.push("qrcode")
                    let __ext_qr__ = {
                        type: 'qrcode',
                        content: cf.content,
                        "barcode-format": 'qrcode',
                    }
                    if (!_.isEmpty(cf.hasIntercept)) {
                        let intc = {
                            hasIntercept: cf.hasIntercept,
                            subStringIndex: cf.subStringIndex,
                            subStringLength: cf.subStringLength
                        }
                        __ext_qr__ = { ...__ext_qr__, ...intc }
                    }
                    obj.w_attrs = { ...obj.w_attrs, ...__ext_qr__ }

                    // 插入二维码 TODO ？？？？
                    /*$span.empty().qrcode({
                        render: "canvas",
                        width: width,
                        height: height,
                        text: toUtf8(cf.content)
                    });*/

                    obj.w_spanSty['overflow'] = "hidden"

                    break;
                case "barcode":
                case "BarCode":
                    obj.w_addTbCls.push("barcode")

                    let barWidth = cf.barWidth || 1;
                    let codeFormat = cf.format || "code128";

                    let __ext_bar__ = {
                        type: 'barcode',
                        content: cf.content,
                        "barcode-format": codeFormat,
                        "bar-width": barWidth
                    }
                    if (!_.isEmpty(cf.hasIntercept)) {
                        let intc = {
                            hasIntercept: cf.hasIntercept,
                            subStringIndex: cf.subStringIndex,
                            subStringLength: cf.subStringLength
                        }
                        __ext_bar__ = { ...__ext_bar__, ...intc }
                    }
                    obj.w_attrs = { ...obj.w_attrs, ...__ext_bar__ }
                    
                    // 绘制二维码 配置项 TODO
                    let barCfg = {
                        format: codeFormat,
                        barWidth: barWidth,
                        barHeight: cf.height,
                        showHRI: false
                    }
                    if (cf.foreColor) {
                        barCfg.color = cf.foreColor
                    }
                    if (cf.backgroundColor) {
                        barCfg.bgColor = cf.backgroundColor
                    }
                    //dom还未生成，没办法插入元素
                    //$span.empty().barcode("1234567890", codeFormat, barcodecf);

                    let newBarWd = jt.template.convertUnit(obj.w_contSty.width, 'px') / obj.w_spanSty.width
                    let __ext__span__ = {
                      zoom: newBarWd,
                      "transform-origin": "left top",
                      transform: "scale(" + newBarWd + ")"
                    }
                    obj.w_spanSty = { ...obj.w_spanSty, ...__ext__span__ }

                    break;
                case "line":
                    obj.w_addTbCls.push(cf.type)
                    let __oth__ = {}
                    if (cf.orient == "v") {
                        obj.w_addTbCls.push("v")
                        if (cf.length) {
                            __oth__.height = cf.length + 'px'
                        }
                        if (cf.lineWidth) {
                            __oth__.width = cf.lineWidth + 'px'
                        }
                    } else {
                        obj.w_addTbCls.push("h")
                        if (cf.length) {
                            __oth__.width = cf.length + 'px'
                        }
                        if (cf.lineWidth) {
                            __oth__.height = cf.lineWidth + 'px'
                        }
                    }
                    obj.w_contSty = { ...obj.w_contSty, ...__oth__ }

                    if (!cf.backgroundColor) {
                        obj.w_spanSty['background-color'] = "#000000"
                    }
                    break;
                case "rect":
                case "ellipse":
                    obj.w_addTbCls.push(cf.type)
                    if (!_.isEmpty(cf.border)) {
                        let bwpx = cf.border.width || '1px'
                        let bw = jt.template.convertUnit(bwpx, 'px')
                        let __ext__ = {
                            'border-width': bw + 'px',
                            'border-color': cf.border.color || "#000",
                            'border-style': cf.border.style || cf.borderStyle || "solid",
                            width: jt.template.convertUnit(obj.w_contSty.width, 'px') - bw * 2 + 'px',
                            height: jt.template.convertUnit(obj.w_contSty.height, 'px') - bw * 2 + 'px'
                        }
                        if (cf.type === 'ellipse') {
                            __ext__['border-radius'] = '50%'
                        }
                        obj.w_spanSty = { ...obj.w_spanSty, ...__ext__ }
                    }
                    break;
                case "image":
                    obj.w_addTbCls.push(cf.type)
                    obj.w_attrs.content = cf.content

                    let __ot_image__ = {
                        "background-image": "url(" + cf.content + ")",
                        "background-repeat": cf.backgroundRepeat || 'no-repeat',
                        "background-size": cf.backgroundSize || '100% 100%'
                    }
                    obj.w_spanSty = { ...obj.w_spanSty, ...__ot_image__ }
                    break
                case "html":
                case "stable":
                case "header":
                case "footer":
                    obj.w_addTbCls.push('html')
                    obj.w_attrs['content'] = cf.content
                    obj.w_spanHtml = cf.content
                case "paging":
                default:
                    obj.w_attrs.type = cf.type === 'paging' ? 'paging' : 'text'
                    obj.w_attrs.content = cf.content
                    obj.w_addTbCls.push("text")
                    // 模板有的元素没有设置宽高  默认 TODO
                    if (!obj.w_contSty.width) {
                        obj.w_contSty.width = cf.content.length * 14 + 'px'
                    }
                    if (!obj.w_contSty.height) {
                        obj.w_contSty.height = 18 + 'px'
                    }
                    
                    obj.w_spanTxt = cf.content
                    let __ex_txt__ = {}
                    if (cf.fontName) {
                        __ex_txt__["font-family"] = cf.fontName
                    }
                    if (cf.fontSize) {
                        if (cf.fontSize && (cf.fontSize.toString().indexOf('px') !== -1 || cf.fontSize.toString().indexOf('pt') !== -1)) {
                            __ex_txt__["font-size"] = cf.fontSize
                        } else {
                            __ex_txt__["font-size"] = (cf.fontSize || 12) + 'pt'
                        }
                    }
                    if (cf.lineHeight) {
                        __ex_txt__["line-height"] = jt.template.getLengthWithUnit(cf.lineHeight)
                    }
                    if (cf.whiteSpace) {
                        __ex_txt__["white-space"] = cf.whiteSpace
                    }
                    if (cf.textAlign) {
                        __ex_txt__["text-align"] = cf.textAlign
                    }
                    if (cf.verticalAlign) {
                        __ex_txt__["vertical-align"] = cf.verticalAlign
                    }
                    obj.w_spanSty = { ...obj.w_spanSty, ...__ex_txt__ }

                    //设置属性干嘛用
                    if (!_.isEmpty(cf.hasIntercept)) {
                        let intc = {
                            hasIntercept: cf.hasIntercept,
                            subStringIndex: cf.subStringIndex,
                            subStringLength: cf.subStringLength
                        }
                        obj.w_attrs = { ...obj.w_attrs, ...intc }
                    }
                    break
            }
            return obj
        },
        // 生成打印模板对象
        createPrtTpl () {
            let tmp = this.$refs.printDesignerPage
            return {
                printerName: this.prtSel.printerName,//打印机名称
                pageSize: this.prtSel.pageSize,//纸张名称
                pageOrient: this.prtSel.pageOrient,  //纸张方向
                top: jt.template.convertUnit(tmp.style.top, "cm").toFixed(2) + "cm",
                left: jt.template.convertUnit(tmp.style.left, "cm").toFixed(2) + "cm",
                width: jt.template.convertUnit(tmp.style.width, "cm").toFixed(2) + "cm",
                height: jt.template.convertUnit(tmp.style.height, "cm").toFixed(2) + "cm",
                backgroundColor: jt.template.rgbColorToHex(tmp.style["background-color"]),
                items: this.createPrtItems()
            }
        },
        createPrtItems () {
            let prtItems = []
            this.drawItems.forEach((item, index) => {
                let fmtItem = this.fmtReqPrtItem(item)
                fmtItem = _.omit(fmtItem, ['w_addTbCls', 'w_contSty', 'w_spanSty', 'w_spanTxt', 'w_attrs', 'w_addTbSty'])

                let obj = CNST.PRINT_ENUMS.wayBillTemplate.master
                let mc = fmtItem.content
                let reg = /^\@\{[\w\W|\u4e00-\u9fa5]+\}$/;
                //只对@{...}格式的字段处理
                if (!_.isEmpty(mc) && reg.test(mc)) {
                    let filedName = this.getFieldFromContent(fmtItem.content);
                    if (!_.isEmpty(filedName)) {
                        let mval = jt.template.getValueOfObject(obj, filedName);
                        if (!_.isEmpty(mval)) {
                            fmtItem.content = "@{" + mval + "}";
                        }
                    }
                }
                prtItems.push(fmtItem)
            })
            return prtItems
        },
        fmtReqPrtItem (obj) {
            let rslt = {
                type: obj.type,
                top: jt.template.convertUnit(obj.w_addTbSty.top, 'px'),
                left: jt.template.convertUnit(obj.w_addTbSty.left, 'px'),
                width: jt.template.convertUnit(obj.w_contSty.width, 'px'),
                height: jt.template.convertUnit(obj.w_contSty.height, 'px'),

                foreColor: obj.w_spanSty["color"] ? jt.template.rgbColorToHex(obj.w_spanSty["color"]) : '#000000',
                backgroundColor: obj.w_spanSty["background-color"] ? jt.template.rgbColorToHex(obj.w_spanSty["background-color"]) : '',
                content: obj.w_attrs.content,
                hasIntercept: obj.w_attrs.hasIntercept,
                subStringIndex: obj.w_attrs.subStringIndex,
                subStringLength: obj.w_attrs.subStringLength,
                printAlways: obj.w_attrs.printAlways
            };
            switch (rslt.type) {
                case "line": {
                    rslt.lineStyle = "solid";
                    if (obj.w_addTbCls.indexOf('v')) {
                        rslt.orient = "v"
                        rslt.lineWidth = rslt.width
                        rslt.length = rslt.height
                    }
                    else {
                        rslt.orient = "h"
                        rslt.lineWidth = rslt.height
                        rslt.length = rslt.width
                    }
                    break
                }
                case "rect":
                case "ellipse": {
                    rslt.border = {
                        width: obj.w_spanSty["border-width"],
                        style: obj.w_spanSty["border-style"],
                        color: obj.w_spanSty["border-color"] || '#000000'
                    };
                    break
                }
                case "image": {
                    break
                }
                case "barcode": {
                    rslt.format = obj.w_attrs["barcode-format"]
                    rslt.barWidth = obj.w_attrs["bar-width"]
                    break
                }
                case "qrcode": {
                    break
                }
                case "text":
                default : {
                    rslt.fontName = obj.w_spanSty["font-family"]
                    let fontSize = obj.w_attrs["font-size"] || ''
                    if (!fontSize) {
                        fontSize = obj.w_spanSty["font-size"]
                    }
                    rslt.fontSize = jt.template.convertUnit(fontSize || 12, 'pt')
                    rslt.lineHeight = obj.w_spanSty["line-height"]
                    rslt.whiteSpace = obj.w_spanSty["white-space"]
                    rslt.textAlign = obj.w_spanSty["text-align"]
                    rslt.verticalAlign = obj.w_spanSty["vertical-align"]
                    break
                }
            }
            return rslt
        },
        getFieldFromContent(cont) {
            let rslt = cont
            //正则表达式，匹配以@{开头和以}结尾的字符串
            let reg = /^\@\{[\w\W|\u4e00-\u9fa5]+\}$/
            if (!_.isEmpty(cont) && reg.test(cont)) {
                let strStart = cont.indexOf("{") + 1
                let strEnd = cont.lastIndexOf("}")
                rslt = cont.substring(strStart, strEnd)
                if (_.isEmpty(rslt)) {
                    return cont
                }
            }
            return rslt
        },
        // 生成最新设计的模板对象
        creNewPrintItems () {
            // 追加新插入的元素
            this.drawItems.forEach((item, index) => {
                const newItem = _.omit(item, ['w_addTbCls', 'w_contSty', 'w_spanSty', 'w_spanTxt', 'w_attrs', 'w_addTbSty'])
                this.tplCfg_new.items.push(newItem)
            })
            jt.template.resolveContentToEnglish(this.tplCfg_new)
        },
        getTmpCode () {
            // 弹窗 显示模板代码文本 TODO
            let code = '111111111'
            this.$alert("<textarea rows='6' cols='50' readonly='readonly'>" + code + "</textarea>", '模版代码', {
                dangerouslyUseHTMLString: true
            })
        },
        layout (derct) {
            switch (derct) {
                case 'up':
                    if (this.proSel.zIndexC < this.drawItems.length) {
                        this.proSel.zIndexC ++
                    }
                    this.setPrintItemStyle('up')
                    break
                case 'down':
                    if (this.proSel.zIndexC > 0) {
                        this.proSel.zIndexC --
                    }
                    this.setPrintItemStyle('down')
                    break
                default:
                    break
            }
        },
        // 处理单个元素的样式
        setPrintItemStyle (derct) {
            let selIndex = parseInt(this.proSel.kj.slice(this.drawItems.length >= 10 ? -2 : -1)) - 1
            /*if (derct === 'up') {
                this.drawItems.splice(selIndex, 1, ...this.drawItems.splice(selIndex + 1, 1, this.drawItems[selIndex]))
            } else if (derct === 'down') {

            }*/
        },
        // TODO 重新绘制
        redraw () {
            var items = this.drawItems
            this.drawItems = []
            for (var j = 0; j < items.length; j++) {
                this.appendPrintItem(items[j])
            }
        },
        // 先选择图片
        selectBackgroundImage () {
            let prefix = process.env.VUE_APP_PUBLIC_PATH + (process.env.NODE_ENV === 'production' ? '/' : '') + 'print/imgs/waybill/'
            let __this__ = this
            let imageArr = [
                prefix + "SF.png",
                prefix + "SF-1.jpg",
                prefix + "YSKD.jpg",
                prefix + "YTO.png",
                prefix + "DBKD.png",
                prefix + "DBKD-1.jpg",
                prefix + "STO.png",
                prefix + "STO-1.jpg",
                prefix + "LT.jpg",
                prefix + "ZTO.jpg",
                prefix + "ANKD.jpg",
                prefix + "ANWL.jpg",
                prefix + "DDWL.png",
                prefix + "YDKD.jpg",
                prefix + "EMS.jpg"
            ];
            //弹出框选择图片 //设置选中的图片
            let bg_Id = "print_designerSelectWin" + new Date().getTime();
            let choose_bg_tpl = '<div>' +
                '<div id="' + bg_Id + '" class="basic-info print_div_mask" >' +
                '<table style="margin-top: 10px;width: 100%;font-size:14px;">' +
                '<tr style="height: 25px;">' +
                '<td style="text-align: right;width: 25%;">' +
                '<span class="mod_span">运单背景：</span>' +
                '</td>' +
                '<td style="text-align: left;">' +
                '<select name="select_template" onchange="">' +
                '<option value="" hidden>请选择</option>';

            imageArr.forEach((i, n) => {
                choose_bg_tpl += '<option value="' + n + '" >' + i + '</option>';
            })
            choose_bg_tpl += '</select>' + '</td>' + '</tr>' + '</table>' + ' </div>' + '</div>';
            let printerTemplate = choose_bg_tpl
            this.$confirm(printerTemplate,'选择运单图片', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                let myselect = document.getElementById(bg_Id).getElementsByTagName('select')[0]
                __this__.setBackgroundImage(myselect.options[myselect.selectedIndex].text)
            }).catch(action => {
                this.$message({ type: 'info', message: '取消设置' })
            });
        },
        // 设置背景图片
        setBackgroundImage (url) {
            this.$refs.printDesignerPage.style["background-image"] = 'url(' + url + ')';
        },
        //清除背景图片
        clearBackgroundImage () {
            this.$refs.printDesignerPage.style["background-image"] = '';
        },
        //清空画布
        clearItems () {
            this.drawItems = []
            this.tplCfg_new.items = []
            this.kjOpts = [{ value: '页面', label: '页面' }]
        },

        // 拖拽
        dragItem (e) {
            let __this__ = this
            let oEv = e || event
            let pTb = jt.template.closest(oEv.target, 'table')
            if (pTb.classList.value.indexOf('print-item') === -1) {
                pTb = jt.template.closest(pTb.parentNode, 'table')
            }
            if (pTb.parentNode.getElementsByClassName('selected')[0]) {
                pTb.parentNode.getElementsByClassName('selected')[0].classList.remove('selected')
            }
            
            pTb.classList.add('selected')
            
            // tl add start
            let tarId = pTb.id
            //获取bind data
            let curItem = this.drawItems[tarId.substring(12)]

            let disX = oEv.clientX - pTb.offsetLeft
            let disY = oEv.clientY - pTb.offsetTop
            document.body.onmousemove = function(e) {
                let oEv = e || event
                pTb.style.left = curItem.w_addTbSty.left = oEv.clientX - disX + "px"
                pTb.style.top = curItem.w_addTbSty.top = oEv.clientY - disY + "px"

                __this__.proSel.left = oEv.clientX - disX + 5
                __this__.proSel.top = oEv.clientY - disY + 5
            }
            document.body.onmouseup = function() {
                document.body.onmousemove = null
                document.body.onmouseup = null
                
                __this__.setPropertyTb(curItem)
                __this__.drawItems.splice(tarId.substring(12), 1, curItem)
            }
            oEv.preventDefault && oEv.preventDefault()
            return false
        },
        // 改变大小
        resizeItem (e) {
            let __this__ = this
            let oEv = e || event
            if (oEv.target.classList.contains("resize")) {
                let pTb = jt.template.closest(oEv.target, 'table')
                let tarId = pTb.id;
                // 获取 bind data
                let curItem = __this__.drawItems[tarId.substring(12)];

                // 设置选中
                pTb.parentNode.getElementsByClassName('selected')[0].classList.remove('selected')
                pTb.classList.add('selected')

                pTb.startMouseX =  oEv.pageX
                pTb.startMouseY = oEv.pageY
                pTb.startLeft = parseInt(pTb.offsetLeft, 10) + this.anchorSize
                pTb.startTop = parseInt(pTb.offsetTop, 10) + this.anchorSize

                // 原始table大小
                pTb.startWidth = this.$refs[tarId].clientWidth
                pTb.startHeight = this.$refs[tarId].clientHeight
                // 设置是否可移动
                pTb.moved = true
                oEv.stopPropagation()

                // 根据点击的位置不同,决定长宽的调整正负
                let x = 0, y = 0
                if (oEv.target.classList.contains("n")) {
                    x = 0, y = -1
                } else if (oEv.target.classList.contains("s")) {
                    x = 0, y = 1
                }else if(oEv.target.classList.contains("w")){
                    x = -1, y = 0
                }else if(oEv.target.classList.contains("e")){
                    x = 1, y = 0
                }else if(oEv.target.classList.contains("se")){
                    x = 1, y = 1
                }else if(oEv.target.classList.contains("sw")){
                    x = -1, y = 1
                }else if(oEv.target.classList.contains("ne")){
                    x = 1, y = -1
                }else if(oEv.target.classList.contains("nw")){
                    x = -1, y = -1
                }
                // 通过全局拖动时间来调整大小
                document.body.onmousemove = function(ev) {
                    let aEvent = ev || event
                    if (!pTb.startWidth) {
                        pTb.startWidth = __this__.$refs[tarId].clientWidth || 1
                    }
                    if (!pTb.startHeight) {
                        pTb.startHeight = __this__.$refs[tarId].clientHeight || 1
                    }

                    // 判断是否可以调整大小
                    if (!pTb.moved) {
                        return false;
                    }

                    let movedX = (aEvent.pageX - parseInt(pTb.startMouseX));
                    let movedY = (aEvent.pageY - parseInt(pTb.startMouseY));

                    if (x!=0) {
                        let afWd = parseInt(pTb.startWidth, 10) + x * movedX 
                        if (afWd < 11) {
                            afWd = 11
                        }
                        pTb.style.width = afWd
                        __this__.$refs[tarId].style.width = afWd - 12 + 'px'
                        __this__.$refs[tarId].firstChild.style.width = curItem.w_contSty.width = afWd - 14 + 'px'

                        __this__.proSel.width = afWd - 14
                    }
                    if (y!=0) {
                        let afHt =  parseInt(pTb.startHeight, 10) + y * movedY;
                        if (afHt < 11) {
                            afHt = 11
                        }
                        pTb.style.height = afHt
                        __this__.$refs[tarId].style.height = afHt - 12 + 'px'
                        __this__.$refs[tarId].firstChild.style.height = curItem.w_contSty.height = afHt - 14 + 'px'

                        __this__.proSel.height = afHt - 14
                    }
                    // 需要调整元素的位置来保持元素显示效果
                    if (pTb.locked) {
                        alert("锁定的元素不能移动")
                        return
                    }
                    if (x < 0 && movedX != 0) {
                        let left = parseInt(pTb.startLeft) + movedX
                        let minLeft = 0;
                        if (left < minLeft) {
                            left = minLeft
                        }
                        curItem.w_addTbSty.left = left + 'px'
                        pTb.style.left = left + 'px'
                    }
                    if ( y < 0 && movedY != 0) {
                        let top = parseInt(pTb.startTop) + movedY
                        let minTop = 0
                        if (top < minTop) {
                            top = minTop
                        }
                        curItem.w_addTbSty.top = top + 'px'
                        pTb.style.top = top + 'px'
                    }
                    return false
                }
                //完成调整
                document.body.onmouseup = function() {
                    document.body.onmousemove = null
                    document.body.onmouseup = null
                    pTb.moved = false

                    __this__.setPropertyTb(curItem)
                    __this__.drawItems.splice(tarId.substring(12), 1, curItem)
                }
                return false
            }
        },
        handleOk () {
            let rslt = this.createPrtTpl()
            if (_.isEmpty(rslt)) {
                this.$message.error('设计模板为空哦')
                return
            }
            this.handleSave(rslt)
            this.updateVis(false)
        },
        // flg 1预览 2打印
        doPrint (flg, event) {
            let prtObj = jt.template.resolveContentToEnglish(this.createPrtTpl())
            prtObj.orient = 0
            let printType = ''
            if (flg == '1') {
                if (event.ctrlKey) {
                    printType = "design"
                } else if (event.shiftKey) {
                    printType = "setup"
                } else {
                    printType = "preview"
                }
            } else {
                printType = "print"
            }
            if (!printService.isSupClodp()) {
                alert("未配置任何打印服务组件")
                return
            }
            printService.doprint({
                documentName: "demo" + new Date().getTime(),
                filedNameMap: "",
                printType: printType,
                template: prtObj,
                printerName: this.prtSel.printerVal,
                data: [{}]
            })
        },
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            const defaults = _.cloneDeep(DEFAULTS)
            for (let key in defaults) {
                this[key] = defaults[key]
            }
        },
        getToolBarsTpl () {
            return (
                <tr>
                    <td valign="top" style="width:410px;">
                        {
                            this.rowsFileds.slice(4,14).map((item, index) => {
                                if (item.key === 'line1') {
                                    return (
                                        <a href="javascript:;" class="btn add-item mg_l" type="line" on-click={() => this.addItem('line', 'h')}>{item.name}</a>
                                    )///
                                } else if (item.key === 'line2') {
                                    return (
                                        <a href="javascript:;" class="btn add-item mg_l" type="line" on-click={() => this.addItem('line', 'v')}>{item.name}</a>
                                    )///
                                } else {
                                    return (
                                        <a href="javascript:;" class="btn add-item mg_l" type={item.key} on-click={() => this.addItem(item.key)}>{item.name}</a>
                                    )///
                                }
                            })
                        }
                    </td>
                    <td valign="top" style="width:84px">
                        {
                            this.rowsFileds.slice(0,2).map((item, index) => {
                                return (
                                    <a href="javascript:;" class="btn add-item" type={item.key} on-click={() => this.addItem(item.key)}>{item.name}</a>
                                )///
                            })
                        }
                    </td>
                    <td valign="top" style="width:84px">
                        {
                            this.rowsFileds.slice(2,4).map((item, index) => {
                                return (
                                    <a href="javascript:;" class="btn add-item" type={item.key} on-click={() => this.addItem(item.key)}>{item.name}</a>
                                )
                            })
                        }
                    </td>
                    <td valign="top">
                        <a href="javascript:void(0)" class="btn" on-click={() => this.selectBackgroundImage()}>加载背景图片</a>
                        <br />
                        <a href="javascript:void(0)" class="btn" on-click={() => this.clearBackgroundImage()}>清除背景图片</a>
                    </td>
                    <td valign="top">
                        <a href="javascript:void(0)" class="btn clear-all mg_l" style="width: 45px;" on-click={() => this.clearItems()}>清空</a>
                        <a href="javascript:void(0)" class="btn re-draw" style="width: 45px; " on-click={() => this.redraw}>重绘</a>
                        <br />
                        <a href="javascript:void(0)" class="btn get-template-code" style="width: 94px;" on-click={() => this.getTmpCode()}>获取模版代码</a>
                    </td>
                    <td>
                        <label>指定打印机：
                            <el-select size="mini" class="printers" style="width: 200px;" v-model={this.prtSel.printerVal} on-change={this.chgPrinters} placeholder="请选择打印机">
                                {
                                    this.prtOpts.map((item,key) => {
                                        return (
                                            <el-option key={key} label={item.name} value={key}/>
                                        )
                                    })
                                }
                            </el-select>
                        </label>
                        <br />
                        <label>纸张：
                            <el-select size="mini" class="pageSizes" style="width: 100px;" v-model={this.prtSel.pageSize} placeholder="纸张尺寸">
                                {
                                    this.pageOpts.map((item, key) => {
                                        return (
                                            <el-option key={key} label={item.name} value={item.name}/>
                                        )
                                    })
                                }
                            </el-select>
                        </label>
                        <label>方向：
                            <el-select size="mini" class="pageOrients" style="width: 100px;" v-model={this.prtSel.pageOrient} placeholder="纸张方向">
                                <el-option value="1" label="纵向"></el-option>
                                <el-option value="2" label="横向"></el-option>
                                <el-option value="3" label="纵向，高度自适应"></el-option>
                                <el-option value="0" label="打印机缺省设置"></el-option>
                            </el-select>
                        </label>
                    </td>
                    <td valign="top">
                        <a href="javascript:void(0)" class="btn do-print-preview" on-click={(event) => this.doPrint(1,event)}>打印预览</a>
                        <br />
                        <a href="javascript:void(0)" class="btn do-print" on-click={() => this.doPrint(2)}>直接打印</a>
                    </td>
                    <td valign="top">
                        <a href="javascript:void(0)" class="btn do-save" id="printDesignerBtnSaveId" on-click={() => this.handleOk()}>保存</a>
                        <br />
                        <a href="javascript:void(0)" class="btn do-close" id="printDesignerBtnCloseId" on-click={() => this.handleClose()}>关闭</a>
                    </td>
                </tr>
            )
        },
        getDrawPage () {
            if (this.drawItems.length > 0) {
                return (
                    this.drawItems.map((item, index) => {
                        return (
                            <table
                                id={'print_table_'+index}
                                ref={'print_table_'+index}
                                name={item.type+parseInt(index+1)}
                                class="print-item"
                                class={'print-item '+item.w_addTbCls.join(' ')}
                                type={item.type}
                                content={item.content}
                                style={item.w_addTbSty}>
                                <tbody on-mousedown={(e) => this.resizeItem(e)}>
                                    {this.insertTrCont_1(item)}
                                    {this.insertTrCont_2(item, index)}
                                    {this.insertTrCont_3(item)}
                                </tbody>
                            </table>
                        )
                    })
                )
            } else {
                return (
                    <table class="print-item">
                        <tr>
                            <td class="resize nw">&nbsp;</td>
                            <td class="resize n"></td>
                            <td class="resize ne">&nbsp;</td>
                        </tr>
                        <tr>
                            <td class="resize w"></td>
                            <td class="move content" on-mousedown={() => this.dragItem()}></td>
                            <td class="resize e"></td>
                        </tr>
                        <tr>
                            <td class="resize sw">&nbsp;</td>
                            <td class="resize s"></td>
                            <td class="resize se">&nbsp;</td>
                        </tr>
                    </table>
                )
            }
        },
        initEvent () {
            
        },
        insertTrCont_1 (item) {
            if (item.orient === 'v') {
                return (
                    <tr>
                        <td class={ 'resize ' + (item.type !== 'line' ? 'nw' : 'n') }>&nbsp;</td>
                        <td class={ item.type != 'line' ? 'resize' : 'n' }></td>
                        <td class={ 'resize ' + (item.type != 'line' ? 'ne' : 'n') }>&nbsp;</td>
                    </tr>
                )
            } else if (item.orient == 'h') {
                return (
                    <tr>
                        <td class={ 'resize ' + (item.type != 'line' ? 'nw' : 'w') }>&nbsp;</td>
                        <td class="resize n"></td>
                        <td class={ 'resize ' + (item.type != 'line' ? 'ne' : 'e') }>&nbsp;</td>
                    </tr>
                )
            } else {
                return (
                    <tr>
                        <td class="resize nw">&nbsp;</td>
                        <td class="resize n"></td>
                        <td class="resize ne">&nbsp;</td>
                    </tr>
                )
            }
        },
        insertTrCont_2 (item, index) {
            if (item.orient == 'h') {
                return (
                    <tr>
                        <td class={item.type != 'line' ? 'resize w' : ''}></td>
                        <td class="move content" ref={'print_table_'+index} style={item.w_contSty} on-mousedown={() => this.dragItem()}>
                            {this.drawItem(item,index)}
                        </td>
                        <td class={item.type != 'line' ? 'resize e' : ''}></td>
                    </tr>
                )
            } else {
                return (
                    <tr>
                        <td class="resize w"></td>
                        <td class="move content" ref={'print_table_'+index} style={item.w_contSty} on-mousedown={() => this.dragItem()}>
                            {this.drawItem(item,index)}
                        </td>
                        <td class="resize e"></td>
                    </tr>
                )
            }
        },
        insertTrCont_3 (item) {
            if (item.orient == 'v') {
                return (
                    <tr>
                        <td class={ 'resize ' + (item.type != 'line' ? 'sw' : 's') }>&nbsp;</td>
                        <td class={ item.type != 'line' ? 'resize s' : '' }></td>
                        <td class={ 'resize ' + (item.type != 'line' ? 'se' : 's') }>&nbsp;</td>
                    </tr>
                )
            } else if (item.orient == 'h') {
                return (
                    <tr>
                        <td class={ 'resize ' + (item.type != 'line' ? 'sw' : 'w') }>&nbsp;</td>
                        <td class={ 'resize ' + (item.type == 'line' ? 's' : '') }></td>
                        <td class={ 'resize ' + (item.type != 'line' ? 'se': 'e') }>&nbsp;</td>
                    </tr>
                )
            } else {
                return (
                    <tr>
                        <td class={ 'resize ' + (item.type != 'line' ? 'sw' : 's') }>&nbsp;</td>
                        <td class="resize s"></td>
                        <td class={ 'resize ' + (item.type != 'line' ? 'se' : 's') }>&nbsp;</td>
                    </tr>
                )
            }
        },
        drawItem (item, idx) {
            if (item.type == 'BarCode' || item.type == 'barcode') {
                return (
                    <canvas id={'barcode_img' + parseInt(idx+1)} width="75" height="75"></canvas>
                ) ///
            } else if (item.type == 'qrcode') {
                return (
                    <canvas id={'qrcode_img' + parseInt(idx+1)} width="75" height="75"></canvas>
                ) ///
            } else {
                return (
                    <span style={item.w_spanSty} domPropsInnerHTML={ item.w_spanHtml || item.w_spanTxt || ' '}></span>
                )
            }
        },
        getPropertiesTpl () {
            return (
                <td style="width: 250px;">
                    <table border="1" class="designer-properties" ref="designerProperties" on-change={(e) => this.handleProperties(e)}>
                        <tr>
                            <th>属性</th>
                            <th style="text-align: left">值</th>
                        </tr>
                        <tr>
                            <th>控件：</th>
                            <td>
                                <select name="name" ref="select_kj" v-model={this.proSel.kj}>
                                    {
                                        this.kjOpts.map(item => {
                                            return (
                                                <option key={item.value} label={item.label} value={item.value}/>
                                            )
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>类型：</th>
                            <td>
                                <input name="type" readonly="readonly" v-model={this.proSel.type}/>
                            </td>
                        </tr>
                        <tr>
                            <th>锁定：</th>
                            <td>
                                <input name="locked" type="checkbox" readonly="readonly" style="width: 20px;height: 12px;" />
                            </td>
                        </tr>
                        <tr>
                            <th>每页打印：</th>
                            <td>
                                <select name="printAlways">
                                    <option value="0" selected="selected">否</option>
                                    <option value="1">是</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>X：</th>
                            <td>
                                <input name="left" v-model={this.proSel.left} /></td>
                        </tr>
                        <tr>
                            <th>Y：</th>
                            <td>
                                <input name="top" v-model={this.proSel.top} /></td>
                        </tr>
                        <tr>
                            <th>宽：</th>
                            <td>
                                <input name="width" v-model={this.proSel.width} /></td>
                        </tr>
                        <tr>
                            <th>高：</th>
                            <td>
                                <input name="height" v-model={this.proSel.height} /></td>
                        </tr>
                        <tr id="subStrTr" style="display:none">
                            <th>字符截取：</th>
                            <td>
                                <input name="hasIntercept" type="checkbox" readonly="readonly" style="width: 15px;height: 12px;" />开始位：
                                <input name="subStringIndex" style="width: 15px;height: 12px;" />截取长度：
                                <input name="subStringLength" style="width: 15px;height: 12px;" /></td>
                        </tr>
                        <tr>
                            <th>层序：</th>
                            <td>
                                <input name="z-index" v-model={this.proSel.zIndexC} disabled="disabled" style="width: 50px;" />
                                <a href="javascript:void(0)" class="layout up all" title="移至顶层">&lt;</a>
                                <a href="javascript:void(0)" class="layout up" title="上移一层" on-click={() => this.layout('up')}>↑ </a>
                                <a href="javascript:void(0)" class="layout down" title="下移一层" on-click={() => this.layout('down')}> ↓</a>
                                <a href="javascript:void(0)" class="layout down all" title="移至底层">&gt;</a></td>
                        </tr>
                        <tr>
                            <th>字体：</th>
                            <td>
                                <select name="font-name" v-model={this.proSel.fontName}>
                                    <option value="Arial">Arial</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                    <option value="System">System</option>
                                    <option value="宋体">宋体</option>
                                    <option value="黑体">黑体</option>
                                    <option value="楷体">楷体</option>
                                    <option value="隶书">隶书</option>
                                    <option value="幼圆">幼圆</option>
                                    <option value="仿宋体">仿宋体</option>
                                    <option value="华文楷体">华文楷体</option>
                                    <option value="华文行楷">华文行楷</option>
                                    <option value="微软雅黑">微软雅黑</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>字号：</th>
                            <td>
                                <input name="font-size" v-model={this.proSel.fontSize} /></td>
                        </tr>
                        <tr>
                            <th>行高：</th>
                            <td>
                                <input name="line-height" v-model={this.proSel.lineHeight} /></td>
                        </tr>
                        <tr>
                            <th>水平对齐：</th>
                            <td>
                                <select name="text-align" v-model={this.proSel.textAlign}>
                                    <option value="">默认</option>
                                    <option value="center">居中</option>
                                    <option value="left">左对齐</option>
                                    <option value="right">右对齐</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>垂直对齐：</th>
                            <td>
                                <select name="vertical-align" v-model={this.proSel.verticalAlign}>
                                    <option value="middle">居中</option>
                                    <option value="top">顶端对齐</option>
                                    <option value="bottom">底端对齐</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>空白换行：</th>
                            <td>
                                <select name="white-space" v-model={this.proSel.whiteSpace}>
                                    <option value="normal">正常</option>
                                    <option value="pre">原样输出</option>
                                    <option value="pre-wrap">原样+自动换行</option>
                                    <option value="pre-line">原样+空格压缩</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>前景色：</th>
                            <td class="f-pr">
                                <input name="fore-color" v-model={this.proSel.foreColor} />
                                <el-color-picker
                                    size="mini"
                                    class="colpicker"
                                    v-model={this.proSel.foreColor}
                                    on-change={(e) => {this.handleProptys(e)}}>
                                </el-color-picker>
                            </td>
                        </tr>
                        <tr>
                            <th>背景色：</th>
                            <td class="f-pr">
                                <input name="back-color" v-model={this.proSel.backgroundColor} />
                                <el-color-picker
                                    size="mini"
                                    class="colpicker"
                                    v-model={this.proSel.backgroundColor}
                                    on-change={(e) => {this.handleProperties(e)}}>
                                </el-color-picker>
                            </td>
                        </tr>
                        <tr>
                            <th>边框宽度：</th>
                            <td>
                                <input name="border-width" v-model={this.proSel.borderWidth} disabled={this.isDisabled('borderWidth')} /></td>
                        </tr>
                        <tr>
                            <th>边框样式：</th>
                            <td>
                                <select name="border-style" v-model={this.proSel.borderStyle} disabled={this.isDisabled('borderStyle')}>
                                    <option value="none">无</option>
                                    <option value="hidden">隐藏</option>
                                    <option value="dotted">点状边框</option>
                                    <option value="dashed">虚线</option>
                                    <option value="solid">实线</option>
                                    <option value="double">双实线</option>
                                    <option value="groove">3D 凹槽边框</option>
                                    <option value="ridge">3D 垄状边框</option>
                                    <option value="inset">3D inset 边框</option>
                                    <option value="outset">3D outset 边框</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>边框色：</th>
                            <td class="f-pr">
                                <input name="border-color" v-model={this.proSel.borderColor} disabled={this.isDisabled('borderColor')} />
                                <el-color-picker
                                    size="mini"
                                    class="colpicker"
                                    v-model={this.proSel.borderColor}
                                    on-change={(e) => {this.handleProperties(e)}}>
                                </el-color-picker>
                            </td>
                        </tr>
                        <tr>
                            <th>条码类型：</th>
                            <td>
                                <select name="barcode-format" v-model={this.proSel.barFormat} disabled={this.isDisabled('barFormat')}>
                                    <option value="code11">code11</option>
                                    <option value="code39">code39</option>
                                    <option value="code93">code93</option>
                                    <option value="code128">code128</option>
                                    <option value="ean8">ean8</option>
                                    <option value="ean13">ean13</option>
                                    <option value="std25">std25</option>
                                    <option value="int25">int25</option>
                                    <option value="msi">msi</option>
                                    <option value="datamatrix">datamatrix</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>细线宽度：</th>
                            <td>
                                <input name="bar-width" v-model={this.proSel.barWidth} disabled={this.isDisabled('barWidth')} /></td>
                        </tr>
                        <tr>
                            <th>内容：</th>
                            <td>
                                <textarea type="text" name="content" style="width: 100%; border: none" rows="4" v-model={this.proSel.content}></textarea>
                            </td>
                        </tr>
                    </table>
                </td>
            )
        },
        initPrintDesigner() {
            var $printDesigner = this.$refs.designer;
            var $printPage = this.$refs.printDesignerPage;

            //TODO
            /*var $printDesignerContainer = $printDesigner.parent();
            $printDesignerContainer.resize(function() {
                $printDesigner.width($printDesignerContainer.width());
                $printDesigner.height($printDesignerContainer.height());
            });
            $printDesignerContainer.resize();*/

            var $propertiesTable = this.$refs.designerProperties;
            var propertiesTableNameControl;

            if ($propertiesTable && $propertiesTable.length > 0) {
                propertiesTableNameControl = $propertiesTable.find("select[name='name']");
                if (designerConfig.filedNameMap) {
                    var filedNameC = $propertiesTable.find("select[name='filed-name']");
                    filedNameC.empty();
                    for (var filedName in designerConfig.filedNameMap) {
                        filedNameC.append("<option value='@{" + filedName + "}'>" + filedName + "</option>")
                    }
                    filedNameC.append("<option value=''>自定义内容</option>");
                }
            }
        }
    }
}