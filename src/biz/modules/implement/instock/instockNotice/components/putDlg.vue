<template>
    <basic-dialog
        class="put-dlg"
        title="上架"
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
                    :data="putDlgData"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        label='序号'
                        align="center"
                        type="index"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        prop="operate"
                        label="操作"
                        align="center"
                        width="100">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            type="primary"
                            v-if='scope.row.showAdd'
                            @click="addLine(scope.$index, scope.row)">拆分</el-button>
                            <el-button
                            size="mini"
                            v-else
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column> 
                    <el-table-column
                        prop="lineNo"
                        label="行号"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="skuCode"
                        label="物料编码"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="skuName"
                        label="物料名称"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="skuSpec"
                        label="规格"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="skuTechParam"
                        width="80"
                        align="center"
                        label="技术参数">
                        <template  slot-scope="scope">
                            <el-form-item label="" label-width="0">
                                <el-link type="primary" @click="checktechParam(scope.row.skuTechParam)">查看</el-link>
                                <!-- <el-input v-model="scope.row.skuTechParam"/> -->
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="waitPutawayQty"
                        label="待上架数量"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="putawayQty"
                        label="上架数量"
                        align="center"
                        width="100">
                        <template slot="header" slot-scope="scope">
                            <span class="color-error">*</span>
                            上架数量
                        </template>
                        <template slot-scope="scope">
                            <el-form-item label="" label-width="0">
                                <el-input v-model="scope.row.putawayQty"/>
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
                    </el-table-column>
                    <el-table-column
                        prop="inventoryType"
                        label="库存类型"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="fromLocation"
                        label="源库位"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="toLocation"
                        label=""
                        align="center"
                        width="150">
                        <template slot="header" slot-scope="scope">
                            <span class="color-error">*</span>
                            目标库位
                        </template>
                        <template slot-scope="scope">
                            <el-select
                                filterable
                                clearable
                                remote
                                @change="toLocationChange(scope.row)"
                                v-model="scope.row.toLocation"
                                :remote-method="queryLocations"
                                :loading="loadingA">
                                <el-option v-for="item of toLocations" :key="item.id" :label="item.code" :value="item.code"/>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="lotatt04"
                        label="入库日期"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="lotatt01"
                        label="生产日期"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="lotatt02"
                        label="失效日期"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="lotatt03"
                        label="生产批次"
                        align="center"
                        width="180">
                    </el-table-column>
                     <!-- <el-table-column
                        prop="projectName"
                        label="项目名称"
                        align="center"
                        width="180">
                    </el-table-column> -->
                    <el-table-column
                        prop="lotatt05"
                        width="180"
                        align="center"
                        label="批次属性5">
                    </el-table-column>
                    <!-- <el-table-column
                        prop="lotatt05"
                        label="批次编码"
                        align="center"
                        width="100">
                    </el-table-column> -->
                    <!-- <el-table-column
                        prop="lotatt06"
                        label="批次属性06"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="lotatt07"
                        label="批次属性07"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="lotatt08"
                        label="批次属性08"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="lotatt09"
                        label="批次属性09"
                        align="center"
                        width="100">
                    </el-table-column>
                    <el-table-column
                        prop="lotatt10"
                        label="批次属性10"
                        align="center"
                        width="100">
                    </el-table-column> 本期不展示 -->         
                </el-table>
            </div>
        </el-form>
    </basic-dialog>
</template>

<script>
import BasicDialog from 'biz/components/basicDialog'
import BasicList from 'biz/components/basicList'

import {mapActions } from 'vuex'

