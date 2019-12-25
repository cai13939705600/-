import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    asnCode: '',
    loading: false
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            items: [
                { key: 'queryList', callee: 'receivingTrading', showMsg: false }
            ]
        }),
    },
    mutations: {
        updateReceivingTrading (state, code ) {
            state.asnCode = code;
        }
    }
}, DEFAULTS)