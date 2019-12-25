<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :handle-search="handleSearch"
            :DO_STATE="DO_STATE.array"
            :state="state"
            :STOCK_COU_TYPE="STOCK_COU_TYPE"
            :STOCK_DIFF_TYPE="STOCK_DIFF_TYPE"
            :STOCK_COU_STATUS="STOCK_COU_STATUS"
            />
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :releaseList="releaseList"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-view="handleView"
            :autoInventory="autoInventory"
            :cancel-pulish-inv="cancelPulishInv"
            :handle-delete="handleDelete"
            :eidtInvDetail="eidtInvDetail"
            :viewRfidCode="viewRfidCode"
            :finishedInv="finishedInv"
            :checkDetail="checkDetail"
            :invStockNote="invStockNote"
            :DO_STATE="DO_STATE.map"
            :STOCK_COU_STATUS="STOCK_COU_STATUS"
            :STOCK_DIFF_TYPE="STOCK_DIFF_TYPE"
            :STOCK_COU_MODE="STOCK_COU_MODE"
            :STOCK_COU_TYPE="STOCK_COU_TYPE"
            :STOCK_COU_SOURCE="STOCK_COU_SOURCE"
            :STOCK_COU_SHOW_MODE="STOCK_COU_SHOW_MODE"
            :proxy-actions="proxyActions"
            :cancelStockInv="cancelStockInv"
            :handleSelectionChange="selectionChanges"
            />
        <entity-dialog
            :state="state"
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :view-id="viewId"
            :entity="state.entity"
            :STOCK_COU_STATUS="STOCK_COU_STATUS"
            :STOCK_DIFF_TYPE="STOCK_DIFF_TYPE"
            :STOCK_COU_MODE="STOCK_COU_MODE"
            :STOCK_COU_SHOW_MODE="STOCK_COU_SHOW_MODE"
            :VALID_FLAG="VALID_FLAG"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            :LOCATION_USE="LOCATION_USE"
            :STOCK_COU_TYPE="STOCK_COU_TYPE"
            :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
            :update-vis="updateEntityDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"/>
        <detail-dialog
            :visible="detailDlgVis"
            :detaillist="detaillist"
            :closeDetail="closeDetail"
            :total="detailTotol"
            :queryList="queryList"
            />
            <rfid-dialog
            :visible="rfidDlgVis"
            :tableData="tableData"
            :rowEntity="rowEntity"
            :update-vis="updateRfidDlgVis"
            />
            <high-dialog
                :visible="highDlgVis"
                :update-vis="updateHighDlgVis"
                :nCount="nCount"
            />
            <pandianNotice
            :visible="pandianNoticeVis"
            :pandianNoticeList="pandianNoticeList"
            :closeDetail="closeDetail"
            :invStockNote="invStockNote"
            :couHId="couHId"
            :total="nocticeTotol"
            :queryMainList="queryList"
            :closenotice="closenotice"
            :LOCATION_USE="LOCATION_USE"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
            :VALID_FLAG="VALID_FLAG"
            />
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import detailDialog from './components/detailDialog'
import rfidDialog from './components/rfidDialog'
import highDialog from './components/highDialog'
import pandianNotice from './components/pandianNotice'
import { download } from 'common/utils/download'
import { removeEmptyAttr, sortListByList } from 'common/utils/tools'
import { groupBy } from 'common/utils/lodash'
import { mapState, mapActions, mapMutations } from 'vuex'

const enums = [
    "DO_STATE",
    "STOCK_DIFF_STATUS",
    "STOCK_DIFF_TYPE",
    "STOCK_COU_STATUS",
    "STOCK_COU_MODE",
    "STOCK_COU_SHOW_MODE",
    "LOCATION_USE",// 库位用途
    "LOCATION_CONSTRAINT",// 库位限制
    "LOCATION_CYCLE_CLASS",// 库位ABC类型
    'VALID_FLAG',
    'STOCK_COU_TYPE', //启停状态
    'STOCK_COU_SOURCE'//盘点来源
]


