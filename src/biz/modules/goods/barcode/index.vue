<template>
    <div class="p-basic">
        <exact-search
            :update-state="updateState"
            :handle-search="handleSearch"/>
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :export-url="exportUrl"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :handle-import="handleImport"/>
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :saving="state.saving"
            :confirm="confirm"
            :update-vis="updateEntityDlgVis"
            :update-state="updateState"
            :query-list="queryList"
            :handle-save="handleSave"/>
        <import-dlg
            :visible="importDlgVis"
            :update-vis="updateImportDlgVis"/>
    </div>
</template>

<script>
import qs from 'qs'
import cookie from 'js-cookie'
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import ImportDlg from './components/importDlg'

export default {
    name: 'goods_barcode',
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
            storeKey: 'goods/barcode',
            // 模块名称
            moduleName: '作业条码',
            // 导入弹窗是否可见
            importDlgVis: false
        }
    },
    computed: {
        exportUrl () {
            const url = process.env.VUE_APP_API_PREFIX + '/ba/rest/api/skuBarcode/exportExcel?'
            const queryStr = qs.stringify({
                ...this.query,
                jwt: cookie.get('jwt'),
                tenantId: cookie.get('tenantId'),
                qpId: cookie.get('qpId')
            })
            return url + queryStr
        }
    },
    created () {
        this.registStore(store)
    },
    mounted () {

    },
    methods: {
        updateImportDlgVis (vis) {
            this.importDlgVis = vis
        },
        handleImport () {
            this.updateImportDlgVis(true)
        },
        handleEdit (row) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.updateState({ entity: row })
        },
        handleDelete (items) {
            const msg = '确定删除选中的物料作业条码吗？'
            const cb = () => {
                if (this.state.list.length === 1) {
                    this.updateState({ pageIndex: 0 })
                }
                this.queryList()
            }
            this.confirm(msg, () => {
                this.dispatch('deleteEntity', {
                    params: items,
                    cb
                })
            })

        },
        handleSave (entity, cb, type) {
            this.dispatch('saveEntity', { entity, cb })
        }
    }
}
</script>

