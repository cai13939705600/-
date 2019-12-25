<template>
    <basic-dialog
        :visible="visible"
        :title="titles"
        :width="960"
        :show-ft="showFt"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handStock">
        <el-form
            label-position="right"
            label-width="80px"
            ref="form"
            size="small"
            :model="dto"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">基础信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                     <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="物料">
                                <el-input v-model="fromName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="名称">
                                <el-input v-model="dto.shortName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="源库位">
                                <el-input v-model="dto.locationNo" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="库存数量">
                                <el-input v-model="dto.qty" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="可用数量">
                                <el-input v-model="dto.avaliableQty" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="货主">
                                <el-input v-model="dto.warehouseName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div v-if="type === 0" class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">移动至</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="目标库位" prop="putLocationNo" :rules="[{ required: true, message: '请选择库位', trigger: 'blur' }]">
                            <el-select
                                v-model="dto.putLocationNo"
                                filterable
                                clearable
                                >
                                <el-option
                                    v-for="item in LibraryLocations"
                                    :key="item.value"
                                    :label="item.code"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="原因" prop="reason"  :rules="[{ required: true, message: '请选择原因', trigger: 'blur' }]">
                                <el-select
                                    v-model="dto.reason"
                                    >
                                    <el-option :value="'0'" label="日常理货"/>
                                    <el-option :value="'1'" label="残损"/>
                                    <el-option :value="'2'" label="其他"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="备注" prop="remarks">
                                <el-input v-model="dto.remarks"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="单位" prop="uom"  :rules="[{ required: true, message: '请选择单位', trigger: 'blur' }]">
                                <el-select
                                    v-model="dto.uom"
                                    >
                                    <el-option :value="'EA'" label="EA"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- <el-form-item 
                             label="单位数量" prop="uomNumber" :rules="[
                                        { required: true, message: '请输入数量', trigger: 'blur' },
                                        { type: 'number', message: '必须为数字'}
                                    ]">
                                <el-input-number
                                    type="number"
                                    :min="0" :max="dto.qty"
                                    v-model="dto.uomNumber"
                                    />
                            </el-form-item> -->
                            <el-form-item label="单位数量" @keyup.native="checkValue('uomNumber')" :rules="[{ required: true, message: '请输入单位数量', trigger: 'blur' }]" prop="uomNumber">
                                <el-input
                                    v-model="dto.uomNumber"
                                    />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="数量" prop="uomNumber">
                                <el-input v-model="dto.uomNumber" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="跟踪ID" prop="traceId">
                                <el-input v-model="dto.traceId" placeholder="请填写备注"/>
                            </el-form-item>
                        </el-col> -->
                    </el-row>
                </div>
            </div>
            <div v-if="type === 1" class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">调整至</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                        <!-- <el-form-item label="物料" label-width="80px" prop="skuName"  :rules="[{ required: true, message: '请选择物料'}]" >
                            <el-autocomplete @focus="updateGoodsSelDlgVis(true)" clearable v-model="dto.skuName">
                                <i class="el-icon-more" slot="suffix" @click="updateGoodsSelDlgVis(true)"></i>
                            </el-autocomplete>
                        </el-form-item> -->
                            <el-form-item
                                props="skuName"
                                label="物料"
                                :rules="[{ required: true, message: '请选择物料'}]" prop="skuName"
                                @focus="updateGoodsSelDlgVis(true)"
                                >
                                    <el-input
                                    v-model="dto.skuName">
                                    <template slot="suffix">
                                        <i
                                            @click="updateGoodsSelDlgVis(true)"
                                            class="el-input__icon el-icon-more"></i>
                                    </template>
                                    </el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                            <el-form-item label="调整数量" @keyup.native="checkValue('batchNumber')" :rules="[{ required: true, message: '请输入数量' }]" prop="batchNumber">
                                <el-input
                                    v-model="dto.batchNumber"
                                    />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库存类型"  :rules="[{ required: true, message: '请选择单位'}]" prop="toInventoryType">
                                <el-select
                                    v-model="dto.toInventoryType"
                                    >
                                    <el-option
                                        v-for="item in inventoryTypes"
                                        :key="item.code+ ''"
                                        :label="item.name"
                                        :value="item.code + ''">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                         <el-col :span="8">
                            <!-- <el-form-item label="货主" :rules="[{ required: true, message: '请选择货主'}]">
                                <el-input v-model="dto.toOwnerName"/>
                            </el-form-item> -->
                            <el-form-item label="货主"  :rules="[{ required: true, message: '请选择货主'}]" prop="toOwnerName">
                                <el-select
                                    v-model="dto.toOwnerName"
                                    >
                                    <el-option
                                        v-for="item in OwnerList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="原因" :rules="[{ required: true, message: '请选择原因'}]" prop="batchReason">
                                <el-select
                                    v-model="dto.batchReason"
                                    >
                                    <!-- <el-option
                                        v-for="item in EC_PLATFORM.array"
                                        :key="item.enumCode + ''"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode + ''">
                                    </el-option> -->
                                    <el-option :value="'0'" label="普通"/>
                                    <el-option :value="'1'" label="物料变更"/>
                                    <el-option :value="'2'" label="良残变更"/>
                                    <el-option :value="'3'" label="其他"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="备注" prop="batchRemarks">
                                <el-input
                                    v-model="dto.batchRemarks"
                                    />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div v-if="type === 1" class="entity-dlg__block">
                <div class="entity-dlg__block-hd" v-if="lotAttrs.lotatt01Validate||lotAttrs.lotatt02Validate||lotAttrs.lotatt03Validate||lotAttrs.lotatt04Validate||lotAttrs.lotatt05Validate||lotAttrs.lotatt06Validate||lotAttrs.lotatt07Validate||lotAttrs.lotatt08Validate||lotAttrs.lotatt09Validate||lotAttrs.lotatt10Validate">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">批属性值</span>
                </div>
                <div class="entity-dlg__block-bd">
                   <el-row :gutter="24">
                        <el-col :span="8">
                           <el-form-item prop="inboundDate" :rules="[{ required: true, message: '请选择入库日期', trigger: 'blur' }]" label-width="88px" v-if="lotAttrs.lotatt04Validate" label="入库日期">
                                <el-date-picker
                                v-model="dto.inboundDate"
                                type="datetime"
                                placeholder="入库日期"
                                style="width: 202px"
                                format="yyyy-MM-dd">
                                </el-date-picker>
                        </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="madeDate" label-width="88px" v-if="lotAttrs.lotatt01Validate" label="生产日期" 
                                :rules="[{ required: true, message: '请输入生产日期', trigger: 'blur' }]">
                                    <el-date-picker
                                        v-model="dto.madeDate"
                                        type="datetime"
                                        placeholder="生产日期"
                                        style="width: 202px"
                                        :product='product'
                                        format="yyyy-MM-dd">
                                    </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="expireDate" label-width="88px" v-if="lotAttrs.lotatt02Validate" label="失效日期"  :rules="[{ required: true, message: '请输入失效日期', trigger: 'blur' }]">
                                    <el-date-picker
                                    v-model="dto.expireDate"
                                    type="datetime"
                                    placeholder="失效日期"
                                    style="width: 202px"
                                    format="yyyy-MM-dd">
                                    </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                           <el-form-item
                                prop="produceBatch"
                                label="生产批次"
                                v-if="lotAttrs.lotatt03Validate"
                                :rules="[{ required: true, message: '请输入生产批次', trigger: 'blur' }]"
                                label-width="88px">
                                <el-input v-model="dto.produceBatch"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                prop="itemId"
                                v-if="lotAttrs.lotatt05Validate"
                                filterable
                                label="项目名称"
                                :rules="[{ required: true, message: '请输入项目名称', trigger: 'blur' }]"
                                label-width="88px">
                                <el-select
                                v-model="dto.itemId"
                                @change="changeItem"
                                filterable
                                clearable
                                >
                                    <el-option
                                        v-for="item in projectNames"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                            </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                prop="attr2"
                                v-if="lotAttrs.lotatt06Validate"
                                :label="lotAttrs.lotatt06Name"
                                :rules="[{ required: true, message: '请输入'+lotAttrs.lotatt06Name, trigger: 'blur' }]"
                                label-width="88px">
                                <el-input v-model="dto.attr2" v-if="lotAttrs.lotatt06Type=='30'"/>
                                <el-date-picker
                                    v-model="dto.attr2"
                                    v-if="lotAttrs.lotatt06Type=='10'"
                                    type="datetime"
                                    :placeholder="lotAttrs.lotatt06Name"
                                    style="width: 202px"
                                    format="yyyy-MM-dd">
                                    </el-date-picker>
                                    <el-input type="number" min='0' v-model="dto.attr2" v-if="lotAttrs.lotatt06Type=='20'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                prop="attr3"
                                v-if="lotAttrs.lotatt07Validate"
                                :label="lotAttrs.lotatt07Name"
                                :rules="[{ required: true, message: '请输入'+lotAttrs.lotatt07Name, trigger: 'blur' }]"
                                label-width="88px">
                                <el-input v-model="dto.attr3" v-if="lotAttrs.lotatt07Type=='30'"/>
                                <el-date-picker
                                    v-model="dto.attr3"
                                    v-if="lotAttrs.lotatt07Type=='10'"
                                    type="datetime"
                                    :placeholder="lotAttrs.lotatt07Name"
                                    style="width: 202px"
                                    format="yyyy-MM-dd">
                                    </el-date-picker>
                                    <el-input type="number" min='0' v-model="dto.attr3" v-if="lotAttrs.lotatt07Type=='20'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                prop="attr4"
                                v-if="lotAttrs.lotatt08Validate"
                                :label="lotAttrs.lotatt08Name"
                                :rules="[{ required: true, message: '请输入'+lotAttrs.lotatt08Name, trigger: 'blur' }]"
                                label-width="88px">
                                <el-input v-model="dto.attr4" v-if="lotAttrs.lotatt08Type=='30'"/>
                                <el-date-picker
                                    v-model="dto.attr4"
                                    v-if="lotAttrs.lotatt08Type=='10'"
                                    type="datetime"
                                    :placeholder="lotAttrs.lotatt08Name"
                                    style="width: 202px"
                                    format="yyyy-MM-dd">
                                    </el-date-picker>
                                    <el-input type="number" min='0' v-model="dto.attr4" v-if="lotAttrs.lotatt08Type=='20'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                prop="attr5"
                                v-if="lotAttrs.lotatt09Validate"
                                :label="lotAttrs.lotatt09Name"
                                :rules="[{ required: true, message: '请输入'+lotAttrs.lotatt09Name, trigger: 'blur' }]"
                                label-width="88px">
                                <el-input v-model="dto.attr5" v-if="lotAttrs.lotatt09Type=='30'"/>
                                <el-date-picker
                                    v-model="dto.attr5"
                                    v-if="lotAttrs.lotatt09Type=='10'"
                                    type="datetime"
                                    :placeholder="lotAttrs.lotatt09Name"
                                    style="width: 202px"
                                    format="yyyy-MM-dd">
                                    </el-date-picker>
                                    <el-input type="number" min='0' v-model="dto.attr5" v-if="lotAttrs.lotatt09Type=='20'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                prop="attr6"
                                v-if="lotAttrs.lotatt10Validate"
                                :label="lotAttrs.lotatt10Name"
                                :rules="[{ required: true, message: '请输入'+lotAttrs.lotatt10Name, trigger: 'blur' }]"
                                label-width="88px">
                                <el-input v-model="dto.attr6" v-if="lotAttrs.lotatt10Type=='30'"/>
                                <el-date-picker
                                    v-model="dto.attr6"
                                    v-if="lotAttrs.lotatt10Type=='10'"
                                    type="datetime"
                                    :placeholder="lotAttrs.lotatt10Name"
                                    style="width: 202px"
                                    format="yyyy-MM-dd">
                                    </el-date-picker>
                                    <el-input type="number" min='0' v-model="dto.attr6" v-if="lotAttrs.lotatt10Type=='20'"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div v-if="type === 2" class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">盈亏调整</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="盈亏类型" prop="adjustType"  :rules="[{ required: true, message: '请选择类型' }]">
                                <el-select
                                    v-model="dto.adjustType"
                                    >
                                    <!-- <el-option
                                        v-for="item in EC_PLATFORM.array"
                                        :key="item.enumCode + ''"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode + ''">
                                    </el-option> -->
                                    <el-option :value="'20'" label="盘亏"/>
                                    <el-option :value="'10'" label="盘盈"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <!-- <el-form-item
                             label="差异数量" prop="adNumber" :rules="[
                                        { required: true, message: '请输入数量', trigger: 'blur' },
                                        { type: 'number', message: '必须为数字'}
                                    ]">
                                <el-input-number
                                    type="number"
                                    :min="0" :max="dto.avaliableQty"
                                    v-model="dto.adNumber"
                                    />
                            </el-form-item> -->
                            <el-form-item label="调整数量" @keyup.native="checkValue('adNumber')" :rules="[{ required: true, message: '请输入数量' }]" prop="adNumber">
                                <el-input
                                    :min="0"
                                    v-model="dto.adNumber"
                                    />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="原因" prop="adReason"  :rules="[{ required: true, message: '请选择原因' }]">
                                <el-select
                                    v-model="dto.adReason"
                                    >
                                    <el-option :value="'上架差异'" label="上架差异"/>
                                    <el-option :value="'盘点差异'" label="盘点差异"/>
                                    <el-option :value="'残损'" label="残损"/>
                                    <el-option :value="'其他'" label="其他"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="备注" prop="adremarks">
                                <el-input v-model="dto.adremarks"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :update-vis="updateGoodsSelDlgVis"
            :handle-save="chooseProduct"
            />

    </basic-dialog>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from '../../store'
