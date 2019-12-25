<template>
    <basic-dialog
        class="receiving-dlg"
        title="收货"
        width="80%"
        :visible="visible"
        :append-to-body="appendToBody"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form size="small" label-width="80px" >
            <div class="entity-dlg__block">
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item label="入库通知单号" label-width="100px">
                            <el-input v-model="tableHeaderDate.code" :disabled="true"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="业务单号">
                            <el-input v-model="tableHeaderDate.billCode1" :disabled="true"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="entity-dlg__block-bd">
                <el-table
                    border
                    @selection-change="selectionChanged"
                    :data="receivingGoodsDlg"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <!-- <el-table-column
                        label='序号'
                        type="index"
                        width="55">
                    </el-table-column>   -->          
                    <el-table-column
                        prop="lineNo"
                        label="行号"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="operate"
                        label="操作"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <el-button
                                size="mini"
                                v-if='scope.row.showAdd'
                                type="primary"
                                @click="addLine(scope.$index, scope.row)">拆分</el-button>
                            <el-button
                                size="mini"
                                v-else
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="skuCode"
                        label="物料编码"
                        align="center"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="skuShortName"
                        label="物料名称"
                        align="center"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="skuSpec"
                        label="规格"
                        align="center"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="skuTechParam"
                        label="技术参数"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                                <el-form-item  label="" label-width="0" 
                                >
                                    <el-link type="primary" @click="checktechParam(scope.row.skuTechParam)">查看</el-link>
                                </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="uom"
                        label="单位"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="expectQty"
                        label="预期数量"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="waitReceivedQty"
                        label="待收数量"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="receivedQty"
                        width="180"
                        align="center"
                        label="收货数量">
                        <template slot="header" slot-scope="scope">
                            <span class="color-error">*</span>
                            收货数量
                        </template>
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" 
                                :rules="[ { required: true, message: '请输入数量' }]"
                            >
                                <el-input @input="qtyChange(scope.$index, scope.row)" v-model="scope.row.receivedQty"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="单价"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        label="金额"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" 
                            >
                                <span>{{(scope.row.receivedQty)*Number(scope.row.price).toFixed(3)}}</span>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="toLocation"
                        label="收货库位"
                        align="center"
                        width="150">
                        <template slot="header" slot-scope="scope">
                            <span class="color-error">*</span>
                            收货库位
                        </template>
                        <template slot-scope="scope">
                        <!--  <el-input v-model="scope.row.toLocation" /> -->
                            <el-select
                                filterable
                                clearable
                                remote
                                v-model="scope.row.toLocation"
                                :remote-method="queryLocations"
                                :loading="loadingA">
                                <el-option v-for="item of toLocations" :key="item.id" :label="item.code" :value="item.code"/>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="inventoryTypeId"
                        label="库存类型"
                        align="center"
                        width="100">
                        <template slot="header" slot-scope="scope">
                            <span class="color-error">*</span>
                            库存类型
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.inventoryTypeId" placeholder="请选择">
                                <el-option
                                    v-for="item in inventoryTypes"
                                    :key="item.code+ ''"
                                    :label="item.name"
                                    :value="item.id + ''">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt04"
                        label="入库日期"
                        align="center"
                        width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.lotatt04" v-if='scope.row.lotatt04Type===20 || scope.row.lotatt04Type===30'/>
                            <el-date-picker
                                v-if='scope.row.lotatt04Type===10'
                                v-model="scope.row.lotatt04"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt01"
                        label="生产日期"
                        align="center"
                        width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.lotatt01" v-if='scope.row.lotatt01Type===20 || scope.row.lotatt01Type===30'/>
                            <el-date-picker
                                v-if='scope.row.lotatt01Type===10'
                                v-model="scope.row.lotatt01"
                                @change="productionDateChange(scope.$index, scope.row)"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt02"
                        label="失效日期"
                        align="center"
                        width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.lotatt02" v-if='scope.row.lotatt02Type===20 || scope.row.lotatt02Type===30' format="yyyy-MM-dd" value-format="yyyy-MM-dd"/>
                            <el-date-picker
                                v-if='scope.row.lotatt02Type===10'
                                v-model="scope.row.lotatt02"
                                type="date"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                placeholder="选择日期">
                            </el-date-picker>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt03"
                        label="生产批次"
                        align="center"
                        width="180">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" >
                                <el-input v-model="scope.row.lotatt03" v-if='scope.row.lotatt03Type===20 || scope.row.lotatt03Type===30'/>
                                <el-date-picker
                                    v-if='scope.row.lotatt03Type===10'
                                    v-model="scope.row.lotatt03"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="lotatt05"
                        label="项目名称"
                        align="center"
                        width="180">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" >
                                <el-input v-model="scope.row.lotatt05" v-if='scope.row.lotatt05Type===20 || scope.row.lotatt05Type===30'/>
                                <el-date-picker
                                    v-if='scope.row.lotatt03Type===10'
                                    v-model="scope.row.lotatt05"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column
                        prop="itemId"
                        label="项目名称"
                        align="center"
                        width="180">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0">
                                <el-select @change="itemIdChange(scope.row)" v-model="scope.row.itemId" placeholder="请选择">
                                    <el-option
                                        v-for="item in projectList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        prop="lotatt05"
                        width="180"
                        align="center"
                        label="批次属性5">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" 
                            >
                                <el-input v-model="scope.row.lotatt05"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt06"
                        label="批次属性6"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" >
                                <el-input v-model="scope.row.lotatt06" v-if='scope.row.lotatt06Type===20 || scope.row.lotatt06Type===30'/>
                                <el-date-picker
                                    v-if='scope.row.lotatt06Type===10'
                                    v-model="scope.row.lotatt06"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt07"
                        label="批次属性7"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" >
                                <el-input v-model="scope.row.lotatt07" v-if='scope.row.lotatt07Type===20 || scope.row.lotatt07Type===30'/>
                                <el-date-picker
                                    v-if='scope.row.lotatt07Type===10'
                                    v-model="scope.row.lotatt07"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt08"
                        label="批次属性8"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" >
                                <el-input v-model="scope.row.lotatt08" v-if='scope.row.lotatt08Type===20 || scope.row.lotatt08Type===30'/>
                                <el-date-picker
                                    v-if='scope.row.lotatt08Type===10'
                                    v-model="scope.row.lotatt08"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt09"
                        label="批次属性9"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" >
                                <el-input v-model="scope.row.lotatt09" v-if='scope.row.lotatt09Type===20 || scope.row.lotatt09Type===30'/>
                                <el-date-picker
                                    v-if='scope.row.lotatt09Type===10'
                                    v-model="scope.row.lotatt09"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt10"
                        label="批次属性10"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0" >
                                <el-input v-model="scope.row.lotatt10" v-if='scope.row.lotatt10Type===20 || scope.row.lotatt10Type===30'/>
                                <el-date-picker
                                    v-if='scope.row.lotatt10Type===10'
                                    v-model="scope.row.lotatt10"
                                    type="date"
                                    placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
    </el-form>
    </basic-dialog>
