<template>
    <basic-search class="warehouse-search" ref="basicSearch" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item
            label="出库通知单号"
            label-width="88px"
            >
            <comma-input v-model="query.doCodeList" :value="query.doCodeList" clearable></comma-input>
        </el-form-item>
        <el-form-item
            label="业务单号"
            label-width="88px">
            <comma-input v-model="query.doBillCode1List" :value="query.doBillCode1List" clearable></comma-input>
        </el-form-item>
        <!-- <el-form-item 
            label="物料编码"
            label-width="88px">
            <el-input v-model="query.skuCode" clearable/>
        </el-form-item> -->
        <el-form-item 
            label="物料名称"
            label-width="88px">
            <el-input v-model="query.skuName" clearable/>
        </el-form-item>
        <el-form-item 
            label="规格"
            label-width="88px">
            <el-input v-model="query.skuSpec" clearable/>
        </el-form-item>
        <el-form-item 
            label="项目名称"
            label-width="88px">
            <el-input v-model="query.itemName" clearable/>
        </el-form-item>
        <el-form-item
            label="拣货单号"
            label-width="88px"
            >
            <comma-input v-model="query.ticketCodeList" :value="query.ticketCodeList" clearable></comma-input>
        </el-form-item>
        
        <el-form-item
            class="w50p"
            label="创建时间"
            label-width="88px"
            prop="createTime"
            ref="createTime"
            >
            <el-date-picker
                v-model="query.createTime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
            ></el-date-picker>
        </el-form-item>
         <el-form-item label="仓库" prop="warehouseId" class="w50p" label-width="88px">
            <el-select
                v-model="query.warehouseId"
                filterable
                clearable
                placeholder=""
                >
                <el-option
                    v-for="item in whses"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            label="库区"
            label-width="88px"
           >
            <el-select
                clearable
                v-model="query.fromZoneId"
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
            label="状态"
            label-width="88px">
            <el-select
                multiple
                clearable
                collapse-tags
                v-model="query.stateList"
                placeholder="">
                <el-option
                    v-for="item in PICK_STATE"
                    :key="item.enumCode"
                    :label="item.enumValueCn"
                    :value="item.enumCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            class="w50p"
            label="发货时间"
            label-width="88px"
            prop="finishTime"
            >
            <el-date-picker
                v-model="query.finishTime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="货主" label-width="88px">
            <el-select
                v-model="query.storerId"
                >
                <el-option
                    v-for="item in OwnerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import commaInput from 'biz/components/commaInput'
import distPicker from 'biz/components/distPicker'
import carrierSelect from 'biz/components/carrierSelect'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
export default {
    mixins: [ ExactSearch ],
    components: {
        commaInput,
        distPicker,
        carrierSelect,
        GoodsSelDlg
    },
    props: {
        state: Object,
        PICK_STATE: {
            type: Array,
            default: () => ([]) 
        }
    },
    data () {
        return {
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
            whses:[],
            OwnerList:[],
            zoneList:[]
        }
    },
    beforeCreate () {
        this.fields = [
            {
                key: 'doCodeList',
                default: []
            },
            {
                key: 'doBillCode1List',
                default: []
            },
            'skuSpec',
            'skuName',
            'itemName',
            {
                key: 'ticketCodeList',
                default: []
            },
            {
                key: 'createTime',
                default: [jt.date.getTodayZero(), jt.date.getTodayLast()]
            },
            'warehouseId',
            'fromZoneId',
             {
                key: 'stateList',
                default: []
            },
            'storerId',
            'finishTime'
        ]
    },
    watch: {
        'query.warehouseId'(val){
           if(val){
               this.query.fromZoneId=''
               this.queryZoneList(val)
           }else{
               this.query.fromZoneId=''
               this.zoneList=[]
           }
              
       },
    },
    created () {
        this.queryWhses()
        this.getOwnerList()
        this.queryZoneList()
    },
    methods: {
         //查询仓库
        queryWhses () {
            this.$store.dispatch('app/queryWhses').then((data) => {
                this.whses = data
            })
        },

        //货主
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


