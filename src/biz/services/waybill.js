/**
 * 电子运单模块请求
 */

const waybill = {
    prefix: 'ba/rest/api/awbConfig',
    items: [
        // 电子运单列表查询
        { key: 'getWaybillList', url: '/getAwbConfigList' },
        // 菜鸟店铺发货地址
        { key: 'getCaiNiaoAddress', url: '/getAddress' },
        // 承运商列表查询
        { key: 'getCarrierList', url: '/getCarrierList' },
        // 仓库列表查询
        { key: 'getStockList', url: '/getWaregetStorerListhouseList' },
        // 店铺列表查询
        { key: 'getShopList', url: '/getShopList' },
        // 货主列表查询
        { key: 'getStoreList', url: '/getStorerList' },
        // 授权店铺列表查询
        { key: 'getAuthshopList', url: '/getAuthEshopList' },
        // 获取运单来源
        { key: 'getWaybillSources', url: '/getAwbConfigSources' },
        // 获取淘系与自定义模板
        { key: 'getTemplates', url: '/getTemplates' },
        // 启用或者停用
        { key: 'enableOrDisable', url: '/enableOrDisableAwbConfigByIdList'},
        // 快递对接编码获取
        { key: 'getExpressDockingCode', url: '/getExpressDockingCode'},
        // 保存或者更新电子运单
        { key: 'saveOrUpdateAwbConfig', url: '/saveOrUpdateAwbConfig'}
    ]
}

export default {
    ...req.generate(waybill)
}
