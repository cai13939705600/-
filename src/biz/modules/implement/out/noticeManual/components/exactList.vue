<template>
    <basic-list
        class="out-noticeManual-list"
        :showPage="false"
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
        :selection-change="selectionChange"
        :setClmnsFlg="false">
        <template slot="hd-col--l">
            <el-form :inline="true" :model="data" class="demo-form-inline">
                <el-form-item label="出库通知单">
                    <el-input v-model="id" placeholder="" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="业务单号">
                    <el-input v-model="code" placeholder="" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-input v-model="itemName" placeholder="" :readonly="true"></el-input>
                </el-form-item>
            </el-form>
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
        id: String,
        code: String,
        itemName: String
        // changeCarrierData: Object|undefined
    },
    created () {
    },
    data () {
        return {
            data: {},
            fields: [
                { key: 'sku.code', name: '物料编码',width:220 },
                { key: 'sku.name', name: '物料名称',width:220 },
                { key: 'sku.spec', name: '规格',width:220 },
                { key: 'sku.uom', name: '单位' },
                { key: 'quantity', name: '数量' },
                { key: 'allocatedQty', name: '应拣数量' },
                { key: 'waitAllocated', name: '待分配数量' },
                { key: 'pickedQty', name: '拣货数量' },
                { key: 'remark', name: '备注' }
            ]
        }
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
    .out-noticeManual-list {
        margin-top: 20px;
        max-height: 35vh;
        overflow-y: scroll;
    }
    .out-noticeManual-list .el-form-item {
        height: 30px;
        line-height: 30px;
        margin-top: -5px;
        /deep/ .el-input__inner {
            width: 180px;
            height: 28px;
            line-height: 28px;
            border: 1px solid transparent;
        }
    }
</style>


