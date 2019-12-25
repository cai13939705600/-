<template>
    <basic-list
        :show-select-col="true"
        :table-h="tableH"
        :fields="fields"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :show-action-col="false"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange">
        <template slot="hd-col--l">
            <!-- <el-button type="primary" size="mini" @click="handleExport" :loading="exporting" v-if="$hasAuth('product_sku_export')">导出</el-button>
            <el-button type="primary" size="mini" @click="handleImport" v-if="$hasAuth('product_sku_import')">批量导入</el-button>
            <el-button type="primary" size="mini" @click="handleAdd" v-if="$hasAuth('product_sku_add')">新增</el-button>
            <el-button type="primary" size="mini" @click="onEdit" v-if="$hasAuth('product_sku_edit')">修改</el-button>
            <el-button type="primary" size="mini" @click="onStart" v-if="$hasAuth('product_sku_enable')">启用</el-button>
            <el-button type="primary" size="mini" @click="onStop" v-if="$hasAuth('product_sku_disable')">停用</el-button> -->
            <el-button v-if="rcMap['ba.sku.bom.add']" type="primary" size="mini" @click="handleAdd" >新建</el-button>
            <el-button v-if="rcMap['ba.sku.bom.modify']" type="primary" size="mini" @click="onEdit" >修改</el-button>
            <el-button v-if="rcMap['ba.sku.bom.del']" type="danger" size="mini" @click="onDel" >删除</el-button>
            <el-button v-if="rcMap['ba.sku.bom.import']" type="primary" size="mini" @click="handleImport" :loading="exporting">导入</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
import cookie from 'js-cookie'
export default {
    mixins: [ ExactList ],
    props: {
        exporting: Boolean,
        handleExport: Function,
        handleStart: Function,
        handleStop: Function,
        handleLogs: Function,
        handleView:Function,
        PACKAGE_TYPE:Object,
        queryList:Function,
        handleImport: Function,
        checktechParam: Function
    },
    data () {
        return {
            fields: [
                { key: 'targetSkuCode', name: '目标物料编码',
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.handleView(row)}>{row.targetSkuCode}</el-link>
                        )
                    }
                },
                // { key: 'code', name: '物料编码' },
                { key: 'targetSkuName', name: '目标物料名称' },
                { key: 'targetSkuUom', name: '目标物料单位'},
                { key: 'targetSkuSpec', name: '规格型号' },
                { key: 'targetSkuSupplierName', name: '供应商' },
                { key: 'targetSkuCategoryName', name: '物料分类名称' },
                { key: 'targetSkuTechParam', name: '技术参数', 
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.checktechParam(row.targetSkuTechParam)}>查看</el-link>
                        )
                    }
                },
                { key: 'warehouseName', name: '仓库名称' },
                { key: 'packageType', name: '包装形式', minWidth: 180 ,
                    render: (h, { index, row, col }) => {
                        const en = this.PACKAGE_TYPE.map[
                            Number( row.packageType )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            return row.packageType
                        }
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
                }
            ]
        }
    },
    methods: {
        pre(a){
            
        },
        onEdit () {
            debugger
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要编辑的物料！')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一件物料进行编辑！')
                return
            }
            // if (rows[0].validFlag === 0) {
            //     this.$message.error('请选择启用的物料！')
            //     return
            // }
            // if(rows[0].lotAttrRuleId==0){
            //     rows[0].lotAttrRuleId=null
            // }
            // if(rows[0].turnoverRuleId==0){
            //     rows[0].turnoverRuleId=null
            // }
            this.handleEdit(rows[0])
        },
        onDel () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要删除的物料！')
                return
            }
            const goodsIds = []
            for (let i = 0, len = rows.length; i < len; i++) {
                    goodsIds.push({targetSkuCode:rows[i].targetSkuCode,packageType:rows[i].packageType})
            }
            if (goodsIds.length) {
                api.goods.deleteBom(goodsIds).then(({head, body ,message})=>{
                    if(head.code == 200){
                        this.$message.success(head.subMessage)
                        this.queryList()
                    }
                })
            } else {
                this.$message.error('所选物料都已启用！')
            }
        },
       
        actionRender (h, { index, row, col }) {
            return (
                <div class="action-wrap">
                    <a class="link-btn log-btn" onClick={() => this.handleLogs(row)}>日志</a>
                </div>
            )
        }
    }
}
</script>


