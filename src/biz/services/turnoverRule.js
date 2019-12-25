/**
 *  周转规则请求
 */

const turnoverRule = {
    prefix: 'wo/rest/api/turnoverRule',
    items: [
        //周转规则 列表请求
        { key: 'turnoverRuleList', url: '/searchByPage'},
        { key: 'turnoverRuleInsert', url: '/insert'},//新建
        { key: 'turnoverRuleUpdate', url: '/update'},//修改
        { key: 'turnoverRuleEnable', url: '/enable'},//启用
        { key: 'turnoverRuleStop', url: '/stop'},//停用

    ]
}

export default {
    ...req.generate(turnoverRule),
}
