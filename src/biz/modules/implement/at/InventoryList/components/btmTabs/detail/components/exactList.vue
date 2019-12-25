<template>
    <basic-list
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :show-action-col="false"
        :indexColLabel="'行号'"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange">
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        DO_STATE: Object
    },
    data () {
        return {
            fields: [
                { key: 'locationNo', name: '库位' },
                { key: 'sku.code', name: '物料编码' },
                { key: 'sku.name', name: '物料名称' },
                { key: 'inventoryTypeName', name: '库存状态' },
                { key: 'sku.uom', name: '单位' },
                { key: 'qty', name: '原始数量' },
                { key: 'actualQty', name: '盘点数量' },
                { key: 'differQty', name: '差异数量' },
            ]
        }
    },
    methods: {
    }
}
</script>
