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
        <el-form
            ref="form"
            size="small"
            label-position="right"
            label-width="80px"
            :model="dto"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">是否确认取消收货</span>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <el-button size="small" type="primary" @click="handleOk">确认</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </template>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
export default {
    mixins: [ EntityDialog],
    props: {
        
    },
    data () {
        return {
            
        }
    },
    beforeCreate () {
        this.allFields = [
            'code', 'name', 'remark'
        ]
        this.disFields = []
    },
    methods: {
    }
}
</script>
<style scoped>
    .result_count {
        line-height: 32px;
    }
    .ml-30 {
        margin-left: 30px;
    }
    .mr-30 {
        margin-right: 30px;
    }
    .tips-sub {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
</style>