import EntityDialog from 'biz/mixins/entityDialog'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import { pick } from 'common/utils/lodash'
import { mapState, mapActions } from 'vuex'
import logDlgVue from '../../../../../goods/mgt/components/logDlg.vue'
export default {
    components: {
        GoodsSelDlg
    },
    mixins: [ EntityDialog ],
    props: {
        action: String,
        proxyRemoteMethod: Function,
        areaLoading: Boolean,
        areaList: Array,
        stockMoveDetailList: Object,
        locationLoading: Boolean,
        locationList: Array,
        stockDetail: Object,
        prodcutLoading: Boolean,
        productList: Array,
        LibraryLocations:Array,
        submitStock: Function,
        adjustInt: Function,
        batchAdjust: Function,
        EC_PLATFORM: Object,
        inventoryTypes: Array,
        type: 0, // 0 移库 1 批次 2 库存调整
        titles:String
    },
    data () {
        return {
            goodsSelDlgVis: false,
            allFields: [],
            fromName:'',
            productName:'',
            inboundDateValidated:false,
            guaranteePeriodValidated:false,
            manuBatchValidated:false,
            batchValidated:false,
            product:'',
            storerId:'',
            guaranteePeriodDays:'',//缓存库存的保质期
            OwnerList:[],
            lotAttrs:{},
            projectNames:[]
        }
    },
    beforeCreate () {
        this.allFields = [
            'putLocationNo',
            'shortName',
            'warehouseId',
            'qty',
            'locationNo',
            'avaliableQty',
            'reason',
            'remarks',
            'uom',
            'uomNumber',
            'number',
            'skuNo',
            'skuName',
            'toInventoryType',
            'adjustType',
            'adNumber',
            'adReason',
            'adremarks',
            'product',
            'batchReason',
            'batchRemarks',
            'batchNumber',
            'toInventoryType',
            'toOwnerName',
            'inboundDate',
            'madeDate',
            'expireDate',
            'produceBatch',
            'batchCode',
            'name',
            'attr1',
            'attr2',
            'attr3',
            'attr4',
            'attr5',
            'attr6',
            'itemId'
        ]
        
    },
    created (){
        this.getOwnerList()
        this.getQueryListItem()
    },
    mounted (){

    },
    watch: {
        visible (newVal) {
            if (newVal == true) {
                this.dto.toOwnerName = this.entity.ownerName
                this.storerId = this.entity.ownerId
                this.dto.toInventoryType = this.entity.inventoryType
                this.fromName = this.entity.skuName
                this.dto.inboundDate = this.entity.inboundDate
                console.log(this.entity.skuId)
                this.getRules(this.entity.skuId)
            }
        },
        title(newVal){
            this.title =newVal
        },
        'dto.skuName': function (n, o) {
            if (n) {
                return 
            } else {
                this.dto.toOwnerName = ''
                this.storerId = ''
                console.log(this,'thisssssssss');
                
            }
        }  
    },
    methods: {
        ...mapActions('stock/at', [
            'moveStock'
        ]),
        //获取项目名称
        getQueryListItem(){
            api.organize.queryListItem({page: {size: 10000},validFlag: 1}).then(({head,body})=>{
                if(head.code=='200'&&body&&body.records){
                    this.projectNames = body.records
                }
            })
        },
        //根据项目id 取项目名称
        changeItem(e){
            let obj = this.projectNames.find(function (x) {
                return x.id == e
            })
            this.dto.attr1 = obj.name
        },
        getOwnerList(){
             api.role.getStorerList({page: {
                    current: 1,
                    size: 10000
                }}).then(({ head = {}, body = [] })=>{  
                if(head.code==200){
                    this.OwnerList = body
                }
          }).catch((error)=>{  
            console.log(error);  
          });  
        },
        getDefaultDto () {
            const fields = this.allFields || []
            const dto = {}
            for (let i = 0; i < fields.length; i++) {
                dto[fields[i]] = undefined
            }
            dto.reason = '0'
            dto.uomNumber = this.entity.avaliableQty
            return dto
        },
        // 显示隐藏物料弹窗
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        querySearchAsync(queryString, callback) {  
          var list = [{}];  
          var that = this;
          api.goods.queryGoodsList({name: that.dto.skuName,page: {
                    current: 1,
                    size: 10000
                }}).then(({ head = {}, body = {} })=>{  
              for(let i of body.records){  
                  i.value = i.name;
                  i.id = i.code
              }  
              list =  body.records 
              callback(list);  
          }).catch((error)=>{  
          console.log(error);  
          });  
        },
        handleSelect:function(item){
          this.dto.skuName=item.name;
          this.dto.skuNo=item.code;
        },
        clearCode(){
             console.log('aaa')
            if(!this.productName){
                this.dto.skuNo = ''
            }
             if(!this.productName){
                this.dto.skuNo = ''
            }else{
                this.dto.skuName = this.productName
            }
        },
        //调整数量必须为数字
        checkValue(val){
            switch (val) {
                case 'batchNumber':
                    this.dto.batchNumber = this.dto.batchNumber.replace(/[^\d]/g,'')
                    break;
                case 'adNumber':
                    this.dto.adNumber = this.dto.adNumber.replace(/[^\d]/g,'')
                    if(this.dto.adNumber>this.dto.avaliableQty&&this.dto.adjustType=='20'){
                        this.dto.adNumber = this.dto.avaliableQty
                    }
                    break;
                case 'uomNumber':
                this.dto.uomNumber = this.dto.uomNumber.replace(/[^\d]/g,'')
                if(this.dto.uomNumber>this.dto.avaliableQty){
                    this.dto.uomNumber = this.dto.avaliableQty
                }
                break;
                default:
                    break;
            }
            
        },
        
        //根据失效天数计算失效日期
        changeDate(product){
             Date.prototype.Format = function (fmt) {
                    var o = {
                        "M+": this.getMonth() + 1,                 //月份
                        "d+": this.getDate(),                    //日
                        "h+": this.getHours(),                   //小时
                        "m+": this.getMinutes(),                 //分
                        "s+": this.getSeconds(),                 //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds()             //毫秒
                    };
                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
            };
            if(this.guaranteePeriodDays){
                debugger
                if(this.dto.madeDate){
                var a = this.dto.madeDate.getTime()+this.guaranteePeriodDays * 3600 * 1000
                var aDay = new Date(this.dto.madeDate.getTime()+this.guaranteePeriodDays * 3600 * 1000)
                this.dto.expireDate = aDay.Format("yyyy-MM-dd")
                return
            }else{
                this.dto.expireDate=""
                return
            }
            }
            if(this.dto.madeDate){
                var a = this.dto.madeDate.getTime()+product.guaranteePeriodDays * 3600 * 1000
                var aDay = new Date(this.dto.madeDate.getTime()+product.guaranteePeriodDays * 3600 * 1000)
                this.dto.expireDate = aDay.Format("yyyy-MM-dd")
            }else{
                this.dto.expireDate=""
            }
        },
        // 选择物料返回
        chooseProduct (product) {
            if(!product){
                return
            }
            console.log('productproduct', product)
            this.product = product
            this.dto.skuNo = product.code
            this.dto.skuName = product.name
            this.dto.toOwnerName = product.storerName
            console.log(product,'product',this.type,'this.type');
            this.storerId = product.storerId
            this.getRules(product.id)
        },
        // 请求物料的批次规则
        getRules(id) {
            api.stock.queryLotAttrs({skuId:id}).then(({head,body})=>{
                if(head.code==200&&body){
                    this.lotAttrs = body
                    console.log(this.lotAttrs)
                }else{
                    this.lotAttrs = {}
                }
            })
        },
        show(e){
            if(e){
                return true
            }else{
                return false
            }
        },
         //提交移库
        async handStock(){
            const valid = await this.$refs.form.validate().catch(() => {})
            if (!valid) {
                return
            }
            if(this.type == 0){
                var  queryDetail = this.formatMove(this.dto,this.entity)
                this.submitStock(queryDetail)
            }
             if(this.type == 1){
                var  queryDetail = this.formatBatch(this.dto,this.entity)
                this.batchAdjust(queryDetail)
            }
             if(this.type == 2){

                var  queryDetail = this.formatProfit(this.dto,this.entity)
                this.adjustInt(queryDetail)
            }

        },
        // 整理移库数据
        formatMove (a,params) {
            console.log(params)
            // _.pick()
            return {
                reason: a.reason,
                stockMoveDetailList: [{
                    planQty: a.uomNumber,
                    putLocationNo: a.putLocationNo,
                    putTraceId: params.traceId,
                    // warehouseId: params.warehouseId,
                    stockId: params.id,
                    // ownerId: params.ownerId,
                    // skuId: params.skuId,
                    // lotId: params.lotId,
                    // inventoryType: params.inventoryType,
                    // traceId: params.traceId,
                    // lotNo: params.lotNo,
                    locationNo: params.locationNo,
                    // ownerName: params.ownerName,
                    // skuName: params.skuName,
                    // zoneId: params.zoneId
                    remark:a.remarks
                }]
            }
        },
        // 整理批次数据
        formatBatch (a,params) {
            if(a.madeDate){
                a.madeDate = jt.date.format(+new Date(a.madeDate), 'yyyy-MM-dd')
            }
            if(a.inboundDate){
                 a.inboundDate = jt.date.format(+new Date(a.inboundDate), 'yyyy-MM-dd')
            }
            if(a.expireDate){
                a.expireDate = jt.date.format(+new Date(a.expireDate), 'yyyy-MM-dd')
            }
            return {
                reason: a.batchReason,
                stockTransferDetailList: [{
                    transferQty: a.batchNumber,
                    // warehouseId: params.warehouseId,
                    stockId: params.id,
                    // ownerId: params.ownerId,
                    // skuId: params.skuId,
                    // lotId: params.lotId,
                    // inventoryType: params.inventoryType,
                    // traceId: params.traceId,
                    // lotNo: params.lotNo,
                    locationNo: params.locationNo,
                    // ownerName: params.ownerName,
                    // skuName: params.skuName,
                    // zoneId: params.zoneId,
                    toInboundDate: a.inboundDate,
                    toMadeDate: a.madeDate,
                    toExpireDate: a.expireDate,
                    toProduceBatch: a.produceBatch,
                    // toBatchCode: a.batchCode,
                    toSkuNo: a.skuNo,
                    // toSkuName: a.productName,
                    toTraceId: params.traceId,
                    toOwnerId: this.storerId,
                    toOwnerName: a.toOwnerName,
                    toInventoryType : a.toInventoryType,
                    toItemId:a.itemId,
                    toAttr1:a.attr1,
                    toAttr2:a.attr2,
                    toAttr3:a.attr3,
                    toAttr4:a.attr4,
                    toAttr5:a.attr5,
                    toAttr6:a.attr6,
                }]
            }
        },
        // 整理盈亏数据
        formatProfit (a,params) {

            return {
                reason: a.adReason,
                adjustType: a.adjustType,
                stockAdjustDetailList: [{
                    adjustQty: a.adNumber,
                    warehouseId: params.warehouseId,
                    stockId: params.id,
                    ownerId: params.ownerId,
                    skuId: params.skuId,
                    lotId: params.lotId,
                    inventoryType: params.inventoryType,
                    traceId: params.traceId,
                    lotNo: params.lotNo,
                    locationNo: params.locationNo,
                    ownerName: params.ownerName,
                    skuName: params.skuName,
                    zoneId: params.zoneId
                }]
            }
        },
    }
}
</script>
