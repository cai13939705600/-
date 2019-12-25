
// 统一物料查询
// const config_1 = {
//     prefix: '/ba/sku',
//     items: [
//         // 查询列表
//         { key: 'queryList', url: '/getSkuList' },
//         // 查询详情
//         { key: 'queryDetlByCode', url: '/getSkuByCode', cType: 3 }
//     ]
// }
// 单据类型分页
const config_3 = {
    prefix: '/ba/billTypeController',
    items: [
        // 查询列表
        { key: 'queryBillTypeController', url: '/page' },
        // 查询详情
        { key: 'BillTypeController', url: '/save' },
        { key: 'editBillType', url: '/update' },
        { key: 'startBillType', url: '/enable' },
        { key: 'stopBillType', url: '/stop' }
    ]
}
// 物料条码
const config_2 = {
    prefix: '/ba/rest/api',
    items: [
        // 新增|编辑
        { key: 'saveBarcode', url: '/skuBarcode/saveOrUpdateSkuBarcode' },
        // 删除
        { key: 'deleteBarcode', url: '/skuBarcode/deleteSkuBarcode' },
        // 查询列表

        { key: 'queryBarcodes', url: '/skuBarcode/getSkuBarcodeList' },
        // 根据商品编码查询商品信息
        { key: 'queryBarcodeExist', url: '/skuBarcode/getSkuBarcodeExist' },

        { key: 'queryBarcodes', url: '/skuBarcode/getSkuBarcodeList' },
        // 根据物料编码查询物料信息
        { key: 'queryBarcodeExist', url: '/skuBarcode/getSkuBarcodeExist' },
        // 批量导入
        { key: 'importBarcodes', url: '/skuBarcode/skubarcodeFileUpload' },
         //新增物料分类
         { key: 'addItemClass', url: '/skuCategory/insert' },
         //编辑物料分类
         { key: 'eidtItemClass', url: '/skuCategory/update' },
    ]
}

export default {
    // ...req.generate(config_1),
    ...req.generate(config_2),
    ...req.generate(config_3)
}
