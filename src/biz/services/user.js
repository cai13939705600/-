
// 用户
const services = {
    prefix: '',
    items: [
        // 获取用户菜单和按钮
        { key: 'queryUserMenus', url: '/ba/rest/api/baUser/getUserMenuList' },
        // 查询当前用户
        { key: 'queryCurrentUser', url: '/ba/rest/api/baUser/getCurrentUser' },
        // 查询当前用户的仓库列表
        { key: 'queryCurrentUserWhses', url: '/ba/rest/api/warehouse/selectCurrentUserWarehouseList' },
        // 切换仓库
        { key: 'changeWarehouse', url: '/ba/rest/api/warehouse/changeWarehouse' },
        // 查询当前用户的列表列设置
        { key: 'querySetTbClumns', url: '/ba/rest/api/baUserColumnChooser/searchChoosedColumns' },
        // 保存列设置
        { key: 'saveSetTbClumns', url: '/ba/rest/api/baUserColumnChooser/cacheColumns' }
    ]
}
export default {
    ...req.generate(services)
}
