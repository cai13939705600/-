<template>
    <basic-dialog
        :visible="visible"
        :title="action === 'add' ? '新建账号' : '编辑账号'"
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
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="账号编号" prop="loginName">
                                <el-input :disabled="action==='edit'" v-model="dto.loginName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="账号名称" prop="name">
                                <el-input v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="账户类型" prop="type">
                                <el-select
                                    v-model="dto.type"
                                    filterable
                                    placeholder="请选择">
                                    <el-option
                                        v-for="item in USER_TYPE.array"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="手机号">
                                <el-input v-model="dto.mobile"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="备注" prop="remarks">
                                <el-input v-model="dto.remarks"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
        </el-form>
        <template slot="ft">
            <el-button v-show="action === 'add'" size="small" type="primary" @click="saveAndGoOn">保存并继续</el-button>
            <el-button size="small" type="primary" @click="handleOk">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </template>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import saveGoOn from 'biz/mixins/saveGoOn'

export default {
    components: {
    },
    mixins: [ EntityDialog, saveGoOn ],
    props: {
        //账号类型
        USER_TYPE:Object,
    },
    data () {
        return {
            rules: {
                loginName: [
                    { required: true, message: '请输入账号编号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入账号名称', trigger: 'blur' },
                    // { max: 8, message: '账号名称不能大于8位', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1[356789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                ],
                type:[
                    {required: true, message: '请选择账户类型',}
                ]
            }
        }
    },
    beforeCreate () {
        this.allFields = [ 'loginName', 'name', 'mobile', 'remarks', 'id' ,{ key: 'type', default:2 }]
        this.disFields = []
    },
    methods: {
        handleClose() {
            this.updateVis(false)
            this.$refs.form.clearValidate()
        },
    }
}
</script>

<style lang="scss" scoped>
.basic-dialog {
    /deep/ .el-cicon-more {
        cursor: pointer;
    }
}
</style>



