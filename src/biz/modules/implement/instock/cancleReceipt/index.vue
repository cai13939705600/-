<template>
    <div class="p-basic">
        <exact-search
            :update-state="updateState"
            :owner-list="state.ownerList"
            :handle-search="handleSearch"/>
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :checktechParam="checktechParam"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :selection-changes="selectionChanges"
            :proxy-actions="proxyActions"
            :handle-export="handleExport"/>
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"/>
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
import EntityDialog from './components/entityDialog'
import techParamDialog from 'biz/components/techParamDialog'

import { mapState , mapActions} from 'vuex'

export default {
    name: 'implement_instock_cancleReceipt',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        techParamDialog
    },
    computed: {
        ...mapState('enums', [
            
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/cancel',
            // 模块名称
            moduleName: '取消收货',
            //缓存选中的列表
            checkList:[],
            techDlgVis:false,
            techParam:'',
            
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
    },
    mounted () {

    },
    methods: {
        ...mapActions('stock/cancel', [
            'cancleGoodsAction',
            'getOwnerListAction'
            ]),
        handleExport () {

        },
        handleImport () {

        },
        handleEdit (row) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.updateState({ entity: row })
        },
        //选择
        selectionChanges (rows) {
            this.checkList = rows
            console.log(rows);
            // TODO

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
         // 代理action 用于验证数据
        proxyActions (action) {
            const rows = this.checkList;
            if (!rows.length) {
                return this.$message.error('请选择通知单')
            }
            const callee = this[action];
            if (callee) {
                return callee()
            } else {
                console.log('未知action:' + action);
                return false;
            }
        },
        // 取消收货
        cancleGoods() {
            const rows = this.checkList;
            const idList = rows.map(row=>row.receivingRecordDetailId);
            this.confirm('是否确认取消收货？', ()=>{
                return this.cancleGoodsAction({
                    params: idList,
                    //成功回调函数
                    cb: ()=>{
                        this.$message({type:'success',message:'成功取消收货'})
                        this.queryList();
                    },
                    //失败回调函数
                    errCb: ()=>{
                        this.$message.error('取消收货失败')
                    }
                })
            })
        },
        //查询条件转换格式
        queryToEnd (query) {
            if (query.createTime && query.createTime.length) {
                query.createTimeStart = query.createTime[0]
                query.createTimeEnd = query.createTime[1]
            }
            delete query.createTime
        },
    }
}
</script>

