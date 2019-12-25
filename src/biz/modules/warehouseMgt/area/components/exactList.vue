<template>
    <basic-list
        :show-select-col="true"
        :show-action-col="false"
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
            <el-button v-if="rcMap['ba.wh.zone.export']" type="primary" size="mini" @click="handleExport">导出</el-button>
            <el-button v-if="rcMap['ba.wh.zone.add']" type="primary" size="mini" @click="handleAdd">新建</el-button>
            <el-button v-if="rcMap['ba.wh.zone.modify']" type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button v-if="rcMap['ba.wh.zone.del']" type="danger" size="mini" @click="onDelete">删除</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        handleExport: Function,
        handleImport: Function
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '库区编号' },
                { key: 'name', name: '库区名称' },
                { key: 'remark', name: '备注' },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间' },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间' }
            ]
        }
    },
    methods: {
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要编辑的库区！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一个库区进行编辑！')
                return
            }
            this.handleEdit(rows[0])
        },
        onDelete () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择准备删除的库区！')
                return
            }

            // const names = rows.reduce((string = '', row) => (string + ' ' + row.name));
            this.handleDelete({
                idList: this.selRows.map(row => row.id)
            })
        }
    }
}
</script>


