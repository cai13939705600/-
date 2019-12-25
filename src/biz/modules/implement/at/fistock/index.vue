<template>
    <div class="p-basic">
        <exact-search
            ref="search"
            :state="state"
            :update-state="updateState"
            :handle-search="handleSearch"
            :location-loading="state.locationLoading"
            :location-list="state.locationList"
            :area-loading="state.areaLoading"
            :area-list="state.areaList"
            :OwnerList="OwnerList"
            :inventory-types="inventoryTypes"
            :proxy-remote-method="proxyRemoteMethod"
            />
        <exact-list
            :state="state"
            :handle-export="handleExport"
            :showAdjust="showAdjust"
            :changeAmount="changeAmount"
            :checktechParam="checktechParam"
            :selection-changes="selectionChanges"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            />
        <entity-dialog
            :visible="adjustDialogVis"
            :update-vis="updateDialogVis"
            :closeAadjustDialog='closeAadjustDialog'
            :titles="titles"
            :queryList="queryList"
            :id="id"
            :name="name"
            :price="price"
            :entity="state.entity"
            :type="type"/>
        <tech-param-dialog
            :visibles="techDlgVis"
            :techParam="techParam"
            :closeTechDig="closeTechDig"
        />
    </div>
</template>

<script>
import PageList from 'biz/mixins/pageList'
import store from './store'
import ExactSearch from './components/exactSearch'
import ExactList from './components/exactList'
import EntityDialog from './components/entityDialog'
import { cloneDeep, isDate } from 'common/utils/lodash'
import { removeEmptyAttr } from 'common/utils/tools'
import { download } from 'common/utils/download'
import techParamDialog from 'biz/components/techParamDialog'


import { mapState, mapActions } from 'vuex'

export default {
    name: 'implement_at_fistock',
    mixins: [ PageList ],
    components: {
        ExactSearch,
        ExactList,
        EntityDialog,
        techParamDialog
    },
    computed: {
        ...mapState('enums', [
            
        ])
    },
    data () {
        return {
            // store唯一标识
            storeKey: 'stock/fistock',
            // 模块名称
            moduleName: '在库',
            inventoryTypes:[],
            OwnerList:[],
            checkList:[],
            moveDialogVis:false,
            adjustDialogVis:false,
            titles:'',
            type:0,
            techDlgVis:false,
            techParam:'',
            id:'',
            name:'',
            price:0,
        }
    },
    created () {
        this.registStore(store)
        // 获取枚举值
        this.queryEnums([
            
        ])
        api.stock.getInventoryTypes({}).then(
            ({ head = {}, body = {} }) => {
                if (head.code === '200') {
                   console.log(body)
                   this.inventoryTypes = body
                }
            }
            )
    },
    mounted () {
        this.getOwnerList()
        console.log('bbbbbbbbbb',this.state);
        
    },
    methods: {
        ...mapActions('stock/at', [
            'queryLocationList',
            'queryAreasList',
        ]),
        // 更新弹窗显示状态 目测只有false
        updateDialogVis (vis) {
            debugger
            this.moveDialogVis = vis
        },
        //技术参数查看
        checktechParam(param){
            this.techParam = param
            this.techDlgVis = true
        },
        //关闭技术参数页面
        closeTechDig(vis){
            this.techDlgVis = vis
        },
        // 选择
        selectionChanges (rows) {
            this.checkList = rows
        },
        //货主
        getOwnerList(){
             api.role.getStorerList({page: {
                    current: 1,
                    size: 10000
                }}).then(({ head = {}, body = [] })=>{  
                if(head.code==200){
                    this.OwnerList = body
                }
          }).catch((error)=>{  
            console.log(error);  
          });  
        },
        showAdjust(vis){
            this.titles = '项目调整'
            const rows = this.checkList;
            if(!rows.length){
                return this.$message.error('请选择一行库存明细操作')
            }
            if(rows.length>1){
                return this.$message.error('只能选择一行库存明细进行调整')
            }
            if(rows[0].availableQty==0){
                return this.$message.error('可用数量为0不允许调整')
            }
            this.updateState({ entity: rows[0] })
            this.type = 0 
            this.id = rows[0].itemId
            this.name = rows[0].itemName
            this.price = rows[0].price
            this.adjustDialogVis = vis
        },
        changeAmount(vis){
             this.titles = '金额调整'
            const rows = this.checkList;
            if(!rows.length){
                return this.$message.error('请选择一行库存明细操作')
            }
            if(rows.length>1){
                return this.$message.error('只能选择一行库存明细进行调整')
            }
            if(rows[0].availableQty==0){
                return this.$message.error('可用数量为0不允许调整')
            }
            this.updateState({ entity: rows[0] })
            this.type = 1 
            this.id = rows[0].itemId
            this.name = rows[0].itemName
            this.price = rows[0].price
            this.adjustDialogVis = vis
        },
        closeAadjustDialog(vis){
            this.adjustDialogVis = vis
        },
        adjustItems(){
            const rows = this.checkList;
            if(!row.length){
                return this.$message.error('请选择一行库存明细操作')
            }
            if(row.length>1){
                return this.$message.error('只能选择一行库存明细进行调整')
            }
            if(rows[0].availableQty==0){
                return this.$message.error('可用数量为0不允许调整')
            }
            
        },
        // 导出
        handleExport () {
            const query = cloneDeep(this.$refs.search.query)
            removeEmptyAttr(query)
            return download({
                url:process.env.VUE_APP_API_PREFIX+ '/wi/rest/api/stockFinance/exportExcel',
                data: query
            });
        },
         queryToEnd (query) {
            //操作时间
            if (query.finishTime && query.finishTime.length) {
                query.startTime = query.finishTime[0]
                query.endTime = query.finishTime[1]
            }
            delete query.finishTime
        },
        // 代理select请求
        proxyRemoteMethod (type) {
            switch (type) {
                case 'location':
                    return (query) => {
                        return this.queryLocationList({
                            params: {
                                name: query
                            }
                        })
                    }
                case 'area':
                    return (query) => {
                        return this.queryAreasList({
                            params: {
                                name: query
                            }
                        })
                    }
                default:
                    break;
            }
        }
    }
}
</script>

