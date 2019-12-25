<template>
    <div class="basic-list" v-loading="loading">
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
                    :ref="`popover-tb_${menuId}`"
                    placement="bottom-end"
                    trigger="click"
                    width="562">
                    <div
                        class="basic-list__sel-field-wrap"
                        v-if="setClmnsFlg">
                        <set-tb-colum
                            :menu-id="menuId"
                            :tb-all-colmns="tbAllColmns"
                            :handle-chg-vis="handleChgVis"
                            :handle-save-clms="handleSaveClms"
                            :handle-close-pop="handleClosePop" />
                    </div>

                    <div
                        class="basic-list__sel-field-wrap"
                        v-else>
                        <el-checkbox
                            class="sel-all-fields"
                            :indeterminate="isIndeterminate"
                            v-model="allFieldsSelected"
                            @change="allFieldsSelChg">
                            全选
                        </el-checkbox>
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
            :max-height="tableHt"
            border
            ref="table"
            :stripe="stripe"
            :data="list"
            :row-key="rowKey"
            :tree-props="treeProps"
            :row-class-name="rowClassName"
            @selection-change="selectionChange"
            @row-click="rowClick">
            <el-table-column align="center" type="selection" :width="50" v-if="showSelectCol && selectType === 'multiple'"/>
            <el-table-column align="center" :width="50" v-if="showSelectCol && selectType === 'single'">
                <template slot-scope="scope">
                    <el-radio v-model="radioIndex" :label="scope.$index">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column align="center" type="index" :width="indexColWidth" :label="indexColLabel"  :index="getIndex" v-if="showIndexCol"/>
            <template  v-for="item of visFields">
                <el-table-column
                    v-if="!item.render"
                    :class-name="item.classNames ? item.classNames.join(' ') : null"
                    :prop="item.key"
                    :label="item.name"
                    :align="item.align || 'center'"
                    :width="item.width ? item.width + 'px' : undefined"
                    :min-width="item.minWidth ? item.minWidth + 'px' : '120px'"
                    :render-header="item.hdRender"
                    :formatter="item.formatter">
                </el-table-column>
                <el-table-column
                    v-else
                    :class-name="item.classNames ? item.classNames.join(' ') : null"
                    :prop="item.key"
                    :label="item.name"
                    :align="item.align || 'center'"
                    :width="item.width ? item.width + 'px' : undefined"
                    :min-width="item.minWidth ? item.minWidth + 'px' : '120px'"
                    :render-header="item.hdRender">
                    <template slot-scope="scope">
                        <table-column
                            :index="scope.$index"
                            :row="scope.row"
                            :col="scope.column"
                            :field="item"
                            :render="item.render"/>
                    </template>
                </el-table-column>
            </template>
            <el-table-column
                align="center"
                class-name="basic-list__col--action"
                v-if="showActionCol"
                :fixed="actionColFixed"
                :width="actionColWidth"
                :label="actionColLabel">
                <template slot-scope="scope">
                    <table-column
                        :index="scope.$index"
                        :row="scope.row"
                        :col="scope.column"
                        :render="actionRender"
                    />
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import TableColumn from 'biz/components/tableColumn'
import SetTbColum from 'biz/components/basicSetTbClms'
import { mapActions } from "vuex"

const DEFAULTS = {
    radioIndex: null
}

