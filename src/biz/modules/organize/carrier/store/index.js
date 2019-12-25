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
            caller: api.organize,
            items: [
                // 查询列表
                { key: 'queryList', callee: 'queryListCarrier' },
                // 新建
                { key: 'createEntity', callee: 'addCarrier' },
                // 修改
                { key: 'updateEntity', callee: 'updateCarrier' },
                { key: 'queryEntity', callee: 'queryEntityCarrier' },
                // 启用
                { key: 'start', callee: 'startCarrier' },
                // 停用
                { key: 'stop', callee: 'stopCarrier' }
            ]
        })
    }
}, DEFAULTS)
