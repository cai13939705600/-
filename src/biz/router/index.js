import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const ROUTES = CNST.ROUTES

const router = new VueRouter({
    mode: 'history',
    routes: [
        ROUTES.LOGIN
    ]
})

router.beforeEach(function (to, from, next) {
    if (!oauth.isAuthed() && to.path !== ROUTES.LOGIN.path) {
         router.push(ROUTES.LOGIN.path)
    } else {
        next()
    }
})

export default router
