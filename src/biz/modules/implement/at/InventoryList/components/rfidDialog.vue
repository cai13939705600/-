<template>
    <basic-dialog
        :visible="visible"
        :title="'RFID查看'"
        :width="490"
        :show-ft="false"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form
            class="myForm"
            ref="form"
            size="small"
            label-position="right"
            label-width="80px"
            @submit.native.prevent>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="盘点单">
                            <el-input v-if="rowEntity.countNo" v-model="rowEntity.countNo" placeholder="" :readonly="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="实盘数量">
                            <el-input v-if="tableData.length" v-model="tableData.length" placeholder="" :readonly="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-table
                    ref="singleTable"
                    :data="tableData"
                    border
                    highlight-current-row
                    style="width: 100%">
                    <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    property="rfidCode"
                    align="center"
                    label="RFID编码"
                    width="348">
                    </el-table-column>
                </el-table>
        </el-form>
    </basic-dialog>
</template>
<script>
import EntityDialog from 'biz/mixins/entityDialog'
export default {
    components: {
        
    },
    mixins: [ EntityDialog ],
    props: {
        tableData:{
            type: Array,
            default () {
                return []
            }
        },
        rowEntity: {
            type: Object,
            default(){
                return {
                    countNo:''
                }
            }
        },
    },
    data () {
        return {
            
        }
    },
    watch: {
        
    },
    beforeCreate () {
        
        
    },
    created(){
        
    },
    methods: {
       
    }
}
</script>

<style lang="scss" scoped>
.basic-dialog {
    /deep/ .el-icon-more {
        cursor: pointer;
    }
    /deep/ .el-input__inner{
        border: 1px solid transparent;
    }
}

</style>



