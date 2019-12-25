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
            <!-- <el-button v-if="rcMap['wi.invmagr.allstockquery.export']" type="primary" size="mini" @click="adjustItem">项目调整</el-button>
            <el-button v-if="rcMap['wi.invmagr.allstockquery.export']" type="primary" size="mini" @click="handleExport">修改金额</el-button> -->
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
        checktechParam: Function
    },
    data () {
        return {
            fields: [
                { key: 'skuCode', name: '物料编码' },
                { key: 'skuName', name: '物料名称' },
                { key: 'skuShortName', name: '物料简称' },
                { key: 'skuSpec', name: '规格' },
                { key: 'skuBarcode', name: '条码' },
                { key: 'qty', name: '库存数量' },
                { key: 'skuUom', name: '单位' },
                { key: 'inventoryTypeName', name: '库存类型' },
                { key: 'totalWeight', name: '总重量' },
                { key: 'totalVolume', name: '总体积(cm3)' },
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
                { key: 'price', name: '单价' },
                { key: 'supplierName', name: '供应商' },
                { key: 'warehouseName', name: '仓库' },
                // { 
                //     key: '写死',
                //     name: '包装',
                //     render: (h, { index, row, col }) => {
                //         return 'EA'
                //     }
                // },
                // { key: 'retailPrice', name: '零售价' },
                // { key: 'totalPrice', name: '总价' ,
                //     render: (h, { index, row, col }) => {
                //         if (row.totalPrice== 0) {
                //             return 
                //         } else {
                //             return <span>{ row.totalPrice }</span>
                //         }
                //     }
                // },
                { key: 'skuTechParam ', name: '技术参数' , 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.skuTechParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'totalPrice', name: '金额' ,
                    render: (h, { index, row, col }) => {
                        if (row.totalPrice== 0) {
                            return 
                        } else {
                            return <span>{ row.totalPrice }</span>
                        }
                    }
                },
                // { key: 'batchCode', name: '批次编码' },
                { key: 'itemName', name: '项目名称' },
                { key: 'attr2', name: '批次属性06' },
                { key: 'attr3', name: '批次属性07' },
                { key: 'attr4', name: '批次属性08' },
                { key: 'attr5', name: '批次属性09' },
                { key: 'attr6', name: '批次属性10' },
            ]
        }
    },
    methods: {
        adjustItem(){
            this.showAdjust(true)
        }
    }
}
</script>


