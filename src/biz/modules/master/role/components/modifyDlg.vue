<template>
    <basic-dialog
        :visible="visible"
        :title="title"
        :width="960"
        :show-ft="showFt"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <!-- 以下左右分角色组件 -->
        <roleInfoDlg/>
    </basic-dialog>
</template>

<script>
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import EntityDialog from 'biz/mixins/entityDialog'
import RoleInfoDlg from './roleInfoDlg'
export default {
    components: {
        GoodsSelDlg,
        RoleInfoDlg
    },
    mixins: [ EntityDialog ],
    props: {

    },
    data () {
        return {
            rules: {},
            goodsSelDlgVis: false
        }
    },
    beforeCreate () {
        this.allFields = [ 'code', 'name', 'shortName', 'skuNo1', 'brandName', 'spec', 'barcode' ]
        this.disFields = []
    },
    methods: {
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        handleEnterKeyUp () {
            this.updateGoodsSelDlgVis(true)
        }
    }
}
</script>

<style lang="scss" scoped>
.basic-dialog {
    /deep/ .el-icon-more {
        cursor: pointer;
    }
}
</style>
