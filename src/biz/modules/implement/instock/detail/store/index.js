import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
     //单据类型
     billTypes:[],
     //库存类型
    inventoryTypes:[],
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
                 // 获取入库单明细查询报表
                 { key: 'queryList', callee: 'getInStockDetailQueryReport' },
               //单据类型接口
               { key: 'getBillTypesAction', callee: 'getBillTypes' ,mutation:'getTypes'},
               //库存类型
               { key: 'getInventoryTypes', callee: 'getInventoryTypes' ,mutation:'getInventory'},
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
        //库存类型
        getInventory:(state,payload)=>{
            state.inventoryTypes=payload 
        },
        // 货主下拉框
        getOwnerLists: (state,payload)=>{
            state.ownerList=payload.records
        },
        //仓库下拉列表
        getStores: (state,payload)=>{
            state.storeList=payload
        },
    }
}, DEFAULTS)
