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
                            <el-form-item label="货主编号" prop="code">
                                <el-input clearable v-model="dto.code" :disabled="this.action === 'edit'" ref="code"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="货主名称" prop="name">
                                <el-input clearable v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人" prop="contact">
                                <el-input clearable v-model="dto.contact"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="联系电话" prop="phone">
                                <el-input clearable v-model.number="dto.phone"/>
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
    mixins: [ EntityDialog, saveGoOn],
    props: {
        
    },
    data () {
        return {
            rules: {
                code: [
                    { required: true, message: '请输入货主编号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入货主名称', trigger: 'blur' }
                ],
                phone: [{ required: false } ,{ pattern: CNST.REG_EXP.TEL_MOBILE, message: '手机号必须为数字' }]
            }
        }
    },
    beforeCreate () {
        this.allFields = [
            'id', 'code', 'name', 'contact', 'phone', 'address'
        ]
        this.disFields = ['logisticCode', 'expressCode']
    },
    methods: {
        toFront (entity) {
            const res = {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
            }
            if(res.phone){
                res.phone = Number(res.phone)
            }
            return res
        },
        toEnd () {
            const res = _.pick(this.dto, this.allFields)
            return res
        },
        onSave () {  
            this.handleOk()
        },
        onSaveAndGoOn () {
            this.saveAndGoOn(() => {})
            this.$refs.code.focus()
        },
        handleClosed () {
            this.updateState('entity')
            if (this.$refs.form) {
                this.$nextTick(() => {
                    this.$refs.form.resetFields()
                })
            }
        },
    }
}
</script>



