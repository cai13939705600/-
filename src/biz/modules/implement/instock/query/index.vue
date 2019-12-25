<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :bill-types='state.billTypes'
            :owner-list="state.ownerList"
            :ASN_STATE="ASN_STATE"
            :handle-search="handleSearch"/>
        <exact-list
            :state="state"
            :billTypes="state.billTypes"
            :ASN_STATE="ASN_STATE"
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
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { mapState, mapActions } from 'vuex'
import { download } from 'common/utils/download'

export default {
    name: 'implement_instock_query',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList
    },
    computed: {
        ...mapState('enums', [
           "ASN_STATE" //作业状态
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/query',
            // 模块名称
            moduleName: '入库单查询报表',
            //缓存选中的列表
            checkList:[] 
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums([
            "ASN_STATE" // 作业状态
        ])
        //获取单据类型接口数据
        this.getBillTypesAction(
            {params:{
                categoryTypeList:[10],
                thrkFlag: 0 //非退货入库
            }
        })
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
        ...mapActions('stock/query',['getBillTypesAction','getOwnerListAction','getWareHouseListAction']),
        handleEdit (row) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.updateState({ entity: row })
        },
        //将时间数据改变格式，变成年月日字符串传出
        queryToEnd (query){ 
            if (query.createTime && query.createTime.length) {
                query.createTimeStart = query.createTime[0]
                query.createTimeEnd = query.createTime[1]
            }
            delete query.createTime
            if (query.receivedTime && query.receivedTime.length) {
                query.receivedTimeStart = query.receivedTime[0]
                query.receivedTimeEnd = query.receivedTime[1]
            }
            delete query.receivedTime
            if (query.finishedTime && query.finishedTime.length) {
                query.finishedTimeStart = query.finishedTime[0]
                query.finishedTimeEnd = query.finishedTime[1]
            }
            delete query.finishedTime
        },
        //代理action 用于验证数据
        proxyActions (action) {
            const callee = this[action];
            if (callee) {
                return callee({
                    // params:{
                    //     idList
                    // }
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
                url: process.env.VUE_APP_API_PREFIX+'/wms/in/reportController/asnReportExport',
                data: query
            });
        }
    }
}
</script>

