<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :update-state="updateState"
            :handle-search="handleSearch"
            :libraries="libraries"
            :DELETE_FLAG="DELETE_FLAG"/>
        <exact-list
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-delete="handleDelete"
            :handle-export="handleExport"/>
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :query-list="queryList"
            :handle-save="handleSave"
            :libraries="libraries"/>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'

import { mapState } from 'vuex'
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'

export default {
    name: 'master_library_area',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog
    },
    computed: {
        ...mapState('enums', [
            'DELETE_FLAG'
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'library/area',
            // 模块名称
            moduleName: '库区',
            libraries: [{
                value: '1',
                label: '库区1'
                }, {
                value: '2',
                label: '库区2'
                }, {
                value: '3',
                label: '库区3'
                }, {
                value: '4',
                label: '库区4'
                }, {
                value: '5',
                label: '库区5'
            }]
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums([
            "DELETE_FLAG" // 启停状态
        ])
    },
    mounted () {

    },
    methods: {
        handleExport () {
            const query = cloneDeep(this.$refs.search.query)
            removeEmptyAttr(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX + '/ba/rest/api/zone/exportExcel',
                data: query
            });
        },
        handleImport () {

        },
        handleEdit (row) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.updateState({ entity: row })
        }
    }
}
</script>

