<template>
    <basic-list
        class="out-notice-list"
        :show-select-col="true"
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
            <el-button v-if="rcMap['wi.outbound.do.add']" type="primary" size="mini" @click="onAdd">新建</el-button>
            <el-button v-if="rcMap['wi.outbound.do.modify']" type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button v-if="rcMap['wi.outbound.do.check']" type="primary" size="mini" @click="onExamine">审核</el-button>
            <el-button v-if="rcMap['wi.outbound.do.checkback']" type="primary" size="mini" @click="onRejct">反审核</el-button>
            <el-button v-if="rcMap['wi.outbound.do.cancelorder']" type="primary" size="mini" @click="onCancel">取消</el-button>
            <el-button v-if="rcMap['wi.outbound.do.receive']" type="primary" size="mini" @click="onAuto">自动分配</el-button>
            <el-button v-if="rcMap['wi.outbound.do.onestepreceive']" type="primary" size="mini" @click="onManual">手工分配</el-button>
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
        YES_FLAG: Object,
        GET_METHOD: Object,
        checktakereason: Function,
        // changeCarrierData: Object|undefined
    },
    created () {
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '出库通知单号', width: 180 },
                { key: 'billCode1', name: '业务单号', width: 180 },
                { key: 'state', name: '状态',
                    render: (h, { index, row, col }) => {
                        const en = this.DO_STATE[
                            Number( row.state )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:DO_STATE', row.state, typeof row.state, this.DO_STATE);
                            return row.state
                        }
                    }
                },
                { key: 'storerName', name: '货主' },
                { key: 'skuQty', name: '总品数' },
                { key: 'quantity', name: '总件数' },
                { key: 'outboundQty', name: '实发件数' },
                { key: 'totalWeight', name: '总重量(kg)'},
                { key: 'totalVolume', name: '总体积（cm³)' },
                { key: 'consignee', name: '收货人' },
                { key: 'address', name: '收货地址', width: 180 },
                { key: 'itemCode', name: '项目编号' },
                { key: 'itemName', name: '项目名称' },
                { key: 'getMethod', name: '领料方式' ,
                    render: (h, { index, row, col }) => {
                        const en = this.GET_METHOD[
                            Number( row.getMethod )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:GET_METHOD', row.getMethod, typeof row.getMethod, this.GET_METHOD);
                            return row.getMethod
                        }
                    }
                },
                { key: 'singleProject', name: '单项工程' },
                { key: 'ifInstallFee', name: '是否有安装费',
                    render: (h, { index, row, col }) => {
                        const en = this.YES_FLAG[
                            Number( row.ifInstallFee )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:YES_FLAG', row.ifInstallFee, typeof row.ifInstallFee, this.YES_FLAG);
                            return row.ifInstallFee
                        }
                    }
                },
                { key: 'ifUrgent', name: '是否紧急' ,
                    render: (h, { index, row, col }) => {
                        const en = this.YES_FLAG[
                            Number( row.ifUrgent )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:YES_FLAG', row.ifUrgent, typeof row.ifUrgent, this.YES_FLAG);
                            return row.ifUrgent
                        }
                    }
                },
                { key: 'constructionUnit', name: '施工单位' },
                { key: 'takeReason', name: '领用原因'  , 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktakereason(row.takeReason)}>查看</el-link>
                        )
                    }
                },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间', width: 180 },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间', width: 180 }
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
                            price: item.price,
                            totalPrice: item.totalPrice,
                            totalSkuWeight: item.weight,
                            totalSkuVolumn: item.volume,
                            supplierName: item.sku.supplierName,
                            techParam: item.techParam,
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
    .out-notice-list {
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


