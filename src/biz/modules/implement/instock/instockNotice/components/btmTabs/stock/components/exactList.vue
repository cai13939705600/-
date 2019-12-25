<template>
    <basic-list
        :fields="fields"
        :loading="state.loading"
        :setClmnsFlg="false"
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
                { key: 'expectQty', name: '预期数量' },
                { key: 'receivedQty', name: '收货数量' },
                { key: 'uom', name: '包装单位' },
                { key: 'weight', name: '重量(kg)' },
                { key: 'volume', name: '体积(cm³)' },
                // 新增字段--后台还未给文档，暂用体积的值
                { key: 'price', name: '单价(元)' },
                { key: 'unitTax', name: '单位税额(元)' },
                { key: 'amount', name: '金额(元)' },
                { key: 'sku.techParam', name: '技术参数', 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.sku.techParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'totalTax', name: '税额(元)' },
                { key: 'totalPriceTax', name: '价税合计(元)' },
            ]
        }
    },
    methods: {
    }
}
</script>