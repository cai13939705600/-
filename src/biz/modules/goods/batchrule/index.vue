<template>
    <div class="p-basic">
        <exact-search
            :update-state="updateState"
            :VALID_FLAG="VALID_FLAG"
            :handle-search="handleSearch"/>
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :export-url="exportUrl"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-start="handleStart"
            :handle-stop="handleStop"
            :handle-delete="handleDelete"
            :handle-import="handleImport"/>
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :saving="state.saving"
            :confirm="confirm"
            :YES_FLAG="YES_FLAG"
            :ATTR_FORMAT="ATTR_FORMAT"
            :update-vis="updateEntityDlgVis"
            :update-state="updateState"
            :query-list="queryList"
            :handle-save="handleSave"/>
    </div>
</template>

<script>
import qs from 'qs'
import cookie from 'js-cookie'
import PageList from 'biz/mixins/pageList'
import store from './store'
import { mapState } from 'vuex'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'

export default {
    name: 'goods_batchrule',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'goods/batchrule',
            // 模块名称
            moduleName: '批次规则',
            // 导入弹窗是否可见
            importDlgVis: false
        }
    },
    computed: {
         ...mapState('enums', [
            "BILL_CATEGORY_TYPE",// 单据大类
            "VALID_FLAG",
            'YES_FLAG',
            'ATTR_FORMAT'
        ]),
        exportUrl () {
            const url = process.env.VUE_APP_API_PREFIX + '/rest/api/skuBarcode/exportExcel?'
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
        this.queryEnums([
            "BILL_CATEGORY_TYPE",// 单据大类
            "VALID_FLAG",
            'YES_FLAG',
            'ATTR_FORMAT'
        ])
    },
    beforeCreate(){
        //  this.allFields = [ 'id', 'code', 'name', 'remark',{ key: 'lotatt01Name', default:'生产日期' } ,'lotatt01Validate', 'lotatt01Type',{ key: 'lotatt02Name', default:'失效日期' } ,'lotatt02Validate', 'lotatt02Type',{ key: 'lotatt03Name', default:'入库日期' } ,'lotatt03Validate', 'lotatt03Type',{ key: 'lotatt04Name', default:'生产批次' } ,'lotatt04Validate', 'lotatt04Type','lotatt05Name' ,'lotatt05Validate', 'lotatt05Type','lotatt06Name' ,'lotatt06Validate', 'lotatt06Type'
        // ,'lotatt07Name' ,'lotatt07Validate', 'lotatt07Type','lotatt08Name' ,'lotatt08Validate', 'lotatt08Type','lotatt09Name' ,'lotatt09Validate', 'lotatt09Type','lotatt10Name' ,'lotatt10Validate', 'lotatt10Type'
        // ]
    },
    mounted () {

    },
    methods: {
        handleStart (goodsIds) {
            console.log(goodsIds)
            this.dispatch('startss', { params:{idList:goodsIds,validFlag:1} , cb: this.queryList })
        },
        handleStop (goodsIds) {
            this.dispatch('startss', { params:{idList:goodsIds,validFlag:0}, cb: this.queryList })
        },
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
            const msg = '确定删除选中的批次规则吗？'
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

