<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :state="state"
            :update-state="updateState"
            :handle-search="handleSearch"
            :VALID_FLAG="VALID_FLAG"
            :ROLE_TYPE="ROLE_TYPE"
            :start-stop="startStop"
        />
        <exact-list
            ref="list"
            :state="state"
            :VALID_FLAG="VALID_FLAG"
            :ROLE_TYPE="ROLE_TYPE"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :edit-loading="editLoading"
            :check-loading="checkLoading"
            :handle-delete="handleDelete"
            :handle-export="handleExport"
            :handle-import="handleImport"
            :handle-check-detail="handleCheckDetail"
            :proxy-action="proxyAction"/>
        <entity-dialog
            ref="dialog"
            :state="state"
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"
            :ROLE_TYPE="ROLE_TYPE"
            />
        <checkDetail-dlg
            :state="state"
            :ROLE_TYPE="ROLE_TYPE"
            :visible="checkDetailDlgVis"
            :update-vis="updateCheckDetailDlgVis"/>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import CheckDetailDlg from './components/checkDetailDlg'
import ModifyDlg from './components/modifyDlg'

import { mapState, mapActions } from 'vuex'

const enums = [
    'VALID_FLAG', // 启停状态
    'ROLE_TYPE' // 角色类型
]

export default {
    name: 'master_role',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        CheckDetailDlg,
        ModifyDlg
    },
    computed:{
        ...mapState('enums', enums)
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'master/role',
            // 模块名称
            moduleName: '角色',
            //查看明细弹窗是否显示
            checkDetailDlgVis: false,
            //查看修改弹窗是否显示
            modifyDlgVis:false,
            editLoading: false,
            checkLoading: false,
            startStop: CNST.ENUMS.startStop
        }
    },
    created () {
        this.registStore(store)
        //获取枚举值
        this.queryEnums(enums)
    },

    methods: {
        ...mapActions('master/role', [
            'getRoleNameListAction',
            'disableRole',
            'queryRoleDetail'
        ]),
        handleExport () {

        },
        handleImport () {

        },
        updateCheckDetailDlgVis(vis) {
            this.checkDetailDlgVis = vis
        },
        handleEdit (entity) {
            this.editLoading = true
            this.queryRoleDetail({
                params: {
                    id: entity.id,
                    type: entity.type,
                },
                cb: () => {
                    this.entityDlgVis = true
                    this.entityDlgActn = 'edit'
                    this.editLoading = false
                },
                erCb: () => {
                    this.editLoading = false
                }
            })
        },
        //点击查看明细按钮
        handleCheckDetail(entity){
            this.checkLoading = true
            this.queryRoleDetail({
                params: {
                    id: entity.id,
                    type: entity.type,
                },
                cb: () => {
                    this.checkDetailDlgVis = true
                    this.checkLoading = false
                },
                erCb: () => {
                    this.checkLoading = false
                }
            })
        },
        // 代理处理请求
        proxyAction ({ action, data, cb }, isValid = true) {
            if (isValid) {
                let message = ''
                let errMessage = ''
                switch (action) {
                    case 'enable':
                        message = '确定启用角色'
                        errMessage = '请选择启用的角色'
                        break;
                    case 'stop':
                        message = '确定停用角色'
                        errMessage = '请选择停用的角色'
                        break;
                    default:
                        break;
                }
                if (!data.length) {
                    return this.$message.error(errMessage)
                }
                const callee = this[action];
                if (callee) {
                    this.$confirm(message, '确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return callee({ data, cb })
                    })
                } else {
                    console.log('未知action:' + action);
                    return false;
                }
            } else {
                const callee = this[action];
                if (callee) {
                    return callee({ data, cb })
                } else {
                    console.log('未知action:' + action);
                    return false;
                }
            }
        },
        enable ({ data }) {
            const menuIdList = data.map(item => item.id);
            this.disableRole({
                params: {
                    menuIdList,
                    validFlag: 1
                },
                cb: () => {
                    this.$message.success('角色启用成功')
                    this.queryList()
                }
            })
        },
        stop ({ data }) {
            const menuIdList = data.map(item => item.id);
            this.disableRole({
                params: {
                    menuIdList,
                    validFlag: 0
                },
                cb: () => {
                    this.$message.success('角色停用成功')
                    this.queryList()
                }
            })
        },
    }
}
</script>

