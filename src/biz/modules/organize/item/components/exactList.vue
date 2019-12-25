<template>
    <basic-list
        :show-select-col="true"
        :show-action-col="false"
        :table-h="tableH"
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange">
        <template slot="hd-col--l">
            <!-- <el-button v-if="rcMap['ba.org.item.export']" type="primary" size="mini" @click="handleExport">导出</el-button> -->
            <el-button v-if="rcMap['ba.org.item.add']" type="primary" size="mini" @click="handleAdd">新建</el-button>
            <el-button v-if="rcMap['ba.org.item.modify']" type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button v-if="rcMap['ba.org.item.enable']" type="primary" size="mini" @click="onStart">启用</el-button>
            <el-button v-if="rcMap['ba.org.item.stop']" type="primary" size="mini" @click="onStop">停用</el-button>
            <el-button v-if="rcMap['ba.org.item.export']" type="primary" size="mini" @click="handleExport">导出</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        handleExport: Function,
        handleStart: Function,
        handleStop: Function,
        MATERIAL_USAGE: Object,//项目物资用途
        VOLTAGE_CLASSES: Object,//电压等级
        PROJECT_TYPE: Object,//项目类型
        YES_FLAG: Object,//是否
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '项目编号' },
                { key: 'name', name: '项目名称' },
                { key: 'type',name: '项目类型',
                     render: (h, { index, row, col }) => {
                        const en = this.PROJECT_TYPE[
                            Number( row.type )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            // console.log('没有枚举:PROJECT_TYPE', row.type, typeof row.type, this.PROJECT_TYPE);
                            return row.type
                        }
                    }
                },
                { key: 'validFlagName', name: '状态' },
                { key: 'cityProjectName', name: '地市(局)项目编号' },
                { key: 'quantity', name: '项目总投资',
                     render:(h, {index, row, col})=>{
                         if(row.quantity>0){
                             return <span>{ row.quantity }</span>
                         }else{
                             return <span></span>
                         }
                     }
                },
                { key: 'materialUsage', name: '项目物资用途' ,
                     render: (h, { index, row, col }) => {
                        const en = this.MATERIAL_USAGE[
                            Number( row.materialUsage )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            // console.log('没有枚举:MATERIAL_USAGE', row.materialUsage, typeof row.materialUsage, this.MATERIAL_USAGE);
                            return row.materialUsage
                        }
                    }
                },
                { key: 'voltageClasses', name: '电压等级' ,
                    render: (h, { index, row, col }) => {
                        const en = this.VOLTAGE_CLASSES[
                            Number( row.voltageClasses )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            // console.log('没有枚举:VOLTAGE_CLASSES', row.voltageClasses, typeof row.voltageClasses, this.VOLTAGE_CLASSES);
                            return row.voltageClasses
                        }
                    }
                },
                { key: 'isRushRapair', name: '是否抢修项目' ,
                    render: (h, { index, row, col }) => {
                        const en = this.YES_FLAG[
                            Number( row.isRushRapair )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.isRushRapair
                        }
                    }
                },
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
                    width: 180
                }
            ]
        }
    },
    methods: {
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要修改的项目！')
                return
            }
            if (rows.length>1) {
                this.$message.error('只能选择一个项目进行修改！')
                return
            }
            this.handleEdit({
                    id: rows[0].id
                }, () => {
            })
        },
        onStart () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要启用的项目！')
                return
            }
            const ids = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 0) {
                    ids.push(rows[i].id)
                }
            }
            if (ids.length) {
                this.handleStart(ids)
            } else {
                this.$message.error('所选项目都已启用！')
            }
        },
        onStop () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要停用的项目！')
                return
            }
            const ids = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 1) {
                    ids.push(rows[i].id)
                }
            }
            if (ids.length) {
                this.handleStop(ids)
            } else {
                this.$message.error('所选项目都已停用！')
            }
        }
    }
}
</script>


