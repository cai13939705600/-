<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :handle-search="handleSearch"
            :location-loading="state.locationLoading"
            :location-list="state.locationList"
            :area-loading="state.areaLoading"
            :area-list="state.areaList"
            :proxy-remote-method="proxyRemoteMethod"
            :inventory-types="state.inventoryTypes"
            />
        <exact-list
            :state="state"
            :handle-export="handleExport"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            />
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import { cloneDeep, isDate } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'

import { mapState, mapActions } from 'vuex'


export default {
    name: 'implement_at_transaction',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList
    },
    computed: {
        ...mapState('enums', [
            
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/stock/transaction',
            // 模块名称
            moduleName: '在库',
            //immediateQuery:false
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums([
            
        ])
    },
    mounted () {

    },
    methods: {
        ...mapActions('stock/transaction', [
            'queryLocationList',
            'queryAreasList'
        ]),
        //查询条件转换格式
        queryToEnd (query) {
            //操作时间
            if (query.finishTime && query.finishTime.length) {
                query.startCreateTime = query.finishTime[0]
                query.endCreateTime = query.finishTime[1]
            }
            delete query.finishTime
        },
        // 导出
        handleExport () {
            const query = cloneDeep(this.$refs.search.query)
            removeEmptyAttr(query)
            console.log(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/wi/inventory/exportStockTransactionReportExcel',
                data: query
            });
        },
        // 代理select请求
        proxyRemoteMethod (type) {
            switch (type) {
                case 'location':
                    return (query) => {
                        return this.queryLocationList({
                            params: {
                                name: query
                            }
                        })
                    }
                case 'area':
                    return (query) => {
                        return this.queryAreasList({
                            params: {
                                name: query
                            }
                        })
                    }
                default:
                    break;
            }
        }
    }
}
</script>

