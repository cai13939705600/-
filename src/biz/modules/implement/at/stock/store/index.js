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

    inventoryTypes: []

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
                { key: 'queryList', callee: 'quertStockList' },
                 // 移库
                { key: 'moveStock', callee: 'moveStock', mutation: 'updateMoveStock'},
                // 盈亏调整
                { key: 'profitChangeStock', callee: 'profitChangeStock' },
                // 冻结
                { key: 'freezeStock', callee: 'freezeStock' },
                // 释放
                { key: 'releaseStock', callee: 'releaseStock' },
                // 批次调整
                { key: 'batchChangeStock', callee: 'batchChangeStock' },
                 // 获取库存类型接口
                 {
                    key: 'getInventoryTypes',
                    callee: 'getInventoryTypes',
                    mutation: 'updateInventoryTypes'
                },
            ]
        }),
        ...generateActions({
            caller: api.print,
            items: [
                //查找远程打印机
                { key: 'queryPrinters', callee: 'queryPrintConfigByPage', mutation:'updateQueryPrinters' },
                // 获取库存类型接口
                {
                    key: 'useTemGetPrinter',
                    callee: 'queryPrintConfig',
                    mutation: 'updateUseTemGetPrinter'
                },
            ]
        }),
    },
    mutations: {
        updateLocationList (state, payload) {
            state.locationList = payload.records;
            console.log(state);
        },
        updateAreaList (state, payload) {
            state.areaList = payload.records
            console.log(state);
        },
        updateMoveStock (state, payload) {
            console.log('444444444444444444444444',state,payload);
        },
        updateInventoryTypes (state, payload) {
            state.inventoryTypes = payload
        },
        updateQueryPrinters (state, payload) {
            if(payload.records.length>0){
                state.queryPrinters = payload.records[0]
            }
            console.log('qqqqqqqqqqqq',state)
        },
        updateUseTemGetPrinter(state, payload) {
            state.tempPrinters = payload
            console.log('PPPPPPPPPP',payload)
        },
    }
}, DEFAULTS)