export default {
    components: {
        TableColumn,
        SetTbColum
    },
    props: {
        treeProps: {
            type: Object,
            default(){
                return {}
            }
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
                return [10, 20, 50, 100, 200]
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
        /**
        * 显示列表是否可设置
        */
        setClmnsFlg: {
            type: Boolean,
            default: true
        }
    },
    data () {
        const selFieldKeys = this.getDefSelFieldKeys()
        const visFields = this.getDefVisFields(selFieldKeys)
        const ot = this.getFieldOther()
        return {
            ..._.cloneDeep(DEFAULTS),
            selFieldKeys,
            allFieldsSelected: selFieldKeys.length === this.fields.length,
            tableHt: 200,
            tbVisObj: null,
            tbAllColmns: ot.arry,
            visFields,
            menuId: this.$router.currentRoute.meta.id
        }
    },
    computed: {
        isIndeterminate () {
            return this.selFieldKeys.length < this.fields.length
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
            this.visFields = this.getDefVisFields(newVal)
        },
        radioIndex (newVal) {
            if (newVal !== null || newVal !== undefined) {
                this.selectionChange([this.list[newVal]])
            } else {
                this.selectionChange([])
            }
        },

        tbVisObj (newVal) {
            /**
             * 处理接口返回数组
             * selected区分是否显示
             * 案例：
             *   showColList: ["storerName", "code", "name"]
             */
            if (newVal) {
                const map = this.getFieldOther().map
                let all = [].concat(newVal.showColList || [], newVal.hideColList || [])
                if (all.length) {
                    const reslt = []
                    for (let i = 0, len = all.length; i < len; i++) {
                        if(map[all[i]]){
                            map[all[i]].selected = newVal.showColList.indexOf(all[i]) !== -1
                            reslt.push(map[all[i]])
                        }
                       
                    }
                    this.tbAllColmns = reslt
                }
            }
        }
    },
    mounted (){
        this.$nextTick( () => {
            // 此处offsetTop和窗口变化 差 29px 227-198i
            if(this.$refs&&this.$refs.table){
                this.tableHt = window.innerHeight - this.$refs.table.$el.offsetTop - 29 - 30
            }
            // 监听窗口大小变化
            window.addEventListener('resize', jt.debounce( () => {
                 if(this.$refs&&this.$refs.table){
                    this.tableHt = window.innerHeight - this.$refs.table.$el.offsetTop - 30
                 }
            }, 100))

            if (this.setClmnsFlg) {
                // 查询列表显示列list
                this.queryTbFields(this.menuId).then((res) => {
                    this.tbVisObj = _.cloneDeep(res)
                })
            }
        })
    },
    methods: {
        ...mapActions('app', [
            'queryTbFields',
            'saveTbClmList'
        ]),
        handleChgVis (visArry) {
            this.visFields = _.cloneDeep(visArry)
        },
        handleSaveClms (sd) {
            this.saveTbClmList(sd).then(({ head, body }) => {
                if (head.code === '200') {
                    this.handleClosePop()
                } else {
                    this.$message.error(head.message)
                }
            })
        },
        handleClosePop () {
            this.$refs[`popover-tb_${this.menuId}`].doClose()
        },
        getDefVisFields (sels) {
            const keyArr = sels
            const keyMap = {}
            for (let i = 0; i < keyArr.length; i++) {
                keyMap[keyArr[i]] = true
            }
            return this.fields.filter(function (item) {
                return keyMap[item.key]
            })
        },
        getFieldOther () {
            const arry = _.cloneDeep(this.fields)
            const map = {}
            for (let i = 0, len = arry.length; i < len; i++) {
                arry[i].selected = true
                map[arry[i].key] = arry[i]
            }
            return { arry, map }
        },
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
                     if(table.selection&&table.selection.length>0){
                        const selection = table.selection
                        for (let i = 0, len = selection.length; i < len; i++) {
                            if (selection[i] === row) {
                                selected = true
                                break
                            }
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
        rowClassName({ row,  rowIndex }) {
            let rowName = ""
            const table = this.$refs.table
            if(table&&table.selection&&table.selection.length>0){
                const selection = table.selection
                const findRow = selection.find(c => c.id == row.id);
                if (findRow) {
                    rowName = "current-row"; // elementUI 默认高亮行的class类 不用再样式了^-^,也可通过css覆盖改变背景颜色
                }
            }
            return rowName; //也可以再加上其他类名 如果有需求的话
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px 0 5px;
    // padding: 5px 32px 5px 18px;
    // height: 28px;
    line-height: 28px;
    border: 1px solid #dbdbdb;
    border-bottom: none;
    background: #fcfcfc;
    overflow: hidden;
}
// @media screen and (min-width: 1300px) and (max-width: 1600px) {
//     .basic-list__hd-col--l {
//         max-width: calc(1050px - 394px);
//     }
// }
// @media screen and (max-width: 1100px) and (min-width: 1300px) {
//     .basic-list__hd-col--l {
//         max-width: calc(810px - 394px);
//     }
// }
.basic-list__hd-col--l {
    .el-button ,.el-dropdown {
        margin: 6px 6px 6px 0 !important;
    }
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
.current-row{
    background-color: rgba(185, 221, 249, 0.75)
}
</style>

