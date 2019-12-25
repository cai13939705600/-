<template>
    <basic-search class="warehouse-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="批次属性" prop="name">
             <el-input v-model="query.name"/>
        </el-form-item>
        <el-form-item label="状态">
            <el-select clearable filterable v-model="query.validFlag">
                <el-option v-for="(item, key) of VALID_FLAG.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
            </el-select>
        </el-form-item>
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
        inventoryTypes: Array,
         VALID_FLAG:{
             type: Object,
            default: () => {}
        },
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
            'warehouseId',
            'zoneId',
            'inventoryType',
            'stockLock',
            'brandName',
            'skuNo',
            'lotNo',
            'inboundDate',
            'madeDate',
            'expireDate',
            'produceBatch',
            'batchCode',
            'attr1',
            'attr2',
            'attr3',
            'attr4',
            'attr5',
            'attr6',
            'attr7',
            'attr8',
            'attr9',
            'attr10',
            'skuName'
        ]
    },
    watch: {
        // 物料防止用户手动删除而产生的bug
        'query.skuNo' (n) {
            if (n !== this.product.id) {
                this.product = null
                return ''
            }
            return n;
        }
    },
    created () {
    },
    methods: {
        // 显示隐藏物料弹窗
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        // 选择物料返回
        chooseProduct (product) {
            debugger
            if(this.query.skuName){
                delete this.query.skuName;
            }
            this.query.skuNo = product.code
            this.query.skuName = product.name
        },
        querySearchAsync(queryString, callback) {  
          var list = [{}];  
          var that = this;
          api.sku.queryList({name: that.query.skuName}).then(({ head = {}, body = {} })=>{  
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
          this.dto.skuName=item.name;
          this.dto.skuNo=item.code;
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
</style>


