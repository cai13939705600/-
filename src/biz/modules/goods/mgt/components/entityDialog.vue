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
            label-width="112px"
            :model="dto"
            :rules="rules"
            class="bardForm"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">基础信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="物料编号" prop="code">
                                <el-input :disabled="action=='view'||parameterValue=='2'" clearable v-model="dto.code"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                            label="货主" prop="storerName"  :rules="[{ required: true, message: '货主不能为空',trigger: 'blur'}]">
                            <el-input
                                clearable
                                :disabled="action=='view'"
                                v-model="dto.storerName"
                                @focus="onClickProductCode"
                                placeholder="">
                                <template slot="suffix">
                                    <i
                                        @click="onClickProductCode"
                                        class="el-input__icon el-icon-more"></i>
                                </template>
                            </el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物料名称" prop="name">
                                <el-input clearable :disabled="action=='view'" v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="物料简称" prop="shortName">
                                <el-input clearable :disabled="action=='view'" v-model="dto.shortName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物料条码" prop="barcode">
                                <el-input clearable :disabled="action=='view'||parameterValue=='2'" v-model="dto.barcode"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="货号" prop="skuNo1">
                                <el-input clearable :disabled="action=='view'" v-model="dto.skuNo1"/>
                            </el-form-item>
                        </el-col>

                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="品牌" prop="brandName">
                                 <el-input clearable :disabled="action=='view'" v-model="dto.brandName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格" prop="spec">
                                <el-input clearable :disabled="action=='view'" v-model="dto.spec"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="标准价格" prop="costPrice">
                                <el-input-number :disabled="action=='view'" :controls="false" :min="0" v-model="dto.costPrice" @change="calcVolume"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="基本单位" prop="uom">
                                <el-input clearable :disabled="action=='view'" v-model="dto.uom"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="批次规则" prop="lotAttrRuleId">
                                <el-select
                                    v-model="dto.lotAttrRuleId"
                                    filterable
                                    
                                    :disabled="action=='view'"
                                    placeholder=""
                                    >
                                    <el-option :value="null" label="无"/>
                                    <el-option
                                        v-for="item in lotAttrRuleList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库存周转规则" prop="turnoverRuleId">
                                <el-select
                                    v-model="dto.turnoverRuleId"
                                    filterable
                                    clearable
                                    :disabled="action=='view'"
                                    placeholder=""
                                    >
                                    <el-option :value="null" label="无"/>
                                    <el-option
                                        v-for="item in turnoverRuleList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                         <el-col :span="8">
                            <!-- <el-form-item label="物料品类" props="categoryId">
                                <el-select
                                    v-model="dto.categoryId"
                                    filterable
                                    clearable
                                    :disabled="action=='view'"
                                    placeholder=""
                                    >
                                    <el-option
                                        v-for="item in itemClassList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item> -->
                             <el-form-item label="物料品类" prop="categoryId">
                               <el-cascader
                                    ref="cascader"
                                    v-model="dto.categoryId"
                                    :show-all-levels="false"
                                    :disabled="action=='view'"
                                    :options="itemClassList"
                                    :props="{ checkStrictly: true, children:'chuilSkuCategoryList',label:'name',value:'id',emitPath: false}"
                                    clearable>
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                            label="供应商" prop="supplierName" :rules="[{ required: true, message: '供应商不能为空',trigger: 'blur'}]" >
                            <el-input
                                clearable
                                v-model="dto.supplierName"
                                @focus="onClicksupplier"
                                :disabled="action=='view'"
                                placeholder="">
                                <template slot="suffix">
                                    <i
                                        @click="onClicksupplier"
                                        class="el-input__icon el-icon-more"></i>
                                </template>
                            </el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                            label="库位">
                            <el-input
                                clearable
                                v-model="dto.locationCode"
                                @focus="onClicklocationQuery"
                                :disabled="action=='view'"
                                placeholder="">
                                <template slot="suffix">
                                    <i
                                        @click="onClicklocationQuery"
                                        class="el-input__icon el-icon-more"></i>
                                </template>
                            </el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="保质期天数" prop="guaranteePeriodDays">
                                 <el-input-number :disabled="action=='view'" :controls="false" :precision="0" :min="0" v-model="dto.guaranteePeriodDays"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item
                                label="是否rfid管理"
                                >
                                <el-select
                                    clearable
                                    v-model="dto.rfidFlag"
                                    :disabled="action=='view'"
                                    >
                                    <el-option :value="1" label="是"/>
                                    <el-option :value="0" label="否"/>
                                </el-select>
                            </el-form-item>
                        </el-col><el-col :span="8">
                            <el-form-item
                                label="是否Bom管理"
                                >
                                <el-select
                                    clearable
                                    v-model="dto.bomFlag"
                                    :disabled="action=='view'"
                                    >
                                    <el-option :value="1" label="是"/>
                                    <el-option :value="0" label="否"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="技术参数" prop="techParam">
                                <el-input
                                    type="textarea"
                                    :rows="2"
                                    clearable 
                                    oninput="if(value.length>300)value=value.slice(0,300)"
                                    :disabled="action=='view'"
                                    v-model="dto.techParam"
                                    placeholder="请输入内容"
                                    >
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <!-- <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">价格信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="最低售价" prop="costPrice">
                                <el-input-number :controls="false" :precision="6" :min="0" v-model="dto.costPrice"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="会员价" prop="memberPrice">
                                <el-input-number :controls="false" :precision="6" :min="0" v-model="dto.memberPrice"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="批发价" prop="wholesalePrice">
                                <el-input-number :controls="false" :precision="6" :min="0" v-model="dto.wholesalePrice"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="零售价" prop="salePrice">
                                <el-input-number :controls="false" :precision="6" :min="0" v-model="dto.salePrice"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div> -->
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">尺寸重量</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item label="长/宽/高(cm)" label-width="100px"  :disabled="action=='view'">
                                <el-row>
                                    <el-col :span="5">
                                        <el-form-item prop="length">
                                            <el-input-number  :disabled="action=='view'" :controls="false"  :min="0" v-model="dto.length" @change="calcVolume" placeholder="长"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1" style="text-align:center;">/</el-col>
                                    <el-col :span="5">
                                        <el-form-item prop="width">
                                            <el-input-number  :disabled="action=='view'" :controls="false" :min="0" v-model="dto.width" @change="calcVolume" placeholder="宽"/>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1" style="text-align:center;">/</el-col>
                                    <el-col :span="5">
                                        <el-form-item prop="height">
                                            <el-input-number :controls="false"  :disabled="action=='view'"  :min="0" v-model="dto.height" @change="calcVolume" placeholder="高"/>
                                        </el-form-item>
                                    </el-col>
                                    <!-- <el-col :span="1" style="text-align:center;">=</el-col> -->
                                    <!-- <el-col :span="6"> 体积 {{volume}} (L)</el-col> -->
                                </el-row>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label-width="80px" label="重量(kg)" prop="grossWeight">
                                <el-input-number :disabled="action=='view'" :controls="false" :min="0" v-model="dto.grossWeight"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label-width="80px" label="体积(cm3)" prop="volume">
                                <el-input-number :disabled="action=='view'"  :controls="false" :min="0" v-model="dto.volume"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    
                </div>
            </div>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">上传图片</span>
                </div>
                <!--上传图片功能 蔡伟-->
            <!--   <el-form-item label="物料图片" prop="imgUrl">
                    &lt;!&ndash;<el-input clearable v-model="dto.imgUrl"/> &ndash;&gt;
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :on-change="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
                        <span v-if="dto.imgUrl" style="margin-left:15px;margin-right:10px;cursor:pointer;color:#3998fc" @click="prePicture(dto.imgUrl)">查看图片</span>
                        <span v-if="dto.imgUrl" style="cursor:pointer" @click="deletePicture">删除</span>
                        </el-upload>
                </el-form-item>-->
                <!--下方上传图片 王虹鸾-->
                <el-form-item label="物料图片" prop="imgUrl">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        accept=".jpg,.jpeg,.png,.pdf,.JPG,.JPEG,.PBG,.PDF,.PNG"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :show-file-list="false"
                        :on-change="uploadFun"
                        :before-upload="beforeAvatarUpload"
                        :http-request="handleAvatarSuccess"
                        :disabled="action=='view'"
                        >
                        <el-button slot="trigger" size="small" v-if="action!='view'" type="primary">选取图片</el-button>
                        <span v-if="dto.imgUrl" style="margin-left:15px;margin-right:10px;cursor:pointer;color:#3998fc" @click="prePicture(dto.imgUrl)">查看图片</span>
                        <span v-if="dto.imgUrl" :disabled="action=='view'" style="cursor:pointer" @click="deletePicture">删除</span>
                    </el-upload>
                </el-form-item>
            </div>
        </el-form>
        <div slot="ft">
            <el-button v-if="action!='view'" size="small" type="primary" @click="handleOk" :loading="saving">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </div>
         <shipper-sel-dlg
            :visible="shipperSelDlgVis"
            :handle-save="chooseProduct"
            :update-vis="updateShipperSelDlgVis"/>
            <all-batch-rule
            :visible="batchRuleSelDlgVis"
            :handle-save="chooseProducts"
            :update-vis="updateBatchRuleSelDlgVis"/>
             <turnover-ruleDlg
            :visible="turnoverRuleDlgVis"
            :handle-save="chooseRule"
            :update-vis="updateTurnoverRuleDlgVis"/>
            <locationQuery
            :visible="locationQueryVis"
            :handle-save="chooselocationQuery"
            :update-vis="updatelocationQueryVis"
            :libraries="libraries"
            :locationType="locationType"
            :VALID_FLAG="VALID_FLAG"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            :LOCATION_USE="LOCATION_USE"
            :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
            />
             <supplier-selDlg
                :visible="supplierSelDlgVis"
                :handle-save="chooseSupplier"
                :update-vis="updateSupplierDlgVis"/>
    </basic-dialog>

