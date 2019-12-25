import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    inventoryTypes: [],
    billTypes: [],
    shopList: [],
    query: {
        createStartTime: jt.date.getTodayZero(),
        createEndTime: jt.date.getTodayLast(),
    }
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.stock,
            type: 1,
            items: [
                // 获取出库通知单列表
                { key: 'queryList', callee: 'allocateDetail' },
                { key: 'updateEntity', callee: 'confirmPick' },
                // 分配回退
                { key: 'allocateBack', callee: 'allocateBack' },
                // 拣货回退
                { key: 'pickBack', callee: 'pickBack' },
                // 缺量拣货
                { key: 'shortagePicking', callee: 'shortagePicking' },
            ]
        }),
    },
    mutations: {
    }
}, DEFAULTS)
