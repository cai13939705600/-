<template>
    <basic-dialog
        class="goods-sel-dlg"
        title="库位查询"
        width="80%"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form class="search-form" size="small" label-width="80px" :model="query" >
           <div class="col-l" v-if="!showSearch">
           <el-form-item label="库区名称" props="zoneId">
            <el-select
                v-model="query.zoneId"
                filterable
                clearable
                placeholder=""
                >
                <el-option
                    v-for="item in libraries"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="库位编号" props="code">
            <el-input v-model="query.code" clearable />
        </el-form-item>
        <el-form-item v-show="false"
            label="状态" props="validFlag">
            <el-select
                v-model="query.validFlag"
                clearable
                placeholder="请选择">
                <el-option
                v-for="item in VALID_FLAG.array"
                :key="item.enumCode + ''"
                :label="item.enumValueCn"
                :value="item.enumCode">
                </el-option>
            </el-select>
        </el-form-item>
           </div>
         <div class="col-r" v-if="!showSearch">
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
            :selection-change="selectionChange"

        />
    </basic-dialog>
</template>

<script>
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'


const DEFAULTS = {
    query: {
        code: undefined,
        name: undefined,
        validFlag: 1,
        locUse:10
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
        showSearch:Boolean,
        libraries:Array,
        locationType:Array,
        VALID_FLAG:Object,
        LOCATION_CYCLE_CLASS:Object,
        LOCATION_USE:Object,
        LOCATION_CONSTRAINT:Object,
        zoneId:String,
    },
    data () {
        return {
            ..._.cloneDeep(DEFAULTS),
            startStop: CNST.ENUMS.startStop,
              fields: [
                { key: 'zoneName', name: '库区名称' },
                { key: 'code', name: '库位编码' },
                { key: 'locationTypeName', name: '库位类型',
                },
                {
                    key: 'locUse',
                    name: '库位用途',
                    render: (h, { index, row, col }) => {
                        for (let i = 0, len = this.LOCATION_USE.array.length; i < len; i++) {
                            if (this.LOCATION_USE.array[i].enumCode === row.locUse) {
                               return <span>{this.LOCATION_USE.array[i].enumValueCn}</span>
                            }
                        }
                    }
                },
                { key: 'constraintType', name: '使用限制',
                    render: (h, { index, row, col }) => {
                        for (let i = 0, len = this.LOCATION_CONSTRAINT.array.length; i < len; i++) {
                            if (this.LOCATION_CONSTRAINT.array[i].enumCode === row.constraintType) {
                               return <span>{this.LOCATION_CONSTRAINT.array[i].enumValueCn}</span>
                            }
                        }
                    }
                },
                { key: 'cycleClass', name: 'ABC分类',
                    render: (h, { index, row, col }) => {
                        for (let i = 0, len = this.LOCATION_CYCLE_CLASS.array.length; i < len; i++) {
                            if (this.LOCATION_CYCLE_CLASS.array[i].enumCode === row.cycleClass) {
                               return <span>{this.LOCATION_CYCLE_CLASS.array[i].enumValueCn}</span>
                            }
                        }
                    }
                },
                { key: 'aisil', name: '通道号' },
                { key: 'level', name: '层号' },
                { key: 'bay', name: '列号' },
                { key: 'validFlag', name: '状态',
                    formatter: function (row, column, cellValue, index) {
                        return CNST.ENUMS.startStop[cellValue] || cellValue
                    }
                },
                { key: 'remark', name: '备注' },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间' ,width:140 },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间',width:140 }
            ]
        }
    },
    watch: {
        visible (newVal) {
            if (newVal&&!this.showSearch) {
                this.query = { ...DEFAULTS.query, ..._.cloneDeep(this.params)}
                this.queryList()
            }
            if(newVal&&this.showSearch){
                console.log(this.zoneId)
                this.query = { ...DEFAULTS.query, ..._.cloneDeep(this.params)}
                this.query.zoneId = this.zoneId
                this.query.validFlag = 1
                this.query.locUse=10
                this.queryList()
            }
        }
    },
    beforeCreate(){
         this.fields = [
            'zoneId',
            'code',
            //'cycleClass',
            {
                key: 'validFlag',
                default: 1
            } ]
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
                this.$message.error('请选择库位')
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
            api.library.queryLibraryLocations({
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


