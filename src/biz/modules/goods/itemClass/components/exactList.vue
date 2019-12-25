<template>
    <basic-list
        :show-select-col="false"
        :show-action-col="true"
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :onEdit="onEdit"
        :rowKey="'id'"
        :treeProps="{children: 'chuilSkuCategoryList', hasChildren: '!!chuilSkuCategoryList'}"
        :handleDel="handleDel"
        :actionRender='actionRender'
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange">
        <template slot="hd-col--l">
            <!-- <el-button type="primary" size="mini" @click="handleAdd" v-if="$hasAuth('product_skubarcode_add')">新建</el-button>
            <el-button type="primary" size="mini" @click="onEdit" v-if="$hasAuth('product_skubarcode_edit')">修改</el-button>
            <el-button type="primary" size="mini" @click="onDelete" v-if="$hasAuth('product_skubarcode_del')">启用</el-button>
            <el-button type="primary" size="mini" @click="onDelete" v-if="$hasAuth('product_skubarcode_del')">停用</el-button> -->
            <el-button v-if="rcMap['ba.sku.category.add']" type="primary" size="mini" @click="handleAdd" >新建</el-button>
        </template>
    </basic-list >
    
</template>

<script>
import ExactList from 'biz/mixins/exactList'
import tableTree from 'biz/components/tableTree'
export default {
    mixins: [ ExactList ],
    props: {
        exportUrl: String,
        handleImport: Function,
        handleStart: Function,
        handleStop: Function,
        addItemClass:Function
    },
    components:{
        tableTree
    },
    data () {
        return {
            fields: [
                { key: 'name', name: '分类名称' },
                { key: 'code', name: '分类编码', width: 180 },
                { key: 'level', name: '分类级别', width: 180 },
                { key: 'remark', name: '备注', Width: 150 },
                { key: 'creator', name: '创建人', width: 160 },
                { key: 'createTime', name: '创建时间', width: 160 },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间', width: 180 }
            ]
        }
    },
    methods: {
        onAdd(a,v){
            this.addItemClass(a,v)
        },
        onEdit (a,b) {
            const rows = b
            this.handleEdit(rows)
        },
        handleDel(a,b){
            const rows = b
            this.handleDelete(rows)
        },
        onStart () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要启用的物料分类！')
                return
            }
            const goodsIds = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 0) {
                    goodsIds.push(rows[i].id)
                }
            }
            if (goodsIds.length) {
                this.handleStart(goodsIds,1)
            } else {
                this.$message.error('所选物料分类已启用！')
            }
        },
        onStop () {
            debugger
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要停用的物料分类！')
                return
            }
            const goodsIds = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 1) {
                    goodsIds.push(rows[i].id)
                }
            }
            if (goodsIds.length) {
                this.handleStop(goodsIds,0)
            } else {
                this.$message.error('所选物料分类都已停用！')
            }
        },
        actionRender (h, { index, row, col }) {
            return (
                <div>
                    <el-link style="font-size:16px;margin-right:8px" type="primary" title="新增" class="el-icon-circle-plus-outline" onClick={() => this.onAdd(row.level,row.id)}></el-link>
                    <el-link style="font-size:16px;margin-right:8px" type="primary" title="编辑" class="el-icon-edit" onClick={() => this.onEdit(index, row)}></el-link>
                    <el-link style="font-size:16px" type="primary" title="删除" class="el-icon-delete" onClick={() => this.handleDel(index, row)}></el-link>
                </div>
            )
        }
    }
}
</script>


