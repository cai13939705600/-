<template>
    <div class="p-basic return-page">
        <exact-search
            :update-state="updateState"
            :handle-search="handleSearch"
            :bill-types='state.billTypes'
            :ASN_STATE="ASN_STATE"
            :PUTAWAY_STATE="PUTAWAY_STATE"
            :ASN_TYPE="ASN_TYPE"
            :ASN_SEARCH_DATE_TYPE="ASN_SEARCH_DATE_TYPE"
            />
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :billTypes="state.billTypes"
            :ASN_STATE="ASN_STATE"
            :PUTAWAY_STATE="PUTAWAY_STATE"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-command="handleCommand"
            :handle-receiving="handleReceiving"
            :handle-putaway="handlePutaway"
            :selection-changes="selectionChanges"
            :proxy-actions="proxyActions"/>
        <entity-dialog
            :state="state"
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :checktechParam="checktechParam"
            :update-vis="updateEntityDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"/>
        <receiving-dlg
            :visible="recGoodsDlgVis"
            :query-list="queryList"
            :table-header-date="state.tableHeaderDate"
            :receiving-goods-dlg='state.receivingGoodsDlg'
            :checktechParam="checktechParam"
            :state="state"
            :inventoryTypes="state.inventoryTypes"
            :selection-changes="selectionChanges"
            :update-vis="updateRecGoodsDlgVis"/>
        <put-dlg
            :visible="putDlgVis"
            :query-list="queryList"
            :put-dlg-data='state.putDlgData'
            :checktechParam="checktechParam"
            :state="state"
            :table-header-date="state.tableHeaderDate"
            :update-vis="updatePutawayDlgVis"/>
        <btm-tabs
            v-show="checkList.length"
            :checktechParam="checktechParam"
            :state="state"
            />
        <tech-param-dialog
            :visibles="techDlgVis"
            :techParam="techParam"
            :closeTechDig="closeTechDig"
        />
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import BtmTabs from './components/btmTabs'
import ReceivingDlg from './components/receivingDlg'
import PutDlg from './components/putDlg'
import { download, preview } from 'common/utils/download'
import techParamDialog from 'biz/components/techParamDialog'

import { mapState, mapActions ,mapMutations} from 'vuex'

const enums = [
    "ASN_TYPE",// 单据类型
    "ASN_STATE",// 作业状态
    "PUTAWAY_STATE",// 上架状态
    "ASN_SEARCH_DATE_TYPE",//ASN查询时间类型
]

