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
                // 查询收货人列表
                { key: 'queryList', callee: 'queryReceiver' },
                // 启用、停用收货人
                { key: 'startOrStop', callee: 'startOrStopReceiver' },
                // 新增
                { key: 'createEntity', callee: 'addOrEditReceiverr' },
                // 修改
                { key: 'updateEntity', callee: 'addOrEditReceiverr' }
            ]
        })
    }
}, DEFAULTS)