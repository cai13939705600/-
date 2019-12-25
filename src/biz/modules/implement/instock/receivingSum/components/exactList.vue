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
        :selection-change="selectionChange">
        <template slot="hd-col--l">
            <el-button v-if="rcMap['wi.inbound.receive.report.export']" type="primary" size="mini" @click="proxyActions('exportHandle')">导出</el-button>
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
        proxyActions:Function
    },
    data () {
        return {
            fields: [
                { key: 'warehouseName', name: '仓库' },
                { key: 'storerName', name: '货主' },
                { key: 'orderDetailCount', name: '订单明细数量' },
                { key: 'sumReceivedQty', name: '实际收货数量' },
                { key: 'sumWeight', name: '总重量(kg)' },
                { key: 'sumVolume', name: '总体积(cm³)' },
                { key: 'receivedTime', name: '入库日期' ,
                    render: (h, { index, row, col }) => {
                        return <span>{jt.date.format(+new Date(row.receivedTime), 'yyyy-MM-dd')}</span>
                    }
                },

            ]
        }
    },
    methods: {
        onExport () {
            console.log("执行导出操作")
        }
    },
}
</script>


