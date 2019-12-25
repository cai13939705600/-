<template>
    <div class="p-basic">
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-view="handleView"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :DO_STATE="DO_STATE.map"
            :PICK_STATE="PICK_STATE.map"/>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactList from './components/exactList'
import { mapState } from 'vuex'

const enums = [
    "DO_STATE",
    "PICK_STATE"
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
        ...mapState('enums', enums)
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/out/notice/warp',
            // 模块名称
            moduleName: '通知单明细',
            // 不直接进行查询
            immediateQuery: false
        }
    },
    
    watch: {
        'state.noticeId': function (n) {
            if (n) {
                this.handleSearch({
                    doId: n
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

