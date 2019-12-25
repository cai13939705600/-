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
            <el-button v-if="rcMap['ba.sku.manage.export']" type="primary" size="mini" @click="handleExport" :loading="exporting">导出</el-button>
            <el-button v-if="rcMap['ba.sku.manage.batchImport']" type="primary" size="mini" @click="handleImport">批量导入</el-button>
            <el-button v-if="rcMap['ba.sku.manage.add']" type="primary" size="mini" @click="handleAdd" >新增</el-button>
            <el-button v-if="rcMap['ba.sku.manage.modify']" type="primary" size="mini" @click="onEdit" >修改</el-button>
            <el-button v-if="rcMap['ba.sku.manage.enable']" type="primary" size="mini" @click="onStart" >启用</el-button>
            <el-button v-if="rcMap['ba.sku.manage.stop']" type="primary" size="mini" @click="onStop" >停用</el-button>
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
        handleImport: Function,
        handleStart: Function,
        handleStop: Function,
        handleLogs: Function,
        handleView:Function
    },
    data () {
        return {
            fields: [
                { key: 'storerName', name: '货主名称' },
                // { key: 'code', name: '物料编码' },
                { key: 'code', name: '物料编码',
                    render: (h, { index, row, col }) => {
                        return (
                            <el-link type="primary" onClick={() =>this.handleView(row)}>{row.code}</el-link>
                        )
                    }
                },
                { key: 'name', name: '物料名称' },
                { key: 'shortName', name: '物料简称' },
                { key: 'barcode', name: '物料条码' },
                {
                    key: 'validFlag',
                    name: '启停状态',
                    formatter: function (row, column, cellValue, index) {
                        return CNST.ENUMS.startStop[cellValue] || cellValue
                    }
                },
                { key: 'uom', name: '基本单位' },
                { key: 'spec', name: '规格' },
                { key: 'brandName', name: '品牌' },
                { key: 'costPrice', name: '价格' },
                { key: 'skuNo1', name: '货号' },
                { key: 'lotAttrRuleName', name: '批次规则' },
                { key: 'imgUrl', name: '物料图片' ,
                    render: (h, { index, row, col }) => {
                        if(row.imgUrl){
                        //     return  <img src={'/api/ba/sku/showImageByte?imgUrl='+row.imgUrl}  min-width="70" height="70" />
                            return <span on-click={(e)=>{
                                e.stopPropagation()
                                this.$alert("<img width=100% src=/api/ba/sku/showImageByte?jwt="+cookie.get('jwt')+"&tenantId="+cookie.get('tenantId')+"&qpId="+cookie.get('qpId')+"&imgUrl="+row.imgUrl +"  />", '物料图片', {
                                    dangerouslyUseHTMLString: true
                                });
                                }} style="color:blue;cursor:pointer">图片预览</span>
                            }
                        }
                },
                { key: 'guaranteePeriodDays', name: '保质期天数' },
                { key: 'length', name: '长(cm)' },
                { key: 'width', name: '宽(cm)' },
                { key: 'height', name: '高(cm)' },
                {
                    key: 'volume',
                    name: '体积(cm³)'
                },
                { key: 'grossWeight', name: '重量(kg)' },
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
            if (rows[0].validFlag === 0) {
                this.$message.error('请选择启用的物料！')
                return
            }
            if(rows[0].lotAttrRuleId==0){
                rows[0].lotAttrRuleId=null
            }
            if(rows[0].turnoverRuleId==0){
                rows[0].turnoverRuleId=null
            }
            this.handleEdit(rows[0])
        },
        onStart () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要启用的物料！')
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
                this.$message.error('所选物料都已启用！')
            }
        },
        onStop () {
            debugger
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择需要停用的物料！')
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
                this.$message.error('所选物料都已停用！')
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


