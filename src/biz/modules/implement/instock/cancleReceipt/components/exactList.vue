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
            <el-button v-if="rcMap['wi.inbound.cancelreceive.cancel']" type="primary" size="mini" @click="proxyActions('cancleGoods')">取消收货</el-button>
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
        proxyActions: Function,
        selectionChanges:Function,
        checktechParam: Function
    },
    data () {
        return {
            fields: [
                { key: 'asnCode', name: '入库通知单号' },
                { key: 'billCode1', name: '业务单号' },
                /* { key: 'lineNo', name: '行号' }, */
                /* { key: 'skuCode', name: '物料' }, */
                { key: 'skuName', name: '物料名称' },
                { key: 'price', name: '单价' },
                { key: 'amount', name: '金额' },
                { key: 'skuTechParam', name: '技术参数' , 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.skuTechParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'skuSpec', name: '规格' },
                { key: 'supplierName', name: '供应商' },
                { key: 'projectName', name: '项目名称' },
                { key: 'storerName', name: '货主' },
                { key: 'createTime', name: '收货时间' },
                { key: 'creator', name: '收货人' },
            ]
        }
    },
    methods: {
        
    }
}
</script>


