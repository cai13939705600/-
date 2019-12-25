<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :update-state="updateState"
            :handle-search="handleSearch"
            :start-stop="startStop"/>
        <exact-list
            ref="exactList"
            :table-h="tableH"
            :state="state"
            :exporting="exporting"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-import="handleImport"
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
            :handle-save="handleSave"/>
            <import-dlg
            :visible="importDlgVis"
            :tpl-url="importTplUrl"
            :query-list="queryList"
            :update-vis="updateImportDlgVis"/>
        <a ref="exportLink"></a>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ImportDlg from './importDlg'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'

export default {
    name: 'organize_supplier',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        ImportDlg
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'organize/supplier',
            // 模块名称
            moduleName: '供应商',
            // 导出中
            exporting: false,
            startStop: CNST.ENUMS.startStop,
            // 导入弹窗是否可见
            importDlgVis: false,
            importTplUrl: '//jkyun.oss-cn-hangzhou.aliyuncs.com/longterm/0/645352747644567808.xlsx?Expires=4713732042&OSSAccessKeyId=LTAIh08vjrfC7HV0&Signature=ihSzQiXoNlijYNgoQwwK%2FYsUhAk%3D#ZXW'
        }
    },
    created () {
        this.registStore(store)
    },
    methods: {
        //导出
        handleExport(){
            const query = cloneDeep(this.$refs.exactSearch.query)
            removeEmptyAttr(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/ba/supplier/exportExcel',
                data: query
            });
        },
        updateImportDlgVis (vis) {
            this.importDlgVis = vis
        },
        handleImport () {
            this.updateImportDlgVis(true)
        },
        // 编辑按钮响应事件
        handleEdit (rows) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.state.entity = rows[0]
            this.state.entity.leader = rows[0].contact
            this.state.entity.tel = rows[0].phone
            this.state.entity.dist = [ rows[0].province , rows[0].city , rows[0].district , rows[0].area]
            this.state.entity.vendId = rows[0].id
            console.log(this.state.entity.dist,'dist')
        },
        handleSave (entity, cb, type) {
            const params = entity
            if (type === 'add') {
                // 新建
                this.createEntity(params, cb)
            } else {
                // 更新
                debugger
                this.updateEntity(params, cb)
            }
        },
        handleStart (vendIds) {
            this.dispatch('start', { params: vendIds , cb: this.queryList })
        },
        handleStop (vendIds) {
            this.dispatch('stop', { params:  vendIds , cb: this.queryList })
            
        }
    }
}
</script>

