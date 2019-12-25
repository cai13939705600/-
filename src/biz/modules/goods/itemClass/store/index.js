import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {
        level:1
    },

    locationLoading: false,
    locationList: [],
    
    areaLoading: false,
    areaList: [],

    prodcutLoading: false,
    productList: []

}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.goods,
            type: 1,
            items: [
                { key: 'queryList', callee: 'itemClassList' },
                { key: 'startss', callee: 'startBatchRule' },
                { key: 'deleteEntity', callee: 'deleteItemClassList' },
            ]
        })
    },
    mutations: {
        
    }
}, DEFAULTS)
