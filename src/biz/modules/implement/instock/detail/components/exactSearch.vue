<template>
    <basic-search class="detail-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item 
            label="入库通知单号"
            label-width="102px">
            <el-input v-model="query.code" clearable/>
        </el-form-item>
        <el-form-item 
            label="业务单号"
            label-width="102px">
            <el-input v-model="query.billCode1" clearable/>
        </el-form-item>
        <el-form-item 
            label="物料名称"
            label-width="102px">
            <el-input v-model="query.skuName" clearable/>
        </el-form-item>
        <el-form-item label="供应商名称"
            label-width="102px">
            <el-input v-model="query.supplierName" clearable/>
        </el-form-item>
        <el-form-item label="项目名称" label-width="102px"
            >
            <el-input v-model="query.projectName" clearable/>
        </el-form-item>
        <el-form-item label="规格" label-width="102px"
            >
            <el-input v-model="query.skuSpec" clearable/>
        </el-form-item>
        <el-form-item
            label="物料编号"
            label-width="102px">
            <el-input
                v-model="query.skuCode"
                clearable
                placeholder="请选择">
                <template slot="suffix">
                    <i
                        @click="onClickProductCode"
                        class="el-input__icon el-icon-more"></i>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseIdList" label-width="102px">
            <el-select
                filterable
                clearable
                multiple
                collapse-tags
                v-model="query.warehouseIdList">
                <el-option
                    v-for="item in storeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item 
            label="订单状态"
            label-width="102px">
             <el-select
                multiple
                collapse-tags
                v-model="query.stateList"
                placeholder="请选择">
                <el-option
                    v-for="item in ASN_STATE.array"
                    :key="item.enumCode + ''"
                    :label="item.enumValueCn"
                    :value="item.enumCode + ''">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="货主" prop="storerId" label-width="102px">
            <el-select
                filterable
                clearable
                multiple
                collapse-tags
                v-model="query.storerIdList">
                <el-option
                    v-for="item in ownerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item 
            label="订单类型"
            label-width="102px">
             <el-select
                multiple
                collapse-tags
                v-model="query.typeList"
                placeholder="请选择">
                <el-option
                    v-for="item in billTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            class="w50p"
            label="创建时间"
            label-width="102px"
            prop="createTime"
            ref="createTime">
            <el-date-picker
                clearable
                v-model="query.createTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                range-separator="~"
                value-format="yyyy-MM-dd HH:mm"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item>
        <el-form-item
            class="w50p"
            label="收货时间"
            label-width="102px"
            prop="receivedTime"
            ref="receivedTime">
            <el-date-picker
                clearable
                v-model="query.receivedTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                range-separator="~"
                value-format="yyyy-MM-dd HH:mm"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item>
        <el-form-item 
            label="收货人"
            label-width="102px">
            <el-input v-model="query.receivedUser" clearable/>
        </el-form-item>
        <el-form-item 
            label="完成人"
            label-width="102px">
            <el-input v-model="query.finishedUser" clearable/>
        </el-form-item>
        <!-- <el-form-item label="供应商名称" prop="supplierId" label-width="102px">
            <el-input :readonly="true" @focus="supplierSelDlgVis = true" v-model="query.supplierName" placeholder="请选择供应商"></el-input>
            <el-input v-show="false" v-model="query.supplierId" placeholder="请选择供应商"></el-input>
        </el-form-item> -->
        
        
       <!--  <el-form-item 
            label="入库日期"
            label-width="102px">
            <el-input v-model="query.lotatt04"/>
        </el-form-item> -->
        <!-- <el-form-item
            class="w50p"
            label="入库日期"
            label-width="102px"
            prop="createTime"
            ref="createTime">
            <el-date-picker
                clearable
                v-model="query.lotatt04"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                range-separator="~"
                value-format="yyyy-MM-dd HH:mm"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item> -->
        <!-- <el-form-item 
            label="生产日期"
            label-width="102px">
            <el-input v-model="query.lotatt01"/>
        </el-form-item> -->
        <!-- <el-form-item
            class="w50p"
            label="生产日期"
            label-width="102px"
            prop="createTime"
            ref="createTime">
            <el-date-picker
                clearable
                v-model="query.lotatt01"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                range-separator="~"
                value-format="yyyy-MM-dd HH:mm"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item> -->
        <!-- <el-form-item 
            label="失效日期"
            label-width="102px">
            <el-input v-model="query.lotatt02"/>
        </el-form-item> -->
        <!-- <el-form-item
            class="w50p"
            label="失效日期"
            label-width="102px"
            prop="createTime"
            ref="createTime">
            <el-date-picker
                clearable
                v-model="query.lotatt02"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                range-separator="~"
                value-format="yyyy-MM-dd HH:mm"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item> -->
        <!-- <el-form-item 
            label="生产批次"
            label-width="102px">
            <el-input v-model="query.lotatt03" clearable/>
        </el-form-item>
        <el-form-item 
            label="项目名称"
            label-width="102px">
            <el-input v-model="query.lotatt05" clearable/>
        </el-form-item> -->
        
        
        <!-- <el-form-item
            class="w50p"
            label="完成时间"
            label-width="102px"
            prop="finishedTime"
            ref="finishedTime">
            <el-date-picker
                clearable
                v-model="query.finishedTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                range-separator="~"
                value-format="yyyy-MM-dd HH:mm"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item> -->
        
        
        
        <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :handle-save="chooseProduct"
            :update-vis="updateGoodsSelDlgVis"/>
        <supplier-sel-dlg
            :visible="supplierSelDlgVis"
            :handle-save="chooseSupplier"
            :update-vis="updateSupplierSelDlgVis"/>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import SupplierSelDlg from 'biz/components/supplierSelDlg'
