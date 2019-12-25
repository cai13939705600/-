<template>
    <basic-dialog
        class="entity-dialog"
        :visible="visible"
        :title="action === 'add' ? '新增出库单' : '编辑出库单'"
        :width="960"
        :isModal="false"
        :modalAppendToBody="false"
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
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">基础信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="业务单号" prop="billCode1" label-width="88px" :rules="[
                                { required: true, message: '请输入业务单号' }
                            ]">
                                <el-input :disabled="action==='edit'" v-model="dto.billCode1" placeholder=""/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="货主" prop="storerId" :rules="[
                                { required: true, message: '请选择货主' }
                            ]">
                                <el-input :readonly="true" @focus="shipperSelDlgVis = true" v-model="dto.storerName" placeholder=""></el-input>
                                <el-input v-show="false" v-model="dto.storerId" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单据类型" prop="billTypeId" :rules="[
                                { required: true, message: '请选择单据类型' }
                            ]">
                                <el-select
                                    clearable
                                    v-model="dto.billTypeId"
                                    placeholder="">
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
                            <el-form-item label="仓库" prop="warehouseId" :rules="[
                                { required: true, message: '请选择仓库' }
                            ]">
                                <el-select
                                    filterable
                                    clearable
                                    v-model="dto.warehouseId"
                                    placeholder="">
                                    <el-option
                                        v-for="item in storeList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <!-- <el-form-item label="仓库" prop="warehouseId" :rules="[
                                { required: true, message: '请选择仓库' }
                            ]">
                                <el-input :readonly="true" @focus="warehouseSelDlgVis = true" v-model="dto.warehouseName" placeholder=""></el-input>
                                <el-input v-show="false" v-model="dto.warehouseId" placeholder=""></el-input>
                            </el-form-item> -->
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="领料方式" prop="getMethod" label-width="88px">
                                <el-select
                                    filterable
                                    clearable
                                    v-model="dto.getMethod"
                                    placeholder="">
                                    <el-option
                                        v-for="item in GET_METHOD"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="项目名称" prop="itemId">
                                <el-input :readonly="true" @focus="itemSelDlgVis = true" v-model="dto.itemName" placeholder=""></el-input>
                                <el-input v-show="false" v-model="dto.itemId" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单项工程" prop="singleProject">
                                <el-input v-model="dto.singleProject" placeholder=""/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="施工单位" prop="constructionUnit">
                                <el-input v-model="dto.constructionUnit" placeholder=""/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="是否有安装费" prop="ifInstallFee" label-width="88px">
                                <el-select
                                    filterable
                                    clearable
                                    v-model="dto.ifInstallFee"
                                    placeholder="">
                                    <el-option
                                        v-for="item in YES_FLAG"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="是否紧急" prop="ifUrgent">
                                <el-select
                                    filterable
                                    clearable
                                    v-model="dto.ifUrgent"
                                    placeholder="">
                                    <el-option
                                        v-for="item in YES_FLAG"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="承运商" prop="carrierId">
                                <el-input :readonly="true" @focus="carrierSelDlgVis = true" v-model="dto.carrierName" placeholder=""></el-input>
                                <el-input v-show="false" v-model="dto.carrierId" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="业务员" prop="operator">
                                <el-input v-model="dto.operator" placeholder=""/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                         <el-col :span="6">
                            <el-form-item label="联系人" prop="consignee" label-width="88px">
                                <el-input v-model="dto.consignee" placeholder="">
                                    <template slot="suffix">
                                        <i @click="consigneeSelDlgVis = true"
                                            class="el-input__icon el-icon-more"></i>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="6">
                            <el-form-item label="联系电话" prop="mobile"
                                :rules="[{ pattern: CNST.REG_EXP.TEL, message: '格式不正确' }]"
                            >
                                <el-input v-model="dto.mobile" placeholder=""/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系地址" prop="address">
                                <el-input v-model="dto.address" placeholder=""/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item label="备注" prop="remark" label-width="88px"
                                :rules="[{ max: 100, message: '不能超过100个字符' }]"
                            >
                                <el-input v-model="dto.remark" placeholder=""/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="领用原因" prop="takeReason" label-width="88px"
                                :rules="[{ max: 100, message: '不能超过100个字符' }]"
                            >
                                <el-input v-model="dto.takeReason" placeholder=""/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">货品信息</span>
                    &emsp;
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="stockSelDlgVis = true"></el-button>
                    <el-button @click="minusGoods" type="primary" icon="el-icon-minus" size="mini"></el-button>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-table
                        :data="dto.doDetailList"
                        border
                        show-summary
                        :summary-method="getSummaries"
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                        <el-table-column
                            type="selection"
                            width="55">
                        </el-table-column>
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="skuCode"
                            label="物料编码"
                            width="180"
                            align="center">
                            <!-- <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                物料编码
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'doDetailList.' + scope.$index + '.id'"
                                :rules="[
                                    { required: true, message: '请输入选择物料' }
                                ]">
                                    <el-input :disabled="!dto.storerId" @focus="chooseGoodsIconClick(scope.$index)" v-model="scope.row.code" :readonly="true" placeholder=""/>
                                    <el-input v-show="false" v-model="scope.row.id" placeholder=""/>
                                </el-form-item>
                            </template> -->
                        </el-table-column>
                        <el-table-column
                            prop="skuName"
                            label="物料名称"
                            align="center">
                            <!-- <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                物料名称
                            </template> -->
                        </el-table-column>
                        <el-table-column
                            prop="skuUom"
                            label="单位"
                            align="center">
                            <!-- <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                单位
                            </template> -->
                        </el-table-column>
                        <el-table-column
                            prop="skuSpec"
                            label="规格"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="quantity"
                            width="180"
                            label="数量"
                            align="center">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                数量
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'doDetailList.' + scope.$index + '.quantity'"
                                    :rules="[
                                        { pattern: CNST.REG_EXP.NATURAL, message: '请输入正确的数量' },
                                        { required: true, message: '请输入数量' },
                                        { validator: validatePass, max: scope.row.availableQty }
                                    ]"
                                >
                                    <el-input v-model="scope.row.quantity" @input="quantityChange(scope.$index, scope.row)" placeholder="" class="quantity"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="availableQty"
                            label="可用数量"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="itemName"
                            label="项目名称"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="supplierName"
                            label="供应商"
                            align="center">
                        </el-table-column>
                         <el-table-column
                            prop="price"
                            label="单价"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="totalPrice"
                            label="金额"
                            align="center">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'doDetailList.' + scope.$index + '.totalPrice'"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '金额最多可输入3位小数' },,{ required: true, message: '请输入金额' }]"
                                >
                                    <el-input v-model="scope.row.totalPrice"  :disabled="true"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="techParam"
                            width="80"
                            align="center"
                            label="技术参数">
                            <template  slot-scope="scope">
                                <el-form-item label="" label-width="0">
                                    <el-link type="primary" @click="checktechParam(scope.row.techParam)">查看</el-link>
                                    <!-- <el-input v-model="scope.row.skuTechParam"/> -->
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="totalSkuWeight"
                            label="重量(kg)"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="totalSkuVolumn"
                            label="体积(cm³)"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="remark"
                            width="180"
                            label="备注"
                            align="center">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'doDetailList.' + scope.$index + '.remark'">
                                    <el-input v-model="scope.row.remark" placeholder=""/>
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
        <warehouse-sel-dlg
            :visible="warehouseSelDlgVis"
            :handle-save="chooseWarehouse"
            :update-vis="updateWarehouseSelDlgVis"/>
        <item-sel-dlg
            :visible="itemSelDlgVis"
            :handle-save="chooseItem"
            :update-vis="updateItemSelDlgVis"/>
        <carrier-sel-dlg
            :visible="carrierSelDlgVis"
            :handle-save="chooseCarrier"
            :update-vis="updateCarrierSelDlgVis"/>
        <consignee-sel-dlg
            :visible="consigneeSelDlgVis"
            :handle-save="chooseConsignee"
            :update-vis="updateConsigneeSelDlgVis"/>
        <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :handle-save="chooseGoods"
            :update-vis="updateGoodsSelDlgVis"
            :storerId="this.dto.storerId"/>
        <stock-sel-dlg
            :visible="stockSelDlgVis"
            :handle-save="chooseStock"
            :checktechParam="checktechParam"
            :update-vis="updateStockSelDlgVis"
            :storerId="this.dto.storerId"
            :warehouseId="this.dto.warehouseId"
            :itemId="this.dto.itemId"/>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import ShipperSelDlg from 'biz/components/shipperSelDlg'
