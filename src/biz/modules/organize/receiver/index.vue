<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :update-state="updateState"
            :handle-search="handleSearch"
            :start-stop="startStop"/>
        <exact-list
            ref="exactList"
            :table-h="tableH"
            :state="state"
            :exporting="exporting"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-edit="handleEdit"
            :handle-start="handleStart"
            :handle-stop="handleStop"
            :handle-export="handleExport"/>
        <entity-dialog
            :module-name="moduleName"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :update-state="updateState"
            :query-list="queryList"
            :handle-save="handleSave"/>
        <a ref="exportLink"></a>
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import { cloneDeep } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'

export default {
    name: 'organize_receiver',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'organize/receiver',
            // 模块名称
            moduleName: '收货人',
            // 导出中
            exporting: false,
            startStop: CNST.ENUMS.startStop
        }
    },
    created () {
        this.registStore(store)
    },
    mounted () {

    },
    methods: {
        //导出
        handleExport(){
            const query = cloneDeep(this.$refs.exactSearch.query)
            removeEmptyAttr(query)
            return download({
                url: process.env.VUE_APP_API_PREFIX+'/ba/rest/api/consignee/exportExcel',
                data: query
            });
        },
        // 编辑按钮响应事件
        handleEdit (rows) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.state.entity = rows[0]
            this.state.entity.storerName = rows[0].storerName
            this.state.entity.storerId = rows[0].storerId
            this.state.entity.province = rows[0].provinceId
            this.state.entity.city = rows[0].cityId
            this.state.entity.district = rows[0].districtId
            console.log(this.state.entity,'this.state.entity');    
        },
        handleSave (entity, cb, type) {
            const params = entity
            if (type === 'add') {
                // 新建
                this.createEntity(params, cb)
            } else {
                // 更新
                this.updateEntity(params, cb)
            }
        },
        // 启用
        handleStart (receiverIds) {
            this.dispatch('startOrStop', { params: { idList: receiverIds ,validFlag: 1}, cb: this.queryList })
        },
        // 停用
        handleStop (receiverIds) {
            this.dispatch('startOrStop', { params: { idList: receiverIds ,validFlag: 0}, cb: this.queryList })
        },
        //将查询条件转为后台需要的格式
        queryToEnd (query){ 
            if(query.storerName){
                delete query.storerName
            }else{
                delete query.storerId
            }
            console.log("执行queryTOEnd",query)
        },
    }
}
</script>