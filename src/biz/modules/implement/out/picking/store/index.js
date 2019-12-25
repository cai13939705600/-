import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    loading: false,
    inventoryTypes: [],
    query: {
        startCreateTime: jt.date.getTodayZero(),
        endCreateTime: jt.date.getTodayLast(),
    }
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            type: 1,
            items: [
                { key: 'queryList', callee: 'getPickTicketList' },
                // 拣货单 汇总明细查询
                { key: 'getPickingDetailTaskListAction', callee: 'getPickingDetailTaskList' },
                // 拣货单拆分明细
                {
                    key: 'getPickingDetailList',
                    callee: 'getPickingDetailList',
                    mutation: 'getPickingDetailList'
                },
                // 确认整单拣货
                {
                    key: 'confirmPick',
                    callee: 'confirmPicking'
                }
            ]
        })
    },
    mutations: {
        getPickingDetailList (state, payload ) {
            state.splitDetail = payload;
        },
        updateInventoryTypes (state, payload) {
            state.inventoryTypes = payload
        },
    }
}, DEFAULTS)
