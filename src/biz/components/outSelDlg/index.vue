<template>
    <basic-dialog
        class="goods-sel-dlg"
        title="原出库单查询"
        width="80%"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form class="search-form" size="small" label-width="80px" :model="query">
            <div class="col-l">
                <el-form-item
                    label="出库通知单号"
                    label-width="102px">
                    <comma-input v-model="query.codeList" :value="query.codeList" placeholder='' clearable></comma-input>
                </el-form-item>
                <el-form-item
                    label="业务单号"
                    label-width="102px">
                    <comma-input v-model="query.billCode1List" :value="query.billCode1List" placeholder='' clearable></comma-input>
                </el-form-item>
                <el-form-item
                    label="状态"
                    label-width="102px">
                    <el-select
                        multiple
                        clearable
                        collapse-tags
                        v-model="query.stateList"
                        placeholder="">
                        <template v-for="item in DO_STATE.array">
                            <el-option
                                v-if="item.enumCode===900 || item.enumCode===1000"
                                :key="item.enumCode"
                                :label="item.enumValueCn"
                                :value="item.enumCode">
                            </el-option>
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="w50p"
                    label="发货时间"
                    label-width="102px"
                    prop="finishedTime"
                    ref="finishedTime">
                    <el-date-picker
                        clearable
                        v-model="query.finishedTime"
                        type="datetimerange"
                        format="yyyy-MM-dd HH:mm"
                        :picker-options="pickerOptions"
                        range-separator="~"
                        value-format="yyyy-MM-dd HH:mm"
                        start-placeholder=""
                        end-placeholder=""
                    ></el-date-picker>
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
import commaInput from 'biz/components/commaInput'
import { mapState } from 'vuex'

const DEFAULTS = {
    query: {
        codeList: undefined,
        billCode1List: undefined,
        stateList: undefined,
        finishTime:undefined
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
        BasicList,
        commaInput
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
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
            fields: [
                { key: 'code', name: '出库通知单号', width: 180 },
                { key: 'billCode1', name: '业务单号', width: 180 },
                { key: 'state', name: '状态',
                    render: (h, { index, row, col }) => {
                        const en = this.DO_STATE.map[
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
                { key: 'totalVolume', name: '总体积（cm3)' },
                { key: 'consignee', name: '收货人' },
                { key: 'address', name: '收货地址', width: 180 },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间', width: 180 },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间', width: 180 }
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
    computed: {
        ...mapState('enums', ['DO_STATE']),
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
                this.$message.error('请选择原出库单')
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
            if(query.stateList==undefined){
                query.stateList=[900,1000]
            }
            if(query.stateList && query.stateList.length===0){
                query.stateList=[900,1000]
            }
            if(query.finishTime){
                query.finishStartTime=query.finishTime[0],
                query.finishEndTime=query.finishTime[1]
            }
            delete query.finishTime
            jt.object.removeEmptyAttr(query)
            api.stock.getOutStockNoticeList({
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


