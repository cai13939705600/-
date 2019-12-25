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
            <el-button v-if="rcMap['wi.invmagr.transactionquery.export']" type="primary" size="mini" @click="handleExport">导出</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        selectionChanges: Function,
        proxyActions: Function,
        handleExport: Function
    },
    data () {
        return {
            fields: [
                { key: 'operateTypeName', name: '操作类型' },
                { key: 'actionNodeName', name: '动作节点' },
                { key: 'billNo', name: '单号' ,width:180 },
                /* { key: 'lineNo', name: '明细行号' }, */
                { key: 'fromSkuName', name: 'From 物料' ,width:180 },
                // { key: 'fromLotNo', name: 'From 批次号',width:220  },
                { key: 'fromLocationNo', name: 'From 库位' },
                { key: 'fromQty', name: 'From 数量' },
                { key: 'toSkuName', name: 'To 物料' },
                // { key: 'toLotNo', name: 'To 批次号' ,width:220 },
                { key: 'toLocationNo', name: 'To 库位' },
                { key: 'toQty', name: 'To 数量' },
                { key: 'remark', name: '备注' },
                { key: 'reason', name: '原因' },
                { key: 'createTime', name: '操作时间' ,width:180 },
                { key: 'creator', name: '操作人' }
            ]
        }
    },
    methods: {
    }
}
</script>


