<template>
    <basic-search :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="单据编号">
            <el-input clearable v-model="query.code" />
        </el-form-item>
        <el-form-item label="单据类型">
            <el-input clearable v-model="query.name"/>
        </el-form-item>
        <el-form-item label="单据大类">
             <el-select clearable filterable v-model="query.billCategory">
                <el-option v-for="(item, key) of BILL_CATEGORY_TYPE.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
            </el-select>
        </el-form-item>
        <el-form-item label="状态">
            <el-select clearable filterable v-model="query.validFlag">
                <el-option v-for="(item, key) of VALID_FLAG.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
            </el-select>
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
export default {
    mixins: [ ExactSearch ],
    props: {
        VALID_FLAG:{
             type: Object,
            default: () => {}
        },
        BILL_CATEGORY_TYPE:{
             type: Object,
            default: () => {}
        },
        startStop: Object
    },
    beforeCreate () {
        this.fields = [ 'code', 'name', 'barcode' ]
    }
}
</script>

