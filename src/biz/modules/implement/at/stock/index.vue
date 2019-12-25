<template>
    <div class="p-basic">
        <exact-search
            :update-state="updateState"
            :handle-search="handleSearch"
            :location-loading="state.locationLoading"
            :location-list="state.locationList"
            :area-loading="state.areaLoading"
            :area-list="state.areaList"
            :inventory-types="state.inventoryTypes"
            :proxy-remote-method="proxyRemoteMethod"
            :state="state"
            />
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :selection-changes="selectionChanges"
            :click-print="clickPrint"
            :proxy-actions="proxyActions"/>
        <!-- 移库 -->
        <entity-dialog
            :module-name="'移库'"
            :visible="moveDialogVis"
            :action="'edit'"
            :update-vis="updateDialogVis"
            :titles="titles"
            :location-loading="state.locationLoading"
            :location-list="state.locationList"
            :stock-detail="stockDetail"
            :LibraryLocations="LibraryLocations"
            :entity="state.entity"
            :submit-stock="submitStock"
            :adjustInt="adjustInt"
            :inventory-types="state.inventoryTypes"
            :batch-adjust="batchAdjust"
            :query-list="queryList"
            :handle-save="handleSave"
            :proxy-remote-method="proxyRemoteMethod"
            :type="type"/>
            <toaster-dialog
            :visible="toasterDialogVis"
            :update-toaster-dialog-vis="updateToasterDialogVis"
        />
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import toasterDialog from 'biz/components/toasterDialog'
import { print } from 'common/utils/print'
import { isDate } from 'common/utils/lodash'

import { mapState, mapActions } from 'vuex'
import logDlgVue from '../../../goods/mgt/components/logDlg.vue'

