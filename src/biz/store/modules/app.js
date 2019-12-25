import router from 'biz/router'
import staticRoutes from 'biz/router/static'
import { merge } from 'biz/store/helper'
/**
 * 获取路由数据
 * @param {Array} menus
 */
function getRoutes (menus) {
    const routeArr = []
    const routeMap = {}
    menus.forEach(item => {
        if (item.path) {
            const route = {
                path: item.path,
                meta: { id: item.id, code: item.code, moduleName: item.moduleName }
            }
            route.component = () => import('biz/modules' + item.path + '/index.vue')
            routeArr.push(route)
            routeMap[item.code] = route
        }
    })
    staticRoutes.forEach(item => {
        console.log('item', item);
        routeArr.push(item)
        routeMap[item.meta.code] = item
    })
    return {
        routeArr,
        routeMap
    }
}

/**
 * 格式化后台返回的菜单数据
 * @param {Array} menus
 */
function formatMenu (menus) {
    const res = []
    for (let i = 0; i < menus.length; i++) {
        res.push({
            id: menus[i].id,
            code: menus[i].code,
            level: menus[i].level,
            moduleName: menus[i].name,
            path: menus[i].href,
            parentId: menus[i].parentId,
            isTop: !menus[i].parentId,
            class: menus[i].icon
        })
    }
    return res
}

/**
 * 将菜单数据转换成树形结构
 * @param {Array} menus
 */
function menuToTree (menus) {
    // 获取顶层菜单
    const topMenus = []
    menus.forEach(item => {
        if (!item.parentId) {
            topMenus.push(item)
        }
    })
    function convert (data, parent) {
        parent.children = parent.children || []
        for (let i = 0; i < data.length; i++) {
            if (data[i].parentId === parent.id) {
                data[i].parentCode = parent.code||''
                parent.children.push(data[i])
                convert(data, data[i])
            }
        }
    }
    for (let i = 0; i < topMenus.length; i++) {
        convert(menus, topMenus[i])
    }
    console.log(topMenus)
    return topMenus
}

const DEFAULTS = {
    // 是否登录
    logined: oauth.isAuthed(),
    // 菜单数据
    menus: [],
    // 路由Array
    routeArr: [],
    // 路由Map
    routeMap: {},
    // 当前用户信息
    user: {},
    // 当前用户的仓库列表
    whses: [],
    // 导航页签
    navTabs: [],
    // 当前激活页签
    actTab: null,
    // 当前页面是前进还是后退
    isBack: false,
    // 登录用户拥有的资源码
    rcMap: {},
    // 侧栏是否折叠
    fold: false,
}

/**
 * 全局状态管理
 */
