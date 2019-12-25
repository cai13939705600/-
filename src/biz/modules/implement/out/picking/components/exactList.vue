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
        :selection-change="onSelect">
        <template slot="hd-col--l">
            <el-button v-if="rcMap['wi.outbound.pick.wholePickConfirm']" @click="onPick" type="primary" size="mini">整单确认拣货</el-button>
            <el-button v-if="rcMap['wi.outbound.pick.print']" @click="onPrintPick" type="primary" size="mini">打印拣货单</el-button>
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
        handleReplace: Function,
        selectionChanges: Function,
        checktakereason: Function,
        proxyActions: Function,
        PICK_STATE: {
            type: Object,
            default: () => ({})
        },
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '拣货单号', width: 180 },
                { key: 'doCode', name: '出库通知单号', width: 180 },
                { key: 'billCode1', name: '业务单号', width: 180 },
                { key: 'billTypeName', name: '单据类型',
                    
                },
                { key: 'state', name: '状态',
                    render: (h, { index, row, col }) => {
                        const en = this.PICK_STATE[
                            Number( row.state )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:PICK_STATE', row.state, typeof row.state);
                            return row.state
                        }
                    }
                },
                
                { key: 'storerName', name: '货主' },
                { key: 'carrierName', name: '承运商' },
                { key: 'skuQty', name: '应拣总数量' },
                { key: 'takeReason', name: '领用原因'  , 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktakereason(row.takeReason)}>查看</el-link>
                        )
                    }
                },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间', width: 180 },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间', width: 180 }
            ]
        }
    },
    methods: {
        onSelect (rows) {
            this.selectionChange(rows)
            this.selectionChanges(rows)
        },
        onPick () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            this.$confirm('是否确认整单拣货', '确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.proxyActions({ action: 'comfrim', rows})
            })
        },
        onPrintPick () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            this.proxyActions({ action: 'printPick', rows})
        }
    }
}
</script>

<style lang="scss" >
    .m15 {
        margin: 0 15px;
    }
    .m15 > .el-button-group > .el-button:first-of-type {
        width: 77px;
    }
    
</style>
