<template>
    <basic-dialog
        :visible="visible"
        :title="'切换仓库'"
        :width="600"
        :show-ft="showFt"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form
            ref="form"
            size="mini"
            label-position="right"
            label-width="90px"
            :model="dto"
            @submit.native.prevent>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item label="仓库" prop="warehouseId">
                                <el-select
                                    filterable
                                    remote
                                    placeholder="请输入仓库"
                                    value-key="code"
                                    v-model="dto.warehouseId">
                                    <el-option v-for="opt of whses" :key="opt.code" :label="opt.name" :value="opt.id"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
        </el-form>
        <template slot="ft">
            <el-button size="small" type="primary" @click="chgWhse">确认</el-button>
        </template>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'

export default {
    components: {
    },
    mixins: [ EntityDialog],
    props: {
        
    },
    beforeCreate () {
        this.allFields = [ 'warehouseId']
        this.disFields = []
    },
    computed: {
        /* app() {
            return this.$store.state.app
        }, */
    },
    data () {
        return {
            whse: {},
            whses: [],
        }
    },
    watch: {
        visible: function (n) {
           if (n) {
               const user = this.$store.state.app.user
               this.dto.warehouseId= user.defaultWarehouseId
           }
        }
    },
    mounted () {
        this.queryWhses()
    },
    methods: {
        handleClosed () {
            this.dto.warehouseId = undefined
        },
        queryWhses () {
            this.$store.dispatch('app/queryWhses').then((data) => {
                this.whses = data
            })
        },
        chgWhse () {
            if(!_.isEmpty(this.dto.warehouseId)){
                api.user.changeWarehouse({
                    id: this.dto.warehouseId
                }).then(({head,body,messaage})=>{
                    if(head.code==200){
                        sessionStorage.setItem("subMessage", head.subMessage)
                        //this.$message.success(head.subMessage)
                        window.location.reload()
                    }else{
                        this.$message.error(head.subMessage);
                    }
                })
            }else{
                this.$message.error('请先选择仓库')
            }
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