export default {
    name: 'implement_at_InventoryList',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        detailDialog,
        pandianNotice,
        rfidDialog,
        highDialog
    },
    computed: {
        ...mapState('enums', enums),
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/at/InventoryList',
            // 模块名称
            moduleName: '盘点单',
            // 子件替换弹窗是否可见
            subReplDlgVis: false,
            // 修改运营商弹框
            carrierDlgVis: false,
            // 缓存选择的通知单
            checkList: [],
            toasterDialogVis: false,
            detailDlgVis:false,
            detaillist:[],
            detailTotol:0,
            pandianNoticeVis:false,
            rfidDlgVis: false,
            highDlgVis:false,
            tableData:[],
            rowEntity:{},
            pandianNoticeList:[],
            nocticeTotol:0,
            couHId:'',
            //查看页盘点单明细请求id
            viewId:''
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums(enums)
        // 获取单据类型
        // this.getBillTypeList({})
    },
    mounted () {
    },
    methods: {
        ...mapActions('stock/at/InventoryList', [
            // 'getBillTypeList',
            // 'checkStockNotice',
            // 'checkBackStockNotice',
            // 'cancelStockInv',
        ]),
        // ...mapMutations('implement/at/InventoryList/detail', [
        //     'updateDetailNoticeId'
        // ]),
        // ...mapMutations('implement/at/InventoryList/warp', [
        //     'updateWarpNoticeId'
        // ]),
        closenotice(e){
            this.pandianNoticeVis = e
        },
        //盘点登记
        invStockNote(e){
            console.log(e)
            this.couHId = e
            api.stock.queryInvStockDetail({"couHId":e,}).then(({head,body})=>{
                if(head.code==200){
                    if(body.records.length){
                        this.pandianNoticeList = body.records
                        this.nocticeTotol = body.total
                        this.pandianNoticeVis = true
                    }else{
                        this.$message.error('无库存数据！');
                    }
                }else{
                    this.$message.error(head.subMessage);
                }
            })
        },
        updateSubReplDlgVis (vis) {
            this.subReplDlgVis = vis
        },
        updateCarrierDlgVis (vis) {
            this.carrierDlgVis = vis
        },
        handleExport () {
            const data = Object.assign({}, this.$refs.search.query);
            this.queryToEnd(data)
            return download({
                url: '/out/doHeader/exportExcel',
                data
            });
        },
        // 显示 下面的详情 组件数据
        selectionChanges (rows) {
            this.checkList = rows
        },
        // 代理action 用于验证数据
        proxyActions ({ action, rows }) {
            const idList = rows.map(row => row.id);
            const callee = this[action];
            if (callee) {
                return callee({
                    idList
                })
            } else {
                return false;
            }
        },
        //取消发布
        cancelPulishInv(e){
            api.stock.canclePublishInvStock(e).then(({head,body})=>{
                if(head.code==200){
                    this.$message.success('取消发布成功！')
                    this.queryList()
                }else{
                    this.$message.error(head.subMessage);
                }
            })
        },
        //取消
        cancelStockInv(e){
            api.stock.cancelStockInv(e).then(({head,body})=>{
                if(head.code==200){
                    this.$message.success('取消成功！')
                    this.queryList()
                }else{
                    this.$message.error(head.subMessage);
                }
            })
        },
        //RFID查看
        viewRfidCode(val){
            debugger
            this.rowEntity = val
            this.tableData = val.stockCouRfidLogList
            this.rfidDlgVis = true
        },
        updateRfidDlgVis(vis){
            this.rfidDlgVis = vis
        },
        updateHighDlgVis(vis){
            this.highDlgVis = vis
        },
        //盘点完成
        finishedInv(e){
            api.stock.finishedStockInv(e).then(({head,body})=>{
                if(head.code==200&&body){
                    // body.result="仍有xx个库位可用数量不等于库存数量，请确定是否作业完成再盘点静盘"
                    if(body.result=='ok'){
                        api.stock.finishedStockInvNest(e).then(({head,body,message})=>{
                            if(head.code==200){
                                this.$message.success('盘点完成！')
                                this.queryList()
                            }else{
                                this.$message.error(head.subMessage);
                            }
                        })
                    }else{
                        this.$confirm(body.result, '提示', {
                                confirmButtonText: '是',
                                cancelButtonText: '否',
                                type: 'warning',
                                center: true
                                }).then(() => {
                                     api.stock.finishedStockInvNest(e).then(({head,body,message})=>{
                                        if(head.code==200){
                                            this.$message.success('盘点完成！')
                                            this.queryList()
                                        }else{
                                            this.$message.error(head.subMessage);
                                        }
                                    })
                                }).catch(() => {
                                    this.$message({
                                        type: 'info',
                                        message: '取消盘点！'
                                    });
                                });
                    }
                }else{
                    this.$message.error(head.subMessage)
                }
            })
            
        },
        //盘点明细
        checkDetail(e){
             api.stock.queryInvStockDetail(e).then(({head,body})=>{
                if(head.code==200){
                    if(body.records.length){
                        this.detaillist = body.records
                        this.detailTotol = body.total
                        this.detailDlgVis = true
                    }else{
                        this.$message.error('该盘点单暂无明细！');
                    }
                }else{
                    this.$message.error(head.subMessage);
                }
            })
        },
        closeDetail(e){
            this.detailDlgVis = e
        },
        eidtInvDetail(e){
            this.viewId = e.id
            api.stock.getPanDianDoInfoById({id:e.id}).then(({head,body})=>{
                if(head.code ==200){
                    this.entityDlgVis = true
                    this.entityDlgActn = 'edit'
                    this.state.entity = body
                }
            })
        },
        queryToEnd (query) {
            if (query.createTime && query.createTime.length) {
                query.startTime = query.createTime[0]
                query.endTime = query.createTime[1]
            }
            delete query.createTime
            delete query.skuName
            delete query.ownerName
        },
        // 审核
        examine (params) {
            this.checkStockNotice({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        //重力货架盘点
        autoInventory(){
            this.highDlgVis = true
            
        },
        //重力盘点
        nCount(param){
            api.stock.autoPandian(param).then(({head,body})=>{
                if(head.code==200){
                    this.$message.success(head.message)
                    this.highDlgVis = false
                    this.queryList()
                }else{
                    this.$message.error(head.message)
                }
            })
        },
        reject (params) {
            this.checkBackStockNotice({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        cancel (params) {
            let ids = params.idList
            let param = {
                id:ids[0].id
            }
            this.cancelStockInv({
                param,
                cb: () => {
                    this.queryList()
                }
            })
        },
        auto (params) {
            this.cancelStockInv({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        manual (params, rows) {
            this.$router.push({
                path: '/implement/out/noticeManual',
                query: {
                    id: rows[0].id,
                    code: rows[0].billCode1
                }
            })
        },
        //盘点单发布接口
        publishStock(params){
            api.stock.publishInvStock(params).then(({head,body})=>{
                if(head.code==200){
                    this.$message.success('发布成功！')
                    this.queryList()
                }else{
                    this.$message.error(head.subMessage);
                }
                
            })
        },
        //盘点单发布前校验
        checkPublish(params){
            var that =  this
            api.stock.checkPublish(params).then(({head,body})=>{
                if(head.code==200&&body){
                    // body.result="仍有xx个库位可用数量不等于库存数量，请确定是否作业完成再盘点静盘"
                    if(body.result=='ok'){
                        this.publishStock({id:params.id,forcePub:false})
                    }else{
                        this.$confirm(body.result, '提示', {
                                confirmButtonText: '是',
                                cancelButtonText: '否',
                                type: 'warning',
                                center: true
                                }).then(() => {
                                     that.publishStock({id:params.id,forcePub:true})
                                }).catch(() => {
                                    this.$message({
                                        type: 'info',
                                        message: '取消发布！'
                                    });
                                });
                    }
                }else{
                    this.$message.error(head.subMessage)
                }
            })
        },
        //发布
        releaseList(e){
            console.log('dsadsadsadsa',e)
            this.checkPublish({id:e})
        },
        //查看详情
        handleView (entity) {
            this.viewId = entity.id
            this.entityDlgVis = true
            this.entityDlgActn = 'view'
            this.queryEntity(entity)
        },
    },
}
</script>

