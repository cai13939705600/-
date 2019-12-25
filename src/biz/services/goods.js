/**
 * 物料模块相关接口
 */

// 物料管理
const config_1 = {
    prefix: '/ba/sku',
    items: [
        // 添加
        { key: 'addGoods', url: '/create'},
        // 编辑
        { key: 'updateGoods', url: '/update' },
        // 查询列表
        { key: 'queryGoodsList', url: '/page'},
        // 启用
        { key: 'startGoods', url: '/enable'},
        // 停用
        { key: 'stopGoods', url: '/stop'},
        // 查询组合装子件物料
        { key: 'querySubGoodsList', url: '/getpackagesubgoodsbyid', method: 'get' },
        // 新增组合装物料
        { key: 'addSubGoods', url: '/createpackagegoods', cType: 3 },
        // 编辑组合装物料
        { key: 'updateSubGoods', url: '/updatepackagegoods', cType: 3 },
        // 批量替换子件
        { key: 'replaceSubGoods', url: '/updatepackageinfolist', cType: 3 },
        // 查询日志
        { key: 'queryLogs', url: '/getgoodsloglist', method: 'get' },
        // 查询基本单位

        { key: 'queryUnits', url: '/getallunit', method: 'get' },

        { key: 'uploadBardImg', url: '/uploadImage' },
        //图片预览
        { key: 'preViewBardImg', url: '/showImageByte' },

    ]
}

// 物料品牌
const config_2 = {
    prefix: '/jd-wms/erp/brand',
    items: [
        // 添加
        { key: 'addBrand', url: '/create', cType: 3 },
        // 删除
        { key: 'deleteBrands', url: '/delete', cType: 3 },
        // 编辑
        { key: 'updateBrand', url: '/update', cType: 3 },
        // 查询列表
        { key: 'queryBrands', url: '/list', method: 'get' },
        // 启用
        { key: 'startBrands', url: '/recover', cType: 3 },
        // 停用
        { key: 'stopBrands', url: '/blockup', cType: 3 }
    ]
}
// 批次规则查询
const config_3 = {
    prefix: 'ba/rest/api',
    items: [
        { key: 'getLotAttr', url: '/lotAttrRule/getLotAttrRuleList'},
        //新增修改
        { key: 'addOrEdit', url: '/lotAttrRule/saveOrUpdateLotAttrRule'},
        { key: 'startBatchRule', url: '/lotAttrRule/disableLotAttrRule'},
        { key: 'stopss', url: '/lotAttrRule/disableLotAttrRule'},
         //物料分类
         { key: 'itemClassList', url: '/skuCategory/searchByPage'},
         //删除物料分类
         { key: 'deleteItemClassList', url: '/skuCategory/delete'},
         //下一级物料分类新增
         { key: 'addNextItemClassList', url: '/skuCategory/nextLevelAdd'},
         //RFID管理
         { key: 'getRfidList', url: '/rfid/searchByPage'},
         //bom管理
         { key: 'getBomList', url: '/bom/getBomList'},
         //bom 新建
         { key: 'addBom', url: '/bom/saveOrUpdateBom'},
         //bom 明细查询
         { key: 'getBomDetail', url: '/bom/getBomDetail'},
         //Bom删除
         { key: 'deleteBom', url: '/bom/deleteBom'},
         //bom导入
         { key: 'importBom', url: '/bom/import/bomFileUpload'},
    ]
}


export default {
    ...req.generate(config_1),
    ...req.generate(config_2),
    ...req.generate(config_3)
}