</template>

<script>
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'
import moment from 'moment'

import {mapActions , mapState} from 'vuex'

const DEFAULTS = {
    loading: false,
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    list: []
}

export default {
    components: {
        BasicDialog,
        BasicList 
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
        checktechParam: {
            type: Function,
            default: () => {}
        },
        handleSave: {
            type: Function,
            default: () => {}
        },
        //收货弹窗表头请求的数据
        tableHeaderDate: {
            type: Object,
            default () {
                return {}
            }
        },
        //库存类型
        inventoryTypes: Array,
        //收货弹窗列表数据
        receivingGoodsDlg:{
            type: Array,
            default () {
                return []
            }
        },
        queryList:Function,   
        state: Object
    },
    computed: {
        ...mapState('stock/return', ['projectList'])
    },
    data () {
        return {
        //缓存收货弹窗选择列表
        selDlgRows:[],
        //是否远程加载收货库位
        loadingA: false,
        toLocations:[]
        }
    },
    created(){
    },
    /* watch: {
        visible (newVal) {
            if (newVal && _.isEmpty(this.list)) {
                this.query = { ...DEFAULTS.query, ..._.cloneDeep(this.params)}
                this.queryList()
            }
        }
    }, */
    watch: {
        visible (newVal) {
            if (newVal) {
                this.queryProjectList({
                    entity: {
                        validFlag: 1,
                        page: {
                            size: 10000
                        }
                    }
                })
            }
        }
    },
    methods: {
        ...mapActions('stock/return', [
            'saveReceivingGoodsDlgAction',
            'queryToLocationsAction',
            'queryProjectList'
            ]),
        handleClose () {
            this.updateVis(false)
        },
        handleClosed () {
            const defaults = _.cloneDeep(DEFAULTS)
            for (let key in defaults) {
                this[key] = defaults[key]
            }    
        },
        //收货数量
        qtyChange(index,row){
            if(row.receivedQty>row.waitReceivedQty){
                row.receivedQty=row.waitReceivedQty
            }
        },
        handleOk () {
            console.log("保存收货弹窗",this,this.receivingGoodsDlg);
            const lists=this.receivingGoodsDlg;
            //如果入库日期批属性为false,则需清空对应的入库日期lotatt04的值
            /* if(lists&&lists.length){
                for(var i = 0;i<lists.length;i++){
                    if(!lists[i].inboundDateValidated){
                        lists[i].lotatt04=''
                    }
                }
            } */
            //先判断是否选中数据，如果选中仅保存勾选的数据，否则保存全部
            const rows = this.selDlgRows;
            if(rows&&rows.length){
                this.checkReceivedQty(rows)

            }else{
                 this.checkReceivedQty(lists)
            }
            
        },
        //选择
        selectionChanged (rows) {
            this.selDlgRows = rows;
            console.log(rows,'收货弹窗选中的列表');
        },
        //生产日期改变productionDate
        productionDateChange(index,row){
            row.lotatt02 = moment(row.lotatt01).add(row.guaranteePeriodDays, 'd').format('YYYY-MM-DD')
        },
        //拆分按钮
        addLine(index,row){
            const target={};
            const targetRow=Object.assign(target, row);
            console.log(target,row,index);
            this.receivingGoodsDlg.splice(index+1, 0, target);
            target.showAdd= false;
            target.receivedQty= '';
                
        },
        //删除按钮
        handleDelete(index, row) {
            console.log(index, row);
            this.receivingGoodsDlg.splice(index, 1);
        },
        //收货弹窗----点击保存按钮发送请求
        saveReceivingDlg(data){
            console.log("保存收货弹窗，发送保存收货请求", this);
                this.saveReceivingGoodsDlgAction({
                    params: data,
                    //成功回调函数
                    cb: () => {
                        this.queryList()
                        this.$message({ type: 'success', message: '收货成功' });
                        this.updateVis(false);
                    },
                    //失败回调函数
                    errCb: ({ code, subMessage: msg }) => {
                        //收货未成功
                        //this.$message.error('收货失败',msg)
                        this.updateVis(true);
                    }
                })        
        },
        //收货数量校验方法：收货数量的和必须小于等于待收货数量
        checkReceivedQty(data){
            var temp = {};
                for(var i in data) {
                    var key= data[i].id;
                    data[i].receivedQty = data[i].receivedQty*1;
                    if(temp[key]) {
                        temp[key].receivedQty += data[i].receivedQty;
                        temp[key].id = data[i].id;
                        temp[key].skuCode = data[i].skuCode;
                        temp[key].waitReceivedQty = data[i].waitReceivedQty;
                        
                    } else {
                        temp[key] = {};
                        temp[key].receivedQty = data[i].receivedQty;
                        temp[key].id = data[i].id;
                        temp[key].skuCode = data[i].skuCode;
                        temp[key].waitReceivedQty = data[i].waitReceivedQty;
                    }
                }
                console.log(temp)
                
                var newArry = [];
                for(var k in temp){
                    newArry.push(temp[k])
                }
                console.log(newArry)
                //判断收货数量和待收数量的大小，只要有一个收货数量大于待收数量就返回true 
                let result = newArry.some(
                    function(item){
                        return item.receivedQty > item.waitReceivedQty
                    }
                )
                console.log(result);
                if(!result){
                    this.saveReceivingDlg(data)
                }else{
                        for(var j in newArry){
                            if(newArry[j].receivedQty > newArry[j].waitReceivedQty){
                                console.log(newArry[j].skuCode+'收货数量大于待收数量');
                                this.$message.error(newArry[j].skuCode+'收货数量大于待收数量')
                            }else{
                                
                            }
                        }
                    }
                
        },
        queryLocations (code) {
            this.loadingA = true
            this.queryToLocationsAction({
                params: {
                    code
                },
                cb: () => {
                    this.loadingA = false
                    this.toLocations = this.state.locations
                 }
            })
        },
        itemIdChange (row) {
            console.log(row,'row'); 
            const id = row.itemId
            const project = this.projectList.find(item => item.id === id)
            row.lotatt05 = project.name
        }
    }
}
</script>
<style lang="scss" scoped>
    /deep/ .el-select {
        .el-input__inner {
            border-color:  #fff!important;
        }
    }
    /deep/ .el-date-editor {
        .el-input__inner {
            border-color:  #fff!important;
        }
    }
</style>
