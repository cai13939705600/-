<template>
    <basic-list
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :setClmnsFlg="false"
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
        DO_STATE: Object,
        checktechParam: Function,
    },
    data () {
        return {
            fields: [
                { key: 'state', name: '行状态', 
                    render: (h, { index, row, col }) => {
                         const en = this.DO_STATE[
                            Number( row.state )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:DO_STATE', row.state, typeof row.state);
                            return row.state
                        }
                    }
                },
                { key: 'skuCode', name: '物料编码' },
                { key: 'skuName', name: '物料名称',width:220 },
                { key: 'spec', name: '规格' ,width:220},
                { key: 'uom', name: '单位' },
                { key: 'supplierName', name: '供应商' },
                { key: 'price', name: '单价' },
                { key: 'totalPrice', name: '金额' },
                { key: 'techParam', name: '技术参数' 
                    , 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.techParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'quantity', name: '应拣数量' },
                { key: 'allocatedQty', name: '分配数量' },
                { key: 'pickedQty', name: '拣货数量' },
                { key: 'checkedQty', name: '复核数量' },
                { key: 'outboundQty', name: '发货数量' },
                { key: 'remark', name: '备注' }
            ]
        }
    },
    methods: {
    }
}
</script>
