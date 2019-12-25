<template>
    <basic-search class="warehouse-search" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="RFID编码" prop="code">
             <el-input v-model="query.code"/>
        </el-form-item>
        <el-form-item label="状态">
            <el-select clearable filterable v-model="query.validFlag">
                <el-option v-for="(item, key) of VALID_FLAG.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
            </el-select>
        </el-form-item>
         <el-form-item
            class="w50p"
            label="创建时间"
            label-width="102px"
            prop="createTime"
            ref="createTime"
            >
            <el-date-picker
                clearable
                v-model="query.createTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="~"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
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
             pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
        }
    },
    beforeCreate () {
        this.fields = [
            'code',
            'validFlag',
            'createStartTime',
            'createEndTime',
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
</style>


