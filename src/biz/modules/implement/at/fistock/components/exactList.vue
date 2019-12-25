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
            <el-button v-if="rcMap['wi.invmagr.allstockquery.export']" type="primary" size="mini" @click="adjustItem">项目调整</el-button>
            <el-button v-if="rcMap['wi.invmagr.allstockquery.export']" type="primary" size="mini" @click="changeAmounts">修改金额</el-button>
            <el-button v-if="rcMap['wi.invmagr.allstockquery.export']" type="primary" size="mini" @click="handleExport">导出</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
import {setDate} from 'common/filters/setDate'
export default {
    mixins: [ ExactList ],
    props: {
        selectionChanges: Function,
        proxyActions: Function,
        handleExport: Function,
        showAdjust: Function,
        changeAmount:Function,
        checktechParam: Function
    },
    data () {
        return {
            fields: [
                { key: 'skuCode', name: '物料编码' },
                { key: 'skuName', name: '物料名称' },
                { key: 'skuSpec', name: '规格型号' },
                { key: 'qty', name: '库存数量' },
                { key: 'skuUom', name: '单位' },
                { key: 'skuTechParam', name: '技术参数', 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.skuTechParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'supplierName', name: '供应商' },
                { key: 'price', name: '单价' },
                { key: 'totalPrice', name: '金额' },
                { key: 'availableQty', name: '可用数量' },
                { key: 'assignQty', name: '分配数量' },
                { key: 'totalWeight', name: '总重量' },
                { key: 'totalVolume', name: '总体积(cm3)' },
                { key: 'itemName', name: '项目名称' },
                { key: 'inventoryTypeName', name: '库存类型' },
                { key: 'warehouseName', name: '仓库名称' },
                { key: 'inboundDate', name: '入库日期' ,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.inboundDate)}</span>
                    }
                },
                { key: 'madeDate', name: '生产日期' ,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.madeDate)}</span>
                    }
                },
                { key: 'expireDate', name: '失效日期' ,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.expireDate)}</span>
                    }
                },
                { key: 'produceBatch', name: '生产批次' },
                // { key: 'ownerName', name: '货主' },
                { key: 'itemMemo', name: '项目调整原因' },
                { key: 'priceMemo', name: '金额调整原因' },
                { key: 'createTime', name: '创建时间' ,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.createTime)}</span>
                    }
                },
                
                // { key: 'batchCode', name: '批次编码' },
                { key: 'creator', name: '创建人' },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间' ,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.modifiedTime)}</span>
                    }
                },
                
            ],
            
        }
    },
    methods: {
        adjustItem(){
            this.showAdjust(true)
        },
        changeAmounts(){
             this.changeAmount(true)
        }
    }
}
</script>


