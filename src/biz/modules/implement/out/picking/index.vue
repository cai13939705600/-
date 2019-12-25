<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :handle-search="handleSearch"
            :PICK_STATE="PICK_STATE.array"
            />
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :checktakereason="checktakereason"
            :selection-changes="selectionChanges"
            :proxy-actions="proxyActions"
            :PICK_STATE="PICK_STATE.map"
            />
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"/>
        <btm-tabs
            v-show="checkList.length"
            :state="state"
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
import EntityDialog from './components/entityDialog'
import subReplDlg from './components/subReplDlg'
import BtmTabs from './components/btmTabs'

import { mapState, mapActions, mapMutations } from 'vuex'

import { download, preview } from 'common/utils/download'
import { removeEmptyAttr, sortListByList } from 'common/utils/tools'
import takeReasonDlg from './components/takeReasonDlg'

const enums = [
    "PICK_STATE",// 拣货单状态
]

export default {
    name: 'implement_out_picking',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        subReplDlg,
        BtmTabs,
        takeReasonDlg
    },
    computed: {
        ...mapState('enums', enums)
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/out',
            // 模块名称
            moduleName: '组合装物料',
            checkList: [],
            toasterDialogVis: false,
            takeReason: '',
            showReaDlg:false,
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
        ...mapActions('stock/out', [
            'confirmPick'
        ]),
        ...mapMutations('implement/out/pick/total', [ 'updateTotalPickTicketId' ]),
        // 选择
        selectionChanges (rows) {
            this.checkList = rows
            if (rows.length === 1) {
                const lastData = rows[rows.length - 1];
                if (lastData) {
                    // 出库通知单明细查询
                    this.updateTotalPickTicketId(lastData.id);
                } else {
                    this.updateTotalPickTicketId('');
                }
            } else {
                this.updateTotalPickTicketId('');
            }
            
        },
        //领用原因
        checktakereason(param){
            this.takeReason = param
            this.showReaDlg = true
        },
        closeReaDlg(vis){
            this.showReaDlg = vis
        },
        // 代理action 
        proxyActions ({ action, rows }) {
            const idList = rows.map(row => row.id);
            const callee = this[action];
            if (callee) {
                return callee({
                    params: {
                        idList
                    }
                }, rows)
            } else {
                console.log('未知action:' + action);
                return false;
            }
        },
        queryToEnd (query) {
            console.log('query', query);
            
            if (query.createTime && query.createTime.length) {
                query.startCreateTime = query.createTime[0]
                query.endCreateTime = query.createTime[1]
            }
            delete query.createTime
            removeEmptyAttr(query)
            if (query.doCode) {
                // 替换中文逗号,并且删除多余逗号
                query.doCode = query.doCode.replace(/(，+)|(,{2,})/g, ',')
                // 删除 开始的逗号
                .replace(/(^,)|(,$)/g, '')
            }
            if (query.billCode1) {
                // 替换中文逗号,并且删除多余逗号
                query.billCode1 = query.billCode1.replace(/(，+)|(,{2,})/g, ',')
                // 删除 开始的逗号
                .replace(/(^,)|(,$)/g, '')
            }
        },
        // 整单确认拣货
        comfrim ({ params }) {
            this.confirmPick({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        // 打印拣货单
        printPick ({ params }) {
            return preview({
                url:  process.env.VUE_APP_API_PREFIX + '/wo/pickTicket/print',
                data: {
                    idList: params.idList.join(',')
                }
            });
        },
    }
}
</script>


