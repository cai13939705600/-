/**
 * 账号模块请求
 */

const config = {
    prefix: '/ba/rest/api/baUser',
    items: [
        // 查询列表
        { key: 'queryAccounts', url: '/search' },
        // 新增
        { key: 'queryRolesByName', url: '/getRoleNameList' },
        // 模糊查询账户列表
        { key: 'searchByName', url: '/fuzzyQueryByName' },
        // 添加账户
        { key: 'addAccount', url: '/insert' },
        // 修改账户
        { key: 'updateAccount', url: '/update' },
        // 获取角色列表
        { key: 'getRoleList', url: '/getRoleList' },
        // 角色设置
        { key: 'roleSetting', url: '/roleSetting' },
        // 密码重置
        { key: 'resetPassword', url: '/pwdReset' },
        //修改密码
        { key: 'changePassword', url: '/updatePwd' },
        // 启用
        { key: 'enable', url: '/enable' },
        // 停用
        { key: 'stop', url: '/stop' },
        // 导出
        { key: 'exportExcel', url: '/exportExcel' },
        // 当前用户信息
        { key: 'getCurrentUser', url: '/getCurrentUser' },
        // 当前用户 对应的店铺列表
        { key: 'getCurrentShops', url: '/eshopList' },
    ]
}

export default {
    ...req.generate(config)
}
