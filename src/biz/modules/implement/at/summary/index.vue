<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :handle-search="handleSearch"
            :EC_PLATFORM="EC_PLATFORM"
            :location-loading="state.locationLoading"
            :location-list="state.locationList"
            :area-loading="state.areaLoading"
            :area-list="state.areaList"
            :inventoryTypes="inventoryTypes"
            :proxy-remote-method="proxyRemoteMethod"
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
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'

import { mapState, mapActions } from 'vuex'

export default {
    name: 'implement_at_summary',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList
    },
    computed: {
        ...mapState('enums', [
            'EC_PLATFORM'
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/stock/summary',
            // 模块名称
            moduleName: '在库',
            inventoryTypes:[]
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums([
            
        ])
         api.stock.getInventoryTypes({}).then(
            ({ head = {}, body = {} }) => {
                if (head.code === '200') {
                   console.log(body)
                   this.inventoryTypes = body
                }
            }
            )
    },
    mounted () {

    },
    methods: {
        ...mapActions('stock/summary', [
            'queryLocationList',
            'queryAreasList'
        ]),
         // 导出
        handleExport () {
            const query = cloneDeep(this.$refs.search.query)
            removeEmptyAttr(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX + '/wi/inventory/exportGroupStockReportExcel.do',
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

