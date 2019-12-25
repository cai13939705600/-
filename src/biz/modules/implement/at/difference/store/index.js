import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    query: { status: '' },
    entity: {},
    // 库存状态
    stockState:[]
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            items: [
                // 查询收货人列表
                { key: 'queryList', callee: 'queryDifference' },
                // 启用、停用收货人
                { key: 'startOrStop', callee: 'startOrStopReceiver' },
                // 新增
                { key: 'createEntity', callee: 'addOrEditReceiverr' },
                // 修改
                { key: 'updateEntity', callee: 'diffEdit' },
                // 查询库存状态
                { key: 'getStockState', callee: 'stockState' ,mutation: 'getStock'}
            ]
        })
    },
    mutations:{
        getStock: (state,payload)=>{
            state.stockState = payload
        }
    }
}, DEFAULTS)