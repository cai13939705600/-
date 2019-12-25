<template>
    <basic-search class="warehouse-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item
            label="物料名称"
            prop="skuName">
            <el-input clearable v-model="query.skuName"/>
        </el-form-item>
        <el-form-item
            label="规格"
            prop="skuSpec">
            <el-input clearable v-model="query.skuSpec"/>
        </el-form-item>
        <el-form-item
            label="供应商"
            prop="supplierName">
            <el-input clearable v-model="query.supplierName"/>
        </el-form-item>
        <el-form-item
            label="项目名称"
            prop="itemName">
            <el-input clearable v-model="query.itemName"/>
        </el-form-item>
        <!-- <el-form-item
            label="项目名称"
            prop="itemName">
            <el-input clearable v-model="query.itemName"/>
        </el-form-item> -->
        <el-form-item
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
        locationLoading: Boolean,
        areaLoading: Boolean,
        inventoryTypes: Array,
        OwnerList:Array
    },
    data () {
        return {
            // 缓存已经选择的产品
            product: null,
            loading:false,
            locationList:[],
            skuList:[],
            whses:[],
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
        }
    },
    beforeCreate () {
        this.fields = [
            'skuName',
            'skuSpec',
            'skuName',
            'supplierName',
            'itemName',
            'startTime',
            'endTime'
        ]
    },
    watch: {
    },
    created () {
        // this.queryWhses()
    },
    methods: {
        //查询仓库
        // queryWhses () {
        //     this.$store.dispatch('app/queryWhses').then((data) => {
        //         this.whses = data
        //     })
        // },
        //
        querySearchAsync(queryString, cb) {
            if(queryString !== ''){
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    api.user.queryCurrentUserWhses({name:queryString}).then(({head,body})=>{
                        if(head.code==200&&body.length>0){
                            for(let i of body){  
                                i.value = i.name;
                            }
                            cb(body)
                        }
                    })
                }, 200);
                
            }else{
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    api.user.queryCurrentUserWhses().then(({head,body})=>{
                        if(head.code==200&&body.length>0){
                            for(let i of body){  
                                i.value = i.name;
                            }
                            console.log(body)
                            cb(body)
                        }
                    })
                }, 200);
            }
        },
        handleSelect:function(item){
        //   this.query.warehouseName=item.name;
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    api.library.queryLibraryLocations({code:query,page:{current: 1, size: 10000}}).then(({head,body})=>{
                        if(head.code==200){
                            this.locationList = body.records
                        }
                    })
                }, 200);
            } else {
            }
       },
       remoteMethods(query){
           if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    api.goods.queryGoodsList({name:query,page:{current: 1, size: 10000}}).then(({head,body})=>{
                        if(head.code==200){
                            this.skuList = body.records
                        }
                    })
                }, 200);
            } else {
            }
       },
       remoteMethodss(query){
           if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    api.goods.queryGoodsList({code:query,page:{current: 1, size: 10000}}).then(({head,body})=>{
                        if(head.code==200){
                            this.skuList = body.records
                        }
                    })
                }, 200);
            } else {
            }
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


