<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState('app', [ 'menus', 'actTab', 'routeMap' ]),
        menuMap () {
            const menus = this.menus
            const map = {}
            function convert (menus) {
                for (let i = 0, len = menus.length; i < len; i++) {
                    map[menus[i].code] = _.omit(menus[i], 'children')
                    if (!_.isEmpty(menus[i].children)) {
                        convert(menus[i].children)
                    }
                }
            }
            convert(menus)
            return map
        }
    },
    watch: {
        actTab (newVal) {
            this.actTopCode = this.findTopCodeBySubCode(newVal)
        }
    },
    data () {
        return {
            actTopCode: null
        }
    },
    render () {
        const menus = this.menus
        return (
            <ul class="top-menu">
            {
                menus.map(item => {
                    return (
                        <li class="menu-item">
                        {
                            item.children && item.children.length
                                ? <el-popover placement="bottom-start" trigger="hover" popper-class="top-menu-popover" visible-arrow={false} ref={'popover-' + item.code} transition={null}>
                                    <a slot="reference" class={['menu-link', this.actTopCode === item.code ? 'menu-link--active' : undefined].join(' ')}>{item.moduleName}</a>
                                    {this.getMenuPopoverContent(item)}
                                </el-popover>
                                : <a class={['menu-link', this.actTab === item.code ? 'menu-link--active' : undefined].join(' ')} onClick={() => this.onMenuClick(item.code)}>{item.moduleName}</a>
                        }
                        </li>
                    )
                })
            }
            </ul>
        )
    },
    methods: {
        getMenuPopoverContent (menu) {
            const children = menu.children
            // 最多支持两层
            let level = !_.isEmpty(children[0].children) ? 2 : 1
            if (level === 1) {
                return (
                    <ul class="top-submenu top-submenu-1">
                    {
                        children.map(item => {
                            return (
                                <li class="menu-item">
                                    <a class={['menu-link', this.actTab === item.code ? 'menu-link--active' : undefined].join(' ')} onClick={() => this.onMenuClick(item.code, menu.code)}>{item.moduleName}</a>
                                </li>
                            )
                        })
                    }
                    </ul>
                )
            } else {
                return (
                    <div class="top-submenu top-submenu-2">
                    {
                        children.map(child => {
                            return (
                                <dl class="menu-block">
                                    <dt class="menu-title">{child.moduleName}</dt>
                                    {
                                        child.children.map(item => {
                                            return (
                                                <dd class="menu-item">
                                                    <a class={['menu-link', this.actTab === item.code ? 'menu-link--active' : undefined].join(' ')} onClick={() => this.onMenuClick(item.code, menu.code)}>{item.moduleName}</a>
                                                </dd>
                                            )
                                        })
                                    }
                                </dl>
                            )
                        })
                    }
                    </div>
                )
            }
        },
        onMenuClick (code, topCode) {
            if (topCode) {
                this.$refs['popover-' + topCode].doClose()
            }
            this.$store.commit('app/actNavTab', { code })
        },
        findTopCodeBySubCode (subCode) {
            const map = this.menuMap
            let topCode = subCode
            while(map[topCode] && map[topCode].parentCode) {
                topCode = map[topCode].parentCode
            }
            return topCode === subCode ? null : topCode
        }
    }
}
</script>

<style lang="scss" scoped>
.top-menu {
    font-size: 16px;
    color: #fff;
    .menu-item {
        display: inline-block;
        &:hover {
            background: #181636;
            color: #3998FC;
        }
    }
    .menu-link {
        display: block;
        padding: 0 24px;
    }
    .menu-link--active {
        color: #3998FC;
    }
}
</style>

<style lang="scss">
.top-menu-popover {
    &[x-placement^="bottom"] {
        margin-top: 0;
    }
    font-size: 14px;
    color: #fff;
    border: 0;
    border-radius: 0;
    background: rgba( 9, 7, 36, 0.971);
    .menu-link {
        &:hover {
            color: #3998FC;
        }
    }
    .menu-link--active {
        color: #3998FC;
    }
    .top-submenu-1 {
        width: 260px;
        padding: 14px 0 0 10px;
        .menu-item {
            display: inline-block;
            width: 50%;
            margin-bottom: 14px;
        }
    }
    .top-submenu-2 {
        width: 390px;
        padding: 12px 0 0 10px;
        .menu-block {
            margin-bottom: 25px;
            &:last-child {
                margin-bottom: 15px;
            }
        }
        .menu-title {
            margin-bottom: 20px;
            padding: 0 0 10px 0;
            font-size: 16px;
            border-bottom: 1px solid rgba(216, 216, 216, 0.2045);
        }
        .menu-item {
            display: inline-block;
            margin-bottom: 10px;
            width: 33.33%;
        }
    }
}
</style>





