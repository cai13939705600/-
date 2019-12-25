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
            <!-- <el-button type="primary" size="mini" @click="handleAdd" v-if="$hasAuth('product_skubarcode_add')">新建</el-button>
            <el-button type="primary" size="mini" @click="onEdit" v-if="$hasAuth('product_skubarcode_edit')">修改</el-button>
            <el-button type="primary" size="mini" @click="onDelete" v-if="$hasAuth('product_skubarcode_del')">启用</el-button>
            <el-button type="primary" size="mini" @click="onDelete" v-if="$hasAuth('product_skubarcode_del')">停用</el-button> -->
            <el-button v-if="rcMap['ba.billtype.manage.add']" type="primary" size="mini" @click="handleAdd">新建</el-button>
            <el-button v-if="rcMap['ba.billtype.manage.modify']" type="primary" size="mini" @click="onEdit" >修改</el-button>
            <el-button v-if="rcMap['ba.billtype.manage.enable']" type="primary" size="mini" @click="onStart">启用</el-button>
            <el-button v-if="rcMap['ba.billtype.manage.stop']" type="primary" size="mini" @click="onStop">停用</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        exportUrl: String,
        handleImport: Function,
        handleStart: Function,
        handleStop: Function,
        BILL_CATEGORY_TYPE:Object
    },
    data () {
        return {
            fields: [
                { key: 'code', name: '单据编码' },
                { key: 'name', name: '单据类型', width: 180 },
                { key: 'billCategory', name: '单据大类', minWidth: 180 ,
                    render: (h, { index, row, col }) => {
                        const en = this.BILL_CATEGORY_TYPE.map[
                            Number( row.billCategory )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.billCategory
                        }
                    }
                },
                {
                    key: 'validFlagName',
                    name: '启停状态',
                },
                { key: 'remark', name: '备注', width: 160 },
                { key: 'creator', name: '创建人', width: 160 },
                { key: 'createTime', name: '创建时间', width: 180 },
                { key: 'modifier', name: '修改人' },
                { key: 'modifiedTime', name: '修改时间', width: 180 },
            ]
        }
    },
    methods: {
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要编辑的单据类型！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一个单据类型进行编辑！')
                return
            }
            if(rows[0].validFlag!=1){
                this.$message.error('请选择启用状态单据类型进行编辑！')
                return
            }
            this.handleEdit(rows[0])
        },
        onStart () {
            debugger
           const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要启用的单据类型！')
                return
            }
            const goodsIds = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 0) {
                    goodsIds.push(rows[i].id)
                }
            }
            if (goodsIds.length) {
                this.handleStart(goodsIds)
            } else {
                this.$message.error('所选单据类型已启用！')
            }
        },
        onStop () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要停用的单据类型！')
                return
            }
            const goodsIds = []
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].validFlag === 1) {
                    goodsIds.push(rows[i].id)
                }
            }
            if (goodsIds.length) {
                this.handleStop(goodsIds)
            } else {
                this.$message.error('所选单据类型都停用！')
            }
        }
    }
}
</script>


