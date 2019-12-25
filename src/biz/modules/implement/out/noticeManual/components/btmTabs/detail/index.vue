<template>
    <div class="p-basic">
        <exact-list
            v-show="state.noticeId"
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-view="handleView"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :proxy-actions="proxyActions"
            />
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactList from './components/exactList'
import { mapState, mapActions } from 'vuex'

const enums = [
]

export default {
    mixins: [ PageList ],
    components: {
        ExactList
    },
    props: [
    ],
    computed: {
        ...mapState('enums', enums)
    },
    inject: {
        idChange: {
            default: () => {}
        },
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'implement/out/noticeManual/detail',
            // 模块名称
            moduleName: '通知单明细',
            // 不直接进行查询
            immediateQuery: false
        }
    },
    
    watch: {
        'state.noticeId': function (n) {
            if (n) {
                this.getList(n)
            }
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums(enums)
        // 获取库存类型
        // this.getInventoryTypes({})
    },
    mounted () {

    },
    methods: {
        ...mapActions('implement/out/noticeManual/detail', ['manualAllocate']),
        getList (n) {
            this.handleSearch({
                skuId: n
            }, {
                berforeUpdate: body => {
                    body.records.forEach(item => {
                        // 最小值
                        item.oldAssignQty = 0
                        item.assignQty = ''
                    });
                    return body
                }
            })
        },
        // 代理action 用于验证数据
        proxyActions ({ action, data }) {
            const callee = this[action];
            if (callee) {
                return callee(data)
            } else {
                console.log('未知action:' + action);
                return false;
            }
        },
        save (data) {
            this.manualAllocate({
                entity: data,
                cb: () => {
                    // this.handleClose()
                    // this.getList(this.state.noticeId)
                    this.idChange()
                }
            })
        }
    }
}
</script>

