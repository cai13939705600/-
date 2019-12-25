<template>
    <div class="basic-list my_table" v-loading="loading">
        <div class="basic-list__hd f-cb" v-if="showHead">
            <div class="basic-list__hd-col--l f-fl">
                <slot name="hd-col--l"></slot>
            </div>
            <div class="basic-list__hd-col--r f-fr">
                <el-pagination
                    v-if="showPage && list.length"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :page-sizes="pageSizes"
                    :total="total"
                    layout="total, sizes, prev, jumper, slot, next "
                    @current-change="pageIndexChange"
                    @size-change="pageSizeChange">
                    <span class="page-count"> / {{pageCount}}</span>
                </el-pagination>
                <el-popover
                    placement="bottom-end"
                    trigger="click"
                    width="562">
                    <div class="basic-list__sel-field-wrap">
                        <el-checkbox-group v-model="selFieldKeys">
                            <el-checkbox v-for="item of fields" :key="item.key" :label="item.key">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <a slot="reference" class="el-icon-setting basic-list__sel-field-btn"></a>
                </el-popover>
            </div>
        </div>
        <div class="basic-list__tip" v-if="showTip">
            <slot name="tip"></slot>
        </div>
        <el-table
            :data="list"
            style="width: 100%"
            row-key="id"
            border
            :tree-props="{children: 'chuilSkuCategoryList', hasChildren: '!!chuilSkuCategoryList'}">
            
            <template  v-for="item of visFields">
                <el-table-column
                    :key="item.key"
                    :class-name="item.classNames ? item.classNames.join(' ') : null"
                    :prop="item.key"
                    :label="item.name"
                    :align="item.align || 'center'"
                    :width="item.width ? item.width + 'px' : undefined"
                    :min-width="item.minWidth ? item.minWidth + 'px' : '120px'"
                    :render-header="item.hdRender"
                    :formatter="item.formatter">
                </el-table-column>
            </template>
            <el-table-column label="操作">
            <template slot-scope="scope">
                 <!-- <el-button
                size="mini"
                @click="onEdit(scope.$index, scope.row)">新建</el-button>
                <el-button
                size="mini"
                @click="onEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
                <i  @click="onAdd(scope.row.level,scope.row.id)" class="el-icon-circle-plus-outline"></i>
                <i  @click="onEdit(scope.$index, scope.row)" class="el-icon-edit"></i>
                <i  @click="handleDel(scope.$index, scope.row)" class="el-icon-delete"></i>
            </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import TableColumn from 'biz/components/tableColumn'

const DEFAULTS = {
    radioIndex: null
}

