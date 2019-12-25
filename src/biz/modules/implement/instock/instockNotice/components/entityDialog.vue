<template>
    <basic-dialog
        class="entity-dialog"
        :visible="visible"
        :title="title"
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
                            <el-form-item label="货主" prop="storerId" 
                                :rules="[{ required: true, message: '请选择货主' }]" 
                                label-width="102px">
                                <el-input :readonly="true" @focus="shipperSelDlgVis = true" v-model="dto.storerName" :disabled="action=='view'"></el-input>
                                <el-input v-show="false" v-model="dto.storerId" :disabled="action=='view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单据类型" prop="billTypeId" 
                                :rules="[{ required: true, message: '请选择单据类型' }]"
                                label-width="102px">
                                <el-select
                                    clearable
                                    :disabled="action=='view'"
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
                            <el-form-item label="业务单号" prop="billCode1" 
                                :rules="[{ required: true, message: '请输入业务单号' }]"
                                label-width="102px">
                                <el-input :disabled="action==='edit' || action==='view'" v-model="dto.billCode1"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="仓库" prop="warehouseId" label-width="102px" :rules="[{ required: true, message: '请选择仓库' }]">
                                <el-select
                                    filterable
                                    clearable
                                    :disabled="action=='view'"
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
                            <el-form-item label="业务员" prop="salesman" label-width="102px">
                                <el-input v-model="dto.salesman" :disabled="action=='view'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="预计到货时间" prop="expectedArriveTime" label-width="102px">
                                <el-date-picker
                                    :disabled="action=='view'"
                                    v-model="dto.expectedArriveTime"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm"
                                    value-format="yyyy-MM-dd HH:mm">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="供应商" prop="supplierId" label-width="102px">
                                <el-input :readonly="true" @focus="supplierSelDlgVis = true" v-model="dto.supplierName" :disabled="action=='view'"></el-input>
                                <el-input v-show="false" v-model="dto.supplierId" :disabled="action=='view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="项目名称" prop="projectName" label-width="102px" :rules="itemRule">
                                <el-input :readonly="true" @focus="itemSelDlgVis = true" v-model="dto.projectName" placeholder="" :disabled="action=='view'"></el-input>
                                <el-input v-show="false" v-model="dto.itemId" placeholder="" :disabled="action=='view'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="项目编号" prop="projectCode" label-width="102px">
                                <el-input v-model="dto.projectCode" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同编号" prop="contractCode" label-width="102px">
                                <el-input v-model="dto.contractCode" :disabled="action=='view'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="发票号" prop="ticketCode" label-width="102px">
                                <el-input v-model="dto.ticketCode" :disabled="action=='view'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单项工程" prop="singleProject" label-width="102px">
                                <el-input v-model="dto.singleProject" :disabled="action=='view'"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24" v-show="action==='view'">
                        <el-col :span="6">
                            <el-form-item label="总金额(元)" prop="totalAmount" label-width="102px">
                                <el-input v-model="dto.totalAmount" :disabled="action=='view'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="总税额(元)" prop="totalTax" label-width="102px">
                                <el-input v-model="dto.totalTax" :disabled="action=='view'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="总价税合计(元)" prop="totalPriceTax" label-width="102px">
                                <el-input v-model="dto.totalPriceTax" :disabled="action=='view'"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item label="备注" prop="remark" label-width="102px"
                                :rules="[{ max: 100, message: '不能超过100个字符' }]">
                                <el-input v-model="dto.remark" :disabled="action=='view'"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">货品信息</span>
                    &emsp;
                    <el-button v-if="action==='add' || action==='edit'" @click="addGoods" type="primary" icon="el-icon-plus" size="mini"></el-button>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-table
                        :data="dto.asnDetailDtoList"
                        border
                        show-summary
                        :summary-method="getSummaries"
                        style="width: 100%">
                        <el-table-column
                            fixed="left"
                            label="操作"
                            align="center"
                            width="60">
                            <template slot-scope="scope">
                                <el-button
                                    @click.native.prevent="deleteRow(scope.$index, dto.asnDetailDtoList)"
                                    :disabled="action=='view'"
                                    type="text"
                                    size="small">
                                    删除
                                </el-button>
                            </template>
                            </el-table-column>
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="id"
                            label="物料编码"
                            align="center"
                            width="180">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                物料编码
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.id'"
                                :rules="[
                                    { required: true, message: '请输入选择物料' }
                                ]">
                                    <el-input :disabled="!dto.storerId || action==='view'" @focus="chooseGoodsIconClick(scope.$index)" v-model="scope.row.code" :readonly="true"/>
                                    <el-input v-show="false" v-model="scope.row.id"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            align="center"
                            width="180"
                            label="物料名称">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                物料名称
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="uom"
                            align="center"
                            label="单位">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                单位
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="spec"
                            align="center"
                            width="180"
                            label="规格">
                        </el-table-column>
                        <el-table-column
                            prop="quantity"
                            width="180"
                            align="center"
                            label="数量">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                数量
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.quantity'"
                                    :rules="[{ pattern: CNST.REG_EXP.NATURAL, message: '请输入正确的数量' }, { required: true, message: '请输入数量' }]"
                                >
                                    <el-input v-model="scope.row.quantity" @input="quantityChange(scope.$index, scope.row)" class="quantity" :disabled="action=='view'"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="totalWeight"
                            align="center"
                            label="重量(kg)">
                        </el-table-column>
                        <el-table-column
                            prop="totalVolumn"
                            align="center"
                            label="体积(cm³)">
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            width="180"
                            align="center"
                            label="单价(元)">
                             <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                单价(元)
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.price'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '单价最多可输入3位小数' },{ required: true, message: '请输入单价' }]"
                                >
                                    <el-input v-model="scope.row.price" @input="priceChange(scope.$index, scope.row)" :disabled="action=='view'"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="unitTax"
                            width="180"
                            align="center"
                            label="单位税额(元)">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.unitTax'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '单位税额最多可输入3位小数' }]"
                                >
                                    <el-input v-model="scope.row.unitTax" @input="unitTaxChange(scope.$index, scope.row)" :disabled="action=='view'"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount"
                            width="180"
                            align="center"
                            label="金额(元)">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                金额(元)
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.amount'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '金额最多可输入3位小数' },,{ required: true, message: '请输入金额' }]"
                                >
                                    <el-input v-model="scope.row.amount" @input="amountChange(scope.$index, scope.row)" :disabled="action=='view'"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="totalTax"
                            width="180"
                            align="center"
                            label="税额(元)">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.totalTax'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '税额最多可输入3位小数' }]"
                                >
                                    <el-input v-model="scope.row.totalTax" @input="totalTaxChange(scope.$index, scope.row)" :disabled="action=='view'"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="totalPriceTax"
                            width="180"
                            align="center"
                            label="价税合计(元)">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.totalPriceTax'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '价税合计最多可输入3位小数' }]"
                                >
                                    <el-input v-model="scope.row.totalPriceTax" :disabled="action=='view'"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="remark"
                            width="180"
                            align="center"
                            label="备注">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'asnDetailDtoList.' + scope.$index + '.remark'">
                                    <el-input v-model="scope.row.remark" :disabled="action=='view'"/>
                                </el-form-item>
                            </template>
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
        <shipper-sel-dlg
            :visible="shipperSelDlgVis"
            :handle-save="chooseShipper"
            :update-vis="updateShipperSelDlgVis"/>
        <supplier-sel-dlg
            :visible="supplierSelDlgVis"
            :handle-save="chooseSupplier"
            :update-vis="updateSupplierSelDlgVis"/>
        <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :handle-save="chooseGoods"
            :storerId="this.dto.storerId"
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
import SupplierSelDlg from 'biz/components/supplierSelDlg'
import ItemSelDlg from 'biz/components/itemSelDlg'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import saveGoOn from 'biz/mixins/saveGoOn'
import { times } from 'common/filters/times' 
import { sumTimes } from 'common/filters/sumTimes' 
import { mapActions, mapState } from 'vuex';
const data = { skuId: undefined, name: undefined, code: undefined, uom: undefined, spec: undefined, quantity: undefined, grossWeight: undefined, totalWeight: undefined, volume: undefined, totalVolumn: undefined, price: undefined, unitTax: undefined, amount: undefined,totalTax: undefined,  totalPriceTax: undefined, remark: undefined}

