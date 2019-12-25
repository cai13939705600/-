<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :owner-list="state.ownerList"
            :store-list="state.storeList"
            :handle-search="handleSearch"/>
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :proxy-actions='proxyActions'
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :handle-export="handleExport"/>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import { isDate } from 'common/utils/lodash'
import { mapState, mapActions } from 'vuex'
import { download } from 'common/utils/download'
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'

export default {
    name: 'implement_instock_receivingSum',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList
    },
    computed: {
        ...mapState('enums', [])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/receivingSum',
            // 模块名称
            moduleName: '入库单查询报表',
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums([
            //"DELETE_FLAG" // 启停状态
        ])
        //货主下拉数据
        this.getOwnerListAction({
            params:{ page: { current: 1, size: 10000}, validFlag:1 }
        })
        // 仓库下拉列表
        // this.getWareHouseListAction({})
    },
    mounted () {

    },
    methods: {
         ...mapActions('stock/receivingSum',['getOwnerListAction','getWareHouseListAction']),
        //将时间数据改变格式，变成年月日字符串传出
        queryToEnd (query){ 
            if (query.receivedTime && query.receivedTime.length) {
                query.receivedTimeStart = query.receivedTime[0]
                query.receivedTimeEnd = query.receivedTime[1]
            }
            delete query.receivedTime
        },
        //代理action 用于验证数据
        proxyActions (action) {
            const callee = this[action];
            if (callee) {
                return callee({
                })
            } else {
                console.log("未知action" + action);
                return false;
            }
        },
        //导出
        exportHandle (data) {
            const query = cloneDeep(this.$refs.search.query)
            removeEmptyAttr(query)           
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/wms/in/reportController/receivingSummaryListExport',
                data: query
            });
        }
    }
}
</script>