const DEFAULTS = {
    
    loading: false,
    total: 0,
    pageIndex: 0,
    pageSize: 10,
    list: [],
    selRows: []
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
        handleSave: {
            type: Function,
            default: () => {}
        },
        //上架弹窗表头请求的数据（同收货弹窗一样）
        tableHeaderDate: {
            type: Object,
            default () {
                return {}
            }
        },
        //上架弹窗列表数据请求
        putDlgData:{
            type: Array,
            default () {
                return []
            }
        },
        queryList: Function,
        state: Object,
        checktechParam: Function
    },
    created(){

    },
    mounted(){
        
        
    },
    data () {
        return {
            //是否远程加载目标库位
            loadingA: false,
            toLocations:[]
        }
    },
    watch: {
        
    },
    methods: {
        ...mapActions('stock/inStock', [
            'savePutDlgAction',
            'toLocationsAction',
            'checkLocationAction'
            ]),
        handleClose () {
            this.updateVis(false)
            this.toLocations = []
        },
        handleClosed () {
            const defaults = _.cloneDeep(DEFAULTS)
            for (let key in defaults) {
                this[key] = defaults[key]
            }
        },
        handleOk () {
            console.log('保存上架弹窗',this);
            //先判断是否选中数据，如果选中仅保存勾选的数据，否则保存全部
            const rows = this.selPutDlgRows;
            const lists=this.putDlgData;
            if(rows&&rows.length){             
                //判断上架数量的和是否等于待上架数量
                console.log('选中的行号相同的列表',rows);
                this.checkNumber(rows);
            }else{
                this.checkNumber(lists);
            }
        },
        //选择
        selectionChanged (rows) {
            this.selPutDlgRows = rows;
        },
        //拆分
        addLine(index,row){
            const target={};
            const targetRow=Object.assign(target, row);
            console.log(target,row,index);
            this.putDlgData.splice(index+1, 0, target);
            target.showAdd= false;
            target.putawayQty= '';       
        },
        //删除按钮
        handleDelete(index, row) {
            console.log(index, row);
            this.putDlgData.splice(index, 1);
        },
        //上架弹窗----点击保存按钮发送请求
        savePutDlg(data){
            console.log("保存上架弹窗，发送保存上架请求", this);
                this.savePutDlgAction({
                    params: data,
                    //成功回调函数
                    cb: () => {
                        this.queryList();
                        this.$message({ type: 'success', message: '上架成功' });
                        this.updateVis(false);
                    },
                    //失败回调函数
                    errCb: ({ code}) => {
                        //收货未成功
                        this.$message.error('上架失败',code)
                        this.updateVis(true);
                    }
                })
        },
        //判断上架数量的和与待上架数量是否一致---方法
        checkNumber(data){
            var temp = {};
                for(var i in data) {
                    var key= data[i].id;
                    data[i].putawayQty = data[i].putawayQty*1;
                    if(temp[key]) {
                        temp[key].putawayQty += data[i].putawayQty;
                        temp[key].id = data[i].id;
                        temp[key].skuCode = data[i].skuCode;
                        temp[key].waitPutawayQty = data[i].waitPutawayQty;
                    } else {
                        temp[key] = {};
                        temp[key].putawayQty = data[i].putawayQty;
                        temp[key].id = data[i].id;
                        temp[key].skuCode = data[i].skuCode;
                        temp[key].waitPutawayQty = data[i].waitPutawayQty;
                    }
                }
                console.log(temp)
                
                var newArry = [];
                for(var k in temp){
                    newArry.push(temp[k])
                }
                console.log(newArry)
                //判断上架数量和待上架数量是否相等，只要有一个上架数量和待上架数量不相等就返回true 
                let result = newArry.some(
                    function(item){
                        return item.putawayQty !== item.waitPutawayQty
                    }
                )
                console.log(result);
                if(!result){
                    this.savePutDlg(data)
                    console.log('上架数量和待上架数量都相等');  
                }else{
                        for(var j in newArry){
                            if(newArry[j].putawayQty !== newArry[j].waitPutawayQty){
                                this.$message.error(newArry[j].skuCode+'上架数量必须等于待上架数量')
                                console.log('数量bu相等');
                            }else{
                                              
                            }
                        }
                    }
        },
        //目标库位模糊查找
        queryLocations (code) {
            if(!!code){
                this.loadingA = true
                this.toLocationsAction({
                    params: {
                        code,
                    },
                    cb: () => {
                        this.loadingA = false
                        this.toLocations = this.state.goLocations
                    }
                })
            }
        },
        //判断是否为锁定库位
        toLocationChange(row){
            if (row.toLocation==''){
                return this.toLocations = []
            } else {
                this.checkLocationAction({params:{code:row.toLocation}})
            }
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
