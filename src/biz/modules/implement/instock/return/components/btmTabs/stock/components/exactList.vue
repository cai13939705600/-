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
        inventoryTypes: Array,
        ASN_STATE: Object,
        checktechParam:Function
    },
    data () {
        return {
            fields: [
                { key: 'lineNo', name: '入库单行号' },
                { key: 'state', name: '收货状态' ,
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
                { key: 'sku.code', name: '物料编码' },
                { key: 'sku.name', name: '物料名称' },
                { key: 'sku.techParam', name: '技术参数', 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.sku.techParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'expectQtyEa', name: '预期数量' },
                { key: 'receivedQtyEa', name: '收货数量' },
                { key: 'uom', name: '包装单位' },
                { key: 'weight', name: '重量(kg)' },
                { key: 'volume', name: '体积(cm³)' }
            ]
        }
    },
    methods: {
    }
}
</script>