export default {
    components: {
        ShipperSelDlg,
        SupplierSelDlg,
        GoodsSelDlg,
        ItemSelDlg
    },
    mixins: [ EntityDialog, saveGoOn ],
    props: {
        state: Object
    },
    data () {
        return {
            // 显示货主弹框
            shipperSelDlgVis: false,
            // 显示供应商弹框
            supplierSelDlgVis: false,
            // 显示物料弹框
            goodsSelDlgVis: false,
            // 显示项目弹框
            itemSelDlgVis: false,
            currentGoodsIndex: 0,
            WI_ASN_ITEM: false,
            CNST,
            itemRule:[
                { required: true, message: '请输入项目名称' }
            ]
        }
    },
    watch: {
        visible: function (n) {
           if (n && this.action === 'add') {
               const user = this.$store.state.app.user
               this.dto.warehouseId = user.defaultWarehouseId
               //this.dto.warehouseName = user.defaultWarehouseName
            // this.dto.doDetailList = _.cloneDeep([data, data])
            this.queryItemYn()
           }
           if (!n) {
               this.dto = this.toFront({ asnDetailDtoList: [] })
           } else {
               this.getStoreListAction({
                   params:{ page: { current: 1, size: 10000}, validFlag:1 }
               })
           }
        },
        'dto.storerId': function (n, o) {
            if (this.action === 'add') {
                this.dto.asnDetailDtoList = [_.cloneDeep(data)]
            } else {
                if (o && n) {
                    this.dto.asnDetailDtoList = [_.cloneDeep(data)]
                }
            }
        }    
    },
    computed: {
        ...mapState('stock/inStock', ['storeList']),
    },
    beforeCreate () {
        this.allFields = [
            'storerId',
            'billTypeId',
            'billCode1',
            'warehouseId',
            'expectedArriveTime',
            'supplierId',
            'contact',
            'projectName',
            'itemId',
            'projectCode',
            'contractCode',
            'ticketCode',
            'singleProject',
            'contactNum',
            'contactAddr',
            'salesman',
            'totalAmount',
            'totalTax',
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
    methods: {
        ...mapActions('stock/inStock', ['getStoreListAction']),
        toFront (entity) {
            const res = {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
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
        queryItemYn(){
            api.base.getParameters({
                    code:'WI_ASN_ITEM'
                }).then(({ head, body }) => {
                    if (head.code== '200') {
                        if(body.parameterValue==0){
                            this.itemRule = []
                        }
                    }
                })
        },
        // 货主弹框隐藏方法
        updateShipperSelDlgVis (vis) {
            this.shipperSelDlgVis = vis
        },
        // 选择货主返回
        chooseShipper (data) {
            this.dto.storerId = data.id
            this.dto.storerName = data.name
        },
        // 供应商弹框隐藏方法
        updateSupplierSelDlgVis (vis) {
            this.supplierSelDlgVis = vis
        },
        // 选择供应商返回
        chooseSupplier (data) {
            this.dto.supplierId = data.id
            this.dto.supplierName = data.name
            this.dto.contact = data.contact
            this.dto.contactNum = data.phone
            this.dto.contactAddr = data.address
        },
        // 项目弹窗隐藏方法
        updateItemSelDlgVis (vis) {
            this.itemSelDlgVis = vis
        },
        // 选择项目返回
        chooseItem (data) {
            this.dto.itemId = data.id
            this.dto.projectName = data.name
            this.dto.projectCode = data.code
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
        // 合计
        getSummaries (param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 1) {
                    sums[index] = '合计';
                    return;
                }
                switch (index) {
                    case 6:
                    case 7:
                    case 8:
                    case 11:
                    case 12:
                    case 13:
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
                if(index==7||index==8||index==9||index==10||index==11||index==12||index==13) {
                    if(sums&&sums[index]&&sums[index] != ' '){
                        sums[index]=sums[index].toFixed(3)*1
                    }
                }
            });
            return sums;
        },
        //添加
        addGoods () {
            this.dto.asnDetailDtoList.push(_.cloneDeep(data))
        },
        //删除
        deleteRow(index, rows) {
            rows.splice(index, 1);
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
                    unitTax: item.unitTax,
                    amount: item.amount,
                    totalTax: item.totalTax,
                    totalPriceTax: item.totalPriceTax,
                }
            })
            // 判断是新建还是修改，修改的时候不传infSource字段
            if(this.action === 'edit'){
                delete data.infSource
            }
            // 合并相同的物料
            var temp = {};
            const list = data.asnDetailDtoList
            for(var i in list) {
                var key= list[i].skuId;
                list[i].expectQty = list[i].expectQty*1;
                if(temp[key]) {
                    temp[key].skuId = list[i].skuId;
                    temp[key].expectQty += list[i].expectQty;
                    temp[key].uom = list[i].uom;
                    temp[key].remark = list[i].remark;
                    temp[key].price = list[i].price;
                    temp[key].unitTax = list[i].unitTax;
                    temp[key].amount = list[i].amount;
                    temp[key].totalTax = list[i].totalTax;
                    temp[key].totalPriceTax = list[i].totalPriceTax;
                } else {
                    temp[key] = {};
                    temp[key].skuId = list[i].skuId;
                    temp[key].expectQty = list[i].expectQty;
                    temp[key].uom = list[i].uom;
                    temp[key].remark = list[i].remark;
                    temp[key].price = list[i].price;
                    temp[key].unitTax = list[i].unitTax;
                    temp[key].amount = list[i].amount;
                    temp[key].totalTax = list[i].totalTax;
                    temp[key].totalPriceTax = list[i].totalPriceTax;
                }
            }
            var newArry = [];
            for(var k in temp){
                newArry.push(temp[k])
            }
            data.asnDetailDtoList = newArry
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
        //输入的数量发生变化
        quantityChange(index,row){
            row.totalWeight = times(row.quantity, row.grossWeight)
            row.totalVolumn = times(row.quantity, row.volume)
            //如果数量和单价都有值---则自动计算金额的值，否则可编辑
            if(row.quantity && row.price){
                row.amount =  times(row.quantity, row.price)
            }
            //如果数量和单位税额都有值---则自动计算税额，否则可编辑
            if(row.quantity && row.unitTax){
                row.totalTax =  times(row.quantity, row.unitTax)
            }
            row.totalPriceTax = sumTimes(row.amount,row.totalTax)
        },
        // 单价改变
        priceChange(index,row){
            //如果数量和单价都有值---则自动计算金额的值，否则可编辑
            if(row.quantity && row.price){
                row.amount =  times(row.quantity, row.price)
            }
            row.totalPriceTax = sumTimes(row.amount,row.totalTax)
        },
        // 单位税额改变
        unitTaxChange(index,row){
            //如果数量和单位税额都有值---则自动计算税额的值，否则可编辑
            if(row.quantity && row.unitTax){
                row.totalTax =  times(row.quantity, row.unitTax)
            }
            row.totalPriceTax = sumTimes(row.amount,row.totalTax)
        },
        // 金额改变
        amountChange(index,row){
            row.totalPriceTax = sumTimes(row.amount,row.totalTax)
        },
        // 税额改变
        totalTaxChange(index,row){
            row.totalPriceTax = sumTimes(row.amount,row.totalTax)
        },
    }
}
</script>
<style lang="scss" scoped>
.basic-dialog {
    /deep/ .el-icon-more {
        cursor: pointer;
    }
}
// 变成样式
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
}
.quantity{
    /deep/ .el-input__inner{
        text-align: center!important;
    }
}
</style>



