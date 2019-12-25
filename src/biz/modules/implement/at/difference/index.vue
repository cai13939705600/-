<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :update-state="updateState"
            :handle-search="handleSearch"
            :STOCK_DIFF_STATUS="STOCK_DIFF_STATUS"
            />
        <exact-list
            ref="exactList"
            :table-h="tableH"
            :state="state"
            :exporting="exporting"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handleEdits="handleEdits"
            :stock-state="state.stockState"
            :STOCK_DIFF_STATUS="STOCK_DIFF_STATUS.map"
            :STOCK_DIFF_TYPE="STOCK_DIFF_TYPE.map"
            :handle-edit="handleEdit"
            :autoInventory="autoInventory"
            :handle-start="handleStart"
            :handle-stop="handleStop"
            :handle-export="handleExport"/>
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :update-state="updateState"
            :query-list="queryList"
            :STOCK_DIFF_STATUS="STOCK_DIFF_STATUS"
            :STOCK_DIFF_TYPE="STOCK_DIFF_TYPE"
            :handle-save="handleSave"/>
        <fistock-dialog
            :module-name="moduleName"
            :visible="fistockDlgVis"
            :update-vis="updateFistockDlgVis"
            :update-state="updateState"
            :query-list="queryList"
            :id="id"
            :checktechParam="checktechParam"
            :STOCK_DIFF_STATUS="STOCK_DIFF_STATUS"
            :STOCK_DIFF_TYPE="STOCK_DIFF_TYPE"
            :handle-save="handleSave"/>
        <tech-param-dialog
            :visibles="techDlgVis"
            :techParam="techParam"
            :closeTechDig="closeTechDig"
        />
        <a ref="exportLink"></a>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import { mapState, mapActions } from 'vuex'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import FistockDialog from './components/fistockDialog'
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'
import techParamDialog from 'biz/components/techParamDialog'

export default {
    name: 'implement_at_difference',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        FistockDialog,
        techParamDialog
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/at/difference',
            // 模块名称
            moduleName: '差异调整',
            // 导出中
            exporting: false,
            entityDlgVis: false,
            fistockDlgVis: false,
            id: '',
            techDlgVis:false,
            techParam:'',
        }
    },
    created () {
        this.registStore(store)
        this.queryEnums([
            "STOCK_DIFF_STATUS",
            "STOCK_DIFF_TYPE"
        ])
        this.getStockState({})
    },
    mounted () {
        console.log(this,'差异中心');   
    },
    computed:{
         ...mapState('enums', [
             "STOCK_DIFF_STATUS",
             "STOCK_DIFF_TYPE"
        ]),
    },
    methods: {
        ...mapActions('implement/at/difference', ['getStockState']),
        //导出
        handleExport(){
            const query = cloneDeep(this.$refs.exactSearch.query)
            removeEmptyAttr(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/ba/rest/api/consignee/exportExcel',
                data: query
            });
        },
        // 编辑按钮响应事件
        handleEdit (rows) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.state.entity = rows[0]
            this.state.entity.storerName = rows[0].storerName
            this.state.entity.storerId = rows[0].storerId
            this.state.entity.province = rows[0].provinceId
            this.state.entity.city = rows[0].cityId
            this.state.entity.district = rows[0].districtId
        },
         //技术参数查看
        checktechParam(param){
            console.log('sssasadasd')
            this.techParam = param
            this.techDlgVis = true
        },
        //关闭技术参数页面
        closeTechDig(vis){
            this.techDlgVis = vis
        },
        //账务差异审核
        handleEdits(id){
            this.fistockDlgVis = true
            this.id = id
        },
        updateFistockDlgVis(vis){
            this.fistockDlgVis = false
        },
        handleSave (entity, cb, type) {
            const params = entity
                this.updateEntity(params, cb)
        },
        // 启用
        handleStart (receiverIds) {
            this.dispatch('startOrStop', { params: { idList: receiverIds ,validFlag: 1}, cb: this.queryList })
        },
        // 停用
        handleStop (receiverIds) {
            this.dispatch('startOrStop', { params: { idList: receiverIds ,validFlag: 0}, cb: this.queryList })
        },
        //将查询条件转为后台需要的格式
        queryToEnd (query){ 
            console.log(query)
            if(query.skuName){
                delete query.skuName
            }else{
                delete query.skuId
            }
            if (query.createTime && query.createTime.length) {
                query.startTime = query.createTime[0]
                query.endTime = query.createTime[1]
            }
            delete query.createTime
            console.log("执行queryTOEnd",query)
        },
        //自动盘点
        autoInventory(){
            api.stock.autoPandian({}).then(({head,body})=>{
                if(head.code==200){
                    this.$message.success(head.message)
                    this.queryList()
                }
            })
        },
    }
}
</script>