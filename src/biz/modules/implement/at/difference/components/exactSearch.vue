<template>
    <basic-search :label-width="100" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="货主" props="ownerId">
            <el-select
                v-model="query.ownerId"
                filterable
                clearable
                placeholder=""
                >
                <el-option
                    v-for="item in getStorerList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        
        <el-form-item label="实物状态">
            <el-select clearable filterable v-model="query.status">
                <el-option v-for="(item, key) of STOCK_DIFF_STATUS.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
            </el-select>
        </el-form-item>
        <el-form-item label="账务状态">
            <el-select clearable filterable v-model="query.financeStatus">
                <el-option v-for="(item, key) of STOCK_DIFF_STATUS.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
            </el-select>
        </el-form-item>
         <el-form-item
            label="物料名称"
            >
            <el-input
                v-model="query.skuName"
                @focus="onClickProductCode"
                placeholder="">
                <template slot="suffix">
                    <i
                        @click="onClickProductCode"
                        class="el-input__icon el-icon-more"></i>
                </template>
            </el-input>
        </el-form-item>
         <el-form-item
            class="w50p"
            label="创建时间"
            prop="createTime"
            ref="createTime"
            >
            <el-date-picker
                clearable
                v-model="query.createTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="~"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
            </el-form-item>
            <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :handle-save="chooseProduct"
            :update-vis="updateGoodsSelDlgVis"/>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import ShipperSelDlg from 'biz/components/shipperSelDlg'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
export default {
    mixins: [ ExactSearch ],
    props: {
        STOCK_DIFF_STATUS:Object
    },
    components: {
        ShipperSelDlg,GoodsSelDlg
    },
    data(){
        return{
            //货主弹窗是否显示
            shipperSelDlgVis: false,  
            getStorerList:[] ,
            goodsSelDlgVis:false,
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
        }
    },
    watch:{
        'query.skuName' (val){
            if(!val){
                this.query.skuId='';
            }
        }
    },
    beforeCreate () {
        this.fields = [  'ownerId', 'skuName', 'status','skuId','financeStatus']
    },
    created(){
        this.getStorer()
    },
    methods: {
        getStorer(){
            api.organize.queryStorerList({}).then(({head,body})=>{
                if(head.code==200&&body.records){
                    this.getStorerList = body.records
                }
            })
        },
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        // 选择物料返回
        chooseProduct (product) {
            debugger
            this.query.skuId = product.id
            this.query.skuName = product.name
        },
        onClickProductCode (e) {
            // TODO 打开物料弹出框
            console.log(e);
            this.goodsSelDlgVis = true
        },
    }
}
</script>
