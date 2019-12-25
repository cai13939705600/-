<template>
    <div :class="['basic-search', closed ? 'basic-search--close' : 'basic-search--open']">
        <div class="basic-search__col-l">
            <el-form
                ref="form"
                size="small"
                :model="query"
                :label-position="labelPosition"
                :label-width="labelWidth + 'px'"
                @submit.native.prevent>
                <slot>&nbsp;</slot>
            </el-form>
        </div>
        <div class="basic-search__col-r">
            <el-button size="small" type="primary" @click="handleSearch(query)">查询</el-button>
            <el-button size="small" @click="handleReset">重置</el-button>
            <a title="展开更多" class="toggle-more-btn" @click="toggleMore" v-if="showMore">
                {{closed ? '展开查询' : '收起查询'}}
            </a>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        labelPosition: {
            type: String,
            default: 'right'
        },
        labelWidth: {
            type: Number,
            default: 80
        },
        query: {
            type: Object,
            default () {
                return {}
            }
        },
        handleSearch: {
            type: Function,
            default: () => {}
        },
        handleReset: {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            closed: true,
            showMore: false
        }
    },
    mounted () {
        // this.handleResize = _.throttle(this.calcStatus, 300)
        // window.addEventListener('resize', this.handleResize)
        this.calcStatus()
    },
    beforeDestroy () {
        // window.removeEventListener('resize', this.handleResize)
    },
    methods: {
        calcStatus () {
            const formH = this.$refs.form.$el.offsetHeight
            if (formH > 125 ) {
                this.showMore = true
            } else {
                this.showMore = false
            }
        },
        toggleMore () {
            this.closed = !this.closed
        }
    }
}
</script>

<style lang="scss" scoped>
.basic-search {
    display: flex;
    padding: 20px 0 0;
    /deep/ .el-form-item--small.el-form-item {
        margin-bottom: 2px;
    }
    &.basic-search--close {
        .basic-search__col-l {
            max-height: 105px;
            overflow: hidden;
        }
        .toggle-more-btn {
            background-image: url('../../imgs/icon-open.png');
        }
    }
    &.basic-search--open {
        .basic-search__col-l {
            max-height: none;
        }
        .toggle-more-btn {
            background-image: url('../../imgs/icon-close.png');
        }
    }
}
.basic-search__col-l {
    flex: 1;
    .el-form {
        display: flex;
        flex-wrap: wrap;
    }
    /deep/ .el-form-item {
        padding-right: 15px;
        box-sizing: border-box;
    }
}
.basic-search__col-r {
    position: relative;
    padding: 0 0 0 25px;
    width: 162px;
    .el-button {
        width: 75px;
    }

    .toggle-more-btn {
        position: absolute;
        display: inline-block;
        left: 36px;
        bottom: 10px;
        width: 60px;
        font-size: 12px;
        color: #3998FC;
        background: no-repeat center right;
        background-size: auto 9px;
    }
}
@media screen and (max-width:1366px) {
    .basic-search__col-l {
        /deep/ .el-form-item {
            width: 25%;
        }
        /deep/ .span-2 {
            width: 50%;
        }
    }
}
@media screen and (min-width:1366px) and (max-width:1920px) {
    .basic-search__col-l {
        /deep/ .el-form-item {
            width: 25%;
        }
        /deep/ .span-2 {
            width: 40%;
        }
    }
}
@media screen and (min-width:1920px) {
    .basic-search__col-l {
        /deep/ .el-form-item {
            width: 16.66%;
        }
        /deep/ .span-2 {
            width: 33.33%;
        }
    }
}
</style>
