<template>
    <basic-search class="warehouse-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="物料"  prop="skuName">
            <el-autocomplete  clearable v-model="query.skuName" :fetch-suggestions="querySearchAsync" placeholder="" @select="handleSelect">
                                <i class="el-icon-more" slot="suffix" @click="updateGoodsSelDlgVis(true)"></i>
                            </el-autocomplete>
        </el-form-item>
        <el-form-item label="库存类型" prop="inventoryType">
                                <el-select
                                    v-model="query.inventoryType"
                                    placeholder=""
                                    :rules="[{ required: true, message: '请选择单位', trigger: 'blur' }]" 
                                    >
                                    <el-option
                                        v-for="item in inventoryTypes"
                                        :key="item.code+ ''"
                                        :label="item.name"
                                        :value="item.code + ''">
                                    </el-option>
                                </el-select>
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
        EC_PLATFORM: Object,
        inventoryTypes:Array
    },
    data () {
        return {
            goodsSelDlgVis: false,
            // 缓存已经选择的产品
            product: null,
        }
    },
    beforeCreate () {
        this.fields = [
            'skuNo',
            'inventoryType'
        ]
    },
    watch: {
        'query.skuName' (newValue){
            if(!newValue){
                this.query.skuNo = ''
            }
        }
    },
    created () {
    },
    methods: {
        // 显示隐藏物料弹窗
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
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
         handleSelect:function(item){
          this.query.skuName=item.name;
          this.query.skuNo=item.code;
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


