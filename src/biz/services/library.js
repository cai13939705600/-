/**
 * 仓库管理相关接口
 */

//仓库
const ware = {
    prefix: '/ba/rest/api/warehouse',
    items: [
        // 查询
        { key: 'queryListWare', url: '/searchByPage' },
        // 新建
        { key: 'addWarehouse', url: '/insert' },
        // 修改
        { key: 'updateWarehouse', url: '/update' },
        // 启用
        { key: 'startWarehouse', url: '/enable' },
        // 停用
        { key: 'stopWarehouse', url: '/stop' },
    ]
}
// 库区
const zone = {
    prefix: '/ba/rest/api/zone',
    items: [
        // 添加库区
        { key: 'addLibraryArea', url: '/insert' },
        // 修改库区
        { key: 'updateLibraryArea', url: '/update' },
        // 获取库区列表
        { key: 'queryLibraryAreas', url: '/search' },
        // 删除库区
        { key: 'deleteLibraryArea', url: '/delete' },
        // 导出
        { key: 'exportLibraryArea', url: '/exportExcel' },
    ]
}
// 库位
const location = {
    prefix: '/ba/rest/api/location',
    items: [
        // 添加库位
        { key: 'batchLibraryLocation', url: '/batchInsert' },
        // 修改库位
        { key: 'updateLibraryLocation', url: '/batchUpdate' },
        // 查看库位列表
        { key: 'queryLibraryLocations', url: '/search' },
        // 启用停用库位
        { key: 'enableLibraryLocation', url: '/enable' },
        // 启用停用库位
        { key: 'stopLibraryLocation', url: '/stop' },
        // 删除库位
        { key: 'deleteLibraryLocations', url: '/delete' },
        // 库位类型
        { key: 'getLocationType', url: '/getLocationTypes'},
        // 导出
        { key: 'exportLocationArea', url: '/exportExcel' },
        //新增
        { key: 'addLocation', url: '/add' },
        //修改
        { key: 'editLocation', url: '/update' },
        //修改
        { key: 'importLocation', url: '/import/locationFileUpload' },
    ]
}


export default {
    ...req.generate(ware),
    ...req.generate(zone),
    ...req.generate(location)
}
