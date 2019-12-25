<template>
    <basic-search class="sum-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="仓库" prop="warehouseId" label-width="102px">
            <el-select
                filterable
                clearable
                v-model="query.warehouseId">
                <el-option
                    v-for="item in storeList"
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
                v-model="query.storerId">
                <el-option
                    v-for="item in ownerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            class="w50p"
            label="入库日期"
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
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import WarehouseSelDlg from 'biz/components/warehouseSelDlg'
export default {
    components: {
        WarehouseSelDlg
    },
    mixins: [ ExactSearch ],
    props: {
        //货主下拉框
        ownerList: {},
    },
    data(){
        return{
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
            //仓库下拉列表
            storeList:[]
        }
    },
    computed: {
    },
    created(){
        this. queryCurrentUserWarehouse()
    },
    beforeCreate () {
        this.fields = [ 'receivedTime','storerId' ,'warehouseId']
    },
    methods:{
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
    .sum-search /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
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