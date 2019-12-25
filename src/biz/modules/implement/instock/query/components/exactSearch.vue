<template>
    <basic-search class="query-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
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
         <el-form-item label="项目名称"
         label-width="102px"
            >
            <el-input v-model="query.projectName" clearable/>
        </el-form-item>
        
        <el-form-item 
            label="单据状态"
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
        <el-form-item label="供应商名称" prop="supplierId" label-width="102px">
            <el-input :readonly="true" @focus="supplierSelDlgVis = true" v-model="query.supplierName" placeholder="请选择供应商"></el-input>
            <el-input v-show="false" v-model="query.supplierId" placeholder="请选择供应商"></el-input>
        </el-form-item>
        <el-form-item 
            label="收货人"
            label-width="102px"
            >
            <el-input v-model="query.receivedUser" clearable/>
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
            label-width="102px"
            label="收货时间"
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
        </el-form-item>
        <el-form-item
                label="单据类型"
                label-width="102px">
                <el-select
                    collapse-tags
                    multiple
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
            <supplier-sel-dlg
                :visible="supplierSelDlgVis"
                :handle-save="chooseSupplier"
                :update-vis="updateSupplierSelDlgVis"/>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import SupplierSelDlg from 'biz/components/supplierSelDlg'
export default {
    components: {
        SupplierSelDlg
    },
    mixins: [ ExactSearch ],
    props: {
        //单据类型
        billTypes:{},
        // 作业状态
        ASN_STATE: {
            type: Object,
            default: () => {}
        },
        //货主下拉框
        ownerList:{},
        
    },
    data(){
        return{
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
            // 显示供应商弹框
            supplierSelDlgVis: false,
            //仓库下拉列表
            storeList:[]
        }
    },
    computed: {
    },
    created(){
        this.queryCurrentUserWarehouse()
    },
    beforeCreate () {
        this.fields = [ 'code', 'billCode1','typeList','stateList','supplierId','createTime','receivedTime','receivedUser','finishedTime','projectName' ,'storerIdList' ,'warehouseIdList']
    },
    methods:{
        // 仓库弹框隐藏方法
        updateWarehouseSelDlgVis (vis) {
            this.warehouseSelDlgVis = vis
        },
        // 选择仓库返回
        chooseWarehouse (data) {
            this.query.warehouseId = data.id
            this.query.warehouseName = data.name
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
    }
}
</script>

<style scoped>
    .query-search /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
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