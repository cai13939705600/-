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
        ASN_STATE: Object
    },
    data () {
        return {
            fields: [
               { key: 'lineNo', name: '订单行号' },
                { key: 'actionNode', name: '操作' ,
                    render: (h, { index, row, col }) => {
                        switch(row.actionNode)
                            {
                                case '010' :
                                    return <span>收货</span>;
                                    break;
                                case '011' :
                                    return <span>收货</span>;
                                    break;
                                case '012' :
                                    return <span>取消收货</span>;
                                    break;
                                case '013' :
                                    return <span>取消收货</span>;
                                    break;
                                case '020' :
                                    return <span>生成上架任务</span>;
                                    break;
                                case '021' :
                                    return <span>上架</span>;
                                    break;
                            }
                        }
                },
                { key: 'toSkuName', name: '名称' },
                /* { key: 'fromLotNo', name: 'From批次号' }, */
                { key: 'fromInventoryType', name: 'From库存类型',
                    render: (h, { index, row, col }) => {
                        for (let i = 0, len = this.inventoryTypes.length; i < len; i++) {
                            if (this.inventoryTypes[i].code === row.fromInventoryType) {
                               return <span>{this.inventoryTypes[i].name}</span>
                            }
                        }
                    }
                 },
                /* { key: 'fromStockLock', name: 'from库存锁' }, */
                { key: 'fromQty', name: 'From数量' },
                { key: 'fromLocationNo', name: 'From储位' },
               /*  { key: 'fromOwnerName', name: 'from货主名' }, */
                /* { key: 'toLotNo', name: 'To批次号' }, */
                { key: 'toInventoryType', name: 'To库存类型' ,
                    render: (h, { index, row, col }) => {
                        for (let i = 0, len = this.inventoryTypes.length; i < len; i++) {
                            if (this.inventoryTypes[i].code === row.toInventoryType) {
                               return <span>{this.inventoryTypes[i].name}</span>
                            }
                        }
                    }
                },
                //{ key: 'toStockLock', name: 'to库存锁' },
                { key: 'toQty', name: 'To数量' },
                { key: 'toLocationNo', name: 'To储位' },
                /* { key: 'toOwnerName', name: 'to货主名' },
                { key: 'toSkuName', name: 'to物料名' },
                { key: 'billNo', name: '业务单号' },
                { key: 'jobNo', name: '任务单号' },
                { key: 'operateType', name: '操作类型' }, */
                { key: 'remark', name: '备注' },
                //{ key: 'creatorId', name: '创建人ID' },
                /* { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间' }, */
                //{ key: 'modifierId', name: '修改人ID' },
                { key: 'modifier', name: '最后操作人' },
                { key: 'modifiedTime', name: '最后编辑时间' ,width:180},
            ]
        }
    },
    methods: {
    }
}
</script>