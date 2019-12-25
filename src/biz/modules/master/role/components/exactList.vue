<template>
    <basic-list
        :show-select-col="true"
        :show-action-col="false"
        :fields="fields"
        :fieldLimit="8"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange">
        <template slot="hd-col--l">
           <!-- <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
            <el-button :disabled="editLoading || checkLoading" :loading="editLoading" type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button :disabled="editLoading || checkLoading" :loading="checkLoading" type="primary" size="mini" @click="onCheck">查看明细</el-button>
            <el-button type="primary" size="mini" @click="proxyAction({ action: 'enable', data: selRows })">启用</el-button>
            <el-button type="primary" size="mini" @click="proxyAction({ action: 'stop', data: selRows })">停用</el-button>-->
            <el-button v-if="rcMap['ba.authority.role.add']"  type="primary" size="mini" @click="handleAdd">新增</el-button>
            <el-button v-if="rcMap['ba.authority.role.modify']" :disabled="editLoading || checkLoading" :loading="editLoading" type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button v-if="rcMap['ba.authority.role.detailquery']" :disabled="editLoading || checkLoading" :loading="checkLoading" type="primary" size="mini" @click="onCheck">查看明细</el-button>
            <el-button v-if="rcMap['ba.authority.role.enable']" type="primary" size="mini" @click="proxyAction({ action: 'enable', data: selRows })">启用</el-button>
            <el-button v-if="rcMap['ba.authority.role.stop']" type="primary" size="mini" @click="proxyAction({ action: 'stop', data: selRows })">停用</el-button>
        </template>
    </basic-list>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
export default {
    mixins: [ ExactList ],
    props: {
        handleExport: Function,
        handleImport: Function,
        handleCheckDetail: Function,
        //启停状态
        VALID_FLAG: Object,
        ROLE_TYPE: Object,
        proxyAction: Function,
        editLoading: Boolean,
        checkLoading: Boolean,
        startStop: Object
    },
    data () {
        return {
            fields: [
                { key: 'name', name: '角色名称' },
                { key: 'type', name: '角色类型',
                    render: (h, { index, row, col }) => {
                         const en = this.ROLE_TYPE.map[
                            Number( row.type )
                        ]
                        if (en) {
                            return <span>{ en.enumValueCn }</span>
                        } else {
                            //console.log('没有枚举:ROLE_TYPE', row.type, typeof row.type);
                            return row.type
                        }
                    }
                },
                { key: 'remarks', name: '备注' },
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
                }
            ]
        }
    },

    methods: {
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择一个角色进行编辑')
                return
            }
            if (rows.length > 1) {
                this.$message.error('只能选择一个角色进行编辑！')
                return
            }
            this.handleEdit(rows[0])
        },
        onCheck () {
            const rows = this.selRows
            if (!rows.length) {
                this.$message.error('请选择一个角色')
                return
            }
            if (rows.length > 1) {
                this.$message.error('最多只能选择一个角色！')
                return
            }
            this.handleCheckDetail(rows[0])
        }
    }
}
</script>


