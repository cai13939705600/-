<template>
    <div class="p-basic">
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :checktechParam="checktechParam"
            :handle-add="handleAdd"
            :handle-view="handleView"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :inventory-types="inventoryTypes"
            :ASN_STATE="ASN_STATE"/>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactList from './components/exactList'
import { mapState } from 'vuex'

const enums = [
    "ASN_STATE",// 作业状态
]

export default {
    name: '',
    mixins: [ PageList ],
    components: {
        ExactList
    },
    props: {
        checktechParam: Function
    },
    computed: {
        ...mapState('enums', enums),
        ...mapState('stock/return', ['inventoryTypes']),
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/return/instockNotice/receive',
            // 模块名称
            moduleName: '收货明细',
            // 不直接进行查询
            immediateQuery: false
        }
    },
    
    watch: {
        'state.asnId': function (n) {
            if (n) {
                this.handleSearch({
                    asnId: n
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