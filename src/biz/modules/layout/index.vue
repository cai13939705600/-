<template>
    <div class="layout f-cb" :class="{'layout--fold': fold}">
        <div class="g-sd f-fl">
            <sidebar/>
        </div>
        <div class="g-mn">
            <topbar/>
            <div class="g-mnc">
                <nav-tabs/>
                <div class="view-wrap">
                    <keep-alive :include="keepAliveInclude">
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import cookie from 'js-cookie'
import { login } from 'biz/utils/oauth'
import Topbar from './components/topbar'
import NavTabs from './components/navTabs'
import Sidebar from './components/sidebar'
import './styles/index.scss'

export default {
    components: {
        Topbar,
        NavTabs,
        Sidebar
    },
    computed: {
        ...mapState('app', ['navTabs', 'routeMap', 'fold']),
        keepAliveInclude () {
            const routeMap = this.routeMap
            const navTabs = this.navTabs
            const include = []
            for (let i = 0, len = navTabs.length; i < len; i++) {
                include.push(routeMap[navTabs[i].code].path.substr(1).replace(/\//g, '_'))
            }
            return include
        }
    },
    watch: {
        $route: {
            immediate: true,
            handler: function (newVal) {
                this.$store.commit('app/actNavTab', {
                    ...newVal.meta,
                    path: newVal.path,
                    query: newVal.query
                })
            }
        },
    },
    created () {
        let { query } = this.$route
        // 查询当前用户
        this.queryCurrentUser()
        // 查询用户菜单
        this.queryUserMenus()
        //查询原出库单弹窗状态枚举
        this.queryEnums(['DO_STATE'])
    },
    methods: {
        ...mapActions('app', ['queryCurrentUser', 'queryUserMenus']),
        ...mapActions('enums',['queryEnums'])
    }
}
</script>


