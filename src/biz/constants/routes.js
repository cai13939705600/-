let uid = 1

function genUid () {
    return 'sr-' + uid++
}

const ROUTES = {
    LOGIN: {
        path: '/login',
        meta: { id: genUid(), code: genUid(), moduleName: '登录页', isGlobal: true },
        component: () => import('biz/modules/login')
    },
    ROOT: {
        path: '/',
        meta: { id: genUid(), code: genUid(), moduleName: '首页', closable: false, icon: 'home' },
        component: () => import('biz/modules/home')
    },
    // 手工分配
    NOTICE_MANUAL: {
        path: '/implement/out/noticeManual',
        meta: { id: genUid(), code: genUid(), moduleName: '手工分配' },
        component: () => import('biz/modules/implement/out/noticeManual')
    }
    
}

export default ROUTES
