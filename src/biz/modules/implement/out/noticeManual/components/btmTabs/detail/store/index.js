import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    noticeId: '',
    doDetailId: '',
    loading: false,
    inventoryTypes: []
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            items: [
                { key: 'queryList', callee: 'getStocksBySku', showMsg: false },
                // 获取库存类型接口
                {
                    key: 'getInventoryTypes',
                    callee: 'getInventoryTypes',
                    mutation: 'updateInventoryTypes'
                },
                {
                    key: 'manualAllocate',
                    callee: 'manualAllocate',
                },
            ]
        }),
    },
    mutations: {
        updateDetailNoticeId (state, id ) {
            state.noticeId = id
        },
        updateDoDetailId (state, id) {
            state.doDetailId = id
        },
        updateInventoryTypes (state, payload) {
            state.inventoryTypes = payload
        },
    }
}, DEFAULTS)
