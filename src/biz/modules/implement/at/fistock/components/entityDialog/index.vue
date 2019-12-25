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
                            <el-form-item label="物料名称">
                                <el-input v-model="dto.skuName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格型号">
                                <el-input v-model="dto.skuSpec" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="供应商">
                                <el-input v-model="dto.supplierName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="原项目">
                                <el-input v-model="name" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库存数量">
                                <el-input v-model="dto.qty" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单价">
                                <el-input v-model="price" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="金额">
                                <el-input v-model="dto.totalPrice" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="entity-dlg__block" v-if="type ===0">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">调整至</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row>
                    <el-col :span="8">
                        <el-form-item
                                filterable
                                label="项目名称"
                                prop="itemId"
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
                            <el-form-item prop="adjustQty" label="调整数量" @keyup.native="checkValue('adjustQty')" :rules="[{ required: true, message: '请输入调整数量', trigger: 'blur' }]">
                                <el-input :min="0" v-model="dto.adjustQty" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="调整原因" prop="memo"  :rules="[{ required: true, message: '请输入调整原因', trigger: 'blur' }]">
                                <el-input v-model="dto.memo" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="entity-dlg__block" v-if="type ===1">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">调整至</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label-width="88px" prop="adjustQty" label="调整数量" @keyup.native="checkValue('adjustQty')" :rules="[{ required: true, message: '请输入调整数量', trigger: 'blur' }]">
                                <el-input :min="0" v-model="dto.adjustQty" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label-width="88px" prop="price" label="调整后单价" @keyup.native="checkValue('price')" :rules="[{ required: true, message: '请输入调整数量', trigger: 'blur' }]">
                                <el-input :min="0" v-model="dto.price" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label-width="88px" prop="totalPrice" @keyup.native="checkValue('totalPrice')" label="调整后金额" >
                                <el-input :min="0" v-model="totalPrice" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label-width="88px" label="调整原因"  prop="memo" :rules="[{ required: true, message: '请输入调整原因', trigger: 'blur' }]">
                                <el-input oninput="if(value.length>100) value=value.slice(0,100)" v-model="dto.memo" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
    </basic-dialog>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from '../../store'
import EntityDialog from 'biz/mixins/entityDialog'
import { pick } from 'common/utils/lodash'
import { mapState, mapActions } from 'vuex'
export default {
    components: {
        
    },
    mixins: [ EntityDialog ],
    props: {
        type: Number, // 0 移库 1 批次 2 库存调整
        titles:String,
        closeAadjustDialog: Function,
        id:String,
        name:String,
        queryList: Function,
        price:Number
    },
    data () {
        return {
            itemId:'',
            memo:'',
            qty:0,
            projectNames:[],
            totalPrice:''
        }
    },
    beforeCreate () {
        this.allFields = [
            'skuName',
            'skuSpec',
            'supplireName',
            'itemName',
            'qty',
            'memo',
            'id',
            'itemId',
            'adjustQty',
            'availableQty',
            'price',
            'totalPrice'
        ]
        
    },
    created (){
        this.getQueryListItem()
    },
    mounted (){

    },
    watch: {
        title(newVal){
            this.title =newVal
        },
        visible(val){
            if(val){
                this.dto.itemId = null 
                this.dto.adjustQty = null
                this.dto.memo = null
                this.dto.price = null
                this.totalPrice = null
            }
        },
        'dto.adjustQty'(val){
            if(val){
                this.totalPrice = this.dto.adjustQty*this.dto.price || 0
            }
        },
        'dto.price'(val){
            if(val){
                this.totalPrice = this.dto.adjustQty*this.dto.price || 0
            }
        }

    },
    methods: {
        //调整数量必须为数字
        checkValue(val){
            switch (val) {
                case 'price':
                    this.dto.price = this.dto.price.replace(/[^\d\.]/g,'').replace(/^\./g,'').replace(/\.{2,}/g,'.').replace('.','$#$').replace(/\./g,'').replace('$#$','.')
                    break;
                case 'totalPrice':
                    if(this.totalPrice){
                        this.totalPrice = this.totalPrice.replace(/[^\d\.]/g,'').replace(/^\./g,'').replace(/\.{2,}/g,'.').replace('.','$#$').replace(/\./g,'').replace('$#$','.')
                    }
                    break;
                case 'adNumber':
                    this.dto.adNumber = this.dto.adNumber.replace(/[^\d]/g,'')
                    if(this.dto.adNumber>this.dto.avaliableQty&&this.dto.adjustType=='20'){
                        this.dto.adNumber = this.dto.avaliableQty
                    }
                    break;
                case 'adjustQty':
                this.dto.adjustQty = this.dto.adjustQty.replace(/[^\d]/g,'')
                if(this.dto.adjustQty>this.dto.availableQty){
                    this.dto.adjustQty = this.dto.avaliableQty
                }
                break;
                default:
                    break;
            }
            
        },
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
            if(!e){
                return
            }
            let obj = this.projectNames.find(function (x) {
                return x.id == e
            })
            console.log(this.dto.itemId)
            this.dto.itemId = obj.id
            if(this.dto.itemId== this.id){
                this.dto.itemId = null
                return this.$message.error('与原项目相同请重新选择')
            }
        },
        handleClose(){
            this.closeAadjustDialog(false)
        },
        async handStock(){
            const valid = await this.$refs.form.validate().catch(() => {})
            if (!valid) {
                return
            }
            if(this.type == 0){
                api.stock.adjustByItemName(
                    {
                        id: this.dto.id,
                        itemId: this.dto.itemId,
                        memo: this.dto.memo,
                        adjustQty: this.dto.adjustQty,
                    }
                ).then(({head,body})=>{
                    if(head.code == 200){
                        this.$message.success(head.subMessage)
                        this.closeAadjustDialog(false)
                        this.queryList()
                    }else{
                        this.$message.error(head.message)
                    }
                })
            }else if(this.type == 1){
                api.stock.adjustByPrice(
                    {
                        id: this.dto.id,
                        memo: this.dto.memo,
                        adjustQty: this.dto.adjustQty,
                        price: this.dto.price
                    }
                ).then(({head,body})=>{
                    if(head.code == 200){
                        this.$message.success(head.subMessage)
                        this.closeAadjustDialog(false)
                        this.queryList()
                    }else{
                        this.$message.error(head.message)
                    }
                })
            }
        },
       
      
    }
}
</script>
