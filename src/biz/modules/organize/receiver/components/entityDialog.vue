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
                            <el-form-item label="客户编号" prop="code">
                                <el-input clearable v-model="dto.code" :disabled="this.action === 'edit'" ref="code"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="客户名称" prop="name">
                                <el-input clearable v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所属货主" prop="storerId" 
                                :rules="[{ required: true, message: '请选择货主' }]" 
                                label-width="102px">
                                <el-input :readonly="true" @focus="shipperSelDlgVis = true" v-model="dto.storerName"></el-input>
                                <el-input v-show="false" v-model="dto.storerId"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="联系人" prop="contact">
                                <el-input clearable v-model="dto.contact"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系电话" prop="telephone">
                                <el-input clearable v-model.number="dto.telephone"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="省"
                                prop="province">
                                <city-select ref="province" clearable v-model="dto.province"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="市" prop="city">
                                <city-select clearable v-model="dto.city" :level="2" :parent-id="dto.province"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="区" prop="district">
                                <city-select clearable v-model="dto.district" :level="3" :parent-id="dto.city"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="联系地址" prop="address">
                                <el-input clearable v-model="dto.address"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <shipper-sel-dlg
            :visible="shipperSelDlgVis"
            :handle-save="chooseShipper"
            :update-vis="updateShipperSelDlgVis"/>
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
import CitySelect from 'biz/components/citySelect'
import ShipperSelDlg from 'biz/components/shipperSelDlg'
export default {
    mixins: [ EntityDialog, saveGoOn],
    props: {
        
    },
    components: {
        ShipperSelDlg,
        CitySelect
    },
    data () {
        return {
            //货主弹窗是否显示
            shipperSelDlgVis: false, 
            rules: {
                code: [
                    { required: true, message: '请输入客户编号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入客户名称', trigger: 'blur' }
                ],
                storerName: [
                    { required: true, message: '请输入所属货主', trigger: 'blur' }
                ],
                contact: [
                    { required: true, message: '请输入联系人', trigger: 'blur' }
                ],
                telephone: [
                    { required: true , message: '请输入联系电话', trigger: 'blur'} ,{ pattern: CNST.REG_EXP.TEL_MOBILE, message: '手机号必须为数字' }
                ],
                address: [
                    { required: true, message: '请输入联系地址', trigger: 'blur' }
                ]
            }
        }
    },
    beforeCreate () {
        this.allFields = [
            'id', 'code', 'name', 'storerName', 'storerId', 'contact', 'telephone', 'province', 'city', 'district', 'address'
        ]
        this.disFields = ['logisticCode', 'expressCode']
    },
    methods: {
        // 货主弹框隐藏方法
        updateShipperSelDlgVis (vis) {
            this.shipperSelDlgVis = vis
        },
        // 选择货主返回
        chooseShipper (data) {
            this.dto.storerId = data.id
            this.dto.storerName = data.name
        },
        toFront (entity) {
            const res = {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
            }
            if (res.telephone) {
                res.telephone = Number(res.telephone)
            }
            return res
        },
        toEnd () {
            const res = _.pick(this.dto, this.allFields)
            if (res.province) {
                res.provinceId = res.province
                delete res.province
            }
            if (res.city) {
                res.cityId = res.city
                delete res.city
            }
            if (res.district) {
                res.districtId = res.district
                delete res.district
            }
            if(res.id === undefined){
                delete res.id
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



