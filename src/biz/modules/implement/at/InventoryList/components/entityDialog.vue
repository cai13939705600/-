<template>
    <basic-dialog
        :visible="visible"
        :title="action === 'add' ? '新增盘点单' : (action=='edit'?'编辑盘点单':'查看盘点单')"
        :width="1290"
        :show-ft="false"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form
            class="myForm"
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
                            <el-form-item label="盘点单号"  prop="countNo" >
                                <el-input disabled v-model="dto.countNo" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="货主" prop="ownerId" :rules="[{ required: true, message: '请选择货主' }]" >
                                <el-select
                                    v-model="dto.ownerId"
                                    filterable
                                    :disabled="canNotClick||action=='view'"
                                    clearable
                                    @change="changeOwener"
                                    placeholder="请输入货主"
                                    >
                                    <el-option
                                        v-for="item in getStorerList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="盘点类型" prop="type" :rules="[
                                { required: true, message: '请选择盘点类型' }
                            ]">
                                <el-select
                                    clearable
                                    v-model="dto.type"
                                    :disabled="canNotClick||action=='view'"
                                    placeholder="请选择盘点类型">
                                    <el-option
                                        v-for="item in STOCK_COU_TYPE.array"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="盘点方式" prop="mode" :rules="[
                                { required: true, message: '请选择盘点方式' }
                            ]">
                                <el-select
                                    clearable
                                    :disabled="canNotClick||action=='view'"
                                    v-model="dto.mode"
                                    placeholder="请选择盘点方式">
                                    <el-option
                                        v-for="item in STOCK_COU_MODE.array"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="dto.type!=10&&dto.type!=20">
                        <el-form-item
                            label="物料"
                            >
                            <el-input
                                clearable
                                :disabled="canNotClick||action=='view'||!dto.ownerId"
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
                        <el-col :span="6" v-if="dto.type!=10&&dto.type!=30">
                           <el-form-item label="库区" prop="zoneId" :rules="zoneRule">
                            <el-select
                                :disabled="canNotClick||action=='view'"
                                v-model="dto.zoneId"
                                filterable
                                clearable
                                placeholder="请输入库区"
                                >
                                <el-option
                                    v-for="item in LibraryList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                         <el-col :span="6" v-if="dto.type!=10&&dto.type!=30">
                            <el-form-item label="库位" prop="locationName">
                                 <el-input
                                clearable
                                :disabled="canNotClick||(!dto.zoneId)||action=='view'"
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
                         <el-col :span="6">
                            <el-form-item label="备注" prop="remarks"
                                :rules="[{ max: 100, message: '不能超过100个字符' }]"
                            >
                                <el-input :disabled="canNotClick||action=='view'" v-model="dto.remarks" placeholder="请输入备注"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="明/盲盘" prop="showMode" :rules="[
                                { required: true, message: '请选择明/盲盘' }
                            ]">
                                <el-select
                                    clearable
                                    :disabled="canNotClick||action=='view'"
                                    v-model="dto.showMode"
                                    placeholder="请选择明/盲盘">
                                    <el-option
                                        v-for="item in STOCK_COU_SHOW_MODE.array"
                                        :key="item.enumCode"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div class="entity-dlg__block-bd" style="text-align: center;">
                        <el-button size="small" v-if="action!='view'" type="primary" :disabled="canNotClick" @click="save">保存</el-button>
                        <el-button size="small" @click="handleClose">取消</el-button>
                    </div>
                </div>
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">盘点明细</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <basic-list
                        ref="basicList"
                        select-type="multiple"
                        :show-select-col="true"
                        :show-action-col="false"
                        :setClmnsFlg="false"
                        :total="total"
                        :fields="fields"
                        :list="inventerlist"
                        :page-index="pageIndex"
                        :page-size="pageSize"
                        :page-index-change="pageIndexChange"
                        :page-size-change="pageSizeChange"
                        :selection-change="selectionChange"
                        >
                         <template slot="hd-col--l"  v-if="dto.type!=10">
                            <el-button v-if="action=='add'&&action!='view'" @click="addGoods" :disabled="!pandiandanId" type="primary" icon="el-icon-plus" size="mini">添加</el-button>
                            <el-button v-if="action=='edit'&&action!='view'" @click="addGoods" :disabled="!canNotClick" type="primary" icon="el-icon-plus" size="mini">添加</el-button>
                            <el-button @click="minusGoods" v-if="action!='view'"  type="primary" icon="el-icon-minus" size="mini">删除</el-button>
                        </template>
                    </basic-list>
                </div>
            </div>
        </el-form>
       
        <locationQuery
            :visible="locationQueryVis"
            :handle-save="chooselocationQuery"
            :update-vis="updatelocationQueryVis"
            :showSearch="showSearch"
            :VALID_FLAG="VALID_FLAG"
            :zoneId="dto.zoneId"
            :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
            :LOCATION_USE="LOCATION_USE"
            :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
            />
            
            <goods-sel-dlg
                :visible="goodsSelDlgVis"
                :handle-save="chooseProduct"
                :storerId="dto.ownerId"
                :update-vis="updateGoodsSelDlgVis"/>
             <stick-list-dialog
                :visible="stickListDialogVis"
                :handle-save="choosestickListDialog"
                :LibraryList="LibraryList"
                :pandiandanId="pandiandanId"
                :update-vis="updateStickListDialogVis"/>
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
        queryList:Function,
        viewId:String
    },
    data () {
        return {
            locationQueryVis:false,
            goodsSelDlgVis: false,
            stickListDialogVis:false,
            canNotClick:true,
            pandiandanId:'',
            currentGoodsIndex: 0,
            CNST,
            total: 0,
            pageIndex: 1,
            pageSize: 10,
            selRows:[],
            inventerlist:[],
            zoneRule:[],
            getStorerList:[],
            itemClassList:[],
            LibraryList:[],
            showSearch:true,
            fields: [
                { key: 'locationNo', name: '库位' },
                { key: 'sku.code', name: '物料编码' },
                { key: 'sku.name', name: '物料名称'},
                { key: 'sku.uom', name: '单位' },
                { key: 'inventoryTypeName', name: '库存状态' },
                { key: 'qty', name: '原始数量' },
                { key: 'actualQty', name: '盘点数量' },
                { key: 'differQty', name: '差异数量' },
            ]
        }
    },
    watch: {
        visible: function (n) {
           if (n && this.action === 'add') {
               this.canNotClick=false
               this.inventerlist=[]
               api.stock.getCountNo().then(({head,body})=>{
                    if(head.code==200&&body.code){
                        this.dto.countNo = body.code
                    }
               })
           }
           if(n&&(this.action === 'edit'||this.action === 'view')){
               console.log("viewId",this.viewId)
               this.pandiandanId = this.viewId
               this.canNotClick = false
                this.queryInvAllDetail({couHId:this.viewId,
                page: {
                    current: this.pageIndex,
                    size: this.pageSize
                }
                })
           }
        },
        'dto.type' (val){
            // 全盘10  库位盘20  货品盘30
            debugger
            if(val==20){
                this.zoneRule=[{
                     required: true, message: '请选择库区' 
                }]
                if(this.dto.skuId){
                    delete this.dto.skuId
                    delete this.dto.skuName
                }
            }else{
               delete this.dto.locationId
               delete this.dto.locationName
            }
            if(val==30){
                delete this.dto.locationId
                delete this.dto.locationName
                delete this.dto.zoneId
            }
            if(val==10){
                delete this.dto.locationId
                delete this.dto.locationName
                delete this.dto.zoneId
                delete this.dto.skuId
                delete this.dto.skuName
            }
        },
        'dto.zoneId'(val){
            if(val){
                this.dto.locationId = ''
                this.dto.locationName = ''
            }
        }
    },
    beforeCreate () {
        this.allFields = [
            'countNo',
            'ownerId',
            'type',
            'mode',
            'showMode',
            'skuId',
            'zoneId',
            'locationId',
            'remarks',
            'locationName',
            'skuName',
            'source'
        ]
        
        this.disFields = []
    },
    created(){
        this.getStorer()
        this.queryItemClass()
        this.queryZoneList()
    },
    methods: {
        changeOwener(){
            this.dto.skuName = ''
            this.dto.skuId = ''
        },
        pageIndexChange (index) {
            this.pageIndex = index
            this.queryInvAllDetail({
                couHId:this.viewId,
                page: {
                    current: this.pageIndex,
                    size: this.pageSize
                }
            })
        },
        pageSizeChange (size) {
            this.pageIndex = 1
            this.pageSize = size
            this.queryInvAllDetail({
                couHId:this.viewId,
                page: {
                    current: this.pageIndex,
                    size: this.pageSize
                }
            })
        },
        selectionChange (rows) {
            this.selRows = rows
        },
        //查询盘点单单挑明细
        // queryInvDetail(params){
        //     api.stock.getInvDetail(params).then(({head,body})=>{
               
        //     })
        // },
        //查询盘点单明细
        queryInvAllDetail(params){
            api.stock.getInvAllDetail(params).then(({head,body})=>{
                 if(head.code==200 && body){
                    this.inventerlist = body.records
                    this.total = body.total
                }
            })
        },
       chooselocationQuery(product) {
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
            if(!this.dto.skuName){
                this.dto.skuId='';
            }
            this.dto.skuId = product.id
            this.dto.skuName = product.name
        },
        choosestickListDialog(product) {
            api.stock.addInvStockCouDetail({id:this.pandiandanId,stockIdList:product}).then(({head,body})=>{
                if(head.code==200){
                    this.$message.success('添加明细成功！')
                    this.queryInvAllDetail({couHId:this.pandiandanId,
                    page: {
                    current: this.pageIndex,
                    size: this.pageSize
                }})
                }else{
                    this.$message.error(head.message)
                }
            })
        },
        onClickProductCode (e) {
            // TODO 打开物料弹出框
            this.goodsSelDlgVis = true
        },
        queryZoneList(){
            api.library.queryLibraryAreas({page: {current: 1, size: 10000}}).then(({head,body})=>{
                if(head.code==200&&body.records){
                    this.LibraryList = body.records
                }
            })
        },
         queryItemClass(){
            api.goods.itemClassList({}).then(({head,body})=>{
                if(head.code==200&&body.records){
                    this.itemClassList = body.records
                }
            })
        },
        getStorer(){
            api.organize.queryStorerList({}).then(({head,body})=>{
                if(head.code==200&&body.records){
                    this.getStorerList = body.records
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
        // 货主弹框隐藏方法
        updateWarehouseSelDlgVis (vis) {
            this.warehouseSelDlgVis = vis
        },
        // 选择货主返回
        chooseWarehouse (data) {
            this.dto.warehouseId = data.id
            this.dto.warehouseName = data.name
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
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                switch (index) {
                    case 5:
                    case 6:
                    case 7:
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
                        } else {
                            sums[index] = 'N/A';
                        }
                        break;
                    default:
                        sums[index] = '';
                        break;
                }
            });
            return sums;
        },
        addGoods () {
            
            this.stickListDialogVis = true
        },
        //删除明细
        minusGoods () {
            var idList = []
            const rows = this.selRows;
            if(!rows.length){
              return   this.$message.error('请选择要删除的明细！')
            }else{
                idList = rows.map(function(v){return v.id})
                this.delDtail({
                    id:this.pandiandanId,
                    detailIdList:idList
                })
            }

        },
        //删除盘点明细
        delDtail(par){
            api.stock.deleteInvDetail(par).then(({head,body})=>{
                if(head.code==200){
                    this.$message.success('删除明细成功！')
                    this.queryInvAllDetail({couHId:this.pandiandanId,page: {
                    current: this.pageIndex,
                    size: this.pageSize
                }})
                }else{
                     this.$message.error(head.message)
                }
            })
        },
        //盘点单创建前校验
        addBeforeCheck(){
            const arrs = ['countNo','ownerId','type','mode','showMode','skuId','zoneId','locationId','remarks','source']
            const param=_.pick(this.dto, arrs)
            if(!param.source){
                param.source =10
            }
            api.stock.addInventerBeforeCheck(param).then(({head,body})=>{
                if(head.code==200&&body){
                    if(body.result=='ok'){
                        param.forceAdd = false
                        this.pandianAdd(param)
                    }else{
                        param.forceAdd = true
                        this.$confirm(body.result, '提示', {
                                confirmButtonText: '是',
                                cancelButtonText: '否',
                                type: 'warning',
                                center: true
                                }).then(() => {
                                     this.pandianAdd(param)
                                }).catch(() => {
                                    this.$message({
                                        type: 'info',
                                        message: '取消创建！'
                                    });
                                });
                    }
                }else{
                    this.$message.error(head.subMessage)
                }
            })
        },
        //盘点单创建接口
        pandianAdd(param){
            api.stock.addInventer(param).then(({head,body})=>{
                if(head.code==200&&body){
                    this.pandiandanId = body
                    this.canNotClick = true
                    this.$message.success('新建成功!')
                    this.queryInvAllDetail({couHId:body,
                        page: {
                        current: this.pageIndex,
                        size: this.pageSize
                        }
                    })
                    this.queryList()
                }else{
                    this.$message.error(head.subMessage)
                }
            })
        },
        //盘点单信息保存
        save(){
            
             this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }else{
                    if(this.action == 'add'){
                        this.addBeforeCheck()
                    }else if(this.action == 'edit'){
                        api.stock.editInventer(this.dto).then(({head,body})=>{
                            if(head.code==200){
                                this.$message.success('修改成功')
                                this.canNotClick = true
                                this.queryInvAllDetail({couHId: this.viewId,page: {
                                    current: this.pageIndex,
                                    size: this.pageSize
                                }})
                                this.queryList()
                            }else{
                                this.$message.error(head.subMessage)
                            }
                        })
                    }
                     
                }
            })
        },
        handleClose() {
            this.updateVis(false)
        },

        handleClosed () {
            this.updateState('entity')
            if (this.$refs.form) {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate()
                })
            }
            //关闭弹窗时清空明细列表数据
            this.inventerlist = []
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

</style>



