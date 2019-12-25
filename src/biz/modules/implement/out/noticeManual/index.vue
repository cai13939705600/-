<template>
    <div class="p-basic">
        <exact-list
            :id="id"
            :code="code"
            :itemName="itemName"
            :projectName="projectName"
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"

            :proxy-actions="proxyActions"
            :handleSelectionChange="selectionChanges"
            />
        <btm-tabs
            v-show="checkList.length"
            />
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactList from './components/exactList'
import BtmTabs from './components/btmTabs'
import { download } from 'common/utils/download'
import { removeEmptyAttr, sortListByList } from 'common/utils/tools'
import { getBOIS } from 'common/utils/lodop'
import { groupBy } from 'common/utils/lodash'
import { mapState, mapActions, mapMutations } from 'vuex'

import { print } from 'common/utils/print'

const enums = [
]


export default {
    name: 'implement_out_noticeManual',
    mixins: [ PageList ],
    components: {
        ExactList,
        BtmTabs,
    },
    computed: {
        ...mapState('enums', enums),
    },
    provide () {
        return {
            getDetail: this.getDetail,
            idChange: this.idChange
        }
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/out/noticeManual',
            // 模块名称
            moduleName: '手工分配',
            immediateQuery: false,
            id: '',
            code: '',
            itemName:'',
            projectName:'',
            checkList: [],
        }
    },
    beforeCreate () {
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums(enums)
    },
    watch: {
        '$route.query.id': {
            immediate: true,
            handler: function (n) {
                this.id = n
                this.$nextTick(() => {
                    this.idChange()
                })
            }
        },
        '$route.query.code': {
            immediate: true,
            handler: function (n) {
                this.code = n
            }
        },
        '$route.query.itemName': {
            immediate: true,
            handler: function (n) {
                this.itemName = n
            }
        },
        '$route.query.projectName': {
            immediate: true,
            handler: function (n) {
                this.projectName = n
            }
        }
    },
    mounted () {
        
    },
    methods: {
        getDetail () {
            return this.detail
        },
        ...mapMutations('implement/out/noticeManual/detail', [
            'updateDetailNoticeId',
            'updateDoDetailId'
        ]),
        idChange () {
            this.updateState({ query: {id: this.id } })
            this.queryList({
                // TODO 问问 超哥 这个接口没准需要改
                berforeUpdate: body => {
                    this.detail = body
                    this.id=body.id
                    console.log(body,'body');                    
                    body.doDetailList.forEach(item => {
                        item.waitAllocated = item.quantity - item.allocatedQty
                        item.oldWaitAllocated = item.quantity - item.allocatedQty
                    });
                    return {
                        total: body.doDetailList.length,
                        records: body.doDetailList
                    }
                }
            })
        },
        // 显示 下面的详情 组件数据
        selectionChanges (rows) {
            this.checkList = rows
            if (rows.length === 1) {
                const lastData = rows[rows.length - 1];
                if (lastData) {
                    this.updateDetailNoticeId(lastData.sku.id);
                    this.updateDoDetailId(lastData.id);
                } else {
                    this.updateDetailNoticeId('');
                    this.updateDoDetailId('');
                }
            } else {
                this.updateDetailNoticeId('');
                this.updateDoDetailId('');
            }
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
        }
    }
}
</script>

