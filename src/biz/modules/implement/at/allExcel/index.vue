<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :state="state"
            :update-state="updateState"
            :handle-search="handleSearch"
            :location-loading="state.locationLoading"
            :location-list="state.locationList"
            :area-loading="state.areaLoading"
            :area-list="state.areaList"
            :OwnerList="OwnerList"
            :inventory-types="inventoryTypes"
            :proxy-remote-method="proxyRemoteMethod"
            />
        <exact-list
            :state="state"
            :handle-export="handleExport"
            :checktechParam="checktechParam"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            />
         <tech-param-dialog
            :visibles="techDlgVis"
            :techParam="techParam"
            :closeTechDig="closeTechDig"
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
import techParamDialog from 'biz/components/techParamDialog'


import { mapState, mapActions } from 'vuex'

export default {
    name: 'implement_at_allExcel',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        techParamDialog
    },
    computed: {
        ...mapState('enums', [
            
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/allExcel',
            // 模块名称
            moduleName: '在库',
            inventoryTypes:[],
            OwnerList:[],
            techDlgVis:false,
            techParam:'',
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
        this.getOwnerList()
    },
    methods: {
        ...mapActions('stock/at', [
            'queryLocationList',
            'queryAreasList',
        ]),
        //货主
        getOwnerList(){
             api.role.getStorerList({page: {
                    current: 1,
                    size: 10000
                }}).then(({ head = {}, body = [] })=>{  
                if(head.code==200){
                    this.OwnerList = body
                }
          }).catch((error)=>{  
            console.log(error);  
          });  
        },
        // 导出
        handleExport () {
            const query = cloneDeep(this.$refs.search.query)
            removeEmptyAttr(query)
            return download({
                url:process.env.VUE_APP_API_PREFIX+ '/wi/inventory/totalStockExport',
                data: query
            });
        },
        //技术参数查看
        checktechParam(param){
            this.techParam = param
            this.techDlgVis = true
        },
        //关闭技术参数页面
        closeTechDig(vis){
            this.techDlgVis = vis
        },
         queryToEnd (query) {
            if (isDate(query.expireDate)){
                query.expireDate = jt.date.format(+new Date(query.expireDate), 'yyyy-MM-dd')
            }
             if (isDate(query.inboundDate)){
                query.inboundDate = jt.date.format(+new Date(query.inboundDate), 'yyyy-MM-dd')
            }
             if (isDate(query.madeDate)){
                query.madeDate = jt.date.format(+new Date(query.madeDate), 'yyyy-MM-dd')
            }
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

