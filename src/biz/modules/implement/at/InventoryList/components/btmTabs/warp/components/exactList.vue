<template>
    <basic-list
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :show-action-col="false"
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
        DO_STATE: Object,
        PICK_STATE: Object
    },
    data () {
        return {
            fields: [
                { key: 'doCode', name: '出库通知单号' },
                { key: 'lineNo', name: '出库通知单行号' },
                { key: 'sku.code', name: '物料编码' },
                { key: 'sku.name', name: '物料名称' },
                { key: 'fromLocationCode', name: '拣选库位' },
                { key: 'uom', name: '单位' },
                { key: 'sku.spec', name: '规格' },
                { key: 'planQty', name: '应拣数量' },
                { key: 'sku.grossWeight', name: '重量' },
                { key: 'sku.volume', name: '体积' },
                { key: 'allocatedQty', name: '分配数量' },
                { key: 'pickedQty', name: '拣货数量' },
                { key: 'state', name: '状态',
                    render: (h, { index, row, col }) => {
                        const en = this.PICK_STATE[
                            Number( row.state )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:PICK_STATE', row.state, typeof row.state, this.PICK_STATE);
                            return row.state
                        }
                    }
                },
                { key: 'toLocationCode', name: '目标库位' },
                { key: 'lotatt01', name: '生产日期' },
                { key: 'lotatt03', name: '生产批号' },
                { key: 'lotatt04', name: '入库日期' },
                { key: 'inventoryTypeName', name: '库存类型' },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间' },
                { key: 'pickingOperator', name: '拣货人' },
                { key: 'pickFinishedTime', name: '拣货时间' },
            ]
        }
    },
    methods: {
    }
}
</script>
