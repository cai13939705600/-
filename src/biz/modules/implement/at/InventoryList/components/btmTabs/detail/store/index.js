import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    noticeId: '',
    loading: false,
    inventoryTypes: []
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            items: [
                { key: 'queryList', callee: 'queryInvStockDetail', showMsg: false },
            ]
        }),
    },
    mutations: {
        updateDetailNoticeId (state, id ) {
            state.noticeId = id;
        },
        updateInventoryTypes (state, payload) {
            state.inventoryTypes = payload
        },
    }
}, DEFAULTS)
