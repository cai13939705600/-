<template>
    <basic-dialog
        class="entity-dialog"
        :visible="visible"
        :title="action === 'add' ? '新增退货入库单' : '编辑退货入库单'"
        :width="960"
        :show-ft="showFt"
        :isModal="false"
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
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">基础信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="业务单号" prop="billCode1" label-width="102px" :rules="[
                                { required: true, message: '请输入业务单号' }
                            ]">
                                <el-input :disabled="action==='edit'" v-model="dto.billCode1"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单据类型" prop="billTypeId" label-width="102px" :rules="[
                                { required: true, message: '请选择单据类型' }
                            ]">
                                <el-select
                                    clearable
                                    v-model="dto.billTypeId">
                                    <el-option
                                        v-for="item in state.billTypes"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="原出库单" prop="billCode2" label-width="102px" :rules="[{ required: true, message: '请选择原出库单' }]">
                                <el-input :readonly="true" @focus="outSelDlgVis = true" v-model="dto.billCode2"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="仓库" prop="warehouseId" label-width="102px" :rules="[{ required: true, message: '请选择仓库' }]">
                                <el-select
                                    filterable
                                    clearable
                                    v-model="dto.warehouseId">
                                    <el-option
                                        v-for="item in storeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="预计到货时间" prop="expectedArriveTime" label-width="102px">
                                <el-date-picker
                                    v-model="dto.expectedArriveTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="货主" prop="storerName" label-width="102px">
                                <el-input v-model="dto.storerName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="项目名称" prop="itemId" label-width="102px">
                                <el-input :readonly="true" @focus="itemSelDlgVis = true" v-model="dto.projectName" placeholder=""></el-input>
                                <el-input v-show="false" v-model="dto.itemId" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="6">
                            <el-form-item label="联系人" prop="contact" label-width="102px">
                                <el-input v-model="dto.contact"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="联系电话" prop="contactNum" label-width="102px"
                                :rules="[{ pattern: CNST.REG_EXP.TEL, message: '格式不正确' }]"
                            >
                                <el-input v-model="dto.contactNum"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系地址" prop="contactAddr" label-width="102px">
                                <el-input v-model="dto.contactAddr"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="备注" prop="remark" label-width="102px"
                                :rules="[{ max: 100, message: '不能超过100个字符' }]"
                            >
                                <el-input v-model="dto.remark"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">货品信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-table
                        :data="dto.asnDetailDtoList"
                        border
                        show-summary
                        :summary-method="getSummaries"
                        style="width: 100%">
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="code"
                            label="物料编码">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="物料名称">
                        </el-table-column>
                        <el-table-column
                            prop="uom"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="spec"
                            label="规格">
                        </el-table-column>
                        <el-table-column
                            prop="quantity"
                            width="180"
                            label="数量">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.quantity'"
                                    :rules="[{ pattern: CNST.REG_EXP.NATURAL, message: '请输入正确的数量' }, { required: true, message: '请输入数量' },
                                    { validator: validatePass, min: 0, max: scope.row.outboundQty }
                                    ]"
                                >
                                    <el-input v-model="scope.row.quantity" @input="priceChange(scope.$index, scope.row)" class="quantity">
                                        <template slot="append">{{scope.row.outboundQty ?'(' + scope.row.outboundQty + ')': "" }}</template>
                                    </el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="grossWeight"
                            label="重量(kg)">
                        </el-table-column>
                        <el-table-column
                            prop="volume"
                            label="体积（cm3)">
                        </el-table-column>
                        <el-table-column
                            prop="supplierName"
                            label="供应商">
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            label="单价">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                单价(元)
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.price'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '单价最多可输入3位小数' },{ required: true, message: '请输入单价' }]"
                                >
                                    <el-input v-model="scope.row.price" @input="priceChange(scope.$index, scope.row)" :disabled="true"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="totalPrice"
                            label="金额(元)">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.totalPrice'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '金额最多可输入3位小数' },,{ required: true, message: '请输入金额' }]"
                                >
                                    <el-input v-model="scope.row.totalPrice"  :disabled="true"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="skuTechParam"
                            label="技术参数">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.skuTechParam'"
                                >
                                    <el-link type="primary" @click="checktechParam(scope.row.skuTechParam)">查看</el-link>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="remark"
                            width="180"
                            label="备注">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <el-button v-show="action === 'add'" size="small" type="primary" @click="onSaveGoOn">保存并继续</el-button>
            <el-button size="small" type="primary" @click="handleOk">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </template>
        <out-sel-dlg
            :visible="outSelDlgVis"
            :handle-save="chooseOut"
            :update-vis="updateOutSelDlgVis"/>
        <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :handle-save="chooseGoods"
            :update-vis="updateGoodsSelDlgVis"/>
        <item-sel-dlg
            :visible="itemSelDlgVis"
            :handle-save="chooseItem"
            :update-vis="updateItemSelDlgVis"/>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import ShipperSelDlg from 'biz/components/shipperSelDlg'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import OutSelDlg from 'biz/components/outSelDlg'
