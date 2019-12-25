import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    inventoryTypes: [],
    billTypes: [],
    shopList: [],
    storeList: [],
    query: {
        createStartTime: jt.date.getTodayZero(),
        createEndTime: jt.date.getTodayLast(),
    }
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            type: 1,
            items: [
                // 获取单据类型
                { key: 'getBillTypeList', callee: 'getBillTypeList', mutation: 'updateBillTypes' },
                // 创建出库通知单
                { key: 'createEntity', callee: 'createStockNotice' },
                { key: 'updateEntity', callee: 'updateStockNotice' },
                // 获取出库通知单列表
                { key: 'queryList', callee: 'queryPickingTask' },
                // 审核
                { key: 'checkStockNotice', callee: 'checkStockNotice' },
                // 反审核
                { key: 'checkBackStockNotice', callee: 'checkBackStockNotice' },
                // 取消
                { key: 'cancelStockNotice', callee: 'cancelStockNotice' },
                // 自动分配
                { key: 'autoAllocate', callee: 'autoAllocate' },
                // 获取详情
                { key: 'queryEntity', callee: 'getDoInfoById' },
                //仓库下拉列表 
                { key: 'getStoreListAction', callee: 'getStoreList' ,mutation:'getStores'},
            ]
        }),
        ...generateActions({
            caller: api.account,
            type: 1,
            items: [
                // 当前用户 对应的店铺列表
                {
                    key: 'getCurrentShops',
                    callee: 'getCurrentShops',
                    mutation: 'updateShopList'
                },
            ]
        })
    },
    mutations: {
        updateDetailList (state, payload) {
            state.detail = payload;
        },
        updateWarpList (state, payload) {
            state.warp = payload
        },
        updateInventoryTypes (state, payload) {
            state.inventoryTypes = payload
        },
        updateBillTypes (state, payload) {
            state.billTypes = payload
        },
        updateShopList (state, payload) {
            state.shopList = payload
        },
        //仓库下拉列表
        getStores (state, payload) {
            state.storeList = payload.records
        },
    }
}, DEFAULTS)
