import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    noticeId: '',
    loading: false
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            items: [
                { key: 'queryList', callee: 'getAllocatedetail', showMsg: false }
            ]
        }),
    },
    mutations: {
        updateWarpNoticeId (state, id ) {
            state.noticeId = id;
        }
    }
}, DEFAULTS)
