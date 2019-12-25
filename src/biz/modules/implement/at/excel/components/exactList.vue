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
            <el-button v-if="rcMap['wi.invmagr.stockquery.export']" type="primary" size="mini" @click="handleExport">导出</el-button>
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
                { key: 'locationNo', name: '库位' },
                { key: 'skuNo', name: '物料编码' },
                { key: 'skuName', name: '物料名称' },
                { key: 'shortName', name: '物料简称' },
                { key: 'spec', name: '规格' },
                { key: 'barcode', name: '条码' },
                { key: 'qty', name: '库存数量' },
                { key: 'uom', name: '单位' },
                { key: 'inventoryTypeName', name: '库存类型' },
                { key: 'totalWeight', name: '总重量' },
                { key: 'totalVolume', name: '总体积(cm3)' },
                { key: 'inboundDate', name: '入库日期' },
                { key: 'madeDate', name: '生产日期' },
                { key: 'expireDate', name: '失效日期' },
                { key: 'produceBatch', name: '生产批次' },
                // { key: 'ownerName', name: '货主' },
                // { key: 'warehouseName', name: '仓库' },
                // { 
                //     key: '写死',
                //     name: '包装',
                //     render: (h, { index, row, col }) => {
                //         return 'EA'
                //     }
                // },
                // { key: 'retailPrice', name: '零售价' },
                { key: 'totalPrice', name: '总价' },
                // { key: 'batchCode', name: '批次编码' },
                { key: 'attr1', name: '批次属性05' },
                { key: 'attr2', name: '批次属性06' },
                { key: 'attr3', name: '批次属性07' },
                { key: 'attr4', name: '批次属性08' },
                { key: 'attr5', name: '批次属性09' },
                { key: 'attr6', name: '批次属性10' },
            ]
        }
    },
    methods: {
    }
}
</script>