import { times } from 'common/filters/times' 
import ItemSelDlg from 'biz/components/itemSelDlg'
import saveGoOn from 'biz/mixins/saveGoOn'
import { mapActions, mapState } from 'vuex';
const data = { name: undefined, code: undefined, uom: undefined, spec: undefined, quantity: undefined, grossWeight: undefined, volume: undefined,supplierName: undefined,price: undefined,totalPrice: undefined,skuTechParam: undefined, remark: undefined,outboundQty:undefined}

export default {
    components: {
        GoodsSelDlg,
        OutSelDlg,
        ItemSelDlg
    },
    mixins: [ EntityDialog, saveGoOn ],
    props: {
        state: Object,
        checktechParam: Function
    },
    data () {
        return {
            // 显示供应商弹框
            supplierSelDlgVis: false,
            // 显示物料弹框
            goodsSelDlgVis: false,
            // 显示原出库单弹窗
            outSelDlgVis: false,
            // 显示项目弹框
            itemSelDlgVis: false,
            currentGoodsIndex: 0,
            CNST,
        }
    },
    watch: {
        visible: function (n) {
           if (n && this.action === 'add') {
               const user = this.$store.state.app.user
               this.dto.warehouseId = user.defaultWarehouseId
               //this.dto.warehouseName = user.defaultWarehouseName
                //this.dto.doDetailList = _.cloneDeep([data, data])
           }
           if (!n) {
               this.dto = this.toFront({ asnDetailDtoList: [] })
           } else {
               this.getStoreListAction({
                   params:{ page: { current: 1, size: 10000}, validFlag:1 }
               })
           }
        },
    },
    computed: {
        ...mapState('stock/return', ['storeList','outDetailList']),
    },
    beforeCreate () {
        this.allFields = [
            'billTypeId',
            'billCode1',
            'billCode2',
            'warehouseId',
            'expectedArriveTime',
            'storerId',
            'storerName',
            'contact',
            'contactNum',
            'projectName',
            'itemId',
            'contactAddr',
            'salesman',
            'remark',
            'id',
            {
                key: 'asnDetailDtoList',
                default: () => ([_.cloneDeep(data)])
            },
            {
                key: 'infSource',
                default: 1
            }
        ]
        this.disFields = []
    },
    mounted(){
        console.log(this,'skdjfkadjaksjdfadsjka');
        
    },
    methods: {
        ...mapActions('stock/return', ['getStoreListAction','getOutDetailListAction']),
        toFront (entity) {
            const res = {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
            }
            if(!_.isEmpty(entity)){
                res.asnDetailDtoList= entity.asnDetailDtoList;
            }
            if(res.stName){
                res.storerName = res.stName
            }
            if(res.spName){
                res.supplierName = res.spName
            }
            if(res.whName){
                res.warehouseName = res.whName
            }
            return res
        },
        // 原出库单弹框隐藏方法
        updateOutSelDlgVis (vis) {
            this.outSelDlgVis = vis
        },
        // 单价改变
        priceChange(index,row){
            //如果数量和单价都有值---则自动计算金额的值，否则可编辑
            if(row.quantity && row.price){
                row.totalPrice =  (row.quantity*row.price).toFixed(3)
            }
        },
        // 选择原出库单返回
        chooseOut (data) {
            this.dto.billCode2 = data.code
            this.dto.storerName = data.storerName
            this.dto.storerId = data.storerId //'1169874728386637825'
            this.dto.contact = data.consignee
            this.dto.contactNum = data.mobile
            this.dto.contactAddr = data.address
            //调用根据出库id查明细接口，查询物料表明细信息
            this.getOutDetailListAction({
                params: {id : data.id},
                //成功回调函数
                cb: () => {
                    //循环遍历outDetailList给asnDetailDtoList赋值
                    this.dto.asnDetailDtoList = this.outDetailList.map(item => {
                        return {
                            code: item.sku.code,
                            id: item.skuId,
                            name: item.sku.name,
                            uom: item.sku.uom,
                            spec: item.sku.spec,
                            price: item.price,
                            totalPrice: item.totalPrice,
                            skuTechParam: item.sku.techParam,
                            quantity: item.quantity,
                            supplierName: item.sku.supplierName,
                            outboundQty:item.outboundQty,
                            grossWeight: item.weight,
                            volume: item.volume,
                            remark: item.remark
                        }
                    })
                }
            })
        },
        // 选择物料图标点击回调
        chooseGoodsIconClick (index) {
            this.currentGoodsIndex = index;
            this.updateGoodsSelDlgVis(true)
        },
        // 物料弹框隐藏方法
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        // 选择物料返回
        chooseGoods (data) {
            data.quantity = undefined
            data.remark = undefined
            data.skuId = data.id
            this.dto.asnDetailDtoList.splice(this.currentGoodsIndex, 1, data)
        },
        // 项目弹窗隐藏方法
        updateItemSelDlgVis (vis) {
            this.itemSelDlgVis = vis
        },
        // 选择项目返回
        chooseItem (data) {
            this.dto.itemId = data.id
            this.dto.projectName = data.name
            //this.dto.projectCode = data.code
        },
        // 合计
        getSummaries (param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                switch (index) {
                    case 5:
                    case 6:
                    case 7:
                    case 10:
                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            if (sums[index] > 999999999999999) {
                                sums[index] = '数值过大'
                            }
                        } else {
                            sums[index] = ' ';
                        }
                        break;
                    default:
                        sums[index] = '';
                        break;
                }
            });
            return sums;
        },
        toEnd () {
            const data = _.pick(this.dto, this.allFields.map(field => {
                if (typeof field === 'object') {
                    return field.key
                }
                return field
            }))
            data.asnDetailDtoList = data.asnDetailDtoList.map((item, index) => {
                return {
                    //lineNo: index + 1,
                    skuId: item.id,
                    expectQty: item.quantity,
                    uom: item.uom,
                    remark: item.remark,
                    price: item.price,
                    amount: item.totalPrice
                }
            })
            // 判断是新建还是修改，修改的时候不传infSource字段
            if(this.action === 'edit'){
                delete data.infSource
            }
            return data
        },
        onSaveGoOn () {
            this.saveAndGoOn(() => {
                ['storerName', 'warehouseName', 'supplierName'].forEach(key => {
                    this.dto[key] = undefined
                })
                this.dto.asnDetailDtoList = [_.cloneDeep(data)]
            })
        },
        handleOk () {
            if (!this.$refs.form) {
                return
            }
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                let params = this.toEnd()
                // 判断出库明细列表里的数量是否全部为0 如果都为0 则提示数量不能全部为0
                let result = params.asnDetailDtoList.every(
                    function(item){
                        return item.expectQty == 0 
                    }
                )
                if(result){
                    this.$message.error("数量不能全部为0")
                }else{
                    this.handleSave(params, () => {
                    this.handleClose()
                    this.queryList()
                }, this.action)
                }
            })
        },
        // 表单验证
        validatePass (rule, value, callback) {
            const min = rule.min
            const max = rule.max
            value = Number(value)
            if (value >= min && value <= max) {
                callback();
            } else {
                if (value < min) {
                    callback(new Error('不能小于0'));
                } else if(value > max){
                    callback(new Error('不能大于收货数量'));
                }
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
// 变成新样式
.entity-dialog {
    width: 100%;
    height: calc(100vh - 130px);
    -webkit-box-sizing: border-box;
    // box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 0;
    z-index: 10;
    background-color: #fff;
    padding-bottom: 0;
    /deep/ .el-dialog {
        margin-top: 0 !important;
        width: 100% !important;
        height: calc(100vh - 130px);
        margin-bottom: 0;
    }
    /deep/ .el-dialog__footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding-top: 20px;
        z-index: 200;
        background: #ffffff;
    }
    /deep/ .el-form {
        padding-bottom: 150px;
    }
    /deep/ .el-dialog:not(.is-fullscreen) .scrollbar__wrap--bd {
        max-height: calc(110vh - 200px)!important;
    }
    /deep/ .el-input-group__append {
        background: #ffffff;
        border:0
    }
}
.quantity{
    /deep/ .el-input__inner{
        text-align: left!important;
        margin-left:-15px!important;
    }
}
</style>




