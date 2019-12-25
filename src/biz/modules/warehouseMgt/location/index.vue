<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :handle-search="handleSearch"
            :libraries="libraries"
            :VALID_FLAG="VALID_FLAG"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"/>
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-batch-edit="handleBatchEdit"
            :handle-start="handleStart"
            :handle-stop="handleStop"
            :handle-import="handleImport"
            :add="add"
            :edit="edit"
            :handle-delete="handleDelete"
            :handle-export="handleExport"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            :LOCATION_USE="LOCATION_USE"
            :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
            :location-type="locationType"
            />
        <entity-dialog
            :state="state"
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"
            :libraries="libraries"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            :LOCATION_USE="LOCATION_USE"
            :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
            />
        <edit-dialog
            :module-name="moduleName"
            :visible="editDialogVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :edit-rows="editRows"
            :update-vis="updateEditDlgVis"
            :query-list="queryList"
            :handle-save="handleEditSave"
            :libraries="libraries"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            />
        <add-dialog
            :state="state"
            :module-name="moduleName"
            :visible="addDialogVis"
            :action="doAction"
            :entity="state.entity"
            :update-vis="updateAddDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"
            :libraries="libraries"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            :LOCATION_USE="LOCATION_USE"
            :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
            />
        <import-dlg
            :visible="importDlgVis"
            :update-vis="updateImportDlgVis"/>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import EditDialog from './components/editDialog'
import AddDialog from './components/addDialog'
import ImportDlg from './importDlg'

import { mapActions, mapState } from "vuex";
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'

export default {
    name: 'warehouseMgt_location',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        EditDialog,
        AddDialog,
        ImportDlg
    },
    computed: {
        ...mapState('library/location', {
           libraries: 'areasList',
           locationType: 'locationType'
        }),
        ...mapState('enums', [
            'LOCATION_CYCLE_CLASS',
            "LOCATION_USE",
            "LOCATION_CONSTRAINT",
            "LOCATION_CYCLE_CLASS",
            'VALID_FLAG'
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'library/location',
            // 模块名称
            moduleName: '库位',
            // 显示编辑框
            doAction: 'add',
            editDialogVis: false,
            addDialogVis: false,
            importDlgVis: false,
            // 准备编辑的数据
            editRows: [],
        }
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
        this.getLocationType({})
        // 获取库位列表获取库位列表
        this.changeValue()
    },
    activated () {
         this.changeValue()
    },
    methods: {
        ...mapActions('library/location', [
            'queryLibraryAreasList',
            'enableEntitiy',
            'stopEntitiy',
            'getLocationType'
        ]),
        // 编辑按钮响应事件
        handleBatchEdit (entitys) {
            this.editDialogVis = true
            this.entityDlgActn = 'edit'
            this.editRows = entitys.idList
            // this.queryEntity(entity)
        },
        updateImportDlgVis (vis) {
            this.importDlgVis = vis
        },
        handleImport () {
            this.updateImportDlgVis(true)
        },
        // 更新实体弹框可见状态
        updateEditDlgVis (vis) {
            this.editDialogVis = vis
        },
        updateAddDlgVis(vis){
            this.addDialogVis = vis
        },
        // 批量更新的保存
        handleEditSave (entity, cb) {
            this.updateEntity(entity, () => {
                cb();
                this.editDialogVis = false
                this.queryList()
            })
        },
        // 当搜索选择框中文字改变
        changeValue (value) {
            this.queryLibraryAreasList({
                entity: {
                    name: value,
                    page: {
                        current: 1,
                        size: 100
                    }
                }
            })
        },
        //新建
        add(){
            this.addDialogVis = true
            this.doAction = 'add'
            this.updateState('entity')
        },
        //修改
        edit(par){
            this.addDialogVis = true
            this.doAction = 'edit'
            this.state.entity = par
        },
        // 启用
        handleStart (entity) {
            this.enableEntitiy({
                entity,
                cb: () => {
                    this.queryList()
                }
            })
        },
        // 停用
        handleStop (entity) {
            this.stopEntitiy({
                entity,
                cb: () => {
                    this.queryList()
                }
            })
        },
        // 导出
        handleExport () {
            const query = cloneDeep(this.$refs.search.query)
            removeEmptyAttr(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/ba/rest/api/location/exportExcel',
                data: query
            });
        }
    }
}
</script>

