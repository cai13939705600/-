<template>
    <basic-search class="warehouse-search" ref="basicSearch" :query="query" :handle-search="onSearch" :handle-reset="handleReset">
        <el-form-item
            label="出库通知单号"
            label-width="102px"
            >
            <comma-input v-model="query.doCodeList" :value="query.doCodeList"></comma-input>
        </el-form-item>
        <el-form-item
            label="拣货单号"
            label-width="102px">
            <comma-input v-model="query.ticketCodeList" :value="query.ticketCodeList"></comma-input>
        </el-form-item>
        <el-form-item
            label="状态"
            label-width="102px">
            <el-select
                multiple
                clearable
                collapse-tags
                v-model="query.stateList"
                placeholder="请选择作业状态">
                <el-option
                    v-for="item in PICK_STATE"
                    :key="item.enumCode"
                    :label="item.enumValueCn"
                    :value="item.enumCode">
                </el-option>
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
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import commaInput from 'biz/components/commaInput'
import distPicker from 'biz/components/distPicker'
import carrierSelect from 'biz/components/carrierSelect'
export default {
    mixins: [ ExactSearch ],
    components: {
        commaInput,
        distPicker,
        carrierSelect
    },
    props: {
        state: Object,
        // 编辑器
        carriers: {
            type: Array,
            default: () => ([])
        },
        PICK_STATE: {
            type: Array,
            default: () => [] 
        },
    },
    data () {
        return {
            pickerOptions: {
                ...CNST.OPTIONS.pickerOptions
            },
            province: undefined,
            city: undefined,
            area: undefined,
            address: undefined,
            goodsSelDlgVis: false,
        }
    },
    beforeCreate () {
        this.fields = [
            'doCodeList',
            'ticketCodeList',
            {
                key: 'stateList',
                default: []
            },
            {
                key: 'createTime',
                default: [jt.date.getTodayZero(), jt.date.getTodayLast()]
            },
        ]
    },
    watch: {
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
            this.query.goodsCode = product.barcode
        },
        onClickProductCode (e) {
            // TODO 打开物料弹出框
            console.log(e);
            this.goodsSelDlgVis = true
        },
        onFocus () {
        },
        validateStart (rule, value, callback) {
            if (this.query.endCreateTime) {
                if (new Date(this.query.startCreateTime) > new Date(this.query.endCreateTime)) {
                    return callback('开始时间大于结束时间')
                }
            }
            this.$refs.endCreateTime.clearValidate()
            return callback()
        },
        validateEnd (rule, value, callback) {
            if (this.query.startCreateTime) {
                if (new Date(this.query.startCreateTime) > new Date(this.query.endCreateTime)) {
                    return callback('结束时间小于开始时间')
                }
            }
            this.$refs.startCreateTime.clearValidate()
            return callback()
        },

        validateSendStart (rule, value, callback) {
            if (this.query.endDeliveryTime) {
                if (new Date(this.query.startDeliveryTime) > new Date(this.query.endDeliveryTime)) {
                    return callback('开始时间大于结束时间')
                }
            }
            this.$refs.endDeliveryTime.clearValidate()
            return callback()
        },
        validateSendEnd (rule, value, callback) {
            if (this.query.startDeliveryTime) {
                if (new Date(this.query.startDeliveryTime) > new Date(this.query.endDeliveryTime)) {
                    return callback('结束时间小于开始时间')
                }
            }
            this.$refs.startDeliveryTime.clearValidate()
            return callback()
        },
        onSearch () {
            this.$refs.basicSearch.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                this.handleSearch(this.query)
            })
        }
    }
}
</script>
<style scoped>
</style>


