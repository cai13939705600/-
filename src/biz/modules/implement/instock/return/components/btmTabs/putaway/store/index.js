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
                { key: 'queryList', callee: 'waitingPut', showMsg: false }
            ]
        }),
    },
    mutations: {
        updateWaitingPut (state, id) {
            state.asnId = id;
        }
        //尝试
        /* updateWaitingPut (state, payload) {
            console.log('payload', payload);
            
            state.asnId = payload.id;
            state.stateList = payload.state;
        } */
    }
}, DEFAULTS)