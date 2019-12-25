<template>
    <basic-search :query="query" :handle-search="handleSearch"  :handle-reset="handleReset">
        <el-form-item label="源物料编码">
            <el-input clearable v-model="query.sourceSkuCode" />
        </el-form-item>
        <el-form-item label="源物料名称">
            <el-input clearable v-model="query.sourceSkuName" />
        </el-form-item>
        <el-form-item label="目标物料名称" label-width="92px">
            <el-input clearable v-model="query.targetSkuName" />
        </el-form-item>
        <el-form-item label="规格型号">
            <el-input clearable v-model="query.targetSkuSpec" />
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
export default {
    mixins: [ ExactSearch ],
    data () {
        return {
            startStop: CNST.ENUMS.startStop
        }
    },
    beforeCreate () {
        this.fields = [ 'sourceSkuCode', 'sourceSkuName', 'targetSkuName','targetSkuSpec' ]
    }
}
</script>

