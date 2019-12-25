<template>
    <basic-search class="instock-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item 
            label="入库通知单"
            label-width="88px">
            <el-input v-model="query.code" clearable/>
        </el-form-item>
        <el-form-item 
            label="业务单号"
            label-width="88px">
            <el-input v-model="query.billCode1" clearable/>
        </el-form-item>
        <el-form-item 
            label="物料名称"
            label-width="88px">
            <el-input v-model="query.skuName " clearable/>
        </el-form-item>
        <el-form-item 
            label="原出库单号"
            label-width="88px">
            <el-input v-model="query.billCode2" clearable/>
        </el-form-item>
        <el-form-item 
            label="供应商名称"
            label-width="88px">
            <el-input v-model="query.supplierName " clearable/>
        </el-form-item>
        <!-- <el-form-item 
            label="作业状态"
            label-width="88px">
             <el-select
                multiple
                collapse-tags
                v-model="query.stateList"
                placeholder="请选择">
                <el-option
                    v-for="item in ASN_STATE.array"
                    :key="item.enumCode + ''"
                    :label="item.enumValueCn"
                    :value="item.enumCode + ''">
                </el-option>
            </el-select>
        </el-form-item> -->
        <!-- <el-form-item
            label="物料编码"
            label-width="88px">
            <el-input
                v-model="query.skuCode"
                placeholder="请选择">
                <template slot="suffix">
                    <i
                        @click="onClickProductCode"
                        class="el-input__icon el-icon-more"></i>
                </template>
            </el-input>
        </el-form-item> -->
        <el-form-item label="项目名称"
            label-width="88px">
            <el-input v-model="query.projectName" clearable/>
        </el-form-item>
        <el-form-item label="规格"
            label-width="88px">
            <el-input v-model="query.skuSpec" clearable/>
        </el-form-item>
        <el-form-item
            class="w50p"
            label="下单时间"
            label-width="88px"
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
        <el-form-item 
            label="作业状态"
            label-width="88px">
             <el-select
                multiple
                collapse-tags
                v-model="query.stateList"
                placeholder="请选择">
                <el-option
                    v-for="item in ASN_STATE.array"
                    :key="item.enumCode + ''"
                    :label="item.enumValueCn"
                    :value="item.enumCode + ''">
                </el-option>
            </el-select>
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
    props: {
        //单据类型
        billTypes:{},
        // 作业状态
        ASN_STATE: {
            type: Object,
            default: () => {}
        },
        // 时间类型
        ASN_SEARCH_DATE_TYPE: {
            type: Object,
            default: () => {}
        },
    },
    components: {
        GoodsSelDlg
    },
    /* watch: {
        // 物料防止用户手动删除而产生的bug
        'query.skuCode' (n) {
            if (n !== this.product.id) {
                this.product = null
                return ''
            }
            return n;
        }
    }, */
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
        },

    },
    data(){
        return{
            goodsSelDlgVis: false,
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },    
        }
    },
    beforeCreate () {
        this.fields = [ 'code', 'billCode1','skuName ','billCode2','supplierName ', 'typeList', 'stateList','skuSpec',
        'projectName',
        {
            key: 'createTime',
            default: [jt.date.getTodayZero(), jt.date.getTodayLast()]
        },
        {
            key: 'returnFlag',
            default: 1
        },
        'createUserCode' ]
    }
}
</script>

<style scoped>
    .instock-search /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
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