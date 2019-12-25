<script>
import { mapState } from 'vuex'
import { getTreeLeaf } from 'common/utils/tree'
import Bus from 'common/utils/bus'
export default {
    data () {
        return {
            leafs: [],
            active: '',
            first: true
        }
    },
    components: {

    },
    computed: {
        ...mapState('app', ['fold', 'menus', 'routeArr', 'navTabs'])
    },
    created () {
        Bus.$on('openAndSelectByCode', path => { 
            this.openAndSelectByCode(path)
        });
    },
    watch: {
        'menus': {
            immediate: true,
            handler: function (n) {
                this.leafs = getTreeLeaf(this.menus)
            },
            deep: true
        },
        '$route': {
            immediate: true,
            handler: function (n) {
                if (n.fullPath !== '/' && this.first && this.routeArr.length) {
                    this.first = false
                    this.openAndSelect(n.fullPath)
                }
            }
        }
    },
    render () {
        return (
            <el-menu
                ref="menu"
                class="side-menu"
                text-color="#fff"
                active-text-color="#fff"
                collapse-transition={false}
                unique-opened
                router={false}
                collapse={ this.fold }
                onSelect={ this.onSelect }>
                { this.getMenuItem(this.menus) }
            </el-menu>
        )
    },
    methods: {
        getMenuIcon (menu) {
            if (menu.isTop) {
                if (menu.class) {
                    return <i class={['el-icon-', menu.class]}></i>
                }
                return <i class="el-icon-menu"></i>
            }
            return <i class="el-icon-caret-right"></i>
        },
        getMenuItem (menus) {
            return menus.map((menu, index) => {
                return (
                    !menu.children || !menu.children.length
                        ? (menu.isTop?<el-menu-item class="cw_el-menu-item" ref={'menuItem' + menu.code} index={ menu.code }>
                                { this.getMenuIcon(menu) }
                                <span slot="title">{ menu.moduleName }</span>
                        </el-menu-item>:<el-menu-item ref={'menuItem' + menu.code} index={ menu.code }>
                            <span slot="title">{ menu.moduleName }</span>
                        </el-menu-item>)
                        : <el-submenu index={ menu.code }>
                            <template slot="title">
                                { this.getMenuIcon(menu) }
                                <span slot="title">{ menu.moduleName }</span>
                            </template>
                            { this.getMenuItem(menu.children) }
                        </el-submenu>
                )
            })
        },
        onSelect (index) {
            this.$store.commit('app/actNavTab', { code: index })
        },
        searchAndSelect(key) {
            const reg = new RegExp(`.*${key}.*`)
            const menu = this.leafs.find(item => reg.test(item.moduleName))
            if (menu) {
                this.onSelect(menu.code)
                this.$refs.menu.open(menu.parentCode)
                this.$refs['menuItem' + menu.code].$el.click()
            }
        },
        openAndSelect(path) {
            const menu = this.leafs.find(item => item.path === path)
            if (menu) {
                this.$nextTick(() => {
                    this.onSelect(menu.code)
                    if(menu.parentCode){
                        this.$refs.menu.open(menu.parentCode)
                    }
                    this.$refs['menuItem' + menu.code].$el.click()
                })
            }
        },
        openAndSelectByCode(code) {
            const menu = this.leafs.find(item => item.code === code)
            if (menu) {
                this.$nextTick(() => {
                    this.onSelect(menu.code)
                    if(menu.parentCode){
                        this.$refs.menu.open(menu.parentCode)
                    }
                    this.$refs['menuItem' + menu.code].$el.click()
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
   .el-menu{
        .cw_el-menu-item{
            padding: 0!important;
            span{
                font-size: 16px!important;
            }
        }
        /* .el-menu-item{
            padding-left: 47px!important;
        } */
    }
    .layout > .g-sd .side-menu .cw_el-menu-item .iconfont{
        font-size: 22px!important;
        margin-right: 22px;
        
    }
    .layout > .g-sd .side-menu .cw_el-menu-item .el-icon-menu{
        font-size: 22px!important;
        margin-right: 22px;
    }
    .layout > .g-sd .side-menu .cw_el-menu-item .el-tooltip{
        padding: 0!important;
    }
    .layout > .g-sd .side-menu .cw_el-menu-item .el-icon-{
        font-size: 22px!important;
        margin-right: 22px;
    }
    .layout > .g-sd .el-menu--collapse .cw_el-menu-item .el-icon-{
        margin-left: -20px;
    }
    .layout > .g-sd .el-submenu .el-menu .el-menu-item{
        padding-left: 46px!important;
    }
</style>