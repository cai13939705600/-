<template>
    <basic-search class="warehouse-search" ref="basicSearch" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item
            label="出库通知单号"
            label-width="88px"
            >
            <comma-input v-model="query.codeList" :value="query.codeList" clearable></comma-input>
        </el-form-item>
        <el-form-item
            label="业务单号"
            label-width="88px">
            <comma-input v-model="query.billCode1List" :value="query.billCode1List" clearable></comma-input>
        </el-form-item>
        <el-form-item label="物料名称"
        label-width="88px"
            >
            <el-input v-model="query.skuName" clearable/>
        </el-form-item>
        <el-form-item
            label="作业状态"
            label-width="88px">
            <el-select
                multiple
                clearable
                collapse-tags
                v-model="query.stateList"
                placeholder="">
                <el-option
                    v-for="item in DO_STATE"
                    :key="item.enumCode"
                    :label="item.enumValueCn"
                    :value="item.enumCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item 
            label="项目名称"
            label-width="88px">
            <el-input v-model="query.itemName" clearable/>
        </el-form-item>
        <el-form-item 
            label="规格"
            label-width="88px">
            <el-input v-model="query.skuSpec" clearable/>
        </el-form-item>
        <el-form-item
            label="单据类型"
            label-width="88px">
            <el-select
                clearable
                v-model="query.billTypeId"
                placeholder="">
                <el-option
                    v-for="item in state.billTypes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        
        <!-- <el-form-item 
            label="项目编号"
            label-width="88px">
            <el-input v-model="query.itemCode" clearable/>
        </el-form-item> -->
        
        <el-form-item
            class="w50p"
            label="创建时间"
            label-width="88px"
            prop="createTime"
            ref="createTime"
            >
            <el-date-picker
                v-model="query.createTime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
            ></el-date-picker>
        </el-form-item>
        <el-form-item
            class="w50p"
            label="发货时间"
            label-width="88px"
            prop="finishTime"
            >
            <el-date-picker
                v-model="query.finishTime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
            ></el-date-picker>
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import commaInput from 'biz/components/commaInput'
import distPicker from 'biz/components/distPicker'
import carrierSelect from 'biz/components/carrierSelect'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
export default {
    mixins: [ ExactSearch ],
    components: {
        commaInput,
        distPicker,
        carrierSelect,
        GoodsSelDlg
    },
    props: {
        state: Object,
        DO_STATE: {
            type: Array,
            default: () => ([]) 
        }
    },
    data () {
        return {
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
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
            'skuName',
            'billTypeId',
            {
                key: 'stateList',
                default: []
            },
            // 'itemCode',
            'itemName',
            'skuSpec',
            {
                key: 'createTime',
                default: [jt.date.getTodayZero(), jt.date.getTodayLast()]
            },
            'finishTime'
        ]
    },
    watch: {
    },
    created () {
    },
    methods: {
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


