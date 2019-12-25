import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {
        showMode:10
    },
    inventoryTypes: [],
    billTypes: [],
    shopList: [],
    query: {
        // startTime: jt.date.format(+jt.date.getTodayZero()),
        // endTime: jt.date.format(+jt.date.getTodayLast()),
        startTime: '',
        endTime: '',
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
                // 创建盘点通知单
                { key: 'createEntity', callee: 'createStockNotice' },
                { key: 'updateEntity', callee: 'updateStockNotice' },
                // 获取出库盘点列表
                { key: 'queryList', callee: 'queryInvStock' },
                // 审核
                { key: 'checkStockNotice', callee: 'checkStockNotice' },
                // 反审核
                { key: 'checkBackStockNotice', callee: 'checkBackStockNotice' },
                // 取消
                { key: 'cancelStockInv', callee: 'cancelStockInv' },
                // 自动分配
                { key: 'autoAllocate', callee: 'autoAllocate' },
                // 获取详情
                { key: 'queryEntity', callee: 'getPanDianDoInfoById' }
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
        }
    }
}, DEFAULTS)
