<template>
    <basic-list
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :setClmnsFlg="false"
        :show-action-col="false"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange">
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
import {setDate} from 'common/filters/setDate'
export default {
    mixins: [ ExactList ],
    props: {
        PICK_STATE: Object,
    },
    data () {
        return {
            fields: [
                { key: 'sku.code', name: '物料编码' },
                { key: 'sku.name', name: '物料名称' },
                { key: 'fromLocationCode', name: '拣选库位' },
                { key: 'uom', name: '单位' },
                { key: 'sku.spec', name: '规格' },
                { key: 'planQty', name: '应拣数量' },
                { key: 'pickedQty', name: '拣货数量' },
                { key: 'state', name: '状态',
                    render: (h, { index, row, col }) => {
                        const type = this.PICK_STATE[row.state];
                        if (type) {
                            return <span>{ type.enumValueCn }</span>
                        } else {
                            console.log('没有类型:PICK_STATE', row.state, typeof row.state);
                            return row.state
                        }
                    }
                },
                { key: 'toLocationCode', name: '目标库位' },
                { key: 'inventoryTypeName', name: '库存状态' },
                { key: 'lotatt01', name: '生产日期' ,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.lotatt01)}</span>
                    }
                },
                { key: 'lotatt03', name: '生产批号' },
                { key: 'lotatt04', name: '入库日期' ,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.lotatt04)}</span>
                    }
                },
                { key: 'pickingOperator', name: '拣货人' },
                { key: 'pickFinishedTime', name: '拣货时间' }
            ]
        }
    },
    methods: {
    }
}
</script>