import WarehouseSelDlg from 'biz/components/warehouseSelDlg'
import CarrierSelDlg from 'biz/components/carrierSelDlg'
import ItemSelDlg from 'biz/components/itemSelDlg'
import ConsigneeSelDlg from 'biz/components/consigneeSelDlgVis'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import StockSelDlg from './stockSelDlg'
import saveGoOn from 'biz/mixins/saveGoOn'
import { times } from 'common/filters/times'
import { mapActions, mapState } from 'vuex';
const data = { skuName: undefined, skuCode: undefined, uom: undefined, spec: undefined, quantity: undefined,price: undefined,totalPrice: undefined,supplierName: undefined, grossWeight: undefined, totalSkuWeight: undefined,techParam:undefined, volume: undefined, totalSkuVolumn: undefined, remark: undefined}

export default {
    components: {
        ShipperSelDlg,
        WarehouseSelDlg,
        CarrierSelDlg,
        ConsigneeSelDlg,
        GoodsSelDlg,
        ItemSelDlg,
        StockSelDlg
    },
    mixins: [ EntityDialog, saveGoOn ],
    props: {
        state: Object,
        //领料方式
        GET_METHOD: {
            type: Array,
            default: () => ([])
        },
        //是否
        YES_FLAG: {
            type: Array,
            default: () => ([])
        },
        checktechParam: Function
    },
    data () {
        return {
            // 显示货主弹框
            shipperSelDlgVis: false,
            // 显示仓库弹框
            warehouseSelDlgVis: false,
            // 显示项目弹框
            itemSelDlgVis: false,
            // 显示承运商弹框
            carrierSelDlgVis: false,
            // 显示收货人弹框
            consigneeSelDlgVis: false,
            // 显示物料弹框
            goodsSelDlgVis: false,
            // 显示库存弹窗
            stockSelDlgVis: false,
            currentGoodsIndex: 0,
            CNST,
        }
    },
    watch: {
        visible: function (n) {
           if (n && this.action === 'add') {
               const user = this.$store.state.app.user
               this.dto.warehouseId = user.defaultWarehouseId
            //    this.dto.warehouseName = user.defaultWarehouseName
            //    this.dto.doDetailList = _.cloneDeep([data, data])
           }
           if (!n) {
               this.dto = this.toFront({ doDetailList: [] })
           } else {
               this.getStoreListAction({
                   params:{ page: { current: 1, size: 10000}, validFlag:1 }
               })
           }
        },
        'dto.storerId': function (n, o) {
            if (this.action === 'add') {
                this.dto.doDetailList = []
            } else {
                if (o && n) {
                    this.dto.doDetailList = []
                }
            }
        },
        'dto.warehouseId': function (n, o) {
            if (this.action === 'add') {
                this.dto.doDetailList = []
            } else {
                if (o && n) {
                    this.dto.doDetailList = []
                }
            }
        },
        'dto.itemId': function (n, o) {
            if (this.action === 'add') {
                this.dto.doDetailList = []
            } else {
                if (o && n) {
                    this.dto.doDetailList = []
                }
            }
        },
        // 'dto.warehouseId': function (n, o) {
        //     const warehouse = this.storeList.find(item => item.id === n)
        //     if (warehouse) {
        //         this.dto.warehouseName = item.name
        //     }
        // }
    },
    computed: {
        ...mapState('stock/out/notice', ['storeList']),
    },
    beforeCreate () {
        this.allFields = [
            'storerId',
            'billTypeId',
            'billCode1',
            'warehouseId',
            'getMethod',
            'itemId',
            'singleProject',
            'constructionUnit',
            {
                key: 'ifInstallFee',
                default: 0
            },
            {
                key: 'ifUrgent',
                default: 0
            },
            'carrierId',
            'operator',
            'consignee',
            'mobile',
            'address',
            'remark',
            'takeReason',
            'id',
            {
                key: 'doDetailList',
                //default: () => ([_.cloneDeep(data)])
                default: () => ([])
            }
        ]
        this.disFields = []
    },
    methods: {
        ...mapActions('stock/out/notice', ['getStoreListAction']),
        // 货主弹框隐藏方法
        updateShipperSelDlgVis (vis) {
            this.shipperSelDlgVis = vis
        },
        // 选择货主返回
        chooseShipper (data) {
            this.dto.storerId = data.id
            this.dto.storerName = data.name
        },
        // 仓库弹框隐藏方法
        updateWarehouseSelDlgVis (vis) {
            this.warehouseSelDlgVis = vis
        },
        // 选择货主返回
        chooseWarehouse (data) {
            this.dto.warehouseId = data.id
            this.dto.warehouseName = data.name
        },
        // 项目弹窗隐藏方法
        updateItemSelDlgVis (vis) {
            this.itemSelDlgVis = vis
        },
        // 选择项目返回
        chooseItem (data) {
            this.dto.itemId = data.id
            this.dto.itemName = data.name
        },
        //库存弹窗隐藏方法
        updateStockSelDlgVis (vis) {
            this.stockSelDlgVis = vis
        },
        // 选择库存返回
        chooseStock (data) {
            this.dto.doDetailList=this.dto.doDetailList.concat(data)
        },
        // 承运商弹框隐藏方法
        updateCarrierSelDlgVis (vis) {
            this.carrierSelDlgVis = vis
        },
        // 选择承运商返回
        chooseCarrier (data) {
            this.dto.carrierId = data.id
            this.dto.carrierName = data.logisticName
        },
        // 发货人弹框隐藏方法
        updateConsigneeSelDlgVis (vis) {
            this.consigneeSelDlgVis = vis
        },
        // 选择发货人返回
        chooseConsignee (data) {
            this.dto.consignee = data.name
            this.dto.mobile = data.telephone
            this.dto.address = data.address
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
            this.dto.doDetailList.splice(this.currentGoodsIndex, 1, data)
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
                    case 11:
                    case 13:
                    case 14:
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
                if(index==7||index==11||index==14||index==13){
                    if(sums&&sums[index]&&sums[index]!=' '){
                        sums[index]=sums[index].toFixed(3)*1
                    }
                }
            });
           
            return sums;
        },
        minusGoods () {
            this.dto.doDetailList=this.dto.doDetailList.filter(item => item.hasSelected!=true )
        },
        toEnd () {
            const data = _.pick(this.dto, this.allFields.map(field => {
                if (typeof field === 'object') {
                    return field.key
                }
                return field
            }))
            data.doDetailList = data.doDetailList.map((item, index) => {
                return {
                    lineNo: index + 1,
                    skuId: item.skuId,
                    financeStockId: item.id,
                    quantity: item.quantity,
                    remark: item.remark,
                    price: item.price,
                    totalPrice: item.totalPrice
                }
            })
            return data
        },
        onSaveGoOn () {
            this.saveAndGoOn(() => {
                ['storerName', 'warehouseName', 'carrierName'].forEach(key => {
                    this.dto[key] = undefined
                })
                //this.dto.doDetailList = [_.cloneDeep(data), _.cloneDeep(data)]
                this.dto.doDetailList = []
            })
        },
        //输入的数量发生变化
        quantityChange(index,row){
            row.totalSkuWeight = times(row.quantity, row.skuWeight)
            row.totalSkuVolumn = times(row.quantity, row.skuVolume)
            row.totalPrice = (row.quantity*row.price).toFixed(3)
        },
        //选中的列表
        handleSelectionChange(val){
            val.map((item)=>{
                item.hasSelected = true
            })
        },
        // 表单验证---数量小于等于可用数量
        validatePass (rule, value, callback) {
            const max = rule.max
            value = Number(value)
            if (value > max){
                callback(new Error('不能大于可用数量'))
            } else {
                callback();
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



