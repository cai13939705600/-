<template>
    <basic-search :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="库区名称" props="zoneId">
            <el-select
                v-model="query.zoneId"
                filterable
                clearable
                >
                <el-option
                    v-for="item in libraries"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="库位编号" props="code">
            <el-input v-model="query.code" clearable/>
        </el-form-item>
        <!-- <el-form-item
            label="ABC分类"
            props="cycleClass">
            <el-select
                v-model="query.cycleClass"
                clearable
                placeholder="请选择">
                <el-option
                v-for="item in LOCATION_CYCLE_CLASS.array"
                :key="item.enumCode + ''"
                :label="item.enumValueCn"
                :value="item.enumCode">
                </el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item
            label="状态" props="validFlag">
            <el-select
                v-model="query.validFlag"
                clearable
                placeholder="请选择">
                <el-option
                v-for="item in VALID_FLAG.array"
                :key="item.enumCode + ''"
                :label="item.enumValueCn"
                :value="item.enumCode">
                </el-option>
            </el-select>
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import SearchSelect from '../../mixin/searchSelect'
export default {
    mixins: [ ExactSearch, SearchSelect ],
    props: {
        VALID_FLAG: {
            type: Object,
            default: () => {}
        },
        LOCATION_CYCLE_CLASS: {
            type: Object,
            default: () => {}
        }
    },
    beforeCreate () {
        this.fields = [
            'zoneId',
            'code',
            //'cycleClass',
            'validFlag',
        ]
    },
    data () {
        return {
        }
    },
    methods: {
    }
}
</script>

