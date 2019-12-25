import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},

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
                { key: 'queryList', callee: 'getRfidList' },
            ]
        })
    },
    mutations: {
        
    }
}, DEFAULTS)
