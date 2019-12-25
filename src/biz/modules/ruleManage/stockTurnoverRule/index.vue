<template>
    <div class="p-basic">
        <exact-search
            ref="exactSearch"
            :update-state="updateState"
            :handle-search="handleSearch"
            :lot-attr-rule-list="lotAttrRuleList"
        />
        <exact-list
            ref="exactList"
            :table-h="tableH"
            :state="state"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :handle-add="handleAdd"
            :handle-view="handleView"
            :handle-edit="handleEdit"
            :handle-start="handleStart"
            :handle-stop="handleStop"/>
        <entity-dialog
            :module-name="moduleName"
            :lot-attr-rule-list="lotAttrRuleList"
            :visible="entityDlgVis"
            :action="entityDlgActn"
            :entity="state.entity"
            :update-vis="updateEntityDlgVis"
            :update-state="updateState"
            :query-list="queryList"
            :handle-save="handleSave"
        />
    </div>
</template>

<script>
    import PageList from 'biz/mixins/pageList'
    import store from './store'
    import ExactSearch from './components/exactSearch'
    import ExactList from './components/exactList'
    import EntityDialog from './components/entityDialog'
    import {cloneDeep} from 'common/utils/lodash'
    import {removeEmptyAttr} from 'common/utils/tools'

    export default {
        name: 'stockTurnoverRule',
        mixins: [PageList],
        components: {
            ExactSearch,
            ExactList,
            EntityDialog,
        },
        data() {
            return {
                // store唯一标识
                storeKey: 'ruleManage/stockTurnoverRule',
                // 模块名称批次规则弹出框
                moduleName: '库存周转规则',
                startStop: CNST.ENUMS.startStop,
                lotAttrRuleList: [],//批次规则下拉数据
                batchRuleDlgVis: false,//
                actionStr:null
            }
        },
        created() {
            this.registStore(store)
            /*this.queryEnums([
                "BILL_CATEGORY_TYPE",// 单据大类
                "VALID_FLAG",
                'YES_FLAG',
                'ATTR_FORMAT'
            ])*/
        },

        methods: {
            handleStart(ids) {
                this.dispatch('start', {params: {idList: ids}, cb: this.queryList})
            },
            handleStop(ids) {
                this.dispatch('stop', {params: {idList: ids}, cb: this.queryList})
            },
            handleEdit(row) {
                this.entityDlgVis = true
                this.entityDlgActn = 'edit'
                this.showDialog(row)
            },
            handleView(row) {
                this.entityDlgVis = true
                this.entityDlgActn = 'view'
                this.showDialog(row)
            },
            //模态框回显数据
            showDialog(row){
                api.rule.getTurnoverRuleById({
                    id:row.id
                }).then(({head = {}, body = {}}) => {
                    if (head.code === '200') {
                        let arr=[]
                        let obj={
                            code: row.code,
                            name: row.name,
                            lotAttrRuleName: body.lotAttrRuleName || row.lotAttrRuleName,
                            lotAttrRuleId: body.lotAttrRuleId || row.lotAttrRuleId,
                            description: body.description || row.description,
                            id: row.id
                        }
                        body.woTurnoverRuleDetailList.forEach(item=>{
                            arr.push({
                                lotattIndex:item.lotattIndex+'',
                                lotattName:item.lotattName+'',
                                sortWay:item.sortWay+'',
                                seqNum:item.seqNum+'',
                                accurateMatchFlag:item.accurateMatchFlag+'',
                            })
                        })
                        let param = Object.assign(obj, {
                            woTurnoverRuleDetailList:arr
                        })
                        console.log(body, ':', param)
                        this.updateState({entity: param})
                    }
                })
            },
        },

    }
</script>

