<template>
    <basic-search :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="库区编号">
            <el-input v-model="query.code" clearable/>
        </el-form-item>
        <el-form-item label="库区名称">
            <el-input v-model="query.name" clearable/>
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
export default {
    mixins: [ ExactSearch ],
    props: {
        libraries: {
            type: Array,
            default: () => ([])
        },
        DELETE_FLAG: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
    },
    beforeCreate () {
        this.fields = [ 'code', 'name' ]
    }
}
</script>

