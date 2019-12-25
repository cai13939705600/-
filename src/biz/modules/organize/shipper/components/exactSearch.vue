<template>
    <basic-search :label-width="100" :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="货主编号">
            <el-input clearable v-model="query.code"/>
        </el-form-item>
        <el-form-item label="货主名称">
            <el-input clearable v-model="query.name"/>
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
        this.fields = [ 'code', 'name', 'validFlag']
    }
}
</script>
