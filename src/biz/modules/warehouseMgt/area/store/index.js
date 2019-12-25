import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {}
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.library,
            items: [
                { key: 'createEntity', callee: 'addLibraryArea' },
                { key: 'updateEntity', callee: 'updateLibraryArea' },
                { key: 'deleteEntity', callee: 'deleteLibraryArea' },
                { key: 'queryList', callee: 'queryLibraryAreas', showMsg: false }
            ]
        })
    }
}, DEFAULTS)
