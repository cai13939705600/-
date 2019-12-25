<template>
    <basic-search class="cancle-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item 
            label="入库通知单"
            >
            <el-input v-model="query.asnCode" clearable/>
        </el-form-item>
        <el-form-item 
            label="业务单号"
            >
            <el-input v-model="query.billCode1" clearable/>
        </el-form-item>
        <el-form-item label="物料名称"
            >
            <el-input v-model="query.skuName" clearable/>
        </el-form-item>
        <el-form-item label="规格"
            >
            <el-input v-model="query.skuSpec" clearable/>
        </el-form-item>
        <el-form-item label="项目名称"
            >
            <el-input v-model="query.projectName" clearable/>
        </el-form-item>
        <el-form-item
            label="物料编码"
            >
            <el-input
                v-model="query.skuCode"
                clearable
                placeholder="请选择">
                <template slot="suffix">
                    <i
                        @click="onClickProductCode"
                        class="el-input__icon el-icon-more"></i>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="供应商"
            >
            <el-input v-model="query.supplierName" clearable/>
        </el-form-item>
        <el-form-item label="货主" prop="storerIdList">
            <el-select
                filterable
                clearable
                multiple
                collapse-tags
                v-model="query.storerIdList">
                <el-option
                    v-for="item in ownerList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item
            class="w50p"
            label="收货时间"
            prop="createTime"
            ref="createTime">
            <el-date-picker
                clearable
                v-model="query.createTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="~"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
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
import GoodsSelDlg from 'biz/components/goodsSelDlg'
export default {
    mixins: [ ExactSearch ],
    components: {
        GoodsSelDlg
    },
    props: {
        //货主下拉框
        ownerList: {}
    },
    data(){
        return{
            goodsSelDlgVis: false,
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            }
        }
    },
    methods:{
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        // 选择物料返回
        chooseProduct (product) {
            this.query.skuCode = product.code
        },
        onClickProductCode (e) {
            // TODO 打开物料弹出框
            console.log(e);
            this.goodsSelDlgVis = true
        }
    },
    computed: {
    },
    beforeCreate () {
        this.fields = [ 'asnCode', 'billCode1', 'skuName', 'skuSpec', 'supplierName', 'skuCode','storerIdList',
        {
            key: 'createTime',
            default: [jt.date.getTodayZero(), jt.date.getTodayLast()]
        }]
    }
}
</script>

<style scoped>
    .cancle-search /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
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

