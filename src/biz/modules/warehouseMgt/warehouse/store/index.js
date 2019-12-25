import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    //query: { validFlag: 1 },
    entity: {}
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.library,
            items: [
                // 查询列表
                { key: 'queryList', callee: 'queryListWare' },
                // 新建
                { key: 'createEntity', callee: 'addWarehouse' },
                // 修改
                { key: 'updateEntity', callee: 'updateWarehouse' },
                // 启用
                { key: 'start', callee: 'startWarehouse' },
                // 停用
                { key: 'stop', callee: 'stopWarehouse' }
            ]
        })
    }
}, DEFAULTS)
