
const config = {
    prefix: '/ba/rest/api',

    items: [
        // 查询列表
        { key: 'queryRoles', url: '/role/getRoleList' },
        // 根据角色名称模糊查询角色信息
        { key: 'queryRolesByName', url: '/role/getRoleNameList' },
        // 角色名字唯一性查询
        { key: 'getRoleNameExist', url: '/role/getRoleNameExist' },
        // 功能角色新增/编辑
        { key: 'addRole', url: '/role/saveOrUpdateRole' },
        // 查看明细
        { key: 'queryRoleDetail', url: '/role/queryRoleDetail' },
        // 启用/停用
        { key: 'disableRole', url: '/role/disableRole' },
        // 货主列表
        { key: 'getStorerList', url: '/role/getStorerList' },
        // 店铺列表
      //  { key: 'getShopList', url: '/getShopList' },
      //库区列表
        {key: 'getZoneList', url: '/zone/getZonesByWhIds'},
        // 仓库列表
        { key: 'getWareHouseList', url: '/role/getWareHouseList' },
    ]
}

export default {
    ...req.generate(config)
}
