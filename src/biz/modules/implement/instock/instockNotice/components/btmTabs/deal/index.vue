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
    props: [
    ],
    computed: {
        ...mapState('enums', enums),
        ...mapState('stock/inStock', ['inventoryTypes']),
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/instock/instockNotice/deal',
            // 模块名称
            moduleName: '入库操作日志',
            // 不直接进行查询
            immediateQuery: false
        }
    },
    
    watch: {
        'state.asnCode': function (n) {
            if (n) {
                this.handleSearch({
                    asnCode: n
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