
// 承运商
const config_1 = {
    prefix: '/ba/carrier',
    items: [
        // 查询列表
        { key: 'queryListCarrier', url: '/page' },
        // 新建 
        { key: 'addCarrier', url: '/create' },
        // 修改 
        { key: 'updateCarrier', url: '/update' },
        // 启用
        { key: 'startCarrier', url: '/enable' },
        // 停用
        { key: 'stopCarrier', url: '/stop' }
    ]
}

// 供应商
const config_2 = {
    prefix: '/ba/supplier',
    items: [
        // 查询列表
        { key: 'querySupplier', url: '/getSupplierPage' },
        // 新增
        { key: 'addSupplier', url: '/create' },
        // 修改
        { key: 'updateSupplier', url: '/update' },
        // 启用 
        { key: 'startSupplier', url: '/enable' },
        // 停用
        { key: 'stopSupplier', url: '/stop' },
        //导入
        { key: 'importSupplier', url: '/import/supplierFileUpload' },
    ]
}

// 货主
const config_3 = {
    prefix: '/ba/rest/api/storer',
    items: [
        // 新增|编辑
        { key: 'addOrEditStorer', url: '/saveOrUpdateStorer' },
        // 查询列表
        { key: 'queryStorerList', url: '/getStorerList', cType: 1},
        // 启用、停用货主 
        { key: 'startOrStopStorer', url: '/disableStorer' }
    ]
}

// 收货人
const config_4 = {
    prefix: '/ba/rest/api/consignee',
    items: [
        // 查询列表
        { key: 'queryReceiver', url: '/getConsigneeList' },
        // 新增|编辑
        { key: 'addOrEditReceiverr', url: '/saveOrUpdateConsignee' },
        // 启用、停用收货人
        { key: 'startOrStopReceiver', url: '/disableConsignee' }
    ]
}

// 项目信息
const config_5 = {
    prefix: '/ba/rest/api/project',
    items: [
        // 查询列表
        { key: 'queryListItem', url: '/getProjectList' },
        // 新建 
        { key: 'addItem', url: '/saveOrUpdateProject' },
        // 修改 
        { key: 'updateItem', url: '/saveOrUpdateProject' },
        // 获取详情 
        { key: 'queryEntityItem', url: '/getProjectDetail' },
        // 启用、停用
        { key: 'startOrStopItem', url: '/disableProject' },
    ]
}

export default {
    ...req.generate(config_1),
    ...req.generate(config_2),
    ...req.generate(config_3),
    ...req.generate(config_4),
    ...req.generate(config_5)
}