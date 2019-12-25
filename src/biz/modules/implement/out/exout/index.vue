<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :handle-search="handleSearch"
            :location-loading="state.locationLoading"
            :location-list="state.locationList"
            :area-loading="state.areaLoading"
            :YES_FLAG="enums.YES_FLAG.array"
            :area-list="state.areaList"
            :proxy-remote-method="proxyRemoteMethod"
            :inventory-types="state.inventoryTypes"
            />
        <exact-list
            :state="state"
            :handle-export="handleExport"
            :YES_FLAG="enums.YES_FLAG.map"
            :checktakereason="checktakereason"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            />
        <takeReasonDlg
            :showReaDlg="showReaDlg"
            :takeReason="takeReason"
            :closeReaDlg="closeReaDlg"
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
import takeReasonDlg from './components/takeReasonDlg'

import { mapState, mapActions } from 'vuex'


export default {
    name: 'implement_out_exout',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        takeReasonDlg
    },
    computed: {
        ...mapState('enums', [
            'YES_FLAG'
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/stock/exout',
            // 模块名称
            moduleName: '出库',
            takeReason: '',
            showReaDlg:false,
            //immediateQuery:false
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums([
            'YES_FLAG'
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
                query.startTime = query.finishTime[0]
                query.endTime = query.finishTime[1]
            }
            delete query.finishTime
        },
        //领用原因
        checktakereason(param){
            this.takeReason = param
            this.showReaDlg = true
        },
        closeReaDlg(vis){
            this.showReaDlg = vis
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

