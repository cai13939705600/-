<template>
    <basic-dialog
        class="myDialog"
        :visible="visible"
        :title="'修改密码'"
        :width="375"
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
            :rules="rules"
            @submit.native.prevent>
                <div class="entity-dlg__block-bd">
                    <!-- <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item label="手机号">
                                <strong class="el-link el-link--primary">{{ user.mobile }}</strong>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="昵称">
                                <strong class="el-link el-link--primary">{{ user.name }}</strong>
                            </el-form-item>
                        </el-col>
                    </el-row> -->
                    <el-form-item label="原密码" prop="password">
                        <el-input type="password" v-model="dto.password"/>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                        <el-input type="password" v-model="dto.newPassword"/>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="dto.checkPass"/>
                    </el-form-item>
                </div>
        </el-form>
        <template slot="ft">
            <el-button size="mini" type="primary" @click="onSave">保存</el-button>
            <!-- <el-button size="mini" type="primary" @click="onReset">重置</el-button> -->
            <el-button size="mini" @click="handleClose">取消</el-button>
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
        proxyAction: Function,
        user: {
            type: Object,
            default: () => {}
        },
        closeChangeDlg:Function
    },
    data () {
        return {
            rules: {
                password: [
                    { required: true, message: '请输入原始密码', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    // { max: 8, message: '账号名称不能大于8位', trigger: 'blur' }
                     { validator: this.validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    // { pattern: /^1[356789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
                    { validator: this.validatePass1, trigger: 'blur' }
                ]
            },
            dto: {
                password: '',
                newPassword: '',
                checkPass: ''
            }
        }
    },
    beforeCreate () {
        this.allFields = [ 'password', 'newPassword', 'checkPass' ]
        this.disFields = []
    },
    watch:{
        'visible' (val){
            if(val){
                this.dto={
                    password: '',
                    newPassword: '',
                    checkPass: ''
                }
            }
        }
    },
    methods: {
        handleClose () {
            this.closeChangeDlg()
        },
        validatePass (rule, value, callback) {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.dto.checkPass !== '') {
                    this.$refs.form.validateField('checkPass');
                }
                callback();
            }
        },
        validatePass1 (rule, value, callback) {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.dto.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        },
        onSave () {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                this.proxyAction({
                    data: {
                        id: this.user.id,
                        password: this.dto.password,
                        newPassword: this.dto.checkPass
                    },
                    cb: () => {
                        this.dto = {
                            password: '',
                            newPassword: '',
                            checkPass: ''
                        }
                    }
                }, false)
            })
        },
        onReset () {
            this.proxyAction({ action: 'resetPwd', data: {
                id: this.user.id,
                mobile: this.user.mobile
            }}, false)
        }
    }
}
</script>

<style lang="scss" scoped>
.myDialog {
    /deep/ .el-icon-more {
        cursor: pointer;
    }
    /deep/ .el-dialog .scrollbar__view--bd {
        padding: 0px!important;
    }
    /deep/ .el-form-item__content{
        width: 240px;
        height: 32px;
    }
}
</style>



