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
            <el-button v-if="rcMap['ba.org.supplier.export']" type="primary" size="mini" @click="handleExport" :loading="exporting">导出</el-button>
            <el-button v-if="rcMap['ba.org.supplier.add']" type="primary" size="mini" @click="handleAdd">新建</el-button>
            <el-button v-if="rcMap['ba.org.supplier.modify']" type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button v-if="rcMap['ba.org.supplier.enable']" type="primary" size="mini" @click="onStart">启用</el-button>
            <el-button v-if="rcMap['ba.org.supplier.stop']" type="primary" size="mini" @click="onStop">停用</el-button>
            <el-button v-if="rcMap['ba.org.supplier.import']" type="primary" size="mini" @click="handleImport" :loading="exporting">导入</el-button>
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
        handleStop: Function,
        handleImport: Function,
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '供应商编号' },
                { key: 'name', name: '供应商名称' },
                { key: 'contact', name: '联系人' },
                { key: 'phone', name: '联系电话' },
                { key: 'province', name: '省'},
                { key: 'city', name: '市'},
                { key: 'district', name: '区县'},
                { key: 'area', name: '街道'},
                { key: 'address', name: '联系地址', minWidth: 240 },
                {
                    key: 'validFlag',
                    name: '状态',
                    formatter: function (row, column, cellValue, index) {
                        return CNST.ENUMS.startStop[cellValue] || cellValue
                    }
                },
                { key: 'creator', name: '创建人' },
                {
                    key: 'createTime',
                    name: '创建时间',
                    width: 180
                },
                { key: 'modifier', name: '修改人' },
                {
                    key: 'modifiedTime',
                    name: '修改时间',
                    width: 180
                },
            ]
        }
    },
    methods: {
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要编辑的供应商！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一个供应商进行编辑！')
                return
            }
            if (rows[0].validFlag === 0) {
                this.$message.error('请选择启用的供应商！')
                return
            }
            this.handleEdit(rows)
            console.log(rows);
            
        },
        onStart () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要启用的供应商！')
                return
            }
            const vendIds = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 0) {
                    vendIds.push(rows[i].id)
                }
            }
            if (vendIds.length) {
                this.handleStart(vendIds)
            } else {
                this.$message.error('所选供应商都已启用！')
            }
        },
        onStop () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要停用的供应商！')
                return
            }
            const vendIds = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 1) {
                    vendIds.push(rows[i].id)
                }
            }
            if (vendIds.length) {
                this.handleStop(vendIds)
            } else {
                this.$message.error('所选供应商都已停用！')
            }
        }
    }
}
</script>