</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import ShipperSelDlg from 'biz/components/shipperSelDlg'
import allBatchRule from 'biz/components/allBatchRule'
import turnoverRuleDlg from 'biz/components/turnoverRuleDlg'
import locationQuery from 'biz/components/locationQuery'
import supplierSelDlg from 'biz/components/supplierSelDlg'
import cookie from 'js-cookie'


export default {
    mixins: [ EntityDialog ],
    props: {
        saving: Boolean,
        units: Array,
        libraries:Array,
        locationType:Array,
        VALID_FLAG:Object,
        LOCATION_CYCLE_CLASS:Object,
        LOCATION_USE:Object,
        LOCATION_CONSTRAINT:Object,
    },
    components:{
        ShipperSelDlg,allBatchRule,turnoverRuleDlg,
        locationQuery,supplierSelDlg
    },
    data () {
        return {
            yesNo: CNST.ENUMS.yesNo,
            volume: 0,
            itemClassList:[],
            fileList:[],
            brands: [],
            rules: {
                code: [
                    { required: true, message: '请输入物料编号', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入物料名称', trigger: 'change' }
                ],
                // shortName: [
                //     { required: true, message: '请输入物料简称', trigger: 'change' }
                // ],
                barcode: [
                    { required: true, message: '请输入物料条码', trigger: 'change' }
                ],
                uom: [
                    { required: true, message: '请输入基本单位', trigger: 'change' }
                ],
                // turnoverRuleId: [
                //     { required: true, message: '请输入库存周转规则', trigger: 'change' }
                // ],
                categoryId:[
                    { required: true, message: '请选择物料品类', trigger: 'change' }
                ],
                length: [{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '最多可输入3位小数' }],
                width: [{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '最多可输入3位小数' }],
                height: [{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '最多可输入3位小数' }],
                grossWeight: [
                    { required: true, message: '请输入重量', trigger: 'change' }
                ],
                volume:[
                    { required: true,message: '请输入体积', }
                ],
                guaranteePeriodDays:[],
            },
            //货主弹窗是否显示
            shipperSelDlgVis: false,
            //批次规则弹框显示
            batchRuleSelDlgVis:false,
            turnoverRuleDlgVis:false,
            locationQueryVis:false,
            supplierSelDlgVis:false,
            parameterValue:'',
            fileUploadParam:'',//上传文件的参数 by wanghongluan
            turnoverRuleList:[],
            lotAttrRuleList:[]
        }
    },
    beforeCreate () {
        this.allFields = [
            'id','code', 'storerId','storerName',{ key: 'lotAttrRuleId', default:null },'name', 'shortName',{ key: 'rfidFlag', default:0 },{ key: 'bomFlag', default:0 },  'barcode', 'skuNo1', 'brandName','brandId', 'spec', 'costPrice', 'uom', 'allocateRule', 'categoryId',
            'supplierId','supplierName', 'techParam', 'locationId','locationCode', 'guaranteePeriodDays', { key: 'length' }, { key: 'width' } , { key: 'height' }, 'grossWeight', 'volume', 'imgUrl',{ key: 'turnoverRuleId', default:null }
        ]
        this.disFields = []
    },
    mounted () {

    },
    watch:{
        'dto.categoryId' (val){
            if(val){
                if(this.$refs.cascader){
                    this.$refs.cascader.dropDownVisible= false
                }
            }
        },
        'parameterValue'(val){
            if(val=='2'){
                this.rules.code=[ { required: false }]
                this.rules.barcode=[ { required: false}]
            }else{
                this.rules.code=[ { required: true, message: '请输入物料编号', trigger: 'change' }]
                this.rules.barcode=[ { required: true, message: '请输入物料条码', trigger: 'change' }]
            }
        },
        'visible' (n){
             //查询系统参数
            api.base.getParameters({code:'SKU_CODE_PRODUCE_RULE'}).then(({head,body})=>{
                if(head.code==200){
                    this.parameterValue = body.parameterValue
                }
            })
        },
        'dto.locationCode'(val){
            if(!val){
                this.dto.locationId = null
            }
        },
        'dto.supplierName'(val){
            if(!val){
                this.dto.supplierId = null
            }
        }
    },
    activated () {
        this.queryItemClass()
        this.queryturnoverRule()
        this.queryLotAttrRuleList()
    },
    created(){
        this.queryItemClass()
        this.queryturnoverRule()
        this.queryLotAttrRuleList()
    },
    methods: {
        //删除物料图片
        deletePicture(){
            this.dto.imgUrl = ''
        },
        //预览图片
        prePicture(imgUrl){
            this.$alert("<img width=100% src=/api/ba/sku/showImageByte?jwt="+cookie.get('jwt')+"&tenantId="+cookie.get('tenantId')+"&qpId="+cookie.get('qpId')+"&imgUrl="+imgUrl +"  />", '物料图片', {
                                    dangerouslyUseHTMLString: true
                                });
        },
        queryItemClass(){
            api.goods.itemClassList({page: {current: 1, size: 10000}}).then(({head,body})=>{
                if(head.code==200&&body.records){
                    this.itemClassList = body.records
                    this.itemClassList = this.getTreeData(this.itemClassList)
                }
            })
        },
        //递归方法
        getTreeData(data){
                // 循环遍历json数据
                for(var i=0;i<data.length;i++){
                    if(data[i].chuilSkuCategoryList.length<1){
                        // chuilSkuCategoryList若为空数组，则将chuilSkuCategoryList设为undefined
                        data[i].chuilSkuCategoryList=undefined;
                    }else {
                        // chuilSkuCategoryList若不为空数组，则继续 递归调用 本方法
                        this.getTreeData(data[i].chuilSkuCategoryList);
                    }
                }
                return data;
        },
         queryturnoverRule(){
            api.rule.queryListRule({page: {current: 1, size: 10000}}).then(({head,body})=>{
                if(head.code==200&&body.records){
                    this.turnoverRuleList = body.records
                }
            })
        },
        queryLotAttrRuleList(){
            api.goods.getLotAttr({page: {current: 1, size: 10000}}).then(({head,body})=>{
                if(head.code==200&&body.records){
                    this.lotAttrRuleList = body.records
                }
            })
        },
        updateShipperSelDlgVis (vis) {
            this.shipperSelDlgVis = vis
        },
        updateBatchRuleSelDlgVis (vis) {
            this.batchRuleSelDlgVis = vis
        },
        updateTurnoverRuleDlgVis(vis){
            this.turnoverRuleDlgVis =vis
        },

        updatelocationQueryVis(vis){
            this.locationQueryVis =vis
        },
        updateSupplierDlgVis(vis){
            this.supplierSelDlgVis =vis
        },
        // 选择物料返回
        chooseProduct (product) {
            if(this.dto.storerName){
                this.dto.storerId = null;
            }
            this.dto.storerId = product.id
            this.dto.storerName = product.name
        },
         chooseProducts (product) {
             if(product.lotatt02Validate){
                this.rules.guaranteePeriodDays=[
                    {required: true, message: '请输入失效日期', trigger: 'change'}
                ]
            }else{
                 this.rules.guaranteePeriodDays=[
                    {required: false, message: '请输入失效日期', trigger: 'change'}
                ]
            }
            if(this.dto.lotAttrRuleName){
                this.dto.lotAttrRuleId=null;
            }
            this.dto.lotAttrRuleId = product.id
            this.dto.lotAttrRuleName = product.name
        },
        chooseRule(product) {
            if(this.dto.turnoverRuleName){
                this.dto.turnoverRuleId = null;
            }
            this.dto.turnoverRuleId = product.id
            this.dto.turnoverRuleName = product.name
        },
        chooselocationQuery(product) {
            if(this.dto.locationCode){
                this.dto.locationId=null;
            }
            this.dto.locationId = product.id
            this.dto.locationCode = product.code
        },
        chooseSupplier(product) {
            if(this.dto.supplierName){
                this.dto.supplierId = null;
            }
            this.dto.supplierId = product.id
            this.dto.supplierName = product.name
        },
        calcVolume () {
            const dto = this.dto
            if (dto.length && dto.width && dto.height) {
               this.dto.volume = (dto.length * dto.width * dto.height).toFixed(3)
            }
        },
        onGoodsNameChange (val) {
            this.dto.goodsAlias = val
        },
        isPeriodManageChange (val) {
            if (val === 0) {
                this.dto.shelfLife = undefined
                this.$refs.form.clearValidate('shelfLife')
            }
        },
        toFront (entity) {
            const res = {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
            }
            // Array.prototype.map.call(['minPrice', 'memberPrice', 'wholesalePrice', 'salePrice', 'skuLength', 'skuWidth', 'skuHeight', 'skuWeight'], (key) => {
            //     if (res[key] === null) {
            //         res[key] = undefined
            //     }
            // })
            if (res.length && res.width && res.height) {
                this.volume = (res.length * res.width * res.height).toFixed(3)
            }
            // const delFields = [ 'brandId', 'brandName' ]
            // delFields.forEach(item => {
            //     delete res[item]
            // })
            return res
        },
        toEnd () {
            // delete this.dto.storerName
            // delete this.dto.supplierName
            // delete this.dto.locationCode
            const res =  this.dto
            jt.object.removeEmptyAttr(res)
            return res
        },
        onClickProductCode (e) {
            // TODO 打开物料弹出框
            this.shipperSelDlgVis = true
        },
        onClickBatchCode (e) {
            // TODO 打开物料弹出框
            this.batchRuleSelDlgVis = true
        },
        onClickturnRules(){
            this.turnoverRuleDlgVis = true
        },
        onClicklocationQuery(){
            this.locationQueryVis = true
        },
        onClicksupplier(){
            this.supplierSelDlgVis = true
        },
        //上传图片
        submitUpload() {
            this.$refs.upload.submit();
        },
        handleRemove(file, fileList) {
        },
        handlePreview(file) {
        },
        progress(val){
          const formData = new FormData()
          formData.append('file', val.file)
          formData.append('type', 'fiel')
          api.sku.uploadBardImg(formData).then(
               ({ data = "" }) => {

            })
        },
        //上传成功功能
        uploadFun(file, fileList){
            this.fileUploadParam=file.raw
        },
        handleAvatarSuccess() {
            this.fileList = []
            const formData = new FormData()
                formData.append('file',this.fileUploadParam)
                api.goods.uploadBardImg(formData).then(
                    ({head,body}) => {
                        if(head.code ==200){
                            this.dto.imgUrl =  head.subMessage
                        }
                    }
            )
      },
      //限制图片格式
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpg'
            | file.type === 'image/jpeg'
            | file.type === 'image/png'
            | file.type === 'image/PNG'
            | file.type === 'image/pdf'
            | file.type === 'image/PDF'
            | file.type === 'image/bmp'
            | file.type === 'image/BMP';
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('上传图片只能是 bmp,jpg,png,pdf格式!');
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 5MB!');
            return false
        }
      },
    }
}
</script>
<style lang="scss" scoped>
    .bardForm{
        /deep/ .upload-demo{
            overflow: hidden;
            /deep/ .el-upload--text{
                float: left;
            }
            /deep/ .el-upload-list--text{
                float: left;
            }
        }
    }
</style>



