import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    searchAccountList: [],
    chooseCount: 0,
    funcRolesList: {
        list: [],
        total: 0
    },
    dataRolesList: {
        list: [],
        total: 0
    },
    searchFuncRole: '',
    searchDataRole: '',
    histroyRoles: {}, // 存储之前的角色
    query: {
        //validFlag: 1
    }
}

export default pageListMerge({
    namespaced: true,
    getters: {
        searchFuncRole (state, getters) {
            return state.searchFuncRole
        },
        searchDataRole (state, getters) {
            return state.searchDataRole
        },
        funcRoles: (state, getters) => {
            if (state.funcRolesList.total) {
                return state.funcRolesList.list.filter(item => {
                    const isFileter = item.name.indexOf(getters.searchFuncRole) !== -1
                    const isChoose = item.choosed
                    return isFileter || isChoose
                })
            } else {
                return []
            }
        },
        dataRoles: (state, getters) => {
            if (state.dataRolesList.total) {
                return state.dataRolesList.list.filter(item => {
                    const isFileter = item.name.indexOf(getters.searchDataRole) !== -1
                    const isChoose = item.choosed
                    return isFileter || isChoose
                })
            } else {
                return []
            }
        },
    },
    actions: {
        ...generateActions({
            caller: api.account,
            items: [
                //查询
                { key: 'queryList', callee: 'queryAccounts' },
                //新增
                { key: 'createEntity', callee: 'addAccount' },
                { key: 'updateEntity', callee: 'updateAccount' },
                // 模糊查询列表
                { key: 'searchByName', callee: 'searchByName', mutation: 'updateSearchAccount' },
                // 获取角色列表
                { key: 'getRoleList', callee: 'getRoleList', mutation: 'updateRolesList' },
                // 角色设置
                { key: 'roleSetting', callee: 'roleSetting' },
                // 密码重置
                { key: 'resetPassword', callee: 'resetPassword' },
                // 启用
                { key: 'enableAccount', callee: 'enable' },
                // 停用
                { key: 'stopAccount', callee: 'stop' },
                // 导出
                { key: 'exportExcel', callee: 'exportExcel' },
                // 当前用户信息
                { key: 'getCurrentUser', callee: 'getCurrentUser' }
            ]
        })
    },
    mutations: {
        updateSearchAccount (state, payload) {
            state.searchAccountList = payload
        },
        updateRolesList (state, payload) {
            if (payload && payload.length) {
                state.chooseCount = 0
                payload.forEach(item => {
                    item.choosed = false
                })
                switch (payload[0].type) {
                    // 数据角色
                    case 1:
                        state.dataRolesList = {
                            list: payload,
                            total: payload.length
                        }
                        break;
                    // 功能角色
                    case 2:
                        state.funcRolesList = {
                            list: payload,
                            total: payload.length
                        }
                        break;
                    default:
                        break;
                }
            }
        },
        updateSearchFuncRole (state, payload) {
            state.searchFuncRole = payload
        },
        updateSearchDataRole (state, payload) {
            state.searchDataRole = payload
        },
        /**
         * @interface Payload
         * @property {number} type 类型
         * @property {string} id
         * @property {number} state 状态
         */
        /**
         * @param {Payload} payload
         */
        updateChoose (state, payload) {
            if (payload.state) {
                state.chooseCount ++
            } else {
                state.chooseCount --
            }
            let data;
            switch (payload.type) {
                // 数据角色
                case 1:
                    data = state.dataRolesList.list.find(item => item.id === payload.id)
                    break;
                // 功能角色
                case 2:
                    data = state.funcRolesList.list.find(item => item.id === payload.id)
                    break;
                default:
                    break;
            }
            data.choosed = payload.state;
        },
        updateHistroyChoose (state) {
            let payload = state.histroyRoles
            // 数据角色
            if (
                payload.dataRoles.length &&
                state.dataRolesList.list.length
            ) {
                state.chooseCount += payload.dataRoles.length;
                payload.dataRoles.forEach(role => {
                    const data = state.dataRolesList.list.find(item => item.name === role)
                    data.choosed = true;
                })
            }
            // 数据角色
            if (
                payload.funcRoles.length &&
                state.funcRolesList.list.length
            ) {
                state.chooseCount += payload.funcRoles.length;
                // 功能角色
                payload.funcRoles.forEach(role => {
                    const data = state.funcRolesList.list.find(item => item.name === role)
                    data.choosed = true;
                })
            }
        },
        updateHistoryRoles (state, payload) {
            state.histroyRoles = payload
        }
    }
}, DEFAULTS)
