<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :bill-types='state.billTypes'
            :ASN_STATE="ASN_STATE"
            :owner-list="state.ownerList"
            :store-list="state.storeList"
            :update-state="updateState"
            :handle-search="handleSearch"/>
        <exact-list
            :state="state"
            :billTypes="state.billTypes"
            :ASN_STATE="ASN_STATE"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :checktechParam="checktechParam"
            :proxy-actions='proxyActions'
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :handle-export="handleExport"/>
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
import { isDate } from 'common/utils/lodash'
import { mapState, mapActions } from 'vuex'
import { download } from 'common/utils/download'
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import techParamDialog from 'biz/components/techParamDialog'

export default {
    name: 'implement_instock_detail',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        techParamDialog
    },
    computed: {
        ...mapState('enums', [
            "ASN_STATE" //作业状态
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/detail',
            // 模块名称
            moduleName: '入库单查询报表',
            techDlgVis:false,
            techParam:'',    
        }
    },
    created () {
        //刷新页面
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
        // 获取库存类型
        this.getInventoryTypes({})
        //货主下拉数据
        this.getOwnerListAction({
            params:{ page: { current: 1, size: 10000}, validFlag:1 }
        })
        // 仓库下拉列表
        //this.getWareHouseListAction({})
    },
    mounted () {

    },
    methods: {
        ...mapActions('stock/detail',['getBillTypesAction','getInventoryTypes','getOwnerListAction','getWareHouseListAction']),
        handleExport () {

        },
        handleImport () {

        },
        handleEdit (row) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.updateState({ entity: row })
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
       
        //将时间数据改变格式，变成年月日字符串传出
        queryToEnd (query){ 
            /* if (isDate(query.finishedTimeEnd)){
                query.finishedTimeEnd = jt.date.format(+new Date(query.finishedTimeEnd), 'yyyy-MM-dd hh：mm')
            } */
            if (query.lotatt01 && query.lotatt01.length) {
                query.lotatt01Start = query.lotatt01[0]
                query.lotatt01End = query.lotatt01[1]
            }
            delete query.lotatt01
            if (query.lotatt02 && query.lotatt02.length) {
                query.lotatt02Start = query.lotatt02[0]
                query.lotatt02End = query.lotatt02[1]
            }
            delete query.lotatt02
            if (query.lotatt04 && query.lotatt04.length) {
                query.lotatt04Start = query.lotatt04[0]
                query.lotatt04End = query.lotatt04[1]
            }
            delete query.lotatt04
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
                url: process.env.VUE_APP_API_PREFIX+'/wms/in/reportController/asnDetailReportExport',
                data: query
            });
        }
    }
}
</script>

