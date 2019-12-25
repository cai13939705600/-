<template>
    <div class="p-basic notice-page">
        <exact-search
            ref="search"
            :update-state="updateState"
            :handle-search="handleSearch"
            :DO_STATE="DO_STATE.array"
            :state="state"
            />
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :checktechParam="checktechParam"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :handle-export="handleExport"
            :DO_STATE="DO_STATE.map"
            :GET_METHOD="GET_METHOD.map"
            :YES_FLAG="YES_FLAG.map"
            :proxy-actions="proxyActions"
            :handleSelectionChange="selectionChanges"
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
import { download } from 'common/utils/download'
import { removeEmptyAttr, sortListByList } from 'common/utils/tools'
import { groupBy } from 'common/utils/lodash'
import { mapState, mapActions, mapMutations } from 'vuex'
import techParamDialog from 'biz/components/techParamDialog'

const enums = [
    "DO_STATE",
    //领料方式
    'GET_METHOD',
    //是否有安装费、是否紧急
    'YES_FLAG'
]


export default {
    name: 'implement_out_dodetailquery',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        techParamDialog
    },
    computed: {
        ...mapState('enums', enums),
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/out/dodetailquery',
            // 模块名称
            moduleName: '出库单明细查询',
            // 子件替换弹窗是否可见
            subReplDlgVis: false,
            // 修改运营商弹框
            carrierDlgVis: false,
            // 缓存选择的通知单
            checkList: [],
            toasterDialogVis: false,
            techDlgVis:false,
            techParam:'',
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums(enums)
        // 获取单据类型
        this.getBillTypeList({})
    },
    mounted () {
    },
    methods: {
        ...mapActions('stock/out/dodetailquery', [
            'getBillTypeList',
            'checkStockNotice',
            'checkBackStockNotice',
            'cancelStockNotice',
            'autoAllocate'
        ]),
        ...mapMutations('implement/out/dodetailquery/detail', [
            'updateDetailNoticeId'
        ]),
        updateSubReplDlgVis (vis) {
            this.subReplDlgVis = vis
        },
        updateCarrierDlgVis (vis) {
            this.carrierDlgVis = vis
        },
        handleExport () {
            console.log("导出出库单明细");
            const data = Object.assign({}, this.$refs.search.query);
            this.queryToEnd(data)
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/wo/rest/api/dodetail/exportExcel',
                data
            });
        },
        // 显示 下面的详情 组件数据
        selectionChanges (rows) {
            this.checkList = rows
            const lastData = rows[rows.length - 1];
            if (lastData) {
                this.updateDetailNoticeId(lastData.id);
                this.updateWarpNoticeId(lastData.id);
            } else {
                this.updateDetailNoticeId('');
                this.updateWarpNoticeId('');
            }
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
        proxyActions ({ action, rows }) {
            const idList = rows.map(row => row.id);
            const callee = this[action];
            if (callee) {
                return callee({
                    idList
                }, rows)
            } else {
                console.log('未知action:' + action);
                return false;
            }
        },
        queryToEnd (query) {
            if (query.createTime && query.createTime.length) {
                query.createStartTime = query.createTime[0]
                query.createEndTime = query.createTime[1]
            }
            if (query.finishTime && query.finishTime.length) {
                query.finishStartTime = query.finishTime[0]
                query.finishEndTime = query.finishTime[1]
            }
            //codeList 、billCode1List为null时候删除
            if (query.codeList && query.codeList[0] == null){
                delete query.codeList
            }
            if (query.billCode1List && query.billCode1List[0] == null){
                delete query.billCode1List
            }
            delete query.createTime
            delete query.finishTime
        },
        // 审核
        examine (params) {
            this.checkStockNotice({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        reject (params) {
            this.checkBackStockNotice({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        cancel (params) {
            this.cancelStockNotice({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        auto (params) {
            this.autoAllocate({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        manual (params, rows) {
            this.$router.push({
                path: '/implement/out/noticeManual',
                query: {
                    id: rows[0].id,
                    code: rows[0].billCode1
                }
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.notice-page {
    position: relative;
}
</style>
