import { pageListMerge, generateActions } from 'biz/store/helper'
import { formatTreeData, getTreeLeaf } from 'common/utils/tree'
import { cloneDeep, intersection } from 'common/utils/lodash'
// 默认状态
const DEFAULTS = {
    entity: {
        type: 2,
        resourceIds: []
    },
    roleList: [],
    // 树状结构数据
    treeData: [],
    // 原始数据
    treeDataSource: [],
    // 所有叶子节点数据ID
    treeLeafIdList: [],
    storeList: {
        total: 0,
        list: []
    },
    zoneList:{
        total:0,
        list:[]
    },
    shopList: {
        total: 0,
        list: []
    },
    wareHouseList: {
        total: 0,
        list: []
    },
    wareHouseIdList:[],
    // 动态过滤部分
    searchStore: '',
    searchShop: '',
    searchWare: '',
    query: {
     //   validFlag: 1
    }
}

export default pageListMerge({
    namespaced: true,
    getters: {
        searchStore (state, getters) {
            return state.searchStore
        },
        searchShop (state, getters) {
            return state.searchShop
        },
        searchWare (state, getters) {
            return state.searchWare
        },
        searchStoreList: (state, getters) => {
            if (state.storeList.total) {
                return state.storeList.list.filter(item => {
                    const isFileter = item.name.indexOf(getters.searchStore) !== -1
                    const isChoose = item.choosed
                    return isFileter || isChoose
                })
            } else {
                return []
            }
        },
        searchWareList: (state, getters) => {
            if (state.wareHouseList.total) {
                return state.wareHouseList.list.filter(item => {
                    const isFileter = item.name.indexOf(getters.searchWare) !== -1
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
            caller: api.role,
            items: [
                // 查询列表
                { key: 'queryList', callee: 'queryRoles' },
                { key: 'queryEntity', callee: 'queryRoleDetail' },
                // 功能角色新增
                { key: 'createEntity', callee: 'addRole' },
                // 功能角色编辑
                { key: 'updateEntity', callee: 'addRole' },
                // 角色名称模糊查询
                {
                    key: 'queryRolesByName',
                    callee: 'queryRolesByName',
                    mutation: 'updateRolesList'
                },
                // 角色名字唯一性查询
                { key: 'getRoleNameExist', callee: 'getRoleNameExist' },
                // 查看明细
                { key: 'queryRoleDetail', callee: 'queryRoleDetail', mutation: 'updateEntityMutation' },
                // 启用/停用
                { key: 'disableRole', callee: 'disableRole' },
                // 货主列表
                {
                    key: 'getStorerList',
                    callee: 'getStorerList',
                    mutation: 'updateStorerList'
                },
                 // 库区列表
                 {
                    key: 'getZoneList',
                    callee: 'getZoneList',
                    mutation: 'updateZoneList'
                },
                // 店铺列表
               /* {
                    key: 'getShopList',
                    callee: 'getShopList',
                    mutation: 'updateShopList'
                },*/
                // 仓库列表
                {
                    key: 'getWareHouseList',
                    callee: 'getWareHouseList',
                    mutation: 'updateWareHouseList'
                },

            ]
        }),
        ...generateActions({
            caller: api.menu,
            items: [
                // 获取树形结构数据
                {
                    key: 'getMenuList',
                    callee: 'getMenuList',
                    mutation: 'updateMenuList'
                }
            ]
        })
    },
    mutations: {
        updateRolesList (state, payload) {
            state.roleList = payload
        },
        // 更新列表数据
        updateMenuList (state, payload) {
            const list = cloneDeep(payload)
            const tree = formatTreeData(list)
            state.treeDataSource = payload
            state.treeData = tree
            state.treeLeafIdList = getTreeLeaf(tree).map(leaf => leaf.id)
            const resourceIds = state.entity.resourceIds
           // console.log('第二个回显实体是',state.entity)
      //     debugger
            if (resourceIds && resourceIds.length && state.treeLeafIdList.length) {
                state.entity.resourceIds = intersection(resourceIds, state.treeLeafIdList)
            }
        },
        updateChooseAll (state) {
            state.entity.resourceIds = cloneDeep(state.treeLeafIdList)
        },
        updateWareHouseList (state, payload) {
            payload.forEach(item => {
                item.choosed = false
            })
            state.wareHouseIdList = payload.map(e =>e.id)
            state.wareHouseList = {
                total: payload.length,
                list: payload
            }
        },
        updateStorerList (state, payload) {
            payload.forEach(item => {
                item.choosed = false
            })
            state.storeList = {
                total: payload.length,
                list: payload
            }
        },
        updateZoneList(state, payload){
            payload.forEach(item => {
                item.choosed = false
            })
            state.zoneList = {
                total: payload.length,
                list: payload
            }
        },
        updateSearchStore (state, payload) {
            state.searchStore = payload
        },
        updateSearchShop (state, payload) {
            state.searchShop = payload
        },
        updateSearchWare (state, payload) {
            state.searchWare = payload
        },
        updateChoose (state, payload) {
            let data;
            switch (payload.type) {
                // 仓库
                case 1:
                    data = state.wareHouseList.list.find(item => item.id === payload.id)
                    break;
                // 货主
                case 2:
                    data = state.storeList.list.find(item => item.id === payload.id)
                    break;
                     // 库区
                case 3:
                    data = state.zoneList.list.find(item => item.id === payload.id)
                    break;
                default:
                    break;
            }
            data.choosed = payload.state;
        },
        emptyData (state, payload) {
            // 二期打开这部分注释
            state.wareHouseList.list.forEach(item => item.choosed = false);
            state.storeList.list.forEach(item => item.choosed = false);
            state.zoneList.list.forEach(item => item.choosed = false);
          //  state.shopList.list.forEach(item => item.choosed = false);
        },
        // 更新当前数据实例
        updateEntityMutation (state, payload) {
            if (payload.resourceIds && payload.resourceIds.length && state.treeLeafIdList.length) {
                payload.resourceIds = intersection(payload.resourceIds, state.treeLeafIdList)
            }
            state.entity = payload
        }
    }
}, DEFAULTS)
