<template>
    <basic-search :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="物料编号">
            <el-input clearable v-model="query.code" />
        </el-form-item>
        <el-form-item label="物料名称">
            <el-input clearable v-model="query.name"/>
        </el-form-item>
        <el-form-item label="物料条码">
            <el-input clearable v-model="query.barcode"/>
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
export default {
    mixins: [ ExactSearch ],
    props: {

    },
    beforeCreate () {
        this.fields = [ 'code', 'name', 'barcode' ]
    }
}
</script>

