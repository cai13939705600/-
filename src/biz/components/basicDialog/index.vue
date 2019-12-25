<template>
    <el-dialog
        class="basic-dialog"
        :class="{'has-ft': showFt}"
        :visible="visible"
        :title="title"
        :modal="isModal"
        :modalAppendToBody="modalAppendToBody"
        :width="realWidth"
        :fullscreen="fullscreen"
        :append-to-body="appendToBody"
        :close-on-click-modal="closeOnClickModal"
        @close="handleClose"
        @closed="handleClosed">
        <el-scrollbar class="scrollbar--bd" wrap-class="scrollbar__wrap--bd" view-class="scrollbar__view--bd">
            <slot></slot>
        </el-scrollbar>
        <div slot="footer" class="basic-dialog-ft" v-if="showFt">
            <slot name="ft">
                <el-button size="small" type="primary" @click="handleOk">{{okText}}</el-button>
                <el-button size="small" @click="handleClose">{{closeText}}</el-button>
            </slot>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: Boolean,
        title: String,
        showFt: {
            type: Boolean,
            default: true
        },
        width: {
            type: [ Number, String ],
            default: 802
        },
        fullscreen: {
            type: Boolean,
            default: false
        },
        appendToBody: {
            type: Boolean,
            default: false
        },
        closeOnClickModal: {
            type: Boolean,
            default: false
        },
        closeText: {
            type: String,
            default: '取消'
        },
        okText: {
            type: String,
            default: '保存'
        },
        handleClose: {
            type: Function,
            default: () => {}
        },
        handleClosed: {
            type: Function,
            default: () => {}
        },
        handleOk: {
            type: Function,
            default: () => {}
        },
        isModal: {
            type: Boolean,
            default: true
        },
        modalAppendToBody: {
            type: Boolean,
            default: true
        },
    },
    computed: {
        realWidth () {
            if (typeof this.width === 'number') {
                return this.width + 'px'
            } else {
                return this.width
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.basic-dialog {
    /deep/ .el-dialog__body {
        padding: 0;
    }
    /deep/ .entity-dlg__block {
        margin-bottom: 10px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    /deep/ .entity-dlg__block-hd {
        margin-bottom: 20px;
        font-size: 13px;
    }
    /deep/ .entity-dlg__hd-line {
        display: inline-block;
        margin-right: 10px;
        width: 3px;
        height: 16px;
        vertical-align: middle;
        border-radius: 3px;
        background: #4186f6;
    }
    /deep/ .entity-dlg__hd-title {
        vertical-align: middle;
        color: #3f4656;
    }
}
.basic-dialog-ft {
    text-align: center;
    .el-button + .el-button {
        margin-left: 30px;
    }
}
</style>
