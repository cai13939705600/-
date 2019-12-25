<template>
    <div class="p-basic total_page">
        <el-tabs
            v-show="state.pickTicketId"
            v-model="active"
            type="card"
            class="suite-btm-tabs">
            <el-tab-pane label="拣货任务" name="first">
                <exact-list
                    :state="state"
                    :page-index-change="pageIndexChange"
                    :page-size-change="pageSizeChange"
                    :handle-add="handleAdd"
                    :handle-view="handleView"
                    :handle-edit="handleEdit"
                    :handle-delete="handleDelete"
                    :PICK_STATE="PICK_STATE.map"/>
            </el-tab-pane>
        </el-tabs>
        
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactList from './components/exactList'
import { mapState, mapActions } from 'vuex'

const enums = [
    "PICK_STATE",// 包裹状态
]

export default {
    name: '',
    mixins: [ PageList ],
    components: {
        ExactList
    },
    props: [
    ],
    computed: {
        ...mapState('enums', enums),
        ...mapState('stock/out', ['inventoryTypes']),
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/out/pick/total',
            // 模块名称
            moduleName: '拣货单汇总',
            // 不直接进行查询
            immediateQuery: false,
            active: 'first'
        }
    },
    
    watch: {
        'state.pickTicketId': function (n) {
            if (n) {
                this.handleSearch({
                    idList: [n]
                })
            }
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
    }
}
</script>
<style lang="scss">
.total_page /deep/ .el-tabs__header.is-top {
    margin-bottom: 0;
}
</style>