export default merge({
    namespaced: true,
    mutations: {
        // 激活导航页签
        actNavTab (state, { code, query }) {
            if (!code || state.actTab === code) {
                return
            }
            if (!state.navTabs.length && code !== CNST.ROUTES.ROOT.meta.code) {
                state.navTabs.push({ ...CNST.ROUTES.ROOT.meta })
            }
            const indexO = _.findIndex(state.navTabs, function (item) {
                return item.code === state.actTab
            })
            const indexN = _.findIndex(state.navTabs, function (item) {
                return item.code === code
            })
            if (indexN === -1) {
                state.navTabs.push({
                    ...state.routeMap[code].meta,
                    query
                })
                state.isBack = false
            } else {
                state.isBack = indexN < indexO
                if (query) {
                    state.navTabs[indexN].query = query
                } else {
                    query = state.navTabs[indexN].query
                }
            }
            state.actTab = code
            router.push({
                path: state.routeMap[code].path,
                query
            })
        },
        // 删除导航页签
        delNavTab (state, { code }) {
            const index = _.findIndex(state.navTabs, function (item) {
                return item.code === code
            })
            if (index === -1) {
                return
            }
            state.navTabs.splice(index, 1)
            if (!state.navTabs.length) {
                state.actTab = null
                router.push({ path: CNST.ROUTES.ROOT.path })
            } else if (state.actTab === code) {
                const actIndex = state.navTabs[index] ? index : (index - 1)
                router.push({ path: state.routeMap[state.navTabs[actIndex].code].path })
            }
        },
        // 删除所有导航页签
        delAllNavTabs (state) {
            state.actTab = null
            state.navTabs = []
            router.push('/')
        },
        /* toggleChgWhseDlg (state, payload) {
            state.chgWhseDlgVis = payload
        } */
    },
    actions: {
        // 查询用户菜单
        async 'queryUserMenus' ({ commit }) {
            const { head, body } = await api.user.queryUserMenus()
            // const { head, body } = {
            //     head: {
            //         code: '200'
            //     },
            //     body: [
            //         { id: '83', code: 'product', level: 1, name: '物料中心', parentId: null , nodeType: 1, icon: "iconfont iconwuliaozhongxin" },
            //         { id: '91', code: 'product_skubarcode', level: 2, name: '作业条码', parentId: '83', href: '/goods/barcode',nodeType: 1 },
            //         { id: '92', code: 'product_documenttype', level: 2, name: '单据类型', parentId: '83', href: '/goods/documenttype',nodeType: 1 },
            //         { id: '93', code: 'product_mgt', level: 2, name: '物料管理', parentId: '83', href: '/goods/mgt',nodeType: 1 },
            //         { id: '94', code: 'product_batchrule', level: 2, name: '批次规则', parentId: '83', href: '/goods/batchrule',nodeType: 1 },
            //         { id: '95', code: 'product_itemClass', level: 2, name: '物料分类', parentId: '83', href: '/goods/itemClass',nodeType: 1 },

            //         { id: '01', code: '01', level: 1, name: '组织管理', parentId: 0, nodeType: 1 },
            //         { id: '011', code: '011', level: 2, name: '承运商', href: '/organize/carrier', parentId: '01', nodeType: 1 },
            //         { id: '012', code: '012', level: 2, name: '货主', href: '/organize/shipper', parentId: '01', nodeType: 1 },
            //         { id: '013', code: '013', level: 2, name: '供应商', href: '/organize/supplier', parentId: '01', nodeType: 1 },
            //         { id: '014', code: '014', level: 2, name: '收货人', href: '/organize/receiver', parentId: '01', nodeType: 1 },

            //         { id: '03', code: '03', level: 1, name: '仓库管理', parentId: 0, nodeType: 1 },
            //         { id: '031', code: '031', level: 2, name: '仓库', href: '/warehouseMgt/warehouse', parentId: '03', nodeType: 1 },
            //         { id: '032', code: '032', level: 2, name: '库区', href: '/warehouseMgt/area', parentId: '03', nodeType: 1 },
            //         { id: '033', code: '033', level: 2, name: '库位', href: '/warehouseMgt/location', parentId: '03', nodeType: 1 },

            //         { id: '02', code: '02', level: 1, name: '入库', parentId: 0, nodeType: 1 },
            //         { id: '021', code: '021', level: 2, name: '入库通知单', href: '/implement/instock/instockNotice', parentId: '02', nodeType: 1 },
            //         { id: '022', code: '022', level: 2, name: '入库单查询', href: '/implement/instock/query', parentId: '02', nodeType: 1 },
            //         { id: '023', code: '023', level: 2, name: '取消收货', href: '/implement/instock/cancleReceipt', parentId: '02', nodeType: 1 },
            //         { id: '024', code: '024', level: 2, name: '收货汇总报表', href: '/implement/instock/receivingSum', parentId: '02', nodeType: 1 },
            //         { id: '025', code: '025', level: 2, name: '入库单明细查询', href: '/implement/instock/detail', parentId: '02', nodeType: 1 },

            //         { id: '169', code: 'implement_at', level: 1, name: '在库', parentId: null, nodeType: 1, icon: "iconfont iconzaiku" },
            //         { id: '154', code: 'implement_at_stock', level: 2, name: '库存管理', parentId: '169', href: '/implement/at/stock', nodeType: 1 },
            //         { id: '163', code: 'implement_at_excel', level: 2, name: '库存查询', parentId: '169', href: '/implement/at/excel' , nodeType: 1 },
            //         { id: '165', code: 'implement_at_summary', level: 2, name: '库存汇总查询', parentId: '169', href: '/implement/at/summary', nodeType: 1 },
            //         { id: '167', code: 'implement_at_transaction', level: 2, name: '库存事务查询', parentId: '169', href: '/implement/at/transaction', nodeType: 1 },
            //         { id: '168', code: 'implement_at_difference', level: 2, name: '差异中心', parentId: '169', href: '/implement/at/difference', nodeType: 1 },
            //         { id: '170', code: 'implement_at_InventoryList', level: 2, name: '盘点单', parentId: '169', href: '/implement/at/InventoryList', nodeType: 1 },


            //         { id: '200', code: 'implement_out', level: 1, name: '出库', parentId: null, nodeType: 1, icon: "iconfont iconchuku" },
            //         { id: '201', code: 'implement_out_notice', level: 2, name: '出库通知单', parentId: '200', href: '/implement/out/notice', nodeType: 1 },
            //         { id: '203', code: 'implement_out_picking', level: 2, name: '拣货单', parentId: '200', href: '/implement/out/picking' , nodeType: 1 },
            //         { id: '204', code: 'implement_out_allocation', level: 2, name: '分配明细', parentId: '200', href: '/implement/out/allocation', nodeType: 1 },

            //         { id: '7', code: '7', level: 1, name: '规则管理', parentId: 0, nodeType: 1, icon: "iconfont iconguizeguanli" },
            //         { id: '71', code: '71', level: 2, name: '库存周转规则', parentId: '7', href: '/ruleManage/stockTurnoverRule', nodeType: 1 },

            //         { id: '8', code: '8', level: 1, name: '权限管理', parentId: 0, nodeType: 1, icon: "iconfont iconwuliaozhongxin" },
            //         { id: '81', code: '81', level: 2, name: '账号', parentId: '8', href: '/master/account', nodeType: 1 },
            //         { id: '82', code: '82', level: 2, name: '角色', parentId: '8', href: '/master/role', nodeType: 1 },

            //         { id: '9', code: '9', level: 1, name: '系统参数', parentId: 0, nodeType: 1, icon: "iconfont iconwuliaozhongxin" },
            //         { id: '91', code: '91', level: 2, name: '系统参数设置', parentId: '9', href: '/system/systemParam', nodeType: 1 },
            //         // icondanjuleixing
            //         // iconshouye
            //     ]
            // }
            if (head.code === '200') {
                if (!_.isArray(body)) {
                    return
                }
                // 菜单过滤
                let menus = []
                let rcMap = { _loaded: true }
                for (let i = 0, len = body.length; i < len; i++) {
                    if (body[i].nodeType === 1) {
                        menus.push(body[i])
                    }
                    rcMap[body[i].code] = true
                }
                menus = formatMenu(menus)
                let { routeArr, routeMap } = getRoutes(menus)
                // 动态添加路由
                router.addRoutes(routeArr)
                // 将菜单数据转换成树形结构
                menus = menuToTree(menus)
                commit('update', { menus, routeArr, routeMap, rcMap })
            } else {
                this._vm.$message.error(head.subMessage)
            }
        },
        // 查询当前用户
        async 'queryCurrentUser' ({ commit }) {
            const { head, body } = await api.user.queryCurrentUser()
            if (head.code === '200') {
                commit('update', { user: body || {} })
            }
        },
        // 查询 各功能table显示列 TODO
        async 'queryTbFields' ({ commit }, menuId) {
            const { head, body } = await api.user.querySetTbClumns({menuId})
            if (head.code === '200') {
                return body || {
                    showColList: [],
                    hideColList: []
                }
            }
        },
        // 查询 各功能table显示列 TODO
        async 'saveTbClmList' ({ commit }, sd) {
            return await api.user.saveSetTbClumns(sd)
        },
        async 'queryWhses' ({ commit }) {
            let { head, body } = await api.user.queryCurrentUserWhses({})
            if (head.code === '200') {
                return body || []
            }
        },
    }
}, DEFAULTS)
