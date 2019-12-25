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
        <a ref="exportLink"></a>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'

export default {
    name: 'warehouseMgt_warehouse',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'warehouseMgt/warehouse',
            // 模块名称
            moduleName: '仓库',
            // 导出中
            exporting: false,
            startStop: CNST.ENUMS.startStop,
        }
    },
    created () {
        this.registStore(store)
    },
    mounted () {

    },
    methods: {
        //导出
        handleExport(){
            const query = cloneDeep(this.$refs.exactSearch.query)
            removeEmptyAttr(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/ba/rest/api/warehouse/exportExcel',
                data: query
            });
        },
        // 编辑按钮响应事件
        handleEdit (rows) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.state.entity = rows[0]
        },
        handleSave (entity, cb, type) {
            const params = entity
            if (type === 'add') {
                // 新建
                this.createEntity(params, cb)
            } else {
                // 更新
                delete params.code
                this.updateEntity(params, cb)
            }
        },
        handleStart (warehouseIds) {
            this.dispatch('start', { params: { idList: warehouseIds }, cb: this.queryList })
        },
        handleStop (warehouseIds) {
            this.dispatch('stop', { params: { idList: warehouseIds } , cb: this.queryList })
        }
    }
}
</script>

