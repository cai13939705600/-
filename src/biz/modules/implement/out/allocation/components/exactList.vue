<template>
    <basic-list
        class="out-allocation-list"
        :show-select-col="true"
        :show-action-col="false"
        :fields="fields"
        :fieldLimit="9"
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
            <el-button v-if="rcMap['wi.outbound.allodetail.detailPickConfirm']" type="primary" size="mini" @click="onPick">明细确认拣货</el-button>
            <el-dropdown  v-if="rcMap['wi.outbound.allodetail.back']" class="m15" @command="onBack" size="mini" split-button type="primary">
                回退操作
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="distribution">分配回退</el-dropdown-item>
                    <el-dropdown-item command="picking">拣货回退</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button v-if="rcMap['wi.outbound.allodetail.lackPickConfirm']" type="primary" size="mini" @click="onShortagePick">缺量拣货</el-button>
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
        handleReplace: Function,
        proxyActions: Function,
        PICK_STATE: {
            type: Object,
            default: () => ({})
        },
        // changeCarrierData: Object|undefined
    },
    created () {
    },
    data () {
        return {
            fields: [
                { key: 'doCode', name: '出库通知单号', width: 180 },
                { key: 'lineNo', name: '出库通知单行号' },
                { key: 'sku.code', name: '物料编码' },
                { key: 'sku.name', name: '物料名称' },
                { key: 'fromLocationCode', name: '拣选库位' },
                { key: 'uom', name: '单位' },
                { key: 'sku.spec', name: '规格' },
                { key: 'planQty', name: '应拣数量' },
                { key: 'sku.grossWeight', name: '重量' },
                { key: 'sku.volume', name: '体积' },
                { key: 'allocatedQty', name: '分配数量' },
                { key: 'pickedQty', name: '拣货数量' },
                // { key: '缺失1', name: '复核数量' },
                // { key: '缺失2', name: '发货数量' },
                { key: 'state', name: '状态',
                    render: (h, { index, row, col }) => {
                        const en = this.PICK_STATE[
                            Number( row.state )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:PICK_STATE', row.state, typeof row.state);
                            return row.state
                        }
                    }
                },
                { key: 'toLocationCode', name: '目标库位' },
                { key: 'lotatt01', name: '生产日期', width: 180 },
                { key: 'lotatt03', name: '生产批号' },
                { key: 'lotatt04', name: '入库日期', width: 180 },
                { key: 'inventoryTypeName', name: '库存类型'},
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间', width: 180 },
                { key: 'pickingOperator', name: '拣货人' },
                { key: 'pickFinishedTime', name: '拣货时间', width: 180 },
                // { key: '缺失3', name: '复核人' },
                // { key: '缺失4', name: '复核时间' },
                // { key: '缺失5', name: '发货人' },
                // { key: '缺失6', name: '发货时间' }
            ]
        }
    },
    methods: {
        onPick () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请选择一条数据')
            }
            if (rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            // 如果不是 拣货完成 状态
            if (rows.every(item => (item.state !== 300))){
                this.handleEdit(rows[0])
            } else {
                return this.$message.error('拣货已完成')
            }
            
        },
        onBack (action) {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            switch (action) {
                case 'distribution':
                    this.proxyActions({ action: 'backAllocate',  rows})
                    break;
                case 'picking':
                    this.proxyActions({ action: 'backPick',  rows})
                    break;
                default:
                    break;
            }
            // this.proxyActions({ action: 'handleEdit', rows})
        },
        onShortagePick () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请选择一条数据')
            }
            if (rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            this.proxyActions({ action: 'shortagePick',  rows})
        }
    }
}
</script>
<style lang="scss" scoped>
    .out-allocation-list {
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
        .m15 {
            margin: 0 15px;
        }
        .m15 > .el-button-group > .el-button:first-of-type {
            width: 77px;
        }
    }
</style>


