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
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">库区</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="库区编号" prop="code">
                                <el-input v-model="dto.code" :disabled="action === 'edit'" placeholder="请输入库区编号" ref="code"/>
                                <el-input v-show="false" v-model="dto.id"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库区名称" prop="name" placeholder="请输入库区名称">
                                <el-input v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="备注" prop="remark" placeholder="请输入备注">
                                <el-input v-model="dto.remark"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <el-button v-show="action !== 'edit'" class="ml-30" size="small" type="primary" @click="proxyAddOrRemoveArguments();onSaveAndGoOn();">保存并继续</el-button>
            <el-button size="small" type="primary" @click="proxyAddOrRemoveArguments();handleOk();">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </template>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import saveGoOn from 'biz/mixins/saveGoOn'
export default {
    mixins: [ EntityDialog, saveGoOn ],
    props: {
        libraries: {
            type: Array,
            default: () => ([])
        }
    },
    data () {
        return {
            rules: {
                code: [
                    {
                        required: true,
                        message: '请输入库区编号',
                        trigger: 'blur'
                    }
                ],
                name: [
                    {
                        required: true,
                        message: '请输入库区名称',
                        trigger: 'blur'
                    }
                ],
            }
        }
    },
    beforeCreate () {
        this.allFields = [
            'id', 'code', 'name', 'remark'
        ]
        this.disFields = []
    },
    methods: {
        proxyAddOrRemoveArguments () {
             if (this.action === 'edit') {
                this.allFields = [
                    'id', 'name', 'remark'
                ]
            } else {
                this.allFields = [
                    'id', 'code', 'name', 'remark'
                ]
            }
        },
        onSaveAndGoOn (){
            this.saveAndGoOn(() => {})
            this.$refs.code.focus()
        }
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



