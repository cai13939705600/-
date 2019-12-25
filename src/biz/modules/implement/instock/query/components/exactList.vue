<template>
    <basic-list
        :show-select-col="true"
        :show-action-col="false"
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChanges">
        <template slot="hd-col--l">
            <el-button v-if="rcMap['wi.inbound.asnquery.export']" type="primary" size="mini" @click="proxyActions('exportHandle')">导出</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        handleExport: Function,
        handleImport: Function,
        selectionChanges:Function,
        proxyActions:Function,
        // 作业状态
        ASN_STATE:Object,
        //单据类型
        billTypes:{}
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '入库通知单号' ,width:180},
                { key: 'billCode1', name: '业务单号' ,width:180},
                { key: 'projectName', name: '项目名称' },
                 { key: 'typeCn', name: '单据类型'},
                //     render: (h, { index, row, col }) => {
                //         for (let i = 0, len = this.billTypes.length; i < len; i++) {
                //             if (this.billTypes[i].id === row.type) {
                //                return <span>{this.billTypes[i].name}</span>
                //             }
                //         }
                //     }
                //  },
                { key: 'state', name: '单据状态' ,
                    render: (h, { index, row, col }) => {
                         const en = this.ASN_STATE.map[
                            Number( row.state )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:ASN_STATE', row.state, typeof row.state);
                            return row.state
                        }
                    }
                },
                { key: 'supplierName', name: '供应商名称' },
                { key: 'storerName', name: '货主' },
                { key: 'warehouseName', name: '仓库' },
                { key: 'expectQty', name: '预期数量' },
                { key: 'skuQty', name: '收货品种' },
                { key: 'receivedQty', name: '收货数量' },
                { key: 'sumVolume', name: '总体积(cm³)' },
                { key: 'sumWeight', name: '总重量(kg)' },
                /* { key: 'sumAmount', name: '总价' }, */
                { key: 'remark', name: '备注' },
                { key: 'createTime', name: '创建时间' ,width:180},
                { key: 'receivedTime', name: '收货时间' ,width:180},
                { key: 'receivedUser', name: '收货人' },
                { key: 'finishedTime', name: '完成时间' ,width:180},
                { key: 'finishedUser', name: '完成人' },
            ]
        }
    },
    methods: {
    },
}
</script>


