/**
 * 出库模块请求
 */

const menu = {
    //prefix: '/rest/api/menu',
    prefix: '/ba/rest/api/menu',
    items: [
        // 查询菜单
        { key: 'getMenuList', url: '/getMenuList' },
    ]
}

export default {
    ...req.generate(menu),
}
