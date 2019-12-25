<template>
    <div class="sidebar" :class="{'sidebar--fold': fold}">
        <div class="sidebar__hd">
            <div class="sidebar__hd-logo"></div>
            <div class="sidebar__hd-fold">
                 <el-input
                    :class="fold ? 'hidden' : 'show'"
                    clearable
                    @keyup.enter.native="searchMenus"
                    @blur="searchMenus"
                    placeholder="菜单筛选" v-model="current" size="mini" class="input-change-menu">
                    <el-button @click="searchMenus" slot="append" icon="el-icon-search" size="mini"></el-button>
                </el-input>
            </div>
        </div>
        <div class="sidebar__bd">
            <el-scrollbar>
                <side-menu ref="side"/>
            </el-scrollbar>
        </div>
        <a class="fold-btn" @click="toggleFold">
            <img src="../../../imgs/flod_arrow.png" alt="">
        </a>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import SideMenu from './sideMenu.vue'
export default {
    components: {
        SideMenu
    },
    computed: {
        ...mapState('app', ['fold', 'menus'])
    },
    data () {
        return {
            current: ''
        }
    },
    methods: {
        toggleFold () {
            this.$store.commit('app/update', { fold: !this.fold })
        },
        searchMenus () {
            const keyword = this.current
            if (/\S/.test(keyword)){
                this.$refs.side.searchAndSelect(_.trim(keyword))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.sidebar {
    width: 100%;
    height: 100%;
    position: relative;
}
.sidebar__hd-logo {
    height: 90px;
    background: url('../../../imgs/sideBarLogo.png') no-repeat center center;
    background-size: 150px auto;
}
.sidebar__hd-fold {
    height: 40px;
    line-height: 30px;
    text-align: center;

    & /deep/ .svg-icon {
        cursor: pointer;
        transform: rotate(90deg);
        transition: all 0.3s;
    }
    .input-change-menu {
        &.hidden {
            transform: translateX(-200px)
        }
        &.show {
            transform: translateX(0)
        }
        width: 86%;
        transition: transform 0.1s ease-in-out;
        /deep/ .el-input-group__append {
            padding: 0 11px;
            background-color: transparent;
            border-color: transparent;
            .el-icon-search {
                font-size: 14px;
                line-height: 22px;
            }
        }
        /deep/ .el-input__inner {
            width: 130px;
            height: 26px;
            background: transparent;
            border-color: white;
            color: white;
            border-radius: 4px;
            margin-left: 11px;
        }
        /deep/  input::-webkit-input-placeholder {
            /* WebKit browsers */
            color: #aaa;
        }
        /deep/  input:-moz-placeholder {
            /* Mozilla Firefox 4 to 18 */
            color: #aaa;
        }
        /deep/   input::-moz-placeholder {
            /* Mozilla Firefox 19+ */
            color: #aaa;
        }
        /deep/  input::-ms-input-placeholder {
            /* Internet Explorer 10+ */
            color: #aaa;
        }
    }
}
.sidebar__bd {
    width: 100%;
    height: calc(100% - 120px);
    overflow: hidden;
}
.el-scrollbar {
    height: 100%;
    & /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
        overflow-y: scroll;
    }
}

.sidebar--fold {
    .sidebar__hd-logo {
        background-image: url('../../../imgs/sideBarFoldLogo.png');
        background-size: 45px auto;
    }
    & /deep/ .svg-icon {
        transform: rotate(0);
    }
    & /deep/ .fold-btn i{
        transform: rotate(-180deg);
        -webkit-transform: rotate(-180deg);
    }
    .el-scrollbar /deep/ .el-scrollbar__view {
        width: $--sd-width-fold;
    }
}

.fold-btn {
    position: absolute;
    right: -14px;
    top: 50%;
    margin-top: -146px;
    width: 14px;
    height: 294px;
    background: rgba(119,128,157,1);
    border-radius: 2px 18px 18px 2px;
    z-index: 200;
    cursor: pointer;
    img {
        transform: rotate(0deg);
        transition: all 0.3s;
        margin-top: 139px;
        text-align: center;
    }
}
.sidebar.sidebar--fold {
    .fold-btn {
        img {
            transform: rotate(180deg);
        }
    }
}

/deep/ .el-submenu__icon-arrow {
    margin-top: -4px;
}
</style>
