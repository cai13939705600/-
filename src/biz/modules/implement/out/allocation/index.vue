<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :handle-search="handleSearch"
            :PICK_STATE="PICK_STATE.array"
            :state="state"
            />
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"

            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"

            :PICK_STATE="PICK_STATE.map"

            :proxy-actions="proxyActions"
            />
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"/>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import { download } from 'common/utils/download'
import { removeEmptyAttr, sortListByList } from 'common/utils/tools'
import { groupBy } from 'common/utils/lodash'
import { mapState, mapActions, mapMutations } from 'vuex'

const enums = [
    "PICK_STATE"
]


export default {
    name: 'implement_out_allocation',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
    },
    computed: {
        ...mapState('enums', enums),
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/out/allocation',
            // 模块名称
            moduleName: '分配明细',
            // 子件替换弹窗是否可见
            subReplDlgVis: false,
            // 修改运营商弹框
            carrierDlgVis: false,
            // 缓存选择的通知单
            checkList: [],
            toasterDialogVis: false
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
        ...mapActions('stock/out/allocation', [
            'allocateBack',
            'pickBack',
            'shortagePicking'
        ]),
        handleEdit (data) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.updateState({
                entity: {
                    id: data.id,
                    total: data.planQty,
                    pickedQty: data.planQty - data.pickedQty,
                    name: data.sku.name,
                    already: data.pickedQty
                }
            })
        },
        // 代理action 用于验证数据
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
        // 分配回退
        backAllocate ({ params }) {
            this.allocateBack({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        // 拣货回退
        backPick ({ params }) {
            this.pickBack({
                params,
                cb: () => {
                    this.queryList()
                }
            })
        },
        // 缺量拣货
        shortagePick ({ params }) {
            this.shortagePicking({
                params: { id: params.idList[0] },
                cb: () => {
                    this.queryList()
                }
            })
        },
        queryToEnd (query) {
            if (query.createTime && query.createTime.length) {
                query.createStartTime = query.createTime[0]
                query.createEndTime = query.createTime[1]
            }
            delete query.createTime
        },
    }
}
</script>

