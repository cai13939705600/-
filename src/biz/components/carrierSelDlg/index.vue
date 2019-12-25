<template>
    <basic-dialog
        class="goods-sel-dlg"
        title="承运商查询"
        width="80%"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form class="search-form" size="small" label-width="80px" :model="query">
            <div class="col-l">
                <el-form-item label="承运商编码">
                    <el-input v-model="query.logisticCode"/>
                </el-form-item>
                <el-form-item label="承运商名称">
                    <el-input v-model="query.logisticName"/>
                </el-form-item>
                <!-- <el-form-item label="启停状态">
                    <el-select clearable filterable v-model="query.isDefault" placeholder="请选择启停标记">
                        <el-option v-for="(item, key) of startStop" :key="key" :label="item" :value="+key"/>
                    </el-select>
                </el-form-item> -->
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
            :setClmnsFlg="false"
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
        logisticCode: undefined,
        logisticName: undefined,
        isDefault: 1,
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
        }
    },
    data () {
        return {
            ..._.cloneDeep(DEFAULTS),
            startStop: CNST.ENUMS.startStop,
            fields: [
                { key: 'logisticCode', name: '承运商编码' },
                { key: 'logisticName', name: '承运商名称' },
                {
                    key: 'validFlagName',
                    name: '启停状态',
                    /* formatter: function (row, column, cellValue, index) {
                        return CNST.ENUMS.startStop[cellValue] || cellValue
                    } */
                },
                { key: 'linkMan', name: '联系人' },
                { key: 'linkTel', name: '联系电话' },
                { key: 'address', name: '联系地址' },
                { key: 'creator', name: '创建人' },
                {
                    key: 'createTime',
                    name: '创建时间',
                    width: 180,
                    /* formatter: function (row, column, cellValue, index) {
                        return jt.date.format(cellValue)
                    } */
                },
                { key: 'modifier', name: '修改人' },
                {
                    key: 'modifiedTime',
                    name: '修改时间',
                    width: 180,
                    /* formatter: function (row, column, cellValue, index) {
                        return jt.date.format(cellValue)
                    } */
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
            if (!this.selRows.length) {
                this.$message.error('请选择货主')
                return
            }
            this.handleSave(this.selRows[0])
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
            jt.object.removeEmptyAttr(query)
            api.organize.queryListCarrier({
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


