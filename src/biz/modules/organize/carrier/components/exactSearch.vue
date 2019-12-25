<template>
    <basic-search :label-width="100" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="承运商编号">
            <el-input clearable v-model="query.logisticCode"/>
        </el-form-item>
        <el-form-item label="承运商名称">
            <el-input clearable v-model="query.logisticName"/>
        </el-form-item>
        <el-form-item label="状态">
            <el-select clearable filterable v-model="query.validFlag">
                <el-option v-for="(item, key) of startStop" :key="key" :label="item" :value="+key"/>
            </el-select>
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
export default {
    mixins: [ ExactSearch ],
    props: {
        startStop: Object
    },
    beforeCreate () {
        this.fields = [ 'logisticCode', 'logisticName', 'validFlag' ]   
    }
}
</script>
