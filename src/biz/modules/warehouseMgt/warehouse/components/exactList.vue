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
            <el-button v-if="rcMap['ba.wh.warehouse.export']" type="primary" size="mini" @click="handleExport" :loading="exporting">导出</el-button>
            <el-button v-if="rcMap['ba.wh.warehouse.add']" type="primary" size="mini" @click="handleAdd">新建</el-button>
            <el-button v-if="rcMap['ba.wh.warehouse.modify']" type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button v-if="rcMap['ba.wh.warehouse.enable']" type="primary" size="mini" @click="onStart">启用</el-button>
            <el-button v-if="rcMap['ba.wh.warehouse.stop']" type="primary" size="mini" @click="onStop">停用</el-button>
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
        handleStart: Function,
        handleStop: Function
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '仓库编码' },
                { key: 'name', name: '仓库名称' },
                { key: 'validFlag',name: '状态' ,
                    formatter: function (row, column, cellValue, index) {
                        return CNST.ENUMS.startStop[cellValue] || cellValue
                    }
                },
                { key: 'contact', name: '联系人' },
                { key: 'phone', name: '联系电话' },
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
                    width: 180
                }
            ]
        }
    },
    methods: {
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要编辑的仓库！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一个仓库进行编辑！')
                return
            }
            if (rows[0].validFlag === 0) {
                this.$message.error('请选择启用的仓库！')
                return
            }
            this.handleEdit(rows)
        },
        onStart () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要启用的仓库！')
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
                this.$message.error('所选仓库都已启用！')
            }
        },
        onStop () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要停用的仓库！')
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
                this.$message.error('所选仓库都已停用！')
            }
        }
    }
}
</script>