export default {
    components: {
        TableColumn
    },
    props: {
        children:{
            type: String,
            default:''
        },
        hasChildren:{
            type: Boolean,
            default: false
        },
        stripe: {
            type: Boolean,
            default: true
        },
        fields: {
            type: Array,
            default () {
                return []
            }
        },
        // 默认显示字段
        defSelFieldKeys: {
            type: Array,
            default () {
                return []
            }
        },
        // 默认显示字段个数
        fieldLimit: {
            type: Number,
            default: 7
        },
        showIndexCol: {
            type: Boolean,
            default: true
        },
        indexColWidth: {
            type: Number,
            default: 55
        },
        indexColLabel: {
            type: String,
            default: '序号'
        },
        showSelectCol: {
            type: Boolean,
            default: false
        },
        selectType: {
            type: String,
            default: 'multiple'
        },
        showActionCol: {
            type: Boolean,
            default: true
        },
        actionColFixed: {
            type: [Boolean, String],
            default: 'right'
        },
        actionColWidth: {
            type: Number,
            default: 100
        },
        actionColLabel: {
            type: String,
            default: '操作'
        },
        actionRender: {
            type: Function,
            default: () => {}
        },
        loading: {
            type: Boolean,
            default: false
        },
        showHead: {
            type: Boolean,
            default: true
        },
        showTip: {
            type: Boolean,
            default: false
        },
        showPage: {
            type: Boolean,
            default: true
        },
        pageIndex: {
            type: Number,
            default: 1
        },
        pageSize: {
            type: Number,
            default: 20
        },
        pageSizes: {
            type: Array,
            default () {
                return [ 20]
            }
        },
        total: {
            type: Number,
            default: 0
        },
        list: {
            type: Array,
            default () {
                return []
            }
        },
        rowKey: {
            type: [ String, Function],
            default () {
                return undefined
            }
        },
        pageIndexChange: {
            type: Function,
            default: () => {}
        },
        pageSizeChange: {
            type: Function,
            default: () => {}
        },
        selectionChange: {
            type: Function,
            default: () => {}
        },
        handleRowClick: {
            type: Function,
            default: () => {}
        },
        onAdd: {
            type: Function,
            default: () => {}
        },
        onEdit: {
            type: Function,
            default: () => {}
        },
        handleDel: {
            type: Function,
            default: () => {}
        },
    },
    data () {
        const selFieldKeys = this.getDefSelFieldKeys()
        return {
            ..._.cloneDeep(DEFAULTS),
            selFieldKeys,
            allFieldsSelected: selFieldKeys.length === this.fields.length,

        }
    },
    computed: {
        isIndeterminate () {
            return this.selFieldKeys.length < this.fields.length
        },
        visFields () {
            const keyArr = this.selFieldKeys
            const keyMap = {}
            for (let i = 0; i < keyArr.length; i++) {
                keyMap[keyArr[i]] = true
            }
            return this.fields.filter(function (item) {
                return keyMap[item.key]
            })
        },
        pageCount () {
            return Math.ceil(this.total / this.pageSize)
        }
    },
    watch: {
        fields (newVal) {
            this.selFieldKeys = this.getDefSelFieldKeys()
        },
        selFieldKeys (newVal) {
            this.allFieldsSelected = newVal.length === this.fields.length
        },
        radioIndex (newVal) {
            if (newVal !== null || newVal !== undefined) {
                this.selectionChange([this.list[newVal]])
            } else {
                this.selectionChange([])
            }
        }
    },
    methods: {
        getIndex (index) {
            return (this.pageIndex - 1 ) * this.pageSize + index + 1
        },
        // 获取默认选中字段key值数组
        getDefSelFieldKeys (limit) {
            if (this.defSelFieldKeys.length > 0) {
                return this.defSelFieldKeys
            }
            return this.fields.slice(0, limit).map(item => {
                return item.key
            });
        },
        allFieldsSelChg (checked) {
            if (!checked) {
                this.selFieldKeys = this.getDefSelFieldKeys(this.fieldLimit)
            } else {
                this.selFieldKeys = this.fields.map(item => {
                    return item.key
                })
            }
        },
        rowClick (row, col) {
            if (col && col.className === 'edit-col') {
                return
            }
            const table = this.$refs.table
            let selected = false
            if (this.showSelectCol) {
                if (this.selectType === 'multiple') {
                    table.toggleRowSelection(row)
                    const selection = table.selection
                    for (let i = 0, len = selection.length; i < len; i++) {
                        if (selection[i] === row) {
                            selected = true
                            break
                        }
                    }
                } else if (this.selectType === 'single') {
                    const list = this.list
                    for (let i = 0, len = this.list.length; i < len; i++) {
                        if (list[i] === row) {
                            if (i === this.radioIndex) {
                                this.radioIndex = null
                            } else {
                                this.radioIndex = i
                                selected = true
                            }
                            break
                        }
                    }
                }
            }
            this.handleRowClick(row, selected)
        },
        updateData (arg) {
            Object.assign(this, arg)
        },
        resetData (arg) {
            if (_.isEmpty(arg) || _.isObject(arg)) {
                Object.assign(this, { ..._.cloneDeep(DEFAULTS), ...(arg || {})})
            } else if(_.isObject(arg)) {
                Object.assign(this, arg)
            } else if (_.isArray(arg)) {
                for (let i = 0; i < arg.length; i++) {
                    this[arg[i]] = _.cloneDeep(DEFAULTS[arg[i]])
                }
            } else if (_.isString(arg)) {
                this[arg] = _.cloneDeep(DEFAULTS[arg])
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.basic-list {
    /deep/ .cell {
        .el-radio__label {
            display: none;
        }
    }
}
.basic-list__hd {
    padding: 20px 32px 20px 18px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #dbdbdb;
    border-bottom: none;
    background: #fcfcfc;
}
.basic-list__hd-col--l {
    .hd-btn {
        display: inline-block;
        margin-right: 10px;
        padding: 0 14px;
        color: #fff;
        font-size: 12px;
        background-color: #4186f6;
        &:last-child {
            margin-right: 0;
        }
        .icon, .line, .text {
            display: inline-block;
            vertical-align: middle;
        }
        .icon {
            width: 12px;
            height: 12px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
        }
        .line {
            margin: 0 10px;
            width: 1px;
            height: 16px;
            background: #2c6bea;
        }
    }
}
.basic-list__sel-field-wrap {
    padding: 10px 0 5px 20px;
    .sel-all-fields {
        margin-bottom: 10px;
    }
}
.el-checkbox-group {
    .el-checkbox {
        margin: 0 25px 0 0;
        height: 36px;
        width: 110px;
        line-height: 36px;
        overflow: hidden;
        word-wrap: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:nth-child(4n) {
            margin-right: 0;
        }
    }
}
.basic-list__tip {
    margin-bottom: 10px;
}
.basic-list__sel-field-btn {
    margin-left: 12px;
    vertical-align: middle;
    color: #606266;
}
.el-pagination {
    display: inline-block;
    font-size: 12px;
    /deep/ .el-select .el-input {
        width: 60px;
    }
    /deep/ .el-pagination__jump {
        margin-left: 0;
    }
    /deep/ .page-count {
        min-width: auto;
        font-weight: normal;
        color: #606266;
    }
}
.my_table{
    /deep/ .el-icon-circle-plus-outline{
        width:20px;
        height: 20px;
    }
    /deep/ .el-icon-edit{
        width:20px;
        height: 20px;
    }
    /deep/ .el-icon-delete{
        width:20px;
        height: 20px;
    }
}
</style>

