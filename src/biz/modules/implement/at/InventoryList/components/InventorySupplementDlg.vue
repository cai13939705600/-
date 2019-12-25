<template>
    <basic-dialog
        :visible="visible"
        :title="'盘点增补'"
        :width="960"
        :action="action"
        :show-ft="false"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :append-to-body="true"
        :handle-ok="handleOk">
        <el-form
            class="myForm"
            ref="form"
            size="small"
            label-position="right"
            label-width="80px"
            :model="dto"
            @submit.native.prevent>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item
                                label="库位"
                                prop="locationName"
                                :rules="[{ required: true, message: '请选择库位'}]"
                                >
                                <el-input
                                    clearable
                                    v-model="dto.locationName"
                                    @focus="onClicklocationQuery"
                                    placeholder="请选择">
                                    <template slot="suffix">
                                        <i
                                            @click="onClicklocationQuery"
                                            class="el-input__icon el-icon-more"></i>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="物料"
                                prop="skuName"
                                :rules="[{ required: true, message: '请选择物料'}]"
                                >
                                <el-input
                                    clearable
                                    v-model="dto.skuName"
                                    @focus="onClickProductCode"
                                    placeholder="请选择">
                                    <template slot="suffix">
                                        <i
                                            @click="onClickProductCode"
                                            class="el-input__icon el-icon-more"></i>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                         <el-col :span="12">
                            <el-form-item label="盘点数量" prop="actualQty"
                            :rules="[{ required: true, message: '请输入数字',type:'number',whitespace: true,transform(value) {
                      if(value){
                        return Number(value);
                      }
                    }}]"
                            >
                                <el-input clearable v-model="dto.actualQty" placeholder="请输入盘点数量"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                label="库存类型"
                                prop="inventoryType"
                                :rules="[{ required: true, message: '请选择库存类型'}]"
                                >
                                <el-select
                                    clearable
                                    v-model="dto.inventoryType"
                                    placeholder="请选择">
                                    <el-option
                                    v-for="item in inventoryTypes"
                                    :key="item.code + ''"
                                    :label="item.name"
                                    :value="item.code">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="entity-dlg__block-bd" style="text-align: center;">
                        <el-button size="small" type="primary"  @click="save">保存</el-button>
                        <el-button size="small" @click="handleClose">取消</el-button>
                    </div>
                </div>
        </el-form>
       
        <locationQuery
            :visible="locationQueryVis"
            :handle-save="chooselocationQuery"
            :update-vis="updatelocationQueryVis"
            :showSearch="showSearch"
            :VALID_FLAG="VALID_FLAG"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            :LOCATION_USE="LOCATION_USE"
            :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
            :libraries="libraries"
            />
            <goods-sel-dlg
                :visible="goodsSelDlgVis"
                :handle-save="chooseProduct"
                :update-vis="updateGoodsSelDlgVis"/>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import locationQuery from 'biz/components/locationQuery'
import saveGoOn from 'biz/mixins/saveGoOn'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'
import stickListDialog from './stickListDialog'
const data = { name: undefined, code: undefined, uom: undefined, spec: undefined, quantity: undefined, grossWeight: undefined, volume: undefined, remark: undefined}

export default {
    components: {
        locationQuery,GoodsSelDlg,BasicDialog,
        BasicList,stickListDialog
    },
    mixins: [ EntityDialog, saveGoOn ],
    props: {
        state: Object,
        STOCK_COU_STATUS:Object,
        STOCK_DIFF_TYPE:Object,
        STOCK_COU_MODE:Object,
        STOCK_COU_SHOW_MODE:Object,
        VALID_FLAG:Object,
        LOCATION_CYCLE_CLASS:Object,
        LOCATION_USE:Object,
        LOCATION_CONSTRAINT:Object,
        STOCK_COU_TYPE:Object,
        couHId:String,
        closeInventer:Function,
        invStockNote:Function
    },
    data () {
        return {
            locationQueryVis:false,
            goodsSelDlgVis: false,
            inventoryTypes:[],
            showSearch:false,
            libraries:[]
        }
    },
    watch: {
        'visible' (val){
            if(val){
                this.dto.locationId=''
                this.dto.skuId = ''
                this.dto.inventoryType = ''
                this.dto.actualQty = ''
                this.dto.locationName = ''
                this.dto.skuName = ''
            }
        }
    },
    beforeCreate () {
        this.allFields = [
            'couHId',
            'locationId',
            'skuId',
            'inventoryType',
            'actualQty',
            'locationName',
            'skuName'
        ]
        
        this.disFields = []
    },
    created(){
        this.getInventoryTypes()
        this.queryZoneList()
    },
    methods: {
       chooselocationQuery(product) {
           if(!product){
             return  this.$message.error("请选择数据！")
           }
            if(!this.dto.locationName){
                this.dto.locationId='';
            }
            this.dto.locationId = product.id
            this.dto.locationName = product.code
        },
        onClicklocationQuery(){
            this.locationQueryVis = true
        },
        updatelocationQueryVis(vis){
            this.locationQueryVis =vis
        },
        // 显示隐藏物料弹窗
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        updateStickListDialogVis(vis) {
            this.stickListDialogVis = vis
        },
        // 选择物料返回
        chooseProduct (product) {
            if(!product){
              return this.$message.error("请选择数据！")
            }
            if(!this.dto.skuName){
                this.dto.skuId='';
            }
            this.dto.skuId = product.id
            this.dto.skuName = product.code
        },
        onClickProductCode (e) {
            // TODO 打开物料弹出框
            this.goodsSelDlgVis = true
        },
        //查询库存类型
        getInventoryTypes(){
            api.stock.getInventoryTypes().then(({head,body})=>{
                if(head.code==200&&body){
                    this.inventoryTypes = body
                }
                
            })
        },
        queryZoneList(){
            api.library.queryLibraryAreas({}).then(({head,body})=>{
                if(head.code==200&&body.records){
                    this.libraries = body.records
                }
            })
        },
        save(){
             var params=_.pick(this.dto, [ 'couHId','locationId','skuId','inventoryType','actualQty'])
             params.couHId=this.couHId
             this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }else{
                    api.stock.augmentInvStockCouDetail(params).then(({head,body})=>{
                        if(head.code==200){
                            this.$message.success(head.message)
                            this.closeInventer(false)
                            this.invStockNote(this.couHId)
                        }else{
                            this.$message.error(head.message)
                        }
                    })
                }
               
            })
        },
        handleClose(){
            this.closeInventer(false)
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

</style>



