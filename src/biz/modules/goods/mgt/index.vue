<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :update-state="updateState"
            :handle-search="handleSearch"/>
        <exact-list
            ref="exactList"
            :state="state"
            :table-h="tableH"
            :exporting="exporting"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-view="handleView"
            :handle-export="handleExport"
            :handle-import="handleImport"
            :handle-start="handleStart"
            :handle-stop="handleStop"
            :handle-logs="handleLogs"/>
        <entity-dialog
            :module-name="moduleName"
            :libraries="libraries"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :locationType="locationType"
            :VALID_FLAG="VALID_FLAG"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            :LOCATION_USE="LOCATION_USE"
            :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
            :units="state.units"
            :saving="state.saving"
            :update-vis="updateEntityDlgVis"
            :update-state="updateState"
            :query-list="queryList"
            :handle-save="handleSave"
            />
        <!-- <log-dlg
            :visible="logDlgVis"
            :loading="state.logLoading"
            :list="state.logList"
            :update-vis="updateLogDlgVis"
            :update-state="updateState"/> -->
        <import-dlg
            :visible="importDlgVis"
            :tpl-url="importTplUrl"
            :query-list="queryList"
            :import-params="importParams"
            :update-vis="updateImportDlgVis"/>
        <a ref="exportLink"></a>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import ImportDlg from 'biz/components/importDlg'
import store from './store'
import { mapActions, mapState } from "vuex"
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import LogDlg from './components/logDlg'
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'


export default {
    name: 'goods_mgt',
    mixins: [ PageList ],
    components: {
        ImportDlg,
        ExactSearch,
        ExactList,
        EntityDialog,
        LogDlg
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'goods/mgt',
            // 模块名称
            moduleName: '物料',
            // 日志弹窗是否可见
            logDlgVis: false,
            // 导出中
            exporting: false,
            libraries:[],
            locationType:[],
            // 导入弹窗是否可见
            importDlgVis: false,
            importTplUrl: '//jkyun.oss-cn-hangzhou.aliyuncs.com/longterm/0/645352747644567808.xlsx?Expires=4713732042&OSSAccessKeyId=LTAIh08vjrfC7HV0&Signature=ihSzQiXoNlijYNgoQwwK%2FYsUhAk%3D#ZXW'
        }
    },
    computed: {
        importParams () {
            return {
                importType: 'Goods',
                headValues: 'goodsName,goodsAlias,brandName,unitName,goodsMemo,skuName,skuBarcode,skuLength,skuWidth,skuHeight,skuWeight,isPaidService,isBatchManagement,isPeriodManage,shelfLife,isDoorService,isProductionMaterials',
                userHeadValues: '物料名称,物料简称,品牌名称,基本单位,货号,规格,条码,长(cm),宽(cm),高(cm),重量(kg),是否虚拟物料,批次管理,管理保质期,保质期天数,入库日期管理,生产批次管理'
            }
        },
        ...mapState('enums', [
            'LOCATION_CYCLE_CLASS',
            "LOCATION_USE",
            "LOCATION_CONSTRAINT",
            "LOCATION_CYCLE_CLASS",
            'VALID_FLAG'
        ])
    },
    created () {
        this.registStore(store)
         this.queryEnums([
            "LOCATION_CYCLE_CLASS",// 库位ABC类型
            "LOCATION_USE",// 库位用途
            "LOCATION_CONSTRAINT",// 库位限制
            "LOCATION_CYCLE_CLASS",// 库位ABC类型
            'VALID_FLAG' //启停状态
        ])
    },
    mounted () {
        this.queryLocationList()
        this.queryLocationType()
    },
    methods: {
        queryLocationList(){
            api.library.queryLibraryAreas({}).then(({head,body})=>{
                if(body&&body.records&&body.records.length){
                    this.libraries=body.records
                }
            })
        },
        queryLocationType(){
            api.library.getLocationType({}).then(({head,body})=>{
                if(body&&body.length){
                    this.locationType=body
                }
            })
        },
        //导出
        handleExport(){
            const query = cloneDeep(this.$refs.exactSearch.query)
            removeEmptyAttr(query)
            console.log(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/ba/sku/exportExcel',
                data: query
            });
        },
        updateLogDlgVis (vis) {
            this.logDlgVis = vis
        },
        updateImportDlgVis (vis) {
            this.importDlgVis = vis
        },
        getExtraExportParams () {
            return {
                excelType: 'Goods',
                typeName: '物料导出'
            }
        },
        handleImport () {
            this.updateImportDlgVis(true)
        },
        handleEdit (row) {
            console.log(row)
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.updateState({ entity: row })
        },
         // 查看按钮响应事件
        handleView (entity) {
            this.entityDlgVis = true
            this.entityDlgActn = 'view'
            if(entity.lotAttrRuleId==0){
                entity.lotAttrRuleId=null
            }
            if(entity.turnoverRuleId==0){
                entity.turnoverRuleId=null
            }
            this.updateState({ entity: entity })
        },
        handleStart (goodsIds) {
            console.log(goodsIds)
            this.dispatch('start', { params:goodsIds , cb: this.queryList })
        },
        handleStop (goodsIds) {
            this.dispatch('stop', { params:goodsIds, cb: this.queryList })
        },
        handleLogs ({ goodsId }) {
            this.updateLogDlgVis(true)
            this.dispatch('queryLogList', goodsId)
        },
        // handleSave (entity, cb, type) {
        //     const params = entity 
        //     if (type === 'add') {
        //         // 新建
        //         this.createEntity(params, cb)
        //     } else {
        //         // 更新
        //         this.updateEntity(params, cb)
        //     }
        // }
    }
}
</script>

