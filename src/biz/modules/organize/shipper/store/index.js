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
                // 查询货主列表
                { key: 'queryList', callee: 'queryStorerList' },
                // 启用、停用货主
                { key: 'startOrStop', callee: 'startOrStopStorer' },
                // 新增
                { key: 'createEntity', callee: 'addOrEditStorer' },
                // 修改
                { key: 'updateEntity', callee: 'addOrEditStorer' },
                // 导出 
                { key: '', callee: 'addOrEditStorer' },
            ]
        })
    }
}, DEFAULTS)