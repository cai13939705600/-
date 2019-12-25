<template>
    <basic-search class="warehouse-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
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
            :remote-method="remoteMethod"
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
            label="物料名称"
            prop="skuName">
            <el-input clearable v-model="query.skuName"/>
        </el-form-item>
        <el-form-item
            label="物料编码"
            prop="skuCode">
                <el-input clearable v-model="query.skuCode"/>
        </el-form-item>
        <el-form-item label="库存类型"   prop="inventoryType">
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
        <el-form-item label="生产批次" prop="produceBatch">
            <el-input v-model="query.produceBatch"/>
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
        OwnerList:Array
    },
    data () {
        return {
            // 缓存已经选择的产品
            product: null,
            loading:false,
            locationList:[],
            skuList:[]
        }
    },
    beforeCreate () {
        this.fields = [
            'locationId',
            'skuCode',
            'skuName',
            'inventoryType',
            'inboundDate',
            'madeDate',
            'expireDate',
            'produceBatch',
            'ownerId'
        ]
    },
    watch: {
    },
    created () {
    },
    methods: {
        remoteMethod(query) {
            debugger
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


