<template>
    <basic-list
        class="out-doquery-list"
        :show-select-col="false"
        :show-action-col="false"
        :fields="fields"
        :fieldLimit="9"
        :table-h="tableH"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange">
        <template slot="hd-col--l">
            <el-button v-if="rcMap['wo.outbound.dodetailquery.export']" type="primary" size="mini" @click="handleExport">导出</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'

export default {
    mixins: [ ExactList ],
    props: {
        handleExport: Function,
        proxyActions: Function,
        DO_STATE: Object,
        checktechParam: Function,
        checktakereason: Function,
        YES_FLAG: Object,
        GET_METHOD: Object
        // changeCarrierData: Object|undefined
    },
    created () {
    },
    data () {
        return {
            fields: [
                { key: 'doCode', name: '出库通知单号', width: 180 },
                { key: 'doBillCode1', name: '业务单号', width: 180 },
                { key: 'ticketCode', name: '拣货单号', width: 180 },
                { key: 'stateStr', name: '状态'},
                { key: 'storerName', name: '货主' },
                { key: 'sku.code', name: '物料编码' },
                { key: 'sku.name', name: '物料名称' },
                { key: 'sku.spec', name: '规格' },
                { key: 'sku.techParam', name: '技术参数' , 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.sku.techParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'skuCateGoryCode', name: '物料类别编码' },
                { key: 'skuCateGoryName', name: '物料类别名称' },
                { key: 'fromZoneName', name: '库区' },
                { key: 'fromLocationCode', name: '库位' },
                { key: 'allocatedQty', name: '应拣数量' },
                { key: 'pickedQty', name: '拣货数量' },
                // { key: 'takeReason', name: '领用原因'  , 
                //     render: (h, { index, row, col }) => {
                //         return (
                //             <el-link type="primary" onClick={() =>this.checktakereason(row.takeReason)}>查看</el-link>
                //         )
                //     }
                // },
                { key: 'itemName', name: '项目名称' },
                { key: 'voltageClassesStr', name: '电压等级'},
                { key: 'createTime', name: '创建时间', width: 180 },
                { key: 'pickFinishedTime', name: '拣货完成时间', width: 180 },
                { key: 'creator', name: '创建人' },
                { key: 'pickingOperator', name: '拣货员' }
            ]
        }
    },
    methods: {
        onAdd () {
            // this.proxyActions({ action: 'handleAdd', rows})
            this.handleAdd()
        },
        onEdit () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请选择一条数据')
            }
            if (!rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            // 添加创建成功也可以修改 马彬prd有问题 改的
            if (rows.every(item => item.state === 100 || item.state === 200)){
                this.handleEdit({
                    id: rows[0].id
                }, (body) => {
                    body.doDetailList = body.doDetailList.map(item => {
                        return {
                            skuCode: item.sku.code,
                            skuId: item.skuId,
                            skuName: item.sku.name,
                            skuUom: item.sku.uom,
                            skuSpec: item.sku.spec,
                            availableQty: item.totalAvailableQty,
                            itemName: item.itemName,
                            quantity: item.quantity,
                            totalSkuWeight: item.weight,
                            totalSkuVolumn: item.volume,
                            skuWeight: item.sku.grossWeight,
                            skuVolume: item.sku.volume,
                            remark: item.remark
                        }
                    })
                })
            } else {
                return this.$message.error('只有待审核状态下可以修改')
            }
        },
        // 审核
        onExamine () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            // 如果都是 待审核 状态
            // if (rows.every(item => item.state === 100)){
                this.proxyActions({ action: 'examine', rows})
            // } else {
            //     return this.$message.error('只有待审核状态下可以修改')
            // }
        },
        // 反审核
        onRejct () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            // 如果都是 创建成功 状态
            // if (rows.every(item => item.state === 200)){
                this.proxyActions({ action: 'reject', rows})
            // } else {
            //     return this.$message.error('只有创建成功状态下可以修改')
            // }
        },
        onCancel () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            // 如果都是 创建成功 待审核 状态
            // if (rows.every(item => (item.state === 200 || item.state === 100))){
                this.proxyActions({ action: 'cancel', rows})
            // } else {
            //     return this.$message.error('只有创建成功、待审核状态下可以修改')
            // }
        },
        // 自动分配
        onAuto () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            // 如果都是 创建成功 待审核 状态
            // if (rows.every(item => (item.state === 300 || item.state === 600 || item.state === 800 || item.state === 1000))){
                this.proxyActions({ action: 'auto', rows})
            // } else {
            //     return this.$message.error('状态不是部分分配/拣货/复核/发货')
            // }
        },
        // 手工分配
        onManual () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请选择一条数据')
            }
            if (!rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            // 如果都是 创建成功 待审核 状态
            if (rows.every(item => (item.state === 200 || item.state === 300 || item.state === 600 || item.state === 800 || item.state === 1000))){
                this.proxyActions({ action: 'manual', rows})
            } else {
                return this.$message.error('状态不是部分分配/拣货/复核/发货')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .out-doquery-list {
        /deep/ .el-dropdown {
            margin-left: 10px;
        }
        /deep/ .el-dropdown__caret-button {
            .el-dropdown__icon.el-icon-arrow-down {
                transition: transform 0.5s;
            }
            .el-dropdown-menu.el-popper {
                width: 100%;
                text-align: center;
            }
            &:hover {
                &::before {
                    opacity: 0;
                }
                background-color: #3389E3;
                .el-dropdown__icon.el-icon-arrow-down {
                    transform: rotate(180deg);
                }
            }
        }
        .ml-10 {
            margin-left: 10px;
        }
    }
</style>