export default {
    mixins: [ ExactSearch ],
    components: {
        GoodsSelDlg,
        SupplierSelDlg
    },
    props: {
        //单据类型
        billTypes:{},
        // 作业状态
        ASN_STATE: {
            type: Object,
            default: () => {}
        },
        //货主下拉框
        ownerList: {},
        
    },
    data(){
        return{
            //是否显示物料弹窗
            goodsSelDlgVis: false,
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
            // 显示仓库弹框
            warehouseSelDlgVis: false,
            // 显示供应商弹框
            supplierSelDlgVis: false,
            //仓库下拉列表
            storeList: [],
        }
    },
    computed: {
    },
    created(){
        this.queryCurrentUserWarehouse()
    },
    methods:{
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        // 选择物料返回
        chooseProduct (product) {
            this.query.skuCode = product.code
        },
        onClickProductCode (e) {
            // TODO 打开物料弹出框
            this.goodsSelDlgVis = true
        },
        // 供应商弹框隐藏方法
        updateSupplierSelDlgVis (vis) {
            this.supplierSelDlgVis = vis
        },
        // 选择供应商返回
        chooseSupplier (data) {
            this.query.supplierId = data.id
            this.query.supplierName = data.name
        },
         //查询当前用户绑定的仓库
       queryCurrentUserWarehouse(){
           api.stock.getWareHouseList({page: {current: 1, size: 1000}}).then(({head,body})=>{
               if(head.code==200){
                   this.storeList = body
               }
           })
       },
    },
    beforeCreate () {
        this.fields = [ 'code','billCode1', 'skuName', 'typeList','stateList', 'supplierName', 'projectName', 'skuSpec', 'supplierId','skuCode','lotatt04','lotatt01','lotatt02','lotatt03', 'lotatt05', 'createTime','receivedTime','receivedUser','finishedTime','finishedUser','storerIdList' ,'warehouseIdList' ]
    }
}
</script>

<style scoped>
    .detail-search /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
    }

    .time-item /deep/ .el-input__inner {
        padding-left: 15px !important;
    }
    .time-item /deep/  .el-input__icon.el-icon-time {
        display: none !important;
    }
    /* .time-item /deep/ input {
        position: relative;
    } */
    .time-item::after {
        content: ' ';
        display: inline-block;
        width: 16px;
        height: 16px;
        position: absolute;
        top: 50%;
        margin-top: -9px;
        right: 8px;
        background: url('../../../../../imgs/icon-time-picker.png') center no-repeat;
        background-size: 16px 16px;
        z-index: 20;
    }
</style>

