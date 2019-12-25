<template>
    <basic-dialog
        class="goods-sel-dlg"
        title="物料筛选"
        width="80%"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form class="search-form" size="small" label-width="80px" :model="query">
            <div class="col-l">
                <el-form-item label="物料编号">
                    <el-input v-model="query.code"/>
                </el-form-item>
                <el-form-item label="物料名称">
                    <el-input v-model="query.name"/>
                </el-form-item>
                <el-form-item label="物料条码">
                    <el-input v-model="query.barcode"/>
                </el-form-item>
                <el-form-item label="货号">
                    <el-input v-model="query.skuNo1"/>
                </el-form-item>
            </div>
            <div class="col-r">
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button size="small" @click="handleReset">重置</el-button>
            </div>
        </el-form>
        <basic-list
            ref="basicList"
            select-type="single"
            :show-select-col="true"
            :show-action-col="false"
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
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'

const DEFAULTS = {
    query: {
        code: undefined,
        name: undefined,
        barcode: undefined,
        skuNo1: undefined
    },
    loading: false,
    total: 0,
    pageIndex: 0,
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
        }
    },
    data () {
        return {
            ..._.cloneDeep(DEFAULTS),
            fields: [
                { key: 'code', name: '物料编号' },
                { key: 'name', name: '物料名称' },
                { key: 'shortName', name: '物料简称' },
                { key: 'barcode', name: '物料条码' },
                { key: 'brandName', name: '品牌' },
                { key: 'skuNo1', name: '货号' },
                { key: 'spec', name: '规格' }
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
            if (!this.selRows.length) {
                this.$message.error('请选择物料')
                return
            }
            this.handleSave(this.selRows[0])
            this.updateVis(false)
        },
        pageIndexChange (index) {
            this.pageIndex = index - 1
            this.queryList()
        },
        pageSizeChange (size) {
            this.pageIndex = 0
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
            jt.object.removeEmptyAttr(query)
            api.sku.queryList({
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


