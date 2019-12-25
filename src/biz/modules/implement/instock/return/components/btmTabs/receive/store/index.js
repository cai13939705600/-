import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    asnId: '',
    loading: false
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            items: [
                { key: 'queryList', callee: 'getReceivingDetailList', showMsg: false }
            ]
        }),
    },
    mutations: {
        updateReceivingDetailList (state, id ) {
            state.asnId = id;
        }
    }
}, DEFAULTS)