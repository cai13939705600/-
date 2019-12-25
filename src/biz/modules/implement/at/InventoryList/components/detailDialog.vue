<template>
    <basic-dialog
        :visible="visible"
        :title="'盘点明细'"
        :width="1290"
        :show-ft="false"
        :update-vis="updateVis"
        :handle-close="closeTt"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
            <basic-list
                ref="basicList"
                select-type="multiple"
                :setClmnsFlg="false"
                :show-select-col="false"
                :show-action-col="false"
                :total="total"
                :fields="fields"
                :list="detaillist"
                >
            </basic-list>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import locationQuery from 'biz/components/locationQuery'
import saveGoOn from 'biz/mixins/saveGoOn'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'
const data = { name: undefined, code: undefined, uom: undefined, spec: undefined, quantity: undefined, grossWeight: undefined, volume: undefined, remark: undefined}

export default {
    components: {
        locationQuery,GoodsSelDlg,BasicDialog,
        BasicList
    },
    mixins: [ EntityDialog, saveGoOn ],
    props: {
        state: Object,
        STOCK_COU_STATUS:Object,
        STOCK_DIFF_TYPE:Object,
        STOCK_COU_MODE:Object,
        STOCK_COU_SHOW_MODE:Object,
        VALID_FLAG:Object,
        LOCATION_CYCLE_CLASS:Object,
        LOCATION_USE:Object,
        LOCATION_CONSTRAINT:Object,
        STOCK_COU_TYPE:Object,
        detaillist:Array,
        closeDetail:Function,
        total:Number
    },
    data () {
        return {
            locationQueryVis:false,
            goodsSelDlgVis: false,
            canClick:false,
            pandiandanId:'',
            currentGoodsIndex: 0,
            CNST,
            pageIndex: 1,
            pageSize: 10,
            selRows:[],
            inventerlist:[],
            zoneRule:[],
            getStorerList:[],
            itemClassList:[],
            LibraryList:[],
            showSearch:true,
            fields: [
                { key: 'locationNo', name: '库位' },
                { key: 'sku.code', name: '物料编码' },
                { key: 'sku.name', name: '物料名称'},
                { key: 'sku.spec', name: '单位' },
                { key: 'inventoryTypeName', name: '库存状态' },
                { key: 'qty', name: '原始数量' },
                { key: 'actualQty', name: '盘点数量' },
                { key: 'differQty', name: '差异数量' },
            ]
        }
    },
    watch: {
        
    },
    beforeCreate () {
       
    },
    created(){
       
    },
    methods: {
         closeTt () {
            this.closeDetail(false)
        },
    }
}
</script>

<style lang="scss" scoped>
.basic-dialog {
    /deep/ .el-icon-more {
        cursor: pointer;
    }
}

</style>



