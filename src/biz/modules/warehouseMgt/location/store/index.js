import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {
        isCheck: true,
        locUse: 10,
        constraintType: 10
    },
    areasList: [],
    pageSize: 20,
    locationType: [],
    /* query: {
        validFlag: 1
    } */
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.library,
            items: [
                { key: 'createEntity', callee: 'batchLibraryLocation' },
                { key: 'updateEntity', callee: 'updateLibraryLocation' },
                { key: 'queryList', callee: 'queryLibraryLocations', showMsg: false },
                { key: 'enableEntitiy', callee: 'enableLibraryLocation' },
                { key: 'stopEntitiy', callee: 'stopLibraryLocation' },
                { key: 'deleteEntity', callee: 'deleteLibraryLocations' },
                { 
                    key: 'queryLibraryAreasList', 
                    callee: 'queryLibraryAreas',
                    mutation: 'areas',
                },
                {
                    key: 'getLocationType',
                    callee: 'getLocationType',
                    mutation: 'updateLocationType',
                },
            ]
        })
    },
    mutations: {
        areas (state, data) {
            state.areasList = data.records
        },
        updateLocationType (state, data) {
            state.locationType = data
        }
    }
}, DEFAULTS)
