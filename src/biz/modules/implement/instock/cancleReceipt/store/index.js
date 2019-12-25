import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    query: {
        createTimeStart: jt.date.getTodayZero(),
        createTimeEnd: jt.date.getTodayLast(),
    },
    // 货主下拉框
    ownerList:[]
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            items: [
                // 获取取消收货列表
                { key: 'queryList', callee: 'getCancleGoodsList' },
                // 取消收货
                { key: 'cancleGoodsAction', callee: 'cancleGoods' },
                // 货主下拉框 
               { key: 'getOwnerListAction', callee: 'getOwnerList' ,mutation:'getOwnerLists'},
            ]
        })
    },
    mutations: {
        // 货主下拉框
        getOwnerLists: (state,payload)=>{
            state.ownerList=payload.records
        }
    }
}, DEFAULTS)
