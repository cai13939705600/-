<template>
    <basic-dialog
        class="goods-sel-dlg"
        title="项目查询"
        width="80%"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form class="search-form" size="small" label-width="80px" :model="query">
            <div class="col-l">
                <el-form-item label="项目编号">
                    <el-input v-model="query.itemCode"/>
                </el-form-item>
                <el-form-item label="项目名称">
                    <el-input v-model="query.itemName"/>
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
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'
import { mapState , mapActions} from 'vuex'
const enums = [
    "PROJECT_TYPE",//项目类型
    'MATERIAL_USAGE',//项目物资用途
    'VOLTAGE_CLASSES',//电压等级
    'YES_FLAG',//是否

]

const DEFAULTS = {
    query: {
        itemCode: undefined,
        itemName: undefined
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
            fields: [
                { key: 'code', name: '项目编号' },
                { key: 'name', name: '项目名称' },
                { key: 'type', name: '项目类型' ,
                    render: (h, { index, row, col }) => {
                        const en = this.PROJECT_TYPE.map[
                            Number( row.type )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:PROJECT_TYPE', row.type, typeof row.type, this.PROJECT_TYPE);
                            return row.type
                        }
                    }
                },
                { key: 'cityProjectName', name: '地市(局)项目编号' },
                { key: 'quantity', name: '项目总投资' },
                { key: 'materialUsage', name: '项目物资用途' ,
                     render: (h, { index, row, col }) => {
                        const en = this.MATERIAL_USAGE.map[
                            Number( row.materialUsage )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:MATERIAL_USAGE', row.materialUsage, typeof row.materialUsage, this.MATERIAL_USAGE);
                            return row.materialUsage
                        }
                    }
                },
                { key: 'voltageClasses', name: '电压等级' ,
                    render: (h, { index, row, col }) => {
                        const en = this.VOLTAGE_CLASSES.map[
                            Number( row.voltageClasses )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:VOLTAGE_CLASSES', row.voltageClasses, typeof row.voltageClasses, this.VOLTAGE_CLASSES);
                            return row.voltageClasses
                        }
                    }
                },
                { key: 'isRushRapair', name: '是否抢修项目' ,
                    render: (h, { index, row, col }) => {
                        const en = this.YES_FLAG.map[
                            Number( row.isRushRapair )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:YES_FLAG', row.isRushRapair, typeof row.isRushRapair, this.YES_FLAG);
                            return row.isRushRapair
                        }
                    }
                },
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
        ...mapState('enums', enums),
    },
    created () {
        // 获取枚举值
        this.queryEnums(enums)
    },
    methods: {
        ...mapActions('enums',['queryEnums']),
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
                this.$message.error('请选择项目')
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
            api.organize.queryListItem({
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