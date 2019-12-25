<template>
    <basic-list
        :show-select-col="true"
        :fields="fields"
        :fieldLimit="11"
        :loading="state.loading"
        :total="state.total"
        :list="state.list"
        :page-index="state.pageIndex"
        :page-size="state.pageSize"
        :page-index-change="pageIndexChange"
        :page-size-change="pageSizeChange"
        :selection-change="selectionChange"
        :action-render="actionRender"
        :show-action-col="true"
        :action-col-fixed="'left'">
        <template slot="hd-col--l">
        <!--    <el-button type="primary" size="mini" @click="proxyAction({ action: 'exportExcel' }, false)">导出</el-button>
            &lt;!&ndash; <el-button type="primary" size="mini" @click="handleImport">导入</el-button> &ndash;&gt;
            <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
            <el-button type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button type="primary" size="mini" @click="proxyAction({ action: 'setRole', data: selRows }, false)">角色设置</el-button>
            <el-button type="primary" size="mini" @click="proxyAction({ action: 'enable', data: selRows })">启用</el-button>
            <el-button type="primary" size="mini" @click="proxyAction({ action: 'stop', data: selRows })">停用</el-button>-->
            <el-button v-if="rcMap['ba.authority.user.export']"  type="primary" size="mini" @click="proxyAction({ action: 'exportExcel' }, false)">导出</el-button>
            <el-button v-if="rcMap['ba.authority.user.add']" type="primary" size="mini" @click="handleAdd" >新增</el-button>
            <el-button v-if="rcMap['ba.authority.user.modify']" type="primary" size="mini" @click="onEdit">修改</el-button>
            <el-button v-if="rcMap['ba.authority.user.rolesetting']" type="primary" size="mini" @click="proxyAction({ action: 'setRole', data: selRows }, false)">角色设置</el-button>
            <el-button v-if="rcMap['ba.authority.user.enable']"  type="primary" size="mini" @click="proxyAction({ action: 'enable', data: selRows })">启用</el-button>
            <el-button v-if="rcMap['ba.authority.user.stop']" type="primary" size="mini" @click="proxyAction({ action: 'stop', data: selRows })">停用</el-button>
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
        setRole:Function,
        //启停状态
        VALID_FLAG:Object,
        //账号类型
        USER_TYPE:Object,
        YES_FLAG:Object,//是否完成人脸采集
        proxyAction: Function
    },
    data () {
        return {
            fields: [
                { key: 'loginName', name: '账号编号' },
                { key: 'name', name: '账号名称' },
                { key: 'mobile', name: '手机号',width: 100 },
                { key: 'dataRoles', name: '数据角色' },
                { key: 'functionalRoles', name: '功能角色' },
                { key: 'type', name: '账号类型',width: 80,
                    render: (h, { index, row, col }) => {
                        const en = this.USER_TYPE.map[
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
                {
                    key: 'validFlag',
                    name: '状态',width: 50,
                    formatter: function (row, column, cellValue, index) {
                        return CNST.ENUMS.startStop[cellValue] || cellValue
                    }
                },

                {
                    key: 'fetchFaceFlag',
                    name: '是否完成人脸采集',width: 120,
                    formatter: function (row, column, cellValue, index) {
                       // return this.YES_FLAG.array[cellValue] || cellValue
                         return  row.fetchFaceFlag==0?'否':'是'
                    }
                },
                { key: 'creator', name: '创建人' },
                {
                    key: 'createTime',
                    name: '创建时间',width: 150,
                    // formatter: function (row, column, cellValue, index) {
                    //     return jt.date.format(cellValue)
                    // }
                },
                { key: 'modifier', name: '修改人' },
                {
                    key: 'modifiedTime',
                    name: '修改时间',width: 150,
                   /*  formatter: function (row, column, cellValue, index) {
                        return jt.date.format(cellValue)
                    } */
                }
            ]
        }
    },
    methods: {
        proxyValide () {

        },
        onEdit () {
            const rows = this.selRows
            if (!rows.length) {
                return this.$message.error('请选择要修改的账户')
            }
            if (rows.length > 1) {
                return this.$message.error('最多只能选择一个账户进行修改')
            }
            this.handleEdit(rows[0])
        },
        actionRender (h, { index, row, col }) {
            return (
                <el-link type="primary" onClick={() => this.proxyAction({ action: 'resetPwd', data: { loginName: row.loginName } }, false)}>重置密码</el-link>
            )
        }
    }
}
</script>


