<template>
    <basic-dialog
        class="goods-sel-dlg"
        title="库存列表"
        width="80%"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <basic-list
            ref="basicList"
            select-type="multiple"
            :show-select-col="true"
            :show-action-col="false"
            :fields="fields"
            :list="list"
            :loading="loading"
            :total="total"
            :page-index="pageIndex"
            :page-size="pageSize"
            :setClmnsFlg="false"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :selection-change="selectionChange"/>
    </basic-dialog>
</template>

<script>
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'
import GoodsSelDlg from 'biz/components/goodsSelDlg'


const DEFAULTS = {
    query: {
        code: undefined,
        name: undefined,
        barcode: undefined,
        skuNo1: undefined
    },
    loading: false,
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    list: [],
    selRows: []
}

export default {
    components: {
        BasicDialog,
        BasicList,
        GoodsSelDlg
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        appendToBody: {
            type: Boolean,
            default: true
        },
        params: {
            type: Object,
            default () {
                return {}
            }
        },
        updateVis: {
            type: Function,
            default: () => {}
        },
        handleSave: {
            type: Function,
            default: () => {}
        },
        LibraryList:Array,
        pandiandanId:String,
    },
    data () {
        return {
            ..._.cloneDeep(DEFAULTS),
            goodsSelDlgVis: false,
            inventoryTypes:[],
            locationList:[],
            fields: [
                { key: 'locationNo', name: '库位' },
                { key: 'skuNo', name: '物料编码' },
                { key: 'skuName', name: '名称' },
                { key: 'shortName', name: '简称' },
                // { key: 'ownerName', name: '货主' },
                { key: 'qty', name: '库存数量' },
                { key: 'spec', name: '规格' },
                { key: 'barcode', name: '条码' },
                { key: 'uom', name: '单位' },
                // { 
                //     key: '写死',
                //     name: '包装',
                //     render: (h, { index, row, col }) => {
                //         return 'EA'
                //     }
                // },
                { key: 'avaliableQty', name: '可用数量' },
                { key: 'putQty', name: '待上架数量' },
                { key: 'assignQty', name: '分配数量' },
                { key: 'lockQty', name: '冻结数' },
                 { key: 'inventoryTypeName', name: '库存类型',
                 },
                { key: 'totalWeight', name: '总重量(kg)' },
                { key: 'totalVolume', name: '总体积(L)' },
                { key: 'retailPrice', name: '零售价' },
                { key: 'totalPrice', name: '总价' },
                { key: 'lotNo', name: '批次号' },
                { key: 'inboundDate', name: '入库日期' },
                { key: 'madeDate', name: '生产日期' },
                { key: 'expireDate', name: '失效日期' },
                { key: 'produceBatch', name: '生产批次' },
                { key: 'batchCode', name: '批次编码' },
            ]
        }
    },
    beforeCreate(){
        this.fields = [
            'warehouseId',
            'zoneId',
            'inventoryType',
            'stockLock',
            'brandName',
            'skuNo',
            'lotNo',
            'batchCode',
            'inboundDate',
            'madeDate',
            'expireDate',
            'produceBatch',
            'batchCode',
            'attr6',
            'attr7',
            'attr8',
            'attr9',
            'attr10',
            'skuName'
        ]
    },
    watch: {
        visible (newVal) {
            if (newVal) {
                this.query = { ...DEFAULTS.query, ..._.cloneDeep(this.params)}
                this.queryList()
            }
        }
    },
    created(){
        this.queryStockList()
        this.getLocationList()
    },
    methods: {
         // 代理select请求
        proxyRemoteMethod (type) {
            switch (type) {
                case 'location':
                    return (query) => {
                        console.log('aaaaaaaaaaaaaa',query)
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
        },
        //查询库位列表
        getLocationList(){
            api.library.queryLibraryLocations({}).then(({head,body})=>{
                if(head.code==200&&body.records){
                    this.locationList = body.records
                }
            })
        },
        //查询库存类型
        queryStockList(){
            api.stock.getInventoryTypes().then(({head, body})=>{
                if(head.code==200&&body){
                    this.inventoryTypes = body
                }
            })
        },
        // 显示隐藏物料弹窗
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
         // 选择物料返回
        chooseProduct (product) {
            debugger
            if(this.query.skuName){
                delete this.query.skuName;
            }
            this.query.skuNo = product.code
            this.query.skuName = product.name
        },
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            const defaults = _.cloneDeep(_.get(DEFAULTS, ['selRows', 'query']))
            for (let key in defaults) {
                this[key] = defaults[key]
            }
            this.$refs.basicList.resetData()
        },
        handleOk () {
            if (!this.selRows.length) {
                this.$message.error('请选择库存')
                return
            }
            const idList =this.selRows.map(row => row.id);
            this.handleSave(idList)
            this.updateVis(false)
        },
        pageIndexChange (index) {
            debugger
            this.pageIndex = index
            this.queryList()
        },
        pageSizeChange (size) {
            debugger
            this.pageIndex = 1
            this.pageSize = size
            this.queryList()
        },
        selectionChange (rows) {
            this.selRows = rows
        },
        handleSearch () {
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        handleReset () {
            this.pageIndex = DEFAULTS.pageIndex
            this.queryList()
        },
        queryList () {
            api.stock.queryStockPage({
                id:this.pandiandanId,
                page: {
                    current: this.pageIndex,
                    size: this.pageSize
                }
            }).then(({ head = {}, body = {} }) => {
                if (head.code === '200') {
                    this.list = _.get(body, 'records') || []
                    this.total = _.get(body, 'total') || 0
                }
                this.$refs.basicList.resetData('radioIndex')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.search-form {
    display: flex;
    .col-l {
        display: flex;
        flex: 1;
        .el-form-item {
            width: 25%;
            padding-right: 20px;
        }
    }
    .col-r {
        width: 140px;
    }
}
.basic-list {
    padding-top: 0;
}
</style>


