<template>
    <basic-dialog
        title="批量替换子件"
        width="80%"
        :visible="visible"
        :handle-close="handleClose"
        :handle-closed="handleClosed">
        <div class="entity-dlg__block">
            <div class="entity-dlg__block-hd">
                <span class="entity-dlg__hd-line"></span>
                <span class="entity-dlg__hd-title">原组合装子件物料</span>
            </div>
            <div class="entity-dlg__block-bd">
                <old-sub/>
            </div>
        </div>
        <div class="entity-dlg__block">
            <div class="entity-dlg__block-hd">
                <span class="entity-dlg__hd-line"></span>
                <span class="entity-dlg__hd-title">新组合装子件物料</span>
            </div>
            <div class="entity-dlg__block-bd">
                <new-sub/>
            </div>
        </div>
    </basic-dialog>
</template>

<script>
import BasicDialog from 'biz/components/basicDialog'
import oldSub from './oldSub'
import newSub from './newSub'
export default {
    components: {
        BasicDialog,
        oldSub,
        newSub
    },
    props: {
        visible: Boolean,
        updateVis: Function
    },
    data () {
        return {
            goodsSelDlgVis: false
        }
    },
    methods: {
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {

        }
    }
}
</script>

<style lang="scss" scoped>
.basic-dialog {
    /deep/ .el-table__empty-block {
        height: 180px;
        background-size: auto 70%;
    }
    /deep/ .basic-list {
        padding-top: 0;
    }
    /deep/ .basic-list__hd-col--l {
        width: 50%;
    }
    /deep/ .el-icon-more {
        cursor: pointer;
    }
}
.entity-dlg__block {
    &:first-child {
        margin-bottom: 25px;
    }
}
</style>