export default {
    name: 'implement_return_instockNotice',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        BtmTabs,
        ReceivingDlg,
        PutDlg,
        techParamDialog
    },
    computed:{
        ...mapState('enums', enums),
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/return',
            // 模块名称
            moduleName: '入库通知单',
            // 收货弹窗是否可见
            recGoodsDlgVis: false,
            //上架弹窗是否可见
            putDlgVis:false,
            // 缓存选中查询的通知单
            checkList: [],
            // 是否显示详情
            isShowDetail: false,
            techDlgVis:false,
            techParam:'',
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums(enums)
        //获取单据类型接口数据
        this.getBillTypesAction(
            {params:{
                categoryTypeList:[10],
                thrkFlag: 1 //退货入库
            }
        })
        // 获取库存类型
        this.getInventoryTypes({})
        console.log('获取页面列表',this);  
    },
    mounted () {
       
        
    },
    methods: {
        ...mapActions('stock/return', [
            'receivingGoodsDlgListAction',
            'receivingGoodsDlgHeaderAction',
            'saveReceivingGoodsDlgAction',
            'oneKeyReceivingAction',
            'putDlgListAction',
            'oneKeyRackAction',
            'coerceFinishAction',
            'checkPrintFlagAction',
            'getBillTypesAction',
            'getInventoryTypes',
            'cancleAction',
            'onExamineAction',
            'onRejectAction',
            'getOutDetailListAction'
            ]),
            //新增修改部分1
            ...mapMutations('implement/return/instockNotice/stock', [ 'updateStockDetailList' ]),
            ...mapMutations('implement/return/instockNotice/receive', ['updateReceivingDetailList' ]),
            ...mapMutations('implement/return/instockNotice/putaway', [ 'updateWaitingPut' ]),
            ...mapMutations('implement/return/instockNotice/deal', [ 'updateReceivingTrading' ]),
            //新增修改结束1
        updatePutawayDlgVis(vis) {
            this.putDlgVis = vis
        },
        updateRecGoodsDlgVis(vis) {
            this.recGoodsDlgVis = vis
        },
        //技术参数查看
        checktechParam(param){
            this.techParam = param
            this.techDlgVis = true
        },
         //关闭技术参数页面
        closeTechDig(vis){
            this.techDlgVis = vis
        },
        handleReceiving () {
            //点击收货时的校验
            if(this.checkList.length==0){
                this.$message.error('请选择通知单')
            }else if(this.checkList.length > 1){
                this.$message.error('请对单一通知单进行操作')
            }else{
                if(this.checkList[0].state==10 ||this.checkList[0].state == 30){
                    this.updateRecGoodsDlgVis(true)
                    //遍历弹窗列表--看是否展示批属性
                   /*  const rows = this.state.receivingGoodsDlg
                    if (rows.some(item => item.lotatt05Validate == true)){
                        this.isShowLotatt05 = true
                        console.log(this.isShowLotatt05,'008');    
                    } */
                }else{
                    if(this.checkList[0].state==20){
                        this.$message.error('【取消】状态无法收货')
                    }else if(this.checkList[0].state==40){
                        this.$message.error('【全部收货】状态无法收货')
                    }else if(this.checkList[0].state==50){
                        this.$message.error('【完成】状态无法收货')
                    }else if(this.checkList[0].state==5){
                        this.$message.error('【待审核】状态无法收货')
                    }    
                }
            }
        },
        handlePutaway(rows){
            //点击上架时的校验
            if(this.checkList.length==0){
                this.$message.error('请选择通知单')
            }else if(this.checkList.length > 1){
                this.$message.error('请对单一通知单进行操作')
            }else{
                if(this.checkList[0].state==30 ||this.checkList[0].state == 40){
                    this.updatePutawayDlgVis(true);
                }else{
                    if(this.checkList[0].state==10){
                        this.$message.error('【创建】状态无法上架')
                    }else if(this.checkList[0].state==20){
                        this.$message.error('【取消】状态无法上架')
                    }else if(this.checkList[0].state==50){
                        this.$message.error('【完成】状态无法上架')
                    }
                }
            }
        },
        //选择
        selectionChanges (rows) {
            /* 新修改的选择请求如下 */
            this.checkList = rows
            const lastData = rows[rows.length - 1];
            if (lastData) {
                // 入库通知单明细查询
                this.updateStockDetailList(lastData.id);
                this.updateReceivingDetailList(lastData.id);
                this.updateWaitingPut(lastData.id);
                this.updateReceivingTrading(lastData.code);
            } else {
                this.updateStockDetailList('');
                this.updateReceivingDetailList('');
                this.updateWaitingPut('');
                this.updateReceivingTrading('');
            }
        },
        // 代理action 用于验证数据
        proxyActions (action) {
            const rows = this.checkList;
            const callee = this[action];
            if (callee) {
                return callee()
            } else {
                console.log('未知action:' + action);
                return false;
            }
        },
        // 修改
        onEdit () {
            const rows = this.checkList;
            if (!rows.length) {
                return this.$message.error('请选择一条数据')
            }
            if (!rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            if (rows.every(item => item.state === 10 || item.state === 5)){
                this.handleEdit({
                    asnId: rows[0].id
                }, (body) => {
                    //调用根据出库id查明细接口，查询物料表明细出库数量
                    this.getOutDetailListAction({
                        params: {id : body.doId},
                        //成功回调函数
                        cb: (head, data) => {
                            //循环遍历asnDetailDtoList和outDetailList找到code相同的值，将outboundQty字段push到asnDetailDtoList数组中
                            body.asnDetailDtoList.forEach(item1 => {
                                data.doDetailList.forEach(item2 => {
                                    if(item1.id == item2.skuId){
                                        item1.outboundQty=item2.outboundQty
                                    }
                                })
                            })
                        }
                    }) 
                    body.asnDetailDtoList = body.asnDetailDtoList.map(item => {
                        return {
                                code: item.skuCode,
                                id: item.skuId,
                                name: item.skuName,
                                uom: item.uom,
                                spec: item.skuSpec,
                                price: item.price,
                                totalPrice: item.amount,
                                supplierName: item.supplierName,
                                skuTechParam: item.skuTechParam,
                                quantity: item.expectQty,
                                outboundQty: item.outboundQty,
                                grossWeight: item.weight,
                                volume: item.volume,
                                remark: item.remark
                        }
                    })
                })
            } else {
                return this.$message.error('只有待审核状态或创建状态下可以修改')
            }
        },
        //审核
        onExamine(){
            const rows = this.checkList;
            const asnIdList = rows.map(row=>row.id);
            //只有待审核状态下才可以审核
            let result = rows.some(
                    function(item){
                        return item.state != 5 
                    }
                )
            if (!result) {
                    return this.onExamineAction({ 
                        params: {asnIdList},
                        //成功回调函数
                        cb: () => {
                            this.$message({ type: 'success', message: '审核成功' });
                            this.queryList();
                        }
                    });
                } else {
                    return this.$message.error('只有待审核状态下可以审核')
                }
        },
        // 反审核 
        onReject(){
            const rows = this.checkList;
            const asnIdList = rows.map(row=>row.id);
            //只有已审核状态即创建状态下才可以反审核
            let result = rows.some(
                    function(item){
                        return item.state != 10 
                    }
                )
            if (!result) {
                    return this.onRejectAction({ 
                        params: {asnIdList},
                        //成功回调函数
                        cb: () => {
                            this.$message({ type: 'success', message: '反审核成功' });
                            this.queryList();
                        }
                    });
                } else {
                    return this.$message.error('只有创建状态下可以反审核')
                }
        },
        // 取消订单
        cancle (){
            const rows = this.checkList;
            const idList = rows.map(row=>row.id);
            //只有待审核和创建状态下可以取消
                let result = rows.some(
                    function(item){  
                        return item.state > 10
                    }
                )
                console.log(result,'result');
                if (!result) {
                    return this.cancleAction({ 
                        params: idList,
                        //成功回调函数
                        cb: () => {
                            this.$message({ type: 'success', message: '取消订单成功' });
                            this.queryList();
                        }
                    });
                } else {
                    return this.$message.error('只有待审核和创建状态下可以取消')
                }
        },
        // 收货
        receivingGoods() {
            const rows = this.checkList;
            const length = rows.length;
            const asnId = rows[length-1].id;
            //收货弹窗---列表数据请求        
             this.receivingGoodsDlgListAction({
                params: {
                    asnId
                }
            });
            //收货弹窗---表头请求
            this.receivingGoodsDlgHeaderAction({
                params: {
                    asnId
                }
            });  
        },
        // 一键收货   
        oneKeyReceiving() {
            const rows = this.checkList;
            const asnIdList = rows.map(row=>row.id);
            if(rows.length==0){
                this.$message.error('请选择通知单')
            }else{
                return this.oneKeyReceivingAction({
                    params: asnIdList,
                    //成功回调函数
                    cb: () => {
                        this.$message({ type: 'success', message: '一键收货成功' });
                        this.queryList();
                    }
                })
            }
        },
        //上架
        putaway(){
            const rows = this.checkList;
            const length = rows.length;
            const asnId = rows[length-1].id;
            //上架弹窗---表头请求（和收货弹窗同一个请求）
            this.receivingGoodsDlgHeaderAction({
                params: {
                    asnId
                }
            });
            //上架弹窗--列表内容请求
            this.putDlgListAction({
                params: {
                    asnId
                }
            });
        },
        //一键上架
        oneKeyRack() {
            const rows = this.checkList;
            const asnIdList = rows.map(row=>row.id);
            return this.oneKeyRackAction({
                params: asnIdList,
               //成功回调函数
                cb: () => {
                    this.$message({ type: 'success', message: '一键上架成功' });
                    this.queryList();
                }    
            })
        },
        //强制完成
        coerceFinish() {
            const rows = this.checkList;
            const idList = rows.map(row=>row.id);
            if(this.checkList.length==0){
                this.$message.error('请选择通知单')
            }else if(this.checkList.length > 1){
                this.$message.error('请对单一通知单进行操作')
            }else if(this.checkList[0].state==50){
                this.$message.error('【完成】状态的订单无法再进行收货上架操作')
            }else if(this.checkList[0].state==20){
                this.$message.error('【取消】状态的订单无法再进行收货上架操作')
            }else{
                this.confirm('请确认是否收货结束，强制完成后无法再进行操作', () => {
                    return this.coerceFinishAction({
                        params: idList,
                        //成功回调函数
                        cb: () => {
                            this.$message({ type: 'success', message: '强制完成成功' });
                            this.queryList();
                        },
                        //失败回调函数
                        errCb: ({ code, subMessage: msg }) => {
                            //未成功
                            this.$message.error('强制完成失败',msg)
                        }
                    })
                })
            }
        },
        //查询条件转换格式
        queryToEnd (query) {
            if (query.createTime && query.createTime.length) {
                query.startDate = query.createTime[0]
                query.endDate = query.createTime[1]
            }
            delete query.createTime
        },
        //打印
        handleCommand(command) {
            const rows= this.checkList;
            if(rows&&rows.length){
                const asnIdList = rows.map(row=>row.id);
                switch(command){
                    case '100':
                        //入库清单状态打印校验
                        let result = rows.some(
                            function(item){
                                return item.state ===20 || item.state===40 || item.state===50
                            }
                        )
                        if(!result){
                            return preview({
                                url:  process.env.VUE_APP_API_PREFIX + '/wms/in/printController/printAsnList',
                                data: {
                                    asnIdList: asnIdList.join(',')
                                }
                            });
                        }else{
                            //如果入库单状态为“取消”，“完全收货”，“完成”，打印入库单时提示是否确认打印
                            const printList = []
                            rows.map((item)=>{
                                if(item.state===20 || item.state===40 || item.state===50){
                                    printList.push(item.code)
                                }
                            })
                            if(printList.length){
                                this.confirm( printList+'已完成收货或已取消'+'是否需要打印入库单', () => {
                                    return preview({
                                        url:  process.env.VUE_APP_API_PREFIX + '/wms/in/printController/printAsnList',
                                        data: {
                                            asnIdList: asnIdList.join(',')
                                        }
                                    });
                                })
                            }
                        }
                        break;
                    case '110':
                        //打印入库验收单状态校验
                        let checkResult = rows.some(
                            function(item){
                                return item.state===10 || item.state===20 || item.state===30
                            }
                        )
                        if(!checkResult){
                            return preview({
                                url:  process.env.VUE_APP_API_PREFIX + '/wms/in/printController/printReceivingList',
                                data: {
                                    asnIdList: asnIdList.join(',')
                                }
                            });
                        }else{
                            //入库单状态为 “完全收货”，“完成”，支持打印入库验收单，其他状态打印入库验收单时提示不支持打印入库验收单，请先完成验收；
                            const checkPrint = [];
                            rows.map((item)=>{
                                if(item.state===10 || item.state===20 || item.state===30){
                                    checkPrint.push(item.code)
                                }
                            })
                            if(checkPrint.length){
                                this.$message.error(checkPrint+"非完全收货或完成状态不支持打印入库验收单，请先完成验收")
                            }   
                        }
                        break;
                    case '120':
                        //先调一次接口看是否是201不是再进行打印
                        api.stock.printPutawayTaskList({asnIdList: asnIdList.join(',')}).then(({ head, body }) => {
                            if (head && head.code === '201') {
                                this.$message.error(head.subMessage)
                            } else {
                                return preview({
                                    url:  process.env.VUE_APP_API_PREFIX + '/wms/in/printController/printPutawayTaskList',
                                    data: {
                                        asnIdList: asnIdList.join(',')
                                    }
                                });
                            }
                        })
                        break;  
                    default:
                        this.proxyActions(command)   
                }
            }else{
                this.$message.error('请选择通知单')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .return-page {
    position: relative;
}
</style>
