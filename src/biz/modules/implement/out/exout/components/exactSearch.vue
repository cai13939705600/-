<template>
    <basic-search class="warehouse-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        
        <!-- <el-form-item
            label="物料编码"
            >
            <el-input clearable v-model="query.skuId"/>
        </el-form-item> -->
        <el-form-item
            label="物料名称"
            >
            <el-input clearable v-model="query.skuName"/>
        </el-form-item>
         <el-form-item
            label="规格"
            >
            <el-input clearable v-model="query.skuSpec"/>
        </el-form-item>
        <!-- <el-form-item
            label="仓库"
           >
            <el-select
                clearable
                v-model="query.warehouseId"
                placeholder="">
                <el-option
                    v-for="item in wareHouseList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item
            label="库区"
           >
            <el-select
                clearable
                v-model="query.zoneId"
                placeholder="">
                <el-option
                    v-for="item in zoneList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
         <el-form-item
            label="库位"
            >
            <el-input clearable v-model="query.locationCode "/>
        </el-form-item>
        <!-- <el-form-item
            label="库位"
           >
            <el-select
                clearable
                v-model="query.locationId"
                placeholder="">
                <el-option
                    v-for="item in locationLists"
                    :key="item.id"
                    :label="item.code"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item
            label="状态"
           >
            <el-select
                clearable
                v-model="query.state"
                placeholder="">
                <el-option
                    key="10"
                    label="待处理"
                    value="10">
                </el-option>
                <el-option
                    key="20"
                    label="已处理"
                    value="20">
                </el-option>
            </el-select>
        </el-form-item>
        <!-- <el-form-item
            class="w50p"
            label="创建时间"
            prop="finishTime"
            >
            <el-date-picker
                v-model="query.finishTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="~"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder=""
                end-placeholder=""
            ></el-date-picker>
        </el-form-item> -->
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import GoodsSelDlg from 'biz/components/goodsSelDlg'

export default {
    mixins: [ ExactSearch ],
    components: {
        GoodsSelDlg
    },
    props: {
        proxyRemoteMethod: Function,
        areaList: Array,
        locationList: Array,
        locationLoading: Boolean,
        areaLoading: Boolean,
        YES_FLAG:Array
    },
    data () {
        return {
            goodsSelDlgVis: false,
            from:false,
            to:false,
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
            wareHouseList:[],
            zoneList:[],
            locationLists:[]
        }
    },
    beforeCreate () {
        this.fields = [
            // 'skuCode',
            'skuName',
            'zoneId',
            'skuSpec',
            'locationCode',
            'state',
            // 'finishTime'
        ]
    },
    watch: {
       'query.warehouseId'(val){
           if(val){
               this.query.zoneId=''
               this.query.locationId=''
               this.queryZoneList(val)
           }else{
               this.query.zoneId=''
               this.query.locationId=''
               this.zoneList=[]
           }
              
       },
       'query.zoneId'(val){
           this.query.locationId = ''
           this.queryLocationList(val)
       }
    },
    created () {
        this.queryCurrentUserWarehouse()
        this.queryZoneList()
        this.queryLocationList()
    },
    methods: {
       //查询当前用户绑定的仓库
       queryCurrentUserWarehouse(){
           api.stock.getWareHouseList({page: {current: 1, size: 1000}}).then(({head,body})=>{
               if(head.code==200){
                   this.wareHouseList = body
               }
           })
       },
       //查询库区
       queryZoneList(a){
           if(a){
               var  param = {warehouseId:a,page: {current: 1, size: 1000}}
           }else{
               var  param = {page: {current: 1, size: 1000}}
           }
           api.library.queryLibraryAreas(param).then(({head,body})=>{
               if(head.code==200){
                   this.zoneList = body.records
               }
           })
       },
       //查询库位
        queryLocationList(a){
           if(a){
               var  param = {zoneId:a,page: {current: 1, size: 1000}}
           }else{
               var  param = {page: {current: 1, size: 1000}}
           }
           api.library.queryLibraryLocations(param).then(({head,body})=>{
               if(head.code==200){
                   this.locationLists = body.records
               }
           })
       },
    }
}
</script>
<style scoped>
    .warehouse-search /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
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


