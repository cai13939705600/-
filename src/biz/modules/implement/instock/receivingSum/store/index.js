import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    // 货主下拉框
    ownerList:[],
    //仓库下拉列表
    storeList:[],
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            type: 1,
            items: [
                 // 获取收货汇总报表
                 { key: 'queryList', callee: 'getReceivingSummaryReport' },
                // 货主下拉框 
               { key: 'getOwnerListAction', callee: 'getOwnerList' ,mutation:'getOwnerLists'},
               //仓库下拉列表 (只可查询该账户绑定的仓库)
               { key: 'getWareHouseListAction', callee: 'getWareHouseList' ,mutation:'getStores'},
            ]
        })
    },
    mutations: {
        // 货主下拉框
        getOwnerLists: (state,payload)=>{
            state.ownerList=payload.records
        },
        //仓库下拉列表
        getStores:(state,payload)=>{
            state.storeList=payload
        },
    }
}, DEFAULTS)
