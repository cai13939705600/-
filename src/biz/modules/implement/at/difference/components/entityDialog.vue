<template>
    <basic-dialog
        :visible="visible"
        title="实物差异审核"
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
                            <el-form-item label="盈亏类型" prop="type">
                                <el-select disabled clearable v-model="dto.type">
                                    <el-option v-for="(item, key) of STOCK_DIFF_TYPE.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="差异数量" prop="differQty">
                                <el-input disabled clearable v-model="dto.differQty"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="调整数量" prop="adjustQty">
                                <el-input disabled clearable v-model="dto.adjustQty"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="申请调整原因" prop="adjustReason">
                                <el-input disabled clearable v-model="dto.adjustReason"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="申请调整备注" prop="adjustRemark">
                                <el-input disabled clearable v-model="dto.adjustRemark"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="16">
                            <el-form-item label="审核原因" prop="auditReason">
                                <el-input type="textarea" clearable v-model="dto.auditReason"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <shipper-sel-dlg
            :visible="shipperSelDlgVis"
            :handle-save="chooseProduct"
            :update-vis="updateShipperSelDlgVis"/>
        <template slot="ft">
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
        STOCK_DIFF_STATUS:Object,
        STOCK_DIFF_TYPE:Object
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
                auditReason: [
                    { required: true, message: '请输入审核原因' }
                ],
            }
        }
    },
    beforeCreate () {
        this.allFields = [
            'id','type', 'differQty', 'adjustQty', 'adjustReason', 'auditReason', 'adjustRemark'
        ]
        this.disFields = ['type', 'differQty','adjustQty','adjustReason','adjustRemark']
    },
    methods: {
        updateShipperSelDlgVis (vis) {
            this.shipperSelDlgVis = vis
        },
        // 选择货主返回
        chooseProduct (product) {
            //this.dto.storerId = product.name
            this.dto.storerId = product.id
            this.dto.storerName = product.name
        },
        onClickProductCode (e) {
            // TODO 打开货主查找弹出框
            this.shipperSelDlgVis = true
        },
        toFront (entity) {
            const res = {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
            }
            return res
        },
        toEnd () {
            const res = _.pick(this.dto, this.allFields)
            if(res.storerName){
                delete res.storerName
            } else {
                delete res.storerId
            }
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
            debugger
            return res
        },
        onSave () {
            this.handleOk()
        },
        onSaveAndGoOn () {
            this.saveAndGoOn(() => {})
            this.$refs.code.focus()
        },
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            console.log('关闭弹窗');   
        },
    }
}
</script>



