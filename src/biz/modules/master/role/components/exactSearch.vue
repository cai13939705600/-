<template>
    <basic-search :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="角色名称">
            <el-input v-model="query.name" clearable />
        </el-form-item>
        <el-form-item label="角色类型">
             <el-select
                collapse-tags
                v-model="query.type"
                filterable
                clearable
                placeholder="">
               <el-option
                    v-for="item in ROLE_TYPE.array"
                    :key="item.enumCode + ''"
                    :label="item.enumValueCn"
                    :value="item.enumCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="启停标记">
            <el-select
                collapse-tags
                v-model="query.validFlag"
                filterable
                clearable
                placeholder="">
                <el-option v-for="(item, key) of startStop" :key="key" :label="item" :value="+key"/>
            </el-select>
        </el-form-item>
    </basic-search>
</template>

<script>
import ExactSearch from 'biz/mixins/exactSearch'
import { mapActions } from 'vuex';
export default {
    mixins: [ ExactSearch ],
    props: {
        state: Object,

        startStop: Object,
        //启停标记
        VALID_FLAG: {
            type: Object,
            default: () => {}
        },
        //角色类型
        ROLE_TYPE:{
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            loading: false
        }
    },
    beforeCreate () {
        this.fields = [ 'name', 'type', {
            key: 'validFlag',
            //default: 1
        } ]
    },
    methods: {
        ...mapActions('master/role', ['queryRolesByName']),
        onSearch (val) {
            this.queryRolesByName({
                params: {
                    name: val
                }
            })
        }
    }
}
</script>

