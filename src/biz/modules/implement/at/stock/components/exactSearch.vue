<template>
    <basic-search class="warehouse-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item
            label="库区"
            prop="zoneId">
            <el-select
                clearable
                v-model="query.zoneId"
                filterable
                remote
                reserve-keyword
                placeholder=""
                :remote-method="proxyRemoteMethod('area')"
                :loading="areaLoading"
                >
                <el-option
                    v-for="item in areaList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            label="库位"
            prop="locationId">
            <el-select
            v-model="query.locationId"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder=""
            :remote-method="remoteMethods"
            :loading="loading"
            >
            <el-option
            v-for="item in locationList"
            :key="item.id"
            :label="item.code"
            :value="item.id">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item
            label="库存类型"
            
            prop="inventoryType"
            >
            <el-select
                clearable
                v-model="query.inventoryType"
                placeholder="">
                <el-option
                v-for="item in inventoryTypes"
                :key="item.code + ''"
                :label="item.name"
                :value="item.code">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            label="是否冻结"
            
            prop="stockLock"
            >
            <el-select
                clearable
                v-model="query.stockLock"
                placeholder="">
                <el-option :value="'1'" label="是"/>
                <el-option :value="'0'" label="否"/>
            </el-select>
        </el-form-item>
        <el-form-item label="物料名称" prop="skuName"  >
            <!-- <el-autocomplete  clearable v-model="query.skuId" :fetch-suggestions="querySearchAsync" placeholder="请输入关键词" @select="handleSelect">
            </el-autocomplete> -->
            <el-select
            v-model="query.skuName"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder=""
            :remote-method="remoteMethod"
            :loading="loading"
            >
            <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.name">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="物料编码"  >
            <!-- <el-autocomplete  clearable v-model="query.skuId" :fetch-suggestions="querySearchAsync" placeholder="请输入关键词" @select="handleSelect">
            </el-autocomplete> -->
            <el-select
            v-model="query.skuId"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder=""
            :remote-method="remoteMethodss"
            :loading="loading"
            >
            <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.code"
            :value="item.id">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="入库日期" prop="inboundDate">
            <el-date-picker
                v-model="query.inboundDate"
                type="date"
                placeholder="">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="生产日期" prop="madeDate">
            <el-date-picker
                v-model="query.madeDate"
                type="date"
                placeholder="">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="失效日期" prop="expireDate">
            <el-date-picker
                v-model="query.expireDate"
                type="date"
                placeholder="">
            </el-date-picker>
        </el-form-item>
        <el-form-item
            prop="produceBatch"
            label="生产批次"
            >
            <el-input clearable v-model="query.produceBatch"/>
        </el-form-item>
        <el-form-item
            prop="attr1"
            label="项目名称">
            <el-input clearable v-model="query.attr1"/>
        </el-form-item>
        <el-form-item label="货主">
            <el-select
                v-model="query.ownerId"
                >
                <el-option
                    v-for="item in OwnerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <!-- 物料列表选择模块 -->
        <!-- <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :update-vis="updateGoodsSelDlgVis"
            :handle-save="chooseProduct"/> -->
            <!-- :params="query" -->
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
        locationLoading: Boolean,
        areaLoading: Boolean,
        inventoryTypes: Array,
        state:Object
    },
    data () {
        return {
            goodsSelDlgVis: false,
            options:[],
            loading:false,
            locationList:[],
            OwnerList:[]
        }
    },
    beforeCreate () {
        this.fields = [
            'warehouseId',
            'zoneId',
            'locationId',
            'inventoryType',
            'stockLock',
            'brandName',
            'ownerId',
            'lotNo',
            'batchCode',
            'inboundDate',
            'madeDate',
            'expireDate',
            'produceBatch',
            'batchCode',
            'attr1',
            'attr6',
            'attr7',
            'attr8',
            'attr9',
            'attr10',
            'skuName',
            'skuId'
        ]
    },
    created () {
        this.queryLocationList()
        this.getOwnerList()
    },
    // updated(){
    //     this.state.qyparams = this.query
    // },
    methods: {
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
        // 显示隐藏物料弹窗
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        querySearchAsync(queryString) {  
          var that = this;
          api.goods.queryGoodsList({name: queryString}).then(({ head = {}, body = {} })=>{  
              if(head.code==200){
                  this.options = body.records 
              }
          }).catch((error)=>{  
            console.log(error);  
          });  
        },
        querySearchAsyncss(queryString) {  
          var that = this;
          api.goods.queryGoodsList({code: queryString}).then(({ head = {}, body = {} })=>{  
              if(head.code==200){
                  this.options = body.records 
              }
          }).catch((error)=>{  
            console.log(error);  
          });  
        },
        queryLocationList(a){
            api.library.queryLibraryLocations({zoneId:this.query.zoneId,code:a,page:{current: 1, size: 10000}}).then(({head,body})=>{
                if(head.code==200){
                    this.locationList = body.records
                }
            })
        },
        remoteMethod(query) {
            debugger
            if (query !== '') {
                this.querySearchAsync(query)
            } else {
                this.options = [];
            }
      },
      remoteMethodss(query) {
            debugger
            if (query !== '') {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.querySearchAsyncss(query,'code')
            }, 200);
            } else {
                this.options = [];
            }
      },
      remoteMethods(query){
           if (query !== '') {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
                this.queryLocationList(query)
            }, 200);
            } else {
                this.locationList = [];
            }
      },
      handleSelect:function(item){
          this.query.skuId=item.id;
        },
        // 选择物料返回
        chooseProduct (product) {
            debugger
            if(this.query.skuName){
                delete this.query.skuName;
            }
            this.query.skuNo = product.code
            this.query.skuName = product.name
        }
    },
    watch: {
        'query.skuName' (newValue){
            if(newValue){
                console.log('skuName',newValue);
                
            }
        },
        'query.zoneId': function(val){
            if(val){
                // api.library.queryLibraryLocations({zoneId:this.query.zoneId,page:{current: 1, size: 10000}}).then(({head,body})=>{
                // if(head.code==200){
                //     this.locationList = body.records
                // }
                this.locationList = []
                this.query.locationId = ''
            }else{
                this.queryLocationList()
            }
        }
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


