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
            <!-- <a class="el-button el-button--primary el-button--mini" :href="exportUrl" v-if="$hasAuth('product_skubarcode_export')">导出</a>
            <el-button type="primary" size="mini" @click="handleImport" v-if="$hasAuth('product_skubarcode_import')">批量导入</el-button>
            <el-button type="primary" size="mini" @click="handleAdd" v-if="$hasAuth('product_skubarcode_add')">新增</el-button>
            <el-button type="primary" size="mini" @click="onEdit" v-if="$hasAuth('product_skubarcode_edit')">修改</el-button>
            <el-button type="primary" size="mini" @click="onDelete" v-if="$hasAuth('product_skubarcode_del')">删除</el-button> -->
            <a v-if="rcMap['ba.sku.barcode.export']" class="el-button el-button--primary el-button--mini" :href="exportUrl">导出</a>
            <el-button v-if="rcMap['ba.sku.barcode.batchImport']" type="primary" size="mini" @click="handleImport" >批量导入</el-button>
            <el-button v-if="rcMap['ba.sku.barcode.add']" type="primary" size="mini" @click="handleAdd" >新增</el-button>
            <el-button v-if="rcMap['ba.sku.barcode.modify']" type="primary" size="mini" @click="onEdit" >修改</el-button>
            <el-button v-if="rcMap['ba.sku.barcode.del']" type="danger" size="mini" @click="onDelete">删除</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        exportUrl: String,
        handleImport: Function
    },
    data () {
        return {
            fields: [
                { key: 'storerName', name: '货主名称' },
                { key: 'code', name: '物料编号', width: 180 },
                { key: 'name', name: '物料名称', minWidth: 180 },
                { key: 'shortName', name: '物料简称', minWidth: 150 },
                { key: 'barcode', name: '物料条码', width: 160 },
                { key: 'skuNo1', name: '货号', width: 160 },
                { key: 'spec', name: '规格' },
                { key: 'creator', name: '创建人' },
                { key: 'createTime', name: '创建时间', width: 180 },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间', width: 180 }
            ]
        }
    },
    methods: {
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要编辑的物料作业条码！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一个物料作业条码进行编辑！')
                return
            }
            this.handleEdit(rows[0])
        },
        onDelete () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要删除的物料作业条码！')
                return
            }
            const items = []
            for (let i = 0, len = rows.length; i < len; i++) {
                items.push({
                    id: rows[i].id,
                    skuId: rows[i].skuId,
                    barcode: rows[i].barcode
                })
            }
            this.handleDelete(items)
        }
    }
}
</script>


