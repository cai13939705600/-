<template>
    <basic-list
        :show-select-col="true"
        :show-action-col="false"
        :fields="fields"
        :fieldLimit="18"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :noCrol="false"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChanges">
        <template slot="hd-col--l">
            <el-button v-if="rcMap['wi.inbound.asn.add']" type="primary" size="mini" @click="onAdd">新建</el-button>
            <el-button v-if="rcMap['wi.inbound.asn.modify']" type="primary" size="mini" @click="proxyActions('onEdit')">修改</el-button>
            <el-button v-if="rcMap['wi.inbound.asn.check']" type="primary" size="mini" @click="proxyActions('onExamine')">审核</el-button>
            <el-button v-if="rcMap['wi.inbound.asn.checkback']" type="primary" size="mini" @click="proxyActions('onReject')">反审核</el-button>
            <!-- <el-button v-if="rcMap['wi.inbound.asn.cancelorder']" type="primary" size="mini" @click="proxyActions('cancle')">取消订单</el-button> -->
            <el-button v-if="rcMap['wi.inbound.asn.receive']" type="primary" size="mini" @click="handleReceiving();proxyActions('receivingGoods');">收货</el-button>
            <el-button v-if="rcMap['wi.inbound.asn.onestepreceive']" type="primary" size="mini" @click="proxyActions('oneKeyReceiving')">一键收货</el-button>
            <el-button v-if="rcMap['wi.inbound.asn.putaway']" type="primary" size="mini" @click="handlePutaway();proxyActions('putaway')">上架</el-button>
            <el-button v-if="rcMap['wi.inbound.asn.onestepputaway']" type="primary" size="mini" @click="proxyActions('oneKeyRack')">一键上架</el-button>
            <el-dropdown v-if="rcMap['wi.inbound.asn.print'] || rcMap['wi.inbound.asn.cancelorder'] || rcMap['wi.inbound.asn.forcefinish'] || rcMap['wi.inbound.asn.import']" style="margin-left:10px" class="ml-10" size="mini" split-button type="primary" @command="handleCommand">
                更多操作
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="rcMap['wi.inbound.asn.el.import']" command="import">导入(电力)入库单</el-dropdown-item>
                    <el-dropdown-item v-if="rcMap['wi.inbound.asn.cancelorder']" command="cancle" divided>取消订单</el-dropdown-item>
                    <el-dropdown-item v-if="rcMap['wi.inbound.asn.forcefinish']" command="coerceFinish" divided>强制完成</el-dropdown-item>
                    <el-dropdown-item v-if="rcMap['wi.inbound.asn.print']" command=100 divided >打印入库清单</el-dropdown-item>
                    <el-dropdown-item v-if="rcMap['wi.inbound.asn.print']" command=110>打印入库验收单</el-dropdown-item>
                    <el-dropdown-item v-if="rcMap['wi.inbound.asn.print']" command=120>打印上架单</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-button v-if="rcMap['wi.inbound.asn.forcefinish']" style="margin-left:10px" type="primary" size="mini" @click="proxyActions('coerceFinish')">强制完成</el-button> -->
            <!-- <el-button v-if="rcMap['wi.inbound.asn.el.import']" style="margin-left:10px" type="primary" size="mini" @click="proxyActions('import')">导入(电力)</el-button> -->
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        handleReceiving: Function,
        handleView: Function,
        handlePutaway:Function,
        proxyActions: Function,
        selectionChanges:Function,
        handleCommand:Function,
        // 作业状态
        ASN_STATE:Object,
        //单据类型
        billTypes:{},
        //上架状态
        PUTAWAY_STATE:{},
    },
    data () {
        return {
             fields: [
                { key: 'code', name: '入库通知单号' , width: 180,
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.handleView(row)}>{row.code}</el-link>
                        )
                    }
                },
                { key: 'billCode1', name: '业务单号' , width: 180},
                { key: 'billType.name', name: '单据类型'},
                { key: 'state', name: '状态',
                    render: (h, { index, row, col }) => {
                         const en = this.ASN_STATE.map[
                            Number( row.state )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:ASN_STATE', row.state, typeof row.state);
                            return row.state
                        }
                    }
                 },
                {key:"storer.name",name:'货主'},
                {key:"supplier.name",name:'供应商',width:180},
                { key: 'expectSkuQty', name: '预期品数' },
                { key: 'receivedSkuQty', name: '收货品数' },
                { key: 'expectQty', name: '预期数量' },
                { key: 'receivedQty', name: '收货数量' },
                { key: 'expectedArriveTime', name: '预计到货时间' , width: 180},
                { key: 'projectCode', name: '项目编号' },
                { key: 'projectName', name: '项目名称' , width: 180},
                { key: 'totalAmount', name: '总金额(元)' },
                { key: 'totalTax', name: '总税额(元)' },
                { key: 'totalPriceTax', name: '总价税合计(元)' },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间' , width: 180},
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间' , width: 180},
            ]
        }
    },
    methods: {
        onAdd () {
            this.handleAdd()
        }
    }
}
</script>


