import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    inventoryTypes: [],
    billTypes: [],
    shopList: [],
    query: {
    }
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            type: 1,
            items: [
                // 获取出库通知单列表
                { key: 'queryList', callee: 'getDoInfoById' },
                {
                    key: 'getStocksBySku',
                    callee: 'getStocksBySku',
                },
                {
                    key: 'manualAllocate',
                    callee: 'manualAllocate',
                },
            ]
        }),
    },
    mutations: {
        // updateQuery (state, payload) {
        //     state.query.id = payload
        // }
    }
}, DEFAULTS)
