<template>
    <basic-dialog
        :visible="visible"
        title="账务差异审核"
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
                            <el-form-item label="差异数量" prop="diffQty">
                                <el-input disabled clearable v-model="dto.diffQty"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="调整数量" prop="adjustQty">
                                <el-input disabled clearable v-model="dto.adjustQty"/>
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
            <div class="entity-dlg__block-bd">
                    <el-table
                        :data="dto.stockFinances"
                        border
                        style="width: 100%">
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="skuCode"
                            label="物料编码"
                            align="center"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="skuName"
                            align="center"
                            width="180"
                            label="物料名称">
                        </el-table-column>
                        <el-table-column
                            prop="skuSpec"
                            align="center"
                            width="180"
                            label="规格型号">
                        </el-table-column>
                        <el-table-column
                            prop="skuUom"
                            align="center"
                            width="180"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="skuTechParam"
                            width="80"
                            align="center"
                            label="技术参数">
                            <template  slot-scope="scope">
                                <el-form-item label="" label-width="0">
                                    <el-link type="primary" @click="checktechParam(scope.row.skuTechParam)">查看</el-link>
                                    <!-- <el-input v-model="scope.row.skuTechParam"/> -->
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="supplierName"
                            align="center"
                            width="180"
                            label="供应商">
                        </el-table-column>
                        <el-table-column
                            prop="qty"
                            align="center"
                            label="库存数量">
                        </el-table-column>
                        <el-table-column
                            prop="adjustQty"
                            align="center"
                            label="调整数量">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'stockFinances.' + scope.$index + '.adjustQty'"
                                >
                                    <el-input v-model="scope.row.adjustQty"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            width="180"
                            align="center"
                            label="单价(元)">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'stockFinances.' + scope.$index + '.price'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '单价最多可输入3位小数' }]"
                                >
                                    <el-input v-model="scope.row.price"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="totalPrice"
                            width="180"
                            align="center"
                            label="金额(元)">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'stockFinances.' + scope.$index + '.totalPrice'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '金额最多可输入3位小数' }]"
                                >
                                    <el-input v-model="scope.row.totalPrice"  :disabled="action=='view'"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="availableQty"
                            width="180"
                            align="center"
                            label="可用数量">
                        </el-table-column>
                        <el-table-column
                            prop="assignQty"
                            width="180"
                            align="center"
                            label="分配数量">
                        </el-table-column>
                        <el-table-column
                            prop="putAwayQty"
                            width="180"
                            align="center"
                            label="待上架数量">
                        </el-table-column>
                        <el-table-column
                            prop="itemName"
                            width="180"
                            align="center"
                            label="项目名称">
                        </el-table-column>
                        <el-table-column
                            prop="warehouseName"
                            width="180"
                            align="center"
                            label="仓库名称">
                        </el-table-column>
                        <el-table-column
                            prop="inboundDate"
                            width="180"
                            align="center"
                            label="入库日期">
                        </el-table-column>
                        <el-table-column
                            prop="modifier"
                            width="180"
                            align="center"
                            label="修改人">
                        </el-table-column>
                        <el-table-column
                            prop="modifiedTime"
                            width="180"
                            align="center"
                            label="修改时间">
                        </el-table-column>
                    </el-table>
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
        STOCK_DIFF_TYPE:Object,
        id: {
            type: [Number, String],
            default: 0
        },
        checktechParam: Function
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
                    { required: true, message: '请输入审核原因' ,triggle:'blur'}
                ],
            },
            CNST
        }
    },
    watch:{
        'visible' (val){
            if(val){
                console.log('sadsadsa',this.dto)
                api.stock.stockFinanceDiff({id:this.id}).then(({head,body})=>{
                    if(body){
                        this.dto.type = Number(body.type)
                        this.dto.adjustQty = body.adjustQty
                        this.dto.diffQty = body.diffQty
                        this.dto.stockFinances = body.stockFinances
                    }
                })
            }
        }
    },
    beforeCreate () {
        this.allFields = [
            'id','type', 'diffQty', 'adjustQty',  'auditReason', {key:'stockFinances',default:[]}
        ]
        this.disFields = ['type', 'diffQty','adjustQty','adjustReason']
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
             var params = {
                id: this.id,
                adjustQty: this.dto.adjustQty,
                diffQty: this.dto.diffQty,
                type: this.dto.type,
                stockFinanceDiffAdjusts: this.dto.stockFinances
            }
             this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                 api.stock.auditDiff(params).then(({head,body})=>{
                    if(head.code==200){
                        this.$message.success(head.subMessage)
                        this.updateVis(false)
                        this.queryList()
                    }else{
                        this.$message.error(head.subMessage)
                    }
                })
            })
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



