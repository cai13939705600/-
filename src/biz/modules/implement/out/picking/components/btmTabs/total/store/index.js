import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    pickTicketId: '',
    loading: false,
    inventoryTypes: []
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            items: [
                { key: 'queryList', callee: 'getPickingDetailTaskList', showMsg: false },
                // // 获取库存类型接口
                // {
                //     key: 'getInventoryTypes',
                //     callee: 'getInventoryTypes',
                //     mutation: 'updateInventoryTypes',
                //     showMsg: false
                // },
            ]
        }),
    },
    mutations: {
        updateTotalPickTicketId (state, id ) {
            state.pickTicketId = id;
        },
        updateInventoryTypes (state, payload) {
            state.inventoryTypes = payload
        },
    }
}, DEFAULTS)
