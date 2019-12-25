export default [
    { id: 30000, code: 'system', level: 1, moduleName: '系统中心', parentId: 0 },
    { id: 30001, code: 'system_user', level: 2, moduleName: '用户管理', parentId: 30000, path: '/master/account' },
    { id: 30002, code: 'system_role', level: 2, moduleName: '角色管理', parentId: 30000, path: '/master/role' },
    { id: 30003, code: 'system_setting', level: 2, moduleName: '高级设置', parentId: 30000, path: '/master/setting' },
]