export default {
    name: 'implement_at_stock',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        toasterDialog
    },
    computed: {
        ...mapState('enums', [
           
        ]),
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/at/stock',
            // 模块名称
            moduleName: '在库',
            // 子件替换弹窗是否可见
            subReplDlgVis: false,
            checkList: {},
            moveDialogVis: false,
            type: 0, // 0 移库 1 批次 2 库存调整
            titles:'',
            stockDetail:{},
             // 显示下载提示框
            toasterDialogVis: false,
            panDian:'light',
            LibraryLocations:[]
        }
    },
    created () {
        this.registStore(store)
        // 获取库存类型
        this.getInventoryTypes({})
        // 获取枚举值
        this.queryEnums([
            
        ])
        this.queryLibraryLocations()
    },
    mounted () {
        
    },
    methods: {
        ...mapActions('stock/at/stock', [
            'queryLocationList',
            'queryAreasList',
            'moveStock',
            'profitChangeStock',
            'freezeStock',
            'releaseStock',
            'batchChangeStock',
            'getInventoryTypes',
            'updateInventoryTypes',
            'updateMoveStock',
            'queryPrinters',
            'useTemGetPrinter'
        ]),
        queryLibraryLocations(){
            api.library.queryLibraryLocations({
                page: {
                    current:1,
                    size: 10000
                }
            }).then(({ head = {}, body = {} }) => {
                if (head.code === '200'&&body&&body.records) {
                    this.LibraryLocations = body.records
                }
            })
        },
        //打印
         clickPrint(val){
            console.log(val)
            this.panDian = val
        },
        // 更新弹窗显示状态 目测只有false
        updateDialogVis (vis) {
            this.moveDialogVis = vis
        },
        // 选择
        selectionChanges (rows) {
            this.checkList = rows
        },
        //将时间数据改变格式，变成年月日字符串传出
        queryToEnd (query){ 
            console.log("执行queryTOEnd")
            if (isDate(query.inboundDate)){
                query.inboundDate = jt.date.format(+new Date(query.inboundDate), 'yyyy-MM-dd')
            }
            if (isDate(query.madeDate)){
                query.madeDate = jt.date.format(+new Date(query.madeDate), 'yyyy-MM-dd')
            }
            //创建时间
            if (isDate(query.expireDate)){
                query.expireDate = jt.date.format(+new Date(query.expireDate), 'yyyy-MM-dd')
            }
        },
        // 代理 用于验证数据
        proxyActions (action) {
            console.log(action)
            const rows = this.checkList;
            if(action!='print'){
                if (!rows.length) {
                    debugger
                    if(action=='freezeHandle'||action=='releaseHandle'){
                        return this.$message.error('请选择库存明细操作')
                    }else{
                        return this.$message.error('请选择一行库存明细操作')
                    }
                }
                const idList = rows.map(row => row.id);
            }
            const callee = this[action];
            if (callee) {
                return callee(rows)
            } else {
                console.log('未知action:' + action);
                return false;
            }
        },
        // 移库
        moveHandle (list) {
            debugger
            if(list&&list.length>1){
                this.$message.error('请对单条明细进行操作');
                return
            }
            var a =list[0].locationNo.toUpperCase()
            console.log(a)
            if(a=='STAGE'||a=='SORTATION'){
                this.$message.error(list[0].locationNo+'为过度库位，不支持库存操作')
                return
            }
            if(list[0].stockLock==1){
                this.$message.error('锁定状态，不允许移库操作')
                return
            }
            this.type = 0
            this.titles = "移库"
            
            this.moveDialogVis = true
            this.updateState({ entity: list[0] })
            // this.getPubInfo(list);
        },
        // 批次调整
        batchHandle (list) {
             if(list&&list.length>1){
                this.$message.error('请对单条明细进行操作');
                return
            }
            var a =list[0].locationNo.toUpperCase()
            console.log(a)
            if(a=='STAGE'||a=='SORTATION'){
                this.$message.error(list[0].locationNo+'为过度库位，不支持库存操作')
                return
            }
            if(list[0].avaliableQty===0){
                this.$message.error('该库存可用量为0，不支持库存操作')
                return
            }
            if(list[0].stockLock==1){
                this.$message.error('锁定状态，不允许库存操作')
                return
            }
            console.log('batchHandle');
            this.type = 1
            this.titles = "批次调整"
            this.moveDialogVis = true
            this.updateState({ entity: list[0] })
        },
        // 库存调整
        amountHandle (list) {
             if(list&&list.length>1){
                this.$message.error('请对单条明细进行操作');
                return
            }
            var a =list[0].locationNo.toUpperCase()
            console.log(a)
            if(a=='STAGE'||a=='SORTATION'){
                this.$message.error(list[0].locationNo+'为过度库位，不支持库存操作')
                return
            }
            this.type = 2
            this.titles = "库存调整"
            this.moveDialogVis = true
            this.updateState({ entity: list[0] })
        },
         //提交移库
        submitStock(query){
            api.stock.moveStock(
                    query
            ).then(
            ({ head = {}, body = {} }) => {
                if (head.code === '200') {
                    this.$message.success('移库成功！')
                    this.moveDialogVis = false;
                    this.queryList()
                }else{
                    this.$message.error(head.subMessage)
                }
            }
            )
        },
         //批次调整
        batchAdjust(query){
            console.log(query)
             api.stock.batchChangeStock(query).then(
            ({ head = {}, body = {} }) => {
                if (head.code === '200') {
                    this.$message.success('批次调整成功！')
                    this.moveDialogVis = false;
                    this.queryList()
                }else{
                    this.$message.error(head.subMessage)
                }
            }
            )
        },
        //库存调整
        adjustInt(query){
            api.stock.profitChangeStock(query).then(
            ({ head = {}, body = {} }) => {
                if (head.code === '200') {
                    this.$message.success('库存调整成功！')
                    this.moveDialogVis = false;
                    this.queryList()
                }else{
                    this.$message.error(head.subMessage)
                }
            }
            )
        },
        // 整理冻结/释放数据
        formatFreeze (params,type) {
            var stockLockDetailList = [];
            for(var i =0;i<params.length;i++){
                stockLockDetailList.push({
                    // operateQty: params[i].qty,
                    // putLocationNo: params[i].locationId,
                    // putTraceId:params[i].traceId,
                    // warehouseId : params[i].warehouseId,
                    stockId : params[i].id,
                    // inventoryType :params[i].inventoryType,
                    // ownerId : params[i].ownerId,
                    // skuId : params[i].skuId,
                    // lotId : params[i].lotId,
                    // traceId : params[i].traceId,
                    // lotNo : params[i].lotNo,
                    locationNo : params[i].locationNo,
                    // ownerName : params[i].ownerName,
                    // skuName : params[i].skuName,
                    // zoneId : params[i].zoneId,
                    // stockLock:params[i].stockLock
                })
            }
           return {
                reason: '',
                operateType:type,
                stockLockDetailList:stockLockDetailList
            }
        },
        // 冻结
        freezeHandle (list) {
            if(list[0].stockLock =='1'){
               return  this.$message.error('该库存已冻结！')
                    
            }
            var a = ''
            var newList = list.filter((value,index)=>{
                if(value.locationNo=='STAGE'||value.locationNo=='SORTATION'||value.qty!=value.avaliableQty){
                    a+=index+1+' '
                }
                return  value.locationNo!='STAGE'&&value.locationNo!='SORTATION'&&value.qty==value.avaliableQty
            })
            if(newList.length==0){
                 this.$message.error('所选明细均为过度库位或是有库存占用未可冻结')
                 return 
            }
            var freezeParams = this.formatFreeze(newList,'04')
            this.$prompt('原因', '提示', {
            confirmButtonText: '确定',
            beforeClose:(action, instance, done)=>{
                if(action =='confirm'&&!instance.inputValue.replace(/\s*/g,"")){
                    this.$message.error('请填写冻结原因！')
                    return
                }
                if(action =='confirm'&&instance.inputValue){
                    done()
                }
                if(action =='cancel'){
                    done()
                }
            },
            cancelButtonText: '取消'
                }).then(({ value }) => {
                freezeParams.reason = value
                api.stock.freezeStock(freezeParams).then(({ head = {}, body = {} }) => {
                if (head.code === '200') {
                    if(a){
                         this.$message.success('冻结明细成功！第'+a+'条为过度库位或有库存占用未冻结')
                    }else{
                        this.$message.success('冻结明细成功!')
                    }
                    this.queryList()
                }else{
                    this.$message.error(head.subMessage)
                }
            })
            }).catch(() => {
                  
            });
        },
        // 释放
        releaseHandle (list) {
           console.log('sss',list)
            if(list[0].stockLock =='0'){
               return  this.$message.error('该库存已释放！')
                    
            }
            var freezeParams = this.formatFreeze(list,'05')
            this.$prompt('原因', '提示', {
            confirmButtonText: '确定',
            beforeClose:(action, instance, done)=>{
                if(action =='confirm'&&!instance.inputValue.replace(/\s*/g,"")){
                    this.$message.error('请填写释放原因！')
                    return
                }
                if(action =='confirm'&&instance.inputValue){
                    done()
                }
                if(action =='cancel'){
                    done()
                }
            },
            cancelButtonText: '取消',
                }).then(({ value }) => {
                freezeParams.reason = value
                api.stock.releaseStock(freezeParams).then(({ head = {}, body = {} }) => {
                if (head.code === '200') {
                    this.$message.success('释放明细成功！')
                    this.queryList()
                }else{
                    this.$message.error(head.subMessage)
                }
            })
            }).catch(() => {      
            });
        },
        print(state){
           
        },
        // decode(str){
        //     return decodeURIComponent(atob(str).split('').map(function (c) {
        //                 return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        //             }).join(''));
        // },
        updateSubReplDlgVis (vis) {
            this.subReplDlgVis = vis
        },
        // 更新提示弹框展示
        updateToasterDialogVis (vis) {
            this.toasterDialogVis = false
        },
        
        // 代理select请求
        proxyRemoteMethod (type) {
            switch (type) {
                case 'location':
                    return (query) => {
                        console.log('aaaaaaaaaaaaaa',query)
                        return this.queryLocationList({
                            params: {
                                name: query
                            }
                        })
                    }
                case 'area':
                    return (query) => {
                        return this.queryAreasList({
                            params: {
                                name: query
                            }
                        })
                    }
                default:
                    break;
            }
        }
    }
}
</script>

