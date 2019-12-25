<template>
    <basic-list
        class="out-notice-list"
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
            <el-button v-if="rcMap['wi.invmagr.cou.add']" type="primary" size="mini" @click="onAdd">新建</el-button>
            <el-button v-if="rcMap['wi.invmagr.cou.modify']" type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button  type="primary" size="mini" @click="ondetail">盘点明细</el-button>
            <el-button v-if="rcMap['wi.invmagr.cou.publish']" type="primary" size="mini" @click="onPut">发布</el-button>
            <el-button v-if="rcMap['wi.invmagr.cou.cancelpublish']" type="primary" size="mini" @click="onCancelPublish">取消发布</el-button>
            <el-button v-if="rcMap['wi.invmagr.cou.cancel']" type="primary" size="mini" @click="onCancel">取消</el-button>
            <el-button v-if="rcMap['wi.invmagr.cou.checkin']" type="primary" size="mini" @click="onWrite">盘点登记</el-button>
            <el-button v-if="rcMap['wi.invmagr.cou.confirm']" type="primary" size="mini" @click="onDone">盘点完成</el-button>
            <el-button v-if="rcMap['wi.invmagr.cou.print']" @click="onPrintPick" type="primary" size="mini">打印</el-button>
            <el-button v-if="rcMap['wi.invmagr.auto.inventory']" type="primary" size="mini" @click="autoPandian">重力货架盘点</el-button>
        </template>
    </basic-list>
</template>!
<script>
import ExactList from 'biz/mixins/exactList'
import { download, preview } from 'common/utils/download'

export default {
    mixins: [ ExactList ],
    props: {
        handleExport: Function,
        proxyActions: Function,
        DO_STATE: Object,
        STOCK_COU_STATUS:Object,
        STOCK_DIFF_TYPE:Object,
        STOCK_COU_MODE:Object,
        STOCK_COU_SHOW_MODE:Object,
        STOCK_COU_TYPE:Object,
        STOCK_COU_SOURCE:Object,
        eidtInvDetail:Function,
        releaseList:Function,
        cancelPulishInv:Function,
        cancelStockInv:Function,
        finishedInv:Function,
        checkDetail:Function,
        invStockNote:Function,
        handleView:Function,
        autoInventory:Function,
        viewRfidCode:Function
        // changeCarrierData: Object|undefined
    },
    created () {
    },
    data () {
        return {
            fields: [
                { key: 'countNo', name: '盘点单号',
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.handleView(row)}>{row.countNo}</el-link>
                        )
                    }
                },
                { key: 'ownerName', name: '货主' },
                { key: 'status', name: '状态',
                    render: (h, { index, row, col }) => {
                        const en = this.STOCK_COU_STATUS.map[
                            Number( row.status )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.status
                        }
                    }
                },
                 { key: 'type', name: '盘点类型',
                    render: (h, { index, row, col }) => {
                        const en = this.STOCK_COU_TYPE.map[
                            Number( row.type )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.type
                        }
                    }
                },
                { key: 'mode', name: '盘点方式',
                    render: (h, { index, row, col }) => {
                        const en = this.STOCK_COU_MODE.map[
                            Number( row.mode )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.mode
                        }
                    }
                },
                 { key: 'source', name: '盘点来源',
                    render: (h, { index, row, col }) => {
                        const en = this.STOCK_COU_SOURCE.map[
                            Number( row.source )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.source
                        }
                    }
                },
                { key: 'stockCouRfidLogList', name: 'RFID编码',width:180  ,
                    render: (h, { index, row, col }) => {
                        return (
                            row.source==20?<el-link type="primary" onClick={() =>this.viewRfidCode(row)}>查看</el-link>:''
                        )
                    }
                },
                { key: 'sku.code', name: '物料编码',width:180  },
                { key: 'sku.name', name: '物料名称',width:180  },
                { key: 'showMode', name: '盘点方式',
                    render: (h, { index, row, col }) => {
                        const en = this.STOCK_COU_SHOW_MODE.map[
                            Number( row.showMode )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.showMode
                        }
                    }
                },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间',width:180  },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间',width:180  }
            ]
        }
    },
    methods: {
        //盘点登记
        onWrite(){
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            if (rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            if(rows[0].source !=10){
                return this.$message.error('类型不为手工盘点，不可操作')
            }
             if (rows.every(item => (item.status === 20||item.status === 30))){
                this.invStockNote(
                   rows[0].id
                )
            } else {
                return this.$message.error('只有发布、盘点中状态下可以盘点登记！')
            }
        },
        onAdd () {
            this.handleAdd()
        },
        autoPandian () {
            this.autoInventory()
        },
        onDone(){
             const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            if (rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            if(rows[0].source !=10){
                return this.$message.error('类型不为手工盘点，不可操作')
            }
            // 如果盘点中状态
            if (rows.every(item => item.status === 30)){
                this.finishedInv({ id: rows[0].id})
            } else {
                return this.$message.error('只有盘点中状态下可以取消发布')
            }
        },
        //盘点明细
        ondetail(){
             const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            if (rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            this.checkDetail({ couHId: rows[0].id})
        },
        //发布
        onPut(){
            var that = this
            const rows = this.selRows;
             if (!rows.length) {
                return this.$message.error('请选择一条数据！')
            }
            if (!rows.length > 1) {
                return this.$message.error('最多只能选择一条数据！')
            }
            if(rows[0].source !=10){
                return this.$message.error('类型不为手工盘点，不可操作')
            }
            if (rows.every(item => item.status === 10)){
                that.releaseList(
                   rows[0].id
                )
            } else {
                return this.$message.error('只有创建状态下可以发布！')
            }
        },
        onEdit () {
            
            var that = this
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请选择一条数据')
            }
            if (!rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            if(rows[0].source !=10){
                return this.$message.error('类型不为手工盘点，不可操作')
            }
            if (rows.every(item => item.status === 10)){
               
                that.eidtInvDetail(
                   rows[0]
                )
            } else {
                return this.$message.error('只有创建状态下可以修改')
            }
        },
        // 取消发布
        onCancelPublish () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            if (!rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            if(rows[0].source !=10){
                return this.$message.error('类型不为手工盘点，不可操作')
            }
            // 如果发布状态
            if (rows.every(item => item.status === 20)){
                this.cancelPulishInv({ id: rows[0].id})
            } else {
                return this.$message.error('只有发布状态下可以取消发布')
            }
        },
        onCancel () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
             if (!rows.length > 1) {
                return this.$message.error('最多只能选择一条数据')
            }
            if(rows[0].source !=10){
                return this.$message.error('类型不为手工盘点，不可操作')
            }
            // 如果都是 创建成功 待审核 状态
            if (rows.every(item => (item.status === 10 || item.status === 20))){
                // this.proxyActions({ action: 'cancel', id:rows[0].id})
                this.cancelStockInv({ id: rows[0].id})
            } else {
                return this.$message.error('只有创建、发布状态下可以取消')
            }
        },
        onPrintPick () {
            const rows = this.selRows;
            if (!rows.length) {
                return this.$message.error('请至少选择一条数据')
            }
            this.printPick(rows)
        },
         // 打印拣货单
        printPick (params) {
            debugger
             const idList = params.map(param => param.id);
            return preview({
                url:  process.env.VUE_APP_API_PREFIX + '/wi/stocktaking/print',
                data: {
                    idList:idList.join(',')
                }
            });
        },
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


