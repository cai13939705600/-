/**
 * 规则管理相关接口
 */

//库存周转规则
const rule = {
    prefix: '/wo/rest/api/turnoverRule',
    items: [
        // 查询
        { key: 'queryListRule', url: '/searchByPage' },
        { key: 'turnoverRuleInsert', url: '/insert'},//新建
        { key: 'turnoverRuleUpdate', url: '/update'},//修改
        { key: 'turnoverRuleEnable', url: '/enable'},//启用
        { key: 'turnoverRuleStop', url: '/stop'},//停用
        { key: 'getTurnoverRuleById', url: '/getTurnoverRuleById'},//修改功能回显的table
    ]
}


export default {
    ...req.generate(rule),
}
