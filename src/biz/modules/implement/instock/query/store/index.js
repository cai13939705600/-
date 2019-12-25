import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    //单据类型
    billTypes:[],
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
                 // 获取入库单查询报表
                 { key: 'queryList', callee: 'getInStockQueryReport' },
                //单据类型接口
                { key: 'getBillTypesAction', callee: 'getBillTypes' ,mutation:'getTypes'},
                 // 货主下拉框 
               { key: 'getOwnerListAction', callee: 'getOwnerList' ,mutation:'getOwnerLists'},
               //仓库下拉列表 (只可查询该账户绑定的仓库)
               { key: 'getWareHouseListAction', callee: 'getWareHouseList' ,mutation:'getStores'},
                
            ]
        })
    },
    mutations:{
        //单据类型接口
        getTypes:(state,payload)=>{
            state.billTypes=payload
        },
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
