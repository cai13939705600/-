import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},

    locationLoading: false,
    locationList: [],
    
    areaLoading: false,
    areaList: [],

    prodcutLoading: false,
    productList: [],
    query: {
        /* startCreateTime: jt.date.getTodayZero(),
        endCreateTime: jt.date.getTodayLast(), */
    }

}

export default pageListMerge({
    namespaced: true,
    actions: {
        // 库区 库位接口
        ...generateActions({
            caller: api.library,
            items: [
                // 查询库位列表
                {
                    key: 'queryLocationList',
                    callee: 'queryLibraryLocations',
                    mutation: 'updateLocationList'
                },
                // 查询库区列表
                {
                    key: 'queryAreasList',
                    callee: 'queryLibraryAreas',
                    mutation: 'updateAreaList'
                }
            ]
        }),
        ...generateActions({
            caller: api.stock,
            type: 1,
            items: [
                { key: 'queryList', callee: 'exOutSearchByPage' },
            ]
        })
    },
    mutations: {
        updateLocationList (state, payload) {
            state.locationList = payload.records;
            console.log(state);
        },
        updateAreaList (state, payload) {
            state.areaList = payload.records
            console.log(state);
        }
    }
}, DEFAULTS)
