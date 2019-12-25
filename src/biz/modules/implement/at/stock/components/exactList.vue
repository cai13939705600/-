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
            <el-button v-if="rcMap['wi.invmagr.stockmag.move']" type="primary" size="mini" @click="proxyActions('moveHandle')">移库</el-button>
            <el-button v-if="rcMap['wi.invmagr.stockmag.lotchange']" type="primary" size="mini" @click="proxyActions('batchHandle')">批次调整</el-button>
            <el-button v-if="rcMap['wi.invmagr.stockmag.stockchange']" type="primary" size="mini" @click="proxyActions('amountHandle')">库存调整</el-button>
            <el-button v-if="rcMap['wi.invmagr.stockmag.frozen']" type="primary" size="mini" @click="proxyActions('freezeHandle')">冻结</el-button>
            <el-button v-if="rcMap['wi.invmagr.stockmag.release']" type="primary" size="mini" @click="proxyActions('releaseHandle')">释放</el-button>
            <!-- <el-dropdown  @click="proxyActions('print')" @command="clickPrint" class="ml-10" size="mini" split-button type="primary" >
                打印
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item command="light">明盘盘点单</el-dropdown-item>
                    <el-dropdown-item command="dark">盲盘盘点单</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown> -->
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        selectionChanges: Function,
        proxyActions: Function,
        clickPrint:Function
    },
    data () {
        return {
            fields: [
                { key: 'locationName', name: '库位' },
                { key: 'skuNo', name: '物料编码',width:180 },
                { key: 'skuName', name: '名称' ,width:180},
                { key: 'shortName', name: '简称' ,width:180},
                // { key: 'ownerName', name: '货主' },
                { key: 'qty', name: '库存数量' },
                { key: 'spec', name: '规格' ,width:180},
                { key: 'barcode', name: '条码' ,width:180},
                { key: 'uom', name: '单位' },
                // { 
                //     key: '写死',
                //     name: '包装',
                //     render: (h, { index, row, col }) => {
                //         return 'EA'
                //     }
                // },
                { key: 'avaliableQty', name: '可用数量' },
                { key: 'putAwayQty', name: '待上架数量' },
                { key: 'assignQty', name: '分配数量' },
                { key: 'lockQty', name: '冻结数' },
                 { key: 'inventoryTypeName', name: '库存类型',
                 },
                { key: 'totalWeight', name: '总重量(kg)' },
                { key: 'totalVolume', name: '总体积(cm3)' },
                
                { key: 'inboundDate', name: '入库日期' },
                { key: 'madeDate', name: '生产日期',},
                { key: 'expireDate', name: '失效日期' ,},
                { key: 'produceBatch', name: '生产批次' },
                { key: 'attr1', name: '项目名称' },
                { key: 'createTime', name: '创建时间' ,width:180},
                { key: 'creator', name: '创建人' },
                { key: 'modifiedTime', name: '修改时间',width:180},
                { key: 'modifier', name: '修改人' },
            ]
        }
    },
    mounted(){
    },
    methods: {
        handClick(){
            console.log('333')
        }
    }
}
</script>


