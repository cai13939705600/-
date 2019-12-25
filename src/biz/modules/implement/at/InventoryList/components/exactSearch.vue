<template>
    <basic-search class="warehouse-search" ref="basicSearch" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item
            label="盘点单号"
            >
            <comma-input v-model="query.codeList" :value="query.codeList"></comma-input>
        </el-form-item>
        <el-form-item
            label="盘点类型"
           >
            <el-select
                clearable
                v-model="query.type"
                placeholder="">
                <el-option
                    v-for="item in STOCK_COU_TYPE.array"
                    :key="item.id"
                    :label="item.enumValueCn"
                    :value="item.enumCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            label="货主名称">
            <el-input
                clearable
                v-model="query.ownerName"
                @focus="onClickProductCodes"
                placeholder="">
                <template slot="suffix">
                    <i @click="onClickProductCodes"
                        class="el-input__icon el-icon-more"></i>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item
            label="盘点状态"
            >
            <el-select
                clearable
                v-model="query.status"
                placeholder="">
                <el-option
                    v-for="item in STOCK_COU_STATUS.array"
                    :key="item.id"
                    :label="item.enumValueCn"
                    :value="item.enumCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            label="物料名称"
            >
            <el-input
            clearable
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
            <shipper-sel-dlg
            :visible="shipperSelDlgVis"
            :handle-save="chooseProducts"
            :update-vis="updateShipperSelDlgVis"/>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import commaInput from 'biz/components/commaInput'
import distPicker from 'biz/components/distPicker'
import carrierSelect from 'biz/components/carrierSelect'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import ShipperSelDlg from 'biz/components/shipperSelDlg'
export default {
    mixins: [ ExactSearch ],
    components: {
        commaInput,
        distPicker,
        carrierSelect,
        GoodsSelDlg,
        ShipperSelDlg
    },
    props: {
        state: Object,
        DO_STATE: {
            type: Array,
            default: () => ([]) 
        },
        STOCK_DIFF_TYPE:Object,
        STOCK_COU_STATUS:Object,
        STOCK_COU_TYPE:Object,
    },
    data () {
        return {
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
             //货主弹窗是否显示
            shipperSelDlgVis: false, 
            goodsSelDlgVis:false
        }
    },
    beforeCreate () {
        this.fields = [
            {
                key: 'codeList',
                default: []
            },
            {
                key: 'billCode1List',
                default: []
            },
            'billTypeId',
            {
                key: 'stateList',
                default: []
            },
            'createTime',
            'finishTime',
            'ownerName',
            'ownerId',

            // jt.date.getTodayZero()
            // jt.date.getTodayLast()
        ]
    },
    watch:{
        'query.ownerName' (val){
            if(!val){
                this.query.ownerId='';
            }
        }
    },
    created () {
    },
    methods: {
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        // 选择物料返回
        chooseProduct(product) {
            debugger
            if(!this.query.skuName){
                delete this.query.skuId;
            }
            this.query.skuName = product.name
            this.query.skuId = product.id
        },
        onClickProductCode (e) {
            // TODO 打开物料弹出框
            console.log(e);
            this.goodsSelDlgVis = true
        },
        updateShipperSelDlgVis (vis) {
            this.shipperSelDlgVis = vis
        },
        // 选择货主返回
        chooseProducts (product) {
            if(!this.query.ownerName){
                delete this.query.ownerId;
            }
            this.query.ownerId = product.id
            this.query.ownerName = product.name
        },
        onClickProductCodes (e) {
            // TODO 打开物料弹出框
            this.shipperSelDlgVis = true
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


