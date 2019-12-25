<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :update-state="updateState"
            :handle-search="handleSearch"
            :PROJECT_TYPE="PROJECT_TYPE.array"
            :start-stop="startStop"/>
        <exact-list
            ref="exactList"
            :table-h="tableH"
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :PROJECT_TYPE="PROJECT_TYPE.map"
            :YES_FLAG="YES_FLAG.map"
            :MATERIAL_USAGE="MATERIAL_USAGE.map"
            :VOLTAGE_CLASSES="VOLTAGE_CLASSES.map"
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
            :YES_FLAG="YES_FLAG.array"
            :PROJECT_CATEGORY="PROJECT_CATEGORY.array"
            :PROJECT_TYPE="PROJECT_TYPE.array"
            :MATERIAL_USAGE="MATERIAL_USAGE.array"
            :SMALL_TYPE="SMALL_TYPE.array"
            :MONEY_SOURCE="MONEY_SOURCE.array"
            :VOLTAGE_CLASSES="VOLTAGE_CLASSES.array"
            :APPLY_COMPANY="APPLY_COMPANY.array"
            :SUPPLIES_ACCOUNT="SUPPLIES_ACCOUNT.array"
            :CONSTRUCTION_NATURE="CONSTRUCTION_NATURE.array"
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
import { mapState} from 'vuex'

const enums = [
    'YES_FLAG',//是否
    'PROJECT_TYPE',//项目类型
    'PROJECT_CATEGORY',//项目类别
    'MATERIAL_USAGE',//项目物资用途
    'SMALL_TYPE',//项目小类
    'VOLTAGE_CLASSES',//电压等级
    'APPLY_COMPANY',//申请单位、建设单位
    'SUPPLIES_ACCOUNT',//物资账
    'CONSTRUCTION_NATURE',//建设性质
    'MONEY_SOURCE',//资金来源
]
export default {
    name: 'organize_item',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog
    },
    computed:{
        ...mapState('enums', enums),
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'organize/item',
            // 模块名称
            moduleName: '项目信息',
            startStop: CNST.ENUMS.startStop,
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums(enums)
    },
    mounted () {
    },
    methods: {
        //导出
        handleExport(){
            const query = cloneDeep(this.$refs.exactSearch.query)
            removeEmptyAttr(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/ba/rest/api/project/exportExcel',
                data: query
            });
        },
        handleSave (entity, cb, type) {
            const params = entity
            if (type === 'add') {
                // 新建
                this.createEntity(params, cb)
            } else {
                // 更新
                this.updateEntity(params, cb)
            }
        },
        handleStart (itemIds) {
            this.dispatch('startOrStop', { params: { idList: itemIds ,validFlag: 1}, cb: this.queryList }) 
        },
        handleStop (itemIds) {
            this.dispatch('startOrStop', { params: { idList: itemIds ,validFlag: 0}, cb: this.queryList })
        }
    }
}
</script>

