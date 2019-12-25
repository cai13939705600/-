<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :state="state"
            :update-state="updateState"
            :handle-search="handleSearch"
            :VALID_FLAG="VALID_FLAG"
            :search-by-name="searchByName"
            :start-stop="startStop"
        />
        <exact-list
            ref="list"
            :state="state"
            :VALID_FLAG="VALID_FLAG"
            :USER_TYPE="USER_TYPE"
            :YES_FLAG="YES_FLAG"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :set-role="setRole"
            :handle-delete="handleDelete"
            :handle-export="handleExport"
            :handle-import="handleImport"
            :proxy-action="proxyAction"/>
        <entity-dialog
            ref="dialog"
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"
            :USER_TYPE="USER_TYPE"
        />
        <set-role-dlg
            :state="state"
            :visible="setRoleDlgVis"
            :update-vis="updateSetRoleDlgVis"
            :proxy-action="proxyAction"
            />
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import SetRoleDlg from './components/setRoleDlg'

import { mapState, mapActions, mapMutations } from 'vuex'
import { download } from 'common/utils/download'
import { removeEmptyAttr } from 'common/utils/tools'
import { uniq } from 'common/utils/lodash'

const enums = [
    'USER_TYPE', // 用户状态 账号类型
    'VALID_FLAG', // 启停状态
    'ROLE_TYPE', // 角色类型
    'YES_FLAG'//是否完成人脸采集
]
export default {
    name: 'master_account',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        SetRoleDlg
    },
    computed:{
        ...mapState('enums', enums)
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'master/account',
            // 模块名称
            moduleName: '账号',
            //修改弹窗是否显示
            reviseDlgVis:false,
            //角色设置弹窗是否显示
            setRoleDlgVis:false,
            startStop: CNST.ENUMS.startStop
        }
    },
    created () {
        this.registStore(store)
        //获取枚举值
        this.queryEnums(enums)
    },
    mounted () {

    },
    methods: {
        ...mapActions('master/account', [
            'addRoleAction',
            'searchByName',
            'enableAccount',
            'stopAccount',
            'getRoleList',
            'roleSetting',
            'resetPassword',
        ]),
        ...mapMutations('master/account', [
            'updateHistoryRoles'
        ]),
        updateSetRoleDlgVis(vis){
            this.setRoleDlgVis=vis
        },
        handleEdit (row) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            console.log(row)
            this.updateState({ entity: row })
        },
        //设置角色--点击设置角色按钮触发
        setRole({ data }){
            if (!data.length) {
                return this.$message.error('请选择设置角色的账号')
            }
            // 处理角色数据
            this.getRolesData(data)
            this.updateSetRoleDlgVis(true);
        },
        // 多个账户的角色 取并集
        getRolesData (data) {
            let dataRoles = []
            let funcRoles = []
            data.forEach(item => {
                item.dataRoles.split(',').map(name => {
                    if (name) {
                        dataRoles.push(name)
                    }
                })
                item.functionalRoles.split(',').map(name => {
                    if (name) {
                        funcRoles.push(name)
                    }
                })
            });
            // 去重 激活选中
            this.updateHistoryRoles({
                dataRoles: uniq(dataRoles),
                funcRoles: uniq(funcRoles)
            })
        },
        handleExport () {

        },
        handleImport () {

        },
        // 代理处理请求
        proxyAction ({ action, data, cb }, isValid = true) {
            if (isValid) {
                let message = ''
                let errMessage = ''
                switch (action) {
                    case 'enable':
                        message = '确定启用账户'
                        errMessage = '请选择启用的账户'
                        break;
                    case 'stop':
                        message = '确定停用账户'
                        errMessage = '请选择停用的账户'
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
            const idList = data.map(item => item.id);
            this.enableAccount({
                params: {
                    idList
                },
                cb: () => {
                    this.queryList()
                }
            })
        },
        stop ({ data }) {
            const idList = data.map(item => item.id);
            this.stopAccount({
                params: {
                    idList
                },
                cb: () => {
                    this.queryList()
                }
            })
        },
        resetPwd ({ data }) {
            this.$confirm('确定重置密码', '重置密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.resetPassword({ params: data ,
                    cb: () => {
                       this.queryList()
                    }
                })

            })
        },
        exportExcel () {
            const query = this.$refs.search.query;
            removeEmptyAttr(query)
            console.log('query', query);
            return download({
                url: '/ba/rest/api/baUser/exportExcel',
                data: query
            });
        },
        getRole ({ data, cb }) {
            this.getRoleList({
                params: data,
                cb
            })
        },
        setRoles ({ data }) {
            const idList = this.$refs.list.selRows.map(item => item.id)
            data.idList = idList;
            removeEmptyAttr(data);
            this.roleSetting({
                params: data,
                cb: () => {
                    this.setRoleDlgVis = false
                    this.queryList()
                }
            })
        }
    }
}
</script>

