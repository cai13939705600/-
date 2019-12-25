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
                { key: 'lineNo', name: '行号' ,width:60},
                { key: 'skuCode', name: '物料编码' ,width:180},
                { key: 'skuName', name: '物料名称' ,width:180},
                { key: 'skuShortName', name: '简称' },
                { key: 'lineState', name: '订单行状态',
                    render: (h, { index, row, col }) => {
                         const en = this.ASN_STATE.map[
                            Number( row.lineState )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:ASN_STATE', row.lineState, typeof row.lineState);
                            return row.lineState
                        }
                    }
                 },
                { key: 'receivedTime', name: '收货时间' ,width:180},
                { key: 'expectQty', name: '预期数量' },
                { key: 'receivedQty', name: '收货数量' },
                { key: 'uom', name: '单位' },
                { key: 'price', name: '单价' },
                { key: 'amount', name: '金额' },
                { key: 'skuTechParam', name: '技术参数', 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.skuTechParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'toLocation', name: '收货库位' },
                { key: 'lotatt01', name: '生产日期' },
                { key: 'lotatt03', name: '生产批号' },
                { key: 'lotatt04', name: '入库日期' },
                { key: 'inventoryType', name: '库存类型' ,
                    render: (h, { index, row, col }) => {
                        for (let i = 0, len = this.inventoryTypes.length; i < len; i++) {
                            if (this.inventoryTypes[i].code === row.inventoryType) {
                               return <span>{this.inventoryTypes[i].name}</span>
                            }
                        }
                    }
                },
                /* { key: 'lotatt05', name: '批次编码' }, */
                /* { key: 'lotatt06', name: '批次属性06' },
                { key: 'lotatt07', name: '批次属性07' },
                { key: 'lotatt08', name: '批次属性08' },
                { key: 'lotatt09', name: '批次属性09' },
                { key: 'lotatt10', name: '批次属性10' }, 暂不显示*/ 
                { key: 'volume', name: '总体积(cm³)' },
                { key: 'weight', name: '总重量(kg)' },
                // { key: 'amount', name: '总价' },
                { key: 'remark', name: '备注' },
                { key: 'modifiedTime', name: '最后操作时间' ,width:180},
                { key: 'modifier', name: '操作人' }
            ]
        }
    },
    methods: {
    }
}
</script>