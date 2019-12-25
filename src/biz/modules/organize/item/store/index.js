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
                { key: 'queryList', callee: 'queryListItem' },
                // 新建
                { key: 'createEntity', callee: 'addItem' },
                // 修改
                { key: 'updateEntity', callee: 'updateItem' },
                // 获取详情
                { key: 'queryEntity', callee: 'queryEntityItem' },
                // 启用、停用
                { key: 'startOrStop', callee: 'startOrStopItem' }
            ]
        })
    }
}, DEFAULTS)
