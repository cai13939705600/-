<template>
    <basic-dialog
        :visible="visible"
        :title="'盘点登记'"
        :width="1290"
        :show-ft="false"
        :update-vis="updateVis"
        :handle-close="closeTt"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
                <basic-list
                ref="basicList"
                :show-action-col="false"
                :setClmnsFlg="false"
                :total="total"
                :fields="fields"
                :page-size="20"
                :list="pandianNoticeList"
                :selection-change="selectionRRows"
                >
            <template slot="hd-col--l">
                <el-button type="primary" size="mini" @click="keepThem" >保存</el-button>
                <el-button type="primary" size="mini" @click="panDianSupply">盘点增补</el-button>
            </template>
            </basic-list>
            <InventorySupplementDlg
                :visible="invenSupplyDlgVis"
                :couHId="couHId"
                :VALID_FLAG="VALID_FLAG"
                :LOCATION_CYCLE_CLASS="LOCATION_CYCLE_CLASS"
                :LOCATION_USE="LOCATION_USE"
                :LOCATION_CONSTRAINT="LOCATION_CONSTRAINT"
                :closeInventer="closeInventer"
                :invStockNote="invStockNote"
                />
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import saveGoOn from 'biz/mixins/saveGoOn'
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'
import InventorySupplementDlg from './InventorySupplementDlg'
import {setDate} from 'common/filters/setDate'

export default {
    components: {
        BasicList,InventorySupplementDlg
    },
    mixins: [ EntityDialog, saveGoOn ],
    props: {
        state: Object,
        total:Number,
        pandianNoticeList:Array,
        closenotice:Function,
        queryMainList:Function,
        couHId:String,
        VALID_FLAG:Object,
        LOCATION_CYCLE_CLASS:Object,
        LOCATION_USE:Object,
        LOCATION_CONSTRAINT:Object,
        STOCK_COU_TYPE:Object,
        invStockNote:Function
    },
    data () {
        return {
            Actn:'',
            locationQueryVis:false,
            goodsSelDlgVis: false,
            canClick:false,
            invenSupplyDlgVis:false,
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
                { key: 'sku.name', name: '物料名称' },
                { key: 'sku.spec', name: '规格' },
                { key: 'sku.uom', name: '单位' },
                { key: 'qty', name: '库存数量' },
                { key: 'inboundDate', name: '入库日期' ,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.inboundDate)}</span>
                    }
                },
                { key: 'actualQty', name: '盘点数量' ,
                    render:(h, { index, row, col }) => {
                        return <el-input v-model={row.actualQty}/>
                    }
                },
                { key: 'differQty', name: '差异数量',
                    render:(h, { index, row, col }) => {
                        if(row.actualQty){
                            return <span>{Math.abs(row.actualQty-row.qty)}</span>
                        }else{
                            return <span>0</span>
                        }
                        
                    }
                },
            ]
        }
    },
    watch: {
        // 不知道蔡伟为啥写这个，先注释了吧~
        /* 'visible'(n){
            if(n&&this.pandianNoticeList){
                this.pandianNoticeList.forEach(e=>{
                    e.actualQty = null
                })
            }
        } */
    },
    beforeCreate () {
       this.allFields=['couHId', 'locationId', 'skuId', 'inventoryType', 'actualQty']
    },
    created(){
       
    },
    methods: {
        closeTt () {
            this.closenotice(false)
        },
        selectionRRows(rows){
            this.selRows = rows
            console.log(this.selRows)
        },
        keepThem(){
            let selectedItem=[]
            this.pandianNoticeList.forEach(e => {
                e = _.pick(e, this.allFields);
                selectedItem.push(e)
            })
            api.stock.recordInvStockCouDetail(selectedItem).then(({head,body})=>{
                if(head.code==200){
                    this.$message.success('操作成功')
                    this.closenotice(false)
                    this.queryMainList()
                }else{
                   this.$message.error(head.subMessage)
                }
            })
        },
        panDianSupply(){
            this.invenSupplyDlgVis = true
        },
        closeInventer(e){
            this.invenSupplyDlgVis =e
        }
    }
}
</script>

<style lang="scss" scoped>
.basic-dialog {
    /deep/ .el-icon-more {
        cursor: pointer;
    }
    /deep/ .el-table__row .el-input__inner{
        border: none;
        &:focus{
            border: 1px solid #d8d8d8;
            background: #fff;
        }
    }
}

</style>



