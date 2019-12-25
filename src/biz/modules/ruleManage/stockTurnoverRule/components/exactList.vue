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
           <!-- <el-button type="primary" size="mini" @click="handleAdd">新建</el-button>
            <el-button type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button type="primary" size="mini" @click="onStart">启用</el-button>
            <el-button type="primary" size="mini" @click="onStop">停用</el-button>-->
            <el-button v-if="rcMap['ba.rule.turnoverrule.add']" type="primary" size="mini" @click="handleAdd" >新增</el-button>
            <el-button v-if="rcMap['ba.rule.turnoverrule.modify']" type="primary" size="mini" @click="onEdit" >修改</el-button>
            <el-button v-if="rcMap['ba.rule.turnoverrule.enable']" type="primary" size="mini" @click="onStart">启用</el-button>
            <el-button v-if="rcMap['ba.rule.turnoverrule.stop']" type="primary" size="mini" @click="onStop">停用</el-button>

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
        VALID_FLAG:Object,
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '周转规则编码' },
                { key: 'name', name: '周转规则名称' ,
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.handleView(row)}>{row.name}</el-link>
                    )
                    }
                },
                { key: 'description',name: '描述'},
                { key: 'lotAttrRuleName', name: '批次规则' },
                { key: 'validFlag', name: '状态',width: 80,
                    formatter: function (row, column, cellValue, index) {
                        return CNST.ENUMS.startStop[cellValue] || cellValue
                    }
                },
                { key: 'creator', name: '创建人' },
                {
                    key: 'createTime',
                    name: '创建时间',
                    width: 140,
                    /* formatter: function (row, column, cellValue, index) {
                        return jt.date.format(cellValue)
                    } */
                },
                { key: 'modifier', name: '修改人' },
                {
                    key: 'modifiedTime',
                    name: '修改时间',
                    width: 140
                }
            ]
        }
    },
    methods: {
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要编辑的周转规则！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一个周转规则进行编辑！')
                return
            }
            if (rows[0].validFlag === 0) {
                this.$message.error('请选择启用的周转规则！')
                return
            }
           this.handleEdit(rows[0])//库存周转规则回显
        },

        onStart () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要启用的周转规则！')
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
                this.$message.error('所选周转规则都已启用！')
            }
        },
        onStop () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要停用的周转规则！')
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
                this.$message.error('所选周转规则都已停用！')
            }
        }
    }
}
</script>


