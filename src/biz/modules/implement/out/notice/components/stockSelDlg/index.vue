<template>
    <basic-dialog
        class="goods-sel-dlg"
        title="库存查询"
        width="80%"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form class="search-form" size="small" label-width="80px" :model="query">
            <div class="col-l">
                <el-form-item label="物料编号">
                    <el-input v-model="query.skuCode"/>
                </el-form-item>
                <el-form-item label="物料名称">
                    <el-input v-model="query.skuName"/>
                </el-form-item>
                <el-form-item label="供应商">
                    <el-input v-model="query.SupplierName"/>
                </el-form-item>
                <el-form-item label="规格">
                    <el-input v-model="query.skuSpec"/>
                </el-form-item>
            </div>
            <div class="col-r">
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
            </div>
        </el-form>
        <basic-list
            ref="basicList"
            select-type="multiple"
            :show-select-col="true"
            :show-action-col="false"
            :setClmnsFlg="false"
            :fields="fields"
            :list="list"
            :loading="loading"
            :total="total"
            :page-index="pageIndex"
            :page-size="pageSize"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :selection-change="selectionChange"/>
    </basic-dialog>
</template>

<script>
import { setDate } from 'common/filters/setDate'

import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'

const DEFAULTS = {
    query: {
        skuCode: undefined,
        skuName: undefined,
    },
    loading: false,
    total: 0,
    pageIndex: 1,
    pageSize: 20,
    list: [],
    selRows: []
}

export default {
    components: {
        BasicDialog,
        BasicList
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        appendToBody: {
            type: Boolean,
            default: true
        },
        params: {
            type: Object,
            default () {
                return {}
            }
        },
        updateVis: {
            type: Function,
            default: () => {}
        },
        handleSave: {
            type: Function,
            default: () => {}
        },
        storerId: {
            type: String | Number
        },
        itemId: {
            type: String | Number
        },
        warehouseId: {
            type: String | Number
        },
        checktechParam: {
            type: Function,
            default: () => {}
        },
    },
    data () {
        return {
            ..._.cloneDeep(DEFAULTS),
            fields: [
                { key: 'skuCode', name: '物料编号' },
                { key: 'skuName', name: '物料名称' },
                { key: 'skuSpec', name: '规格' },
                { key: 'itemName', name: '项目名称' },
                { key: 'availableQty', name: '可用数量' },
                { key: 'price', name: '单价' },
                { key: 'totalPrice', name: '金额' },
                { key: 'supplierName', name: '供应商' },
                { key: 'skuTechParam', name: '技术参数' ,
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.skuTechParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'skuUom', name: '单位' },
                { key: 'inboundDate', name: '入库日期',
                    render: (h, { index, row, col }) => {
                        return <span>{ setDate(row.inboundDate) }</span>
                    }
                },
                { key: 'inventoryType', name: '库存类型' ,
                    render: (h, { index, row, col }) => {
                        if(row.inventoryType=='ZP'){
                            return <span>正品</span>
                        } else if (row.inventoryType=='CC'){
                            return <span>残品</span>
                        } else {
                            return row.inventoryType
                        }
                    }
                }
            ]
        }
    },
    watch: {
        visible (newVal) {
            if (newVal) {
                this.query = { ...DEFAULTS.query, ..._.cloneDeep(this.params)}
                this.queryList()
            }
        }
    },
    methods: {
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            const defaults = _.cloneDeep(_.get(DEFAULTS, ['selRows', 'query']))
            for (let key in defaults) {
                this[key] = defaults[key]
            }
            this.$refs.basicList.resetData()
        },
        handleOk () {
            console.log(this.selRows)
            if (!this.selRows.length) {
                this.$message.error('请选择库存')
                return
            }
            this.handleSave(this.selRows)
            this.updateVis(false)
        },
        pageIndexChange (index) {
            this.pageIndex = index
            this.queryList()
        },
        pageSizeChange (size) {
            this.pageIndex = 1
            this.pageSize = size
            this.queryList()
        },
        selectionChange (rows) {
            this.selRows = rows
        },
        handleSearch () {
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        handleReset () {
            this.query = _.cloneDeep(DEFAULTS.query)
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        queryList () {
            const query = _.cloneDeep(this.query)
            if (this.storerId) {
                query.storerId = this.storerId
            }
            if (this.itemId) {
                query.itemId = this.itemId
            }
            if (this.warehouseId) {
                query.warehouseId = this.warehouseId
            }
            jt.object.removeEmptyAttr(query)
            api.stock.getListByPage({
                ...query,
                page: {
                    current: this.pageIndex,
                    size: this.pageSize
                }
            }).then(({ head = {}, body = {} }) => {
                if (head.code === '200') {
                    this.list = _.get(body, 'records') || []
                    this.total = _.get(body, 'total') || 0
                }
                this.$refs.basicList.resetData('radioIndex')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.search-form {
    display: flex;
    .col-l {
        display: flex;
        flex: 1;
        .el-form-item {
            width: 25%;
            padding-right: 20px;
        }
    }
    .col-r {
        width: 140px;
    }
}
.basic-list {
    padding-top: 0;
}
</style>