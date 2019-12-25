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
        :selection-change="selectionChange">
        <template slot="hd-col--l">
            <el-button v-if="rcMap['wi.inbound.asndetailquery.export']" type="primary" size="mini" @click="proxyActions('exportHandle')">导出</el-button>
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
        proxyActions:Function,
        // 作业状态
        ASN_STATE:Object,
        //单据类型
        billTypes:{},
        //库存类型
        inventoryTypes: Array,
        checktechParam: Function
    },
    data () {
        return {
            fields: [
                { key: 'asnCode', name: '入库通知单号' ,width:180},
                { key: 'lineNo', name: '行号' },
                { key: 'asnBillCode1', name: '业务单号' ,width:180},
                { key: 'warehouseName', name: '仓库' },
                { key: 'storerName', name: '货主' },
                { key: 'asnType', name: '订单类型',
                    render: (h, { index, row, col }) => {
                        for (let i = 0, len = this.billTypes.length; i < len; i++) {
                            if (this.billTypes[i].id === row.asnType) {
                               return <span>{this.billTypes[i].name}</span>
                            }
                        }
                    }
                 },
                { key: 'asnState', name: '订单状态',
                    render: (h, { index, row, col }) => {
                         const en = this.ASN_STATE.map[
                            Number( row.asnState )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:ASN_STATE', row.asnState, typeof row.asnState);
                            return row.asnState
                        }
                    }
                },
                { key: 'supplierName', name: '供应商名称' },
                { key: 'skuCode', name: '物料编码' },
                { key: 'skuName', name: '名称' },
                { key: 'skuShortName', name: '简称' },
                { key: 'expectQtyEa', name: '预期数量' },
                { key: 'receivedQty', name: '收货数量' },
                { key: 'uom', name: '单位' },
                { key: 'price', name: '单价' },
                { key: 'totalPrice', name: '金额' },
                { key: 'skuSpec', name: '规格型号' },
                { key: 'projectName', name: '项目名称'},
                { key: 'skuTechParam', name: '技术参数'  , 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.skuTechParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'receivingDifference', name: '收货差异' ,
                    render: (h, { index, row, col }) => {
                         return <span>{ row.expectQty-row.receivedQty }</span>
                    }
                },
                { key: 'lotatt04', name: '入库日期' },
                { key: 'lotatt01', name: '生产日期' },
                { key: 'lotatt02', name: '失效日期' },
                { key: 'lotatt03', name: '生产批次' },
                /* { key: 'lotatt06', name: '批次属性06' },
                { key: 'lotatt07', name: '批次属性07' },
                { key: 'lotatt08', name: '批次属性08' },
                { key: 'lotatt09', name: '批次属性09' },
                { key: 'lotatt10', name: '批次属性10' }, */
                { key: 'inventoryTypeName', name: '库存类型'},
                { key: 'volume', name: '总体积(cm³)' },
                { key: 'weight', name: '总重量(kg)' },
               /*  { key: 'amount', name: '总价' }, */
                { key: 'remark', name: '备注' },
                { key: 'createTime', name: '创建时间' ,width:180},
                { key: 'receivedTime', name: '收货时间' ,width:180},
                { key: 'creator', name: '收货人' },
                { key: 'modifiedTime', name: '完成时间' ,width:180},
                { key: 'modifier', name: '完成人' },

            ]
        }
    },
    methods: {
        onExport () {
            console.log("执行导出操作")
        }
    },
}
</script>


