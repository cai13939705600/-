import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    //query: { deleteFlag: 0 },
    entity: {}
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.organize,
            type: 2,
            items: [
                // 查询供应商列表
                { key: 'queryList', callee: 'querySupplier' },
                // 新增
                { key: 'createEntity', callee: 'addSupplier'},
                // 修改
                { key: 'updateEntity', callee: 'updateSupplier' },
                // 启用
                { key: 'start', callee: 'startSupplier' },
                // 停用
                { key: 'stop', callee: 'stopSupplier' },
                { key: 'queryEntity', callee: 'queryEntity' }
            ]
        })
    }
}, DEFAULTS)
