<template>
    <basic-search
        class="rule-manage"
        :label-width="100"
        :query="query"
        :handle-search="handleSearch"
        :handle-reset="handleReset"
        :lot-attr-rule-list="lotAttrRuleList"
    >
        <el-form-item label="周转规则名称">
            <el-input clearable v-model="query.name" />
        </el-form-item>
        <el-form-item label="状态">
            <el-select clearable filterable v-model="query.validFlag"  placeholder="">
                <el-option v-for="(item, key) of startStop" :key="key" :label="item" :value="+key"/>
            </el-select>
        </el-form-item>
        <el-form-item label="批次规则">
            <el-input
                clearable
                v-model="ruleView"
                placeholder="">
                <template slot="suffix">
                    <i @click="onClickProductCode"
                        class="el-input__icon el-icon-more"></i>
                </template>
            </el-input>
        </el-form-item>
        <BatchRuleDlg
            :visible="batchRuleDlgVis"
            :handle-save="chooseProduct"
            :update-vis="updateShipperSelDlgVis"/>
    </basic-search>
</template>

<script>
    import ExactSearch from 'biz/mixins/exactSearch'
    import BatchRuleDlg from 'biz/components/batchRuleDlg'
    export default {
        mixins: [ExactSearch],
        props: {
            lotAttrRuleList:Array,
            VALID_FLAG:Object,
        },
        data(){
           return{
               lotAttrRuleId:'',
               batchRuleDlgVis: false,//当前模态框的显示隐藏
               ruleView:'',
               startStop: CNST.ENUMS.startStop,
           }
        },
        beforeCreate() {
            this.fields = ['name', 'validFlag', {key: 'validFlag'},'lotAttrRuleId','ruleView'];
        },
        components: {
            BatchRuleDlg
        },
        methods:{
            onClickProductCode (e) {
                this.batchRuleDlgVis = true
            },
            updateShipperSelDlgVis (vis) {
                this.batchRuleDlgVis = vis
            },
            // 选择商品返回  批次规则入参
            chooseProduct (product) {
                 //this.query.lotAttrRuleName = product.name
                 this.ruleView = product.name
                 this.query.lotAttrRuleId = product.id
            },
            //重置功能
            handleReset () {
                this.query = this.getDefaultQuery()
                this.ruleView = ''
                this.handleSearch({ ...this.query })
            },
        },
    }
</script>

<style lang="scss" scoped>
    @media screen and (max-width: 1920px) and (min-width: 1366px) {
        .rule-manage{
            .el-form-item {
                width: 28% !important;
            }
        }
    }
</style>

