<template>
    <basic-search :query="query" :handle-search="handleSearch" :handle-reset="handleReset">
        <el-form-item label="账号编号">
            <el-input v-model="query.loginName" clearable />
        </el-form-item>
        <el-form-item label="账号名称">
            <el-input v-model="query.name" clearable />
        </el-form-item>
        <!-- <el-form-item label="账号名称">
            <el-select
                v-model="query.name"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="onSearch"
                :loading="loading">
                <el-option
                    v-for="item in state.searchAccountList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                </el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="启停标记">
             <el-select
                v-model.number="query.validFlag"
                clearable
                placeholder="">
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
        //启停标记
        VALID_FLAG: {
            type: Object,
            default: () => {}
        },
        USER_TYPE: {
            type: Object,
            default: () => {}
        },
        //
        searchByName: Function,
        state: Object,
        startStop: Object
    },
    data () {
        return {
            loading: false,
        }
    },
    beforeCreate () {
        this.fields = [ 'loginName', 'name', 'barcode', {
            key: 'validFlag',
        }]
    },
    methods: {
        onSearch (n) {
            console.log('search', n);
            this.searchByName({
                params: {
                    name: n
                }
            })
        }
    }
}
</script>

