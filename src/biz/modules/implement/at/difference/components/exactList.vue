<template>
    <basic-list
        :show-select-col="true"
        :show-action-col="false"
        :table-h="tableH"
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
            <el-button v-if="rcMap['wi.invmagr.diff.check']" type="primary" size="mini" @click="onEdit">实物差异审核</el-button>
            <el-button v-if="rcMap['wi.invmagr.diff.check']" type="primary" size="mini" @click="onFisock">账务差异审核</el-button>
            <!-- <el-button v-if="rcMap['wi.invmagr.auto.inventory']" type="primary" size="mini" @click="autoPandian">自动盘点</el-button> -->
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        exporting: Boolean,
        handleExport: Function,
        handleStart: Function,
        handleStop: Function,
        STOCK_DIFF_STATUS: Object,
        STOCK_DIFF_TYPE: Object,
        stockState: Array,
        autoInventory:Function,
        handleEdits: Function
    },
    data () {
        return {
            fields: [
                {
                    key: 'status',
                    name: '实物状态',
                    render: (h, { index, row, col }) => {
                        const enums = this.STOCK_DIFF_STATUS[row.status]
                        if(enums){
                            return <span>{ enums.enumValueCn }</span>
                        }
                    }
                },
                {
                    key: 'financeStatus',
                    name: '账务状态',
                    render: (h, { index, row, col }) => {
                        const enums = this.STOCK_DIFF_STATUS[row.financeStatus]
                        if(enums){
                            return <span>{ enums.enumValueCn }</span>
                        }
                    }
                },
                { key: 'locationName',name: '库位'},
                { key: 'ownerName', name: '货主' },
                { key: 'type', name: '盈亏类型', 
                     render: (h, { index, row, col }) => {
                        const addnumee= this.STOCK_DIFF_TYPE[row.type]
                        if(addnumee){
                            return <span>{ addnumee.enumValueCn }</span>
                        }
                    }
                },
                { key: 'sku.code', name: '物料编码' },
                { key: 'sku.name', name: '物料名称' },
                { key: 'inventoryType', name: '库存状态' ,
                    render:( h,{ index, row, col}) => {
                        /* this.stockState.map((item) =>{
                            if(item.code == row.inventoryType){
                                return <span>{ item.name }</span>
                            }
                        }) */
                        for (let i = 0, len = this.stockState.length; i < len; i++) {
                            if (this.stockState[i].code === row.inventoryType) {
                               return <span>{this.stockState[i].name}</span>
                            }
                        }
                    }
                },
                { key: 'sku.uom', name: '单位' },
                { key: 'qty', name: '库存数量' },
                { key: 'actualQty', name: '盘点数量' },
                { key: 'differQty',name: '差异数量',},
                { key: 'adjustReason', name: '审核原因' },
            ]
        }
    },
   
    methods: {
        
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择操作的库存！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一条数据进行操作！')
                return
            }
            if (rows[0].status !== 10) {
                this.$message.error('请选择待审核的数据进行操作！')
                return
            }
            //this.handleEdit({ id: rows[0].id })
            this.handleEdit(rows)
        },
        onFisock () {
            const rows = this.selRows
           if (!rows.length) {
                this.$message.error('请选择操作的库存！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一条数据进行操作！')
                return
            }
            if (rows[0].status !== 20) {
                this.$message.error('请先更新实物差异！')
                return
            }
            if (rows[0].financeStatus !== 10) {
                this.$message.error('账务库存状态为已审核不能操作！')
                return
            }
            //this.handleEdit({ id: rows[0].id })
            this.handleEdits(rows[0].id)
        },
        onStart () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要启用的收货人！')
                return
            }
            const ids = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 0) {
                    ids.push(rows[i].id)
                }
            }
            if (ids.length) {
                this.handleStart(ids)
            } else {
                this.$message.error('所选收货人都已启用！')
            }
        },
        onStop () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要停用的收货人！')
                return
            }
            const ids = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 1) {
                    ids.push(rows[i].id)
                }
            }
            if (ids.length) {
                this.handleStop(ids)
            } else {
                this.$message.error('所选收货人都已停用！')
            }
        }
    }
}
</script>


