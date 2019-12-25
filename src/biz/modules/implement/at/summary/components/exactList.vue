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
            <el-button v-if="rcMap['wi.invmagr.collectquery.export']" type="primary" size="mini" @click="handleExport">导出</el-button>
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
                // { key: 'ownerName', name: '货主' },
                // { key: 'locationId', name: '仓库' },
                { key: 'skuNo', name: '物料' ,width:180 },
                { key: 'skuName', name: '名称' ,width:180 },
                { key: 'shortName', name: '简称' },
                { key: 'spec', name: '规格' ,width:180 },
                { key: 'barcode', name: '条码',width:240  },
                // { 
                //     key: '写死',
                //     name: '包装',
                //     render: (h, { index, row, col }) => {
                //         return 'EA'
                //     }
                // },
                { key: 'qty', name: '库存数量' },
                { key: 'uom', name: '单位' },
                { key: 'inventoryTypeName', name: '库存类型' },
                { key: 'totalWeight', name: '总重量' },
                { key: 'totalVolume', name: '总体积' },
                /* { key: 'retailPrice', name: '零售价' },
                { key: 'totalPrice', name: '总价' } */
            ]
        }
    },
    methods: {
    }
}
</script>


