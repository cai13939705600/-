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
            label-width="100px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="承运商编号" prop="logisticCode">
                                <el-input  v-model="dto.logisticCode" :disabled="isDisabled('logisticCode')" ref="code"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="承运商名称" prop="logisticName">
                                <el-input clearable v-model="dto.logisticName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人" prop="linkMan">
                                <el-input clearable v-model="dto.linkMan"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="联系电话" prop="linkTel">
                                <el-input clearable v-model.number="dto.linkTel"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系地址" prop="address">
                                <el-input clearable v-model="dto.address"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <el-button class="ml-20" size="small" type="primary" @click="onSaveAndGoOn" v-if="this.action === 'add'">保存并继续</el-button>
            <el-button class="ml-20" size="small" type="primary" @click="onSave">保存</el-button>
            <el-button class="ml-20" size="small" @click="handleClose">取消</el-button>
        </template>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import saveGoOn from 'biz/mixins/saveGoOn'
export default {
    mixins: [ EntityDialog ,saveGoOn],
    props: {
        logisticsCompany: Object
    },
    data () {
        return {
            rules: {
                logisticCode: [
                    { required: true, message: '请输入承运商编号', trigger: 'blur' }
                ],
                logisticName: [
                    { required: true, message: '请输入承运商名称', trigger: 'blur' }
                ],
                linkTel: [{ required: false } ,{ pattern: CNST.REG_EXP.TEL_MOBILE, message: '手机号必须为数字' }],
                address: [
                    { pattern: /^.{1,100}$/, message: '最多输入100个字符', trigger: 'blur' }
                ],
            }
        }
    },
    beforeCreate () {
        this.allFields = [
            'id', 'logisticCode', 'logisticName', 'linkMan', 'linkTel', 'address'
        ]
        this.disFields = ['logisticCode', 'expressCode']
    },
    methods: {
        onExpressChange (val) {
            this.dto.logisticCode = val
            this.dto.logisticName = this.logisticsCompany[val]
            this.$refs.form.validateField(['logisticCode', 'logisticName'])
        },
        toFront (entity) {
            const res = {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
            }
            if(res.linkTel){
                res.linkTel = Number(res.linkTel)
            } 
            return res
        },
        toEnd () {
            const res = _.pick(this.dto, this.allFields)
            if (res.expressCode) {
                res.expressName = this.logisticsCompany[res.expressCode]
            }
            return res
        },
        onSave () {
            this.handleOk()
        },
        onSaveAndGoOn () {
            this.saveAndGoOn(() => {})
            this.$refs.code.focus() 
        }
    }
}
</script>



