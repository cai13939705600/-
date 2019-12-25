<template>
    <basic-dialog
        :visible="visible"
        :title="action === 'add' ? '角色/新增角色' : '角色/编辑角色'"
        :width="1000"
        :show-ft="showFt"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <!-- 以下左右分角色组件 -->
        <roleInfoDlg
            ref="dataDialog"
            :action="action"
            :state="state"
            :ROLE_TYPE="ROLE_TYPE"
            :entity="state.entity"
            :update-vis="updateVis"
            :handle-save="handleSave"
            :handle-closed="handleClosed"
            :handle-close="handleClose"
            :query-list="queryList"/>
        <el-form slot="ft">
            <el-button v-show="action === 'add'" size="small" type="primary" @click="onSaveGoOn">保存并继续</el-button>
            <el-button size="small" type="primary" @click="onSave">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </el-form>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import RoleInfoDlg from './roleInfoDlg'
export default {
    components: {
        RoleInfoDlg
    },
    mixins: [ EntityDialog ],
    props: {
        state: Object,
        ROLE_TYPE: Object,
        handleSave: Function,
    },
    data () {
        return {
            rules: {},
        }
    },
    beforeCreate () {
        this.allFields = [ 'code', 'name', 'shortName', 'skuNo1', 'brandName', 'spec', 'barcode' ]
        this.disFields = []
    },

    methods: {
        onSaveGoOn () {
            this.$refs.dataDialog.onSaveGoOn()
        },
        onSave () {
            this.$refs.dataDialog.onSave()
        },
        //重写关闭
        handleClose(){
            this.updateVis(false)
            this.$refs.dataDialog.$refs.form.clearValidate()
            this.$refs.dataDialog.wareHourseEdit=''
            this.$refs.dataDialog.storeEdit=''
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



