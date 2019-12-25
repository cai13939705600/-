<template>
    <basic-search class="warehouse-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item
            label="From库位"
            props="fromLocationNo">
            <el-input v-model="query.fromLocationNo"/>
        </el-form-item>
        <el-form-item
            label="To库位"
            props="toLocationNo">
            <el-input v-model="query.toLocationNo"/>
        </el-form-item>
        <el-form-item label="操作类型" props="operateType">
            <el-select
                v-model="query.operateType"
                placeholder=""
                @change="changeOperateType">
                <el-option :value="'100'" label="入库"/>
                <el-option :value="'200'" label="出库"/>
                <el-option :value="'300'" label="在库"/>
            </el-select>
        </el-form-item>
        <el-form-item label="动作节点" props="actionNode" v-if="!query.operateType">
            <el-select
                v-model="query.actionNode"
                placeholder=""
                >
                <el-option :value="'010,011'" label="收货"/>
                <el-option :value="'012,013'" label="取消收货"/>
                <el-option :value="'021'" label="上架"/>
                <el-option :value="'200'" label="移库"/>
                <el-option :value="'210'" label="批次调整"/>
                <el-option :value="'220'" label="盘亏"/>
                <el-option :value="'221'" label="盘盈"/>
                <el-option :value="'230'" label="冻结"/>
                <el-option :value="'231'" label="解冻"/>
                <el-option :value="'410'" label="拣货"/>
                <el-option :value="'411'" label="取消拣货"/>
                <el-option :value="'420'" label="复核"/>
                <el-option :value="'430'" label="发货"/>
            </el-select>
        </el-form-item>
        <el-form-item label="动作节点" props="actionNode" v-if="query.operateType=='100'">
            <el-select
                v-model="query.actionNode"
                placeholder=""
                >
                <el-option :value="'010,011'" label="收货"/>
                <el-option :value="'012,013'" label="取消收货"/>
                <el-option :value="'021'" label="上架"/>
            </el-select>
        </el-form-item>
        <el-form-item label="动作节点" props="actionNode" v-if="query.operateType=='200'">
             <el-select
                v-model="query.actionNode"
                placeholder=""
                >
                <el-option :value="'410'" label="拣货"/>
                <el-option :value="'411'" label="取消拣货"/>
                <el-option :value="'420'" label="复核"/>
                <el-option :value="'430'" label="发货"/>
            </el-select>
        </el-form-item>
        <el-form-item label="动作节点" props="actionNode" v-if="query.operateType=='300'">
             <el-select
                v-model="query.actionNode"
                placeholder=""
                >
                <el-option :value="'200'" label="移库"/>
                <el-option :value="'210'" label="批次调整"/>
                <el-option :value="'220'" label="盘亏"/>
                <el-option :value="'221'" label="盘盈"/>
                <el-option :value="'230'" label="冻结"/>
                <el-option :value="'231'" label="解冻"/>
            </el-select>
        </el-form-item>
        <el-form-item label="单号" props="billNo">
            <el-input v-model="query.billNo"/>
        </el-form-item>
        <!-- <el-form-item  label="明细行号" props="lineNo">
            <el-input v-model="query.lineNo"/>
        </el-form-item> -->
        <!-- <el-form-item   label="From批次号" props="fromLotNo">
            <el-input  v-model="query.fromLotNo"/>
        </el-form-item>
        <el-form-item label="To批次号" props="toLotNo">
            <el-input v-model="query.toLotNo"/>
        </el-form-item> -->
        <el-form-item props="fromSkuName" label="From物料" >
            <el-autocomplete  clearable v-model="query.fromSkuName" :fetch-suggestions="querySearchAsync" placeholder="" @select="handleSelect">
                                <i class="el-icon-more" slot="suffix" @click="updateGoodsSelDlgVis(true,'from')"></i>
                            </el-autocomplete>
        </el-form-item>
        <el-form-item props="toSkuName" label="To物料"  >
            <el-autocomplete   clearable v-model="query.toSkuName" :fetch-suggestions="querySearchAsync" placeholder="" @select="handleSelect1">
                                <i class="el-icon-more" slot="suffix" @click="updateGoodsSelDlgVis(true,'to')"></i>
                            </el-autocomplete>
        </el-form-item>
        <el-form-item label="From数量" props="fromQty">
            <el-input  v-model="query.fromQty"/>
        </el-form-item>
        <el-form-item  label="To数量" props="toQty">
            <el-input v-model="query.toQty"/>
        </el-form-item>
        <el-form-item
            class="w50p"
            label="操作时间"
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
        </el-form-item>
         <!-- 物料列表选择模块 -->
        <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :update-vis="updateGoodsSelDlgVis"
            :handle-save="chooseProduct"/>
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
        locationList: Array,
        locationLoading: Boolean,
        areaLoading: Boolean,
    },
    data () {
        return {
            goodsSelDlgVis: false,
            from:false,
            to:false,
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
        }
    },
    beforeCreate () {
        this.fields = [
            'warehouseId',
            'fromLocationId',
            'toLocationId',
            'operateType',
            'actionNode',
            'billNo',
            'lineNo',
            'fromSkuName',
            'toSkuName',
            'fromQty',
            'toQty',
            'finishTime'
        ]
    },
    watch: {
        'query.fromSkuName' (newVal){
            if(!newVal){
                this.query.fromSkuNo = ''
            }
        },
        'query.toSkuName' (newVal){
            if(!newVal){
                this.query.toSkuNo = ''
            }
        }
    },
    created () {
    },
    methods: {
          // 显示隐藏物料弹窗
        updateGoodsSelDlgVis (vis,v) {
            this.goodsSelDlgVis = vis
            if(v=='from'){
                this.from = true
            }else if(v=='to'){
                this.to = true
            }
        },
        changeOperateType(){
            this.query.actionNode=''
        },

        querySearchAsync(queryString, callback) {  
          var list = [{}];  
          var that = this;
          api.goods.queryGoodsList({name: that.query.skuName}).then(({ head = {}, body = {} })=>{  
              for(let i of body.records){  
                  i.value = i.name;
                  i.id = i.code
              }  
              list =  body.records 
              callback(list);  
          }).catch((error)=>{  
          console.log(error);  
          });  
        },
         // 选择物料返回
        chooseProduct (product) {
           if(this.from){
                this.query.fromSkuNo = product.code
                this.query.fromSkuName = product.name
           }
           if(this.to){
                this.query.toSkuNo = product.code
                this.query.toSkuName = product.name
           }
        },
        handleSelect:function(item){
          this.query.fromSkuName=item.name;
          this.query.fromSkuNo=item.code;
        },
        handleSelect1:function(item){
          this.query.toSkuName=item.name;
          this.query.toSkuNo=item.code;
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


