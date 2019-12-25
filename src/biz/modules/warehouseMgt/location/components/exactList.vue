<template>
    <basic-list
        class="location_list"
        :show-select-col="true"
        :show-action-col="false"
        :fields="fields"
        :fieldLimit="11"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange"
        :page-size="state.pageSize">
        <template slot="hd-col--l">
            <!-- <a class="hd-btn" @click="handleExport">
                <span class="text">导出</span>
                <span class="line"></span>
                <i class="icon el-icon-arrow-down"></i>
            </a> -->
            <el-button v-if="rcMap['ba.wh.location.export']" type="primary" size="mini" @click="handleExport">导出</el-button>
            <el-button v-if="rcMap['ba.wh.location.batchAdd']" type="primary" size="mini" @click="handleAdd">批量生成</el-button>
            <el-button v-if="rcMap['ba.wh.location.batchModify']" type="primary" size="mini" @click="onProxy('edit')">批量修改</el-button>
            <el-button v-if="rcMap['ba.wh.location.enable']" type="primary" size="mini" @click="onProxy('start')">启用</el-button>
            <el-button v-if="rcMap['ba.wh.location.stop']" type="warning" size="mini" @click="onProxy('stop')">停用</el-button>
            <!-- <el-button v-if="rcMap['ba.wh.location.add']" type="primary" size="mini" @click="add">新建</el-button>
            <el-button v-if="rcMap['ba.wh.location.edit']" type="warning" size="mini" @click="edit">修改</el-button> -->
            <el-button  type="primary" size="mini" @click="add">新建</el-button>
            <el-button  type="primary" size="mini" @click="editIt">修改</el-button>
            <el-button  type="primary" size="mini" @click="handleImport" :loading="exporting">导入</el-button>
            <!-- <el-button type="danger" size="mini" @click="onProxy('delete')">删除</el-button> -->
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        exporting: Boolean,
        handleExport: Function,
        handleImport: Function,
        handleBatchEdit: Function,
        handleStart: Function,
        handleStop: Function,
        handleDelete: Function,
        state: Object,
        locationType: Array,
        LOCATION_CYCLE_CLASS: Object,
        DELETE_FLAG: Object,
        LOCATION_USE: Object,
        LOCATION_CONSTRAINT: Object,
        add: Function,
        edit: Function
    },
    data () {
        return {
            fields: [
                { key: 'zoneName', name: '库区名称' },
                { key: 'code', name: '库位编码' ,width:180},
                { key: 'locationTypeName', name: '库位类型',
                    /* render: (h, { index, row, col }) => {
                        const result = this.locationType.filter(type => {
                            return (type.id) === row.locTypeId
                        })
                        if (result && result.length > 0) {
                            return (
                                <span>{result[0].name}</span>
                            )
                        } else {
                            console.log('没有类型:locCategory' +  row.locTypeId);
                            return row.locTypeId;
                        }
                    } */
                },
                { 
                    key: 'locUse',
                    name: '库位用途',
                    render: (h, { index, row, col }) => {
                        /* const en = this.LOCATION_USE.map[
                            Number( row.locUse )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:LOCATION_USE' +  row.locUse);
                            return row.locUse
                        }   */  
                        for (let i = 0, len = this.LOCATION_USE.array.length; i < len; i++) {
                            if (this.LOCATION_USE.array[i].enumCode === row.locUse) {
                               return <span>{this.LOCATION_USE.array[i].enumValueCn}</span>
                            }
                        }
                    }
                },
                { key: 'constraintType', name: '使用限制',
                    render: (h, { index, row, col }) => {
                        /* const en = this.LOCATION_CONSTRAINT.map[
                            Number( row.constraintType )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:LOCATION_CONSTRAINT' +  row.constraintType);
                            
                            return row.constraintType
                        } */
                        for (let i = 0, len = this.LOCATION_CONSTRAINT.array.length; i < len; i++) {
                            if (this.LOCATION_CONSTRAINT.array[i].enumCode === row.constraintType) {
                               return <span>{this.LOCATION_CONSTRAINT.array[i].enumValueCn}</span>
                            }
                        }
                    }
                },
                { key: 'cycleClass', name: 'ABC分类',
                    render: (h, { index, row, col }) => {
                        /* const en = this.LOCATION_CYCLE_CLASS.map[
                            Number( row.cycleClass )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:LOCATION_CYCLE_CLASS' +  row.cycleClass);
                            
                            return row.cycleClass
                        } */
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
                    /* render: (h, { index, row, col }) => {
                        const en = this.DELETE_FLAG.map[
                            Number( row.state )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            console.log('没有枚举:DELETE_FLAG' +  row.state);
                            
                            return row.state
                        }
                    } */
                    formatter: function (row, column, cellValue, index) {
                        return CNST.ENUMS.startStop[cellValue] || cellValue
                    } 
                },
                { key: 'remark', name: '备注' },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间' ,width:180},
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间' ,width:180}
            ]
        }
    },
    methods: {
        // 检测是否选择
        validateChoose() {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择库区！')
                return false
            }
            return rows
        },
        // 格式化数据
        formatData (rows) {
            return {
                idList: rows.map(row => row.id)
            }
        },
        //编辑
        editIt(){
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择库位！')
                return false
            }
            if (rows.length>1) {
                this.$message.error('只能选择一个库位进行修改！')
                return false
            }
            this.edit(rows[0])
        },
        // 代理
        onProxy (type) {
            const rows = this.validateChoose()
            if (rows) {
                const entity = this.formatData(rows)
                switch (type) {
                    case 'edit':
                        //编辑时候判断库位用途，收货库位，出库暂存库位，不允许批量修改。
                        let result = rows.some(
                            function(item){
                                return item.locUse === 20 || item.locUse === 30
                            }
                        )
                        if (!result) {
                            return this.handleBatchEdit(entity);
                        } else {
                            return this.$message.error('所选库位存在收货库位或出库暂存库位，不允许批量修改')
                        }
                    case 'delete':
                        return this.handleDelete(entity);
                    case 'start':
                        return this.handleStart(entity);
                    case 'stop':
                        return this.handleStop(entity);
                    default:
                        break;
                }
            }
        }
    }
}
</script>

<style lang="scss">
    .location_list {
        /deep/ .el-pagination__sizes {
            .el-input.el-input--mini.el-input--suffix {
                min-width: 70px;
                width: 70px;
            }
        }
    }
    
</style>

