<template>
    <div class="p-basic">
        <exact-search
            :update-state="updateState"
            :VALID_FLAG="VALID_FLAG"
            :handle-search="handleSearch"/>
        <exact-list
            :state="state"
            :VALID_FLAG="VALID_FLAG"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            />
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
    name: 'goods_rfidMgt',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'goods/rfidMgt',
            // 模块名称
            moduleName: 'RFID管理',
            // 导入弹窗是否可见
            importDlgVis: false
        }
    },
    computed: {
        ...mapState('enums', [
             "VALID_FLAG",
        ]),
    },
    created () {
        this.registStore(store)
         this.queryEnums([
            "VALID_FLAG",
        ])
    },
    mounted () {

    },
    methods: {
       queryToEnd (query) {
            if (query.createTime && query.createTime.length) {
                query.createStartTime = query.createTime[0]
                query.createEndTime = query.createTime[1]
            }
            if (query.finishTime && query.finishTime.length) {
                query.createStartTime = query.finishTime[0]
                query.createEndTime = query.finishTime[1]
            }
            delete query.createTime
            delete query.finishTime
        },
    }
}
</script>

