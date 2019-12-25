import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    //query: { validFlag: 1, },
    query: {},
    entity: {},
    areasList: [],
}

export default pageListMerge({
    namespaced: true,
    actions: {
         ...generateActions({
            caller: api.rule,
            items: [
                // 查询列表
                { key: 'queryList', callee: 'queryListRule' },
                // 新建
                { key: 'createEntity', callee: 'turnoverRuleInsert' },
                // 修改
                { key: 'turnoverRuleUpdate', callee: 'turnoverRuleUpdate'},
                // 启用
                { key: 'start', callee: 'turnoverRuleEnable' },
                // 停用
                { key: 'stop', callee: 'turnoverRuleStop' },
                //修改功能回显的table
                { key: 'getTurnoverRuleById', callee: 'getTurnoverRuleById'},
            ]
        })
    },
}, DEFAULTS)
