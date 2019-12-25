<template>
    <basic-dialog
        class="entity-dialog"
        :visible="visible"
        :title="action === 'add' ? '新建' :(action === 'edit'? '修改':'查看')"
        :width="1000"
        :show-ft="showFt"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form
            ref="form"
            size="small"
            label-position="right"
            :model="dto"
            label-width="87px"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item
                            label="目标物料" prop="targetSkuCode" :rules="[{ required: true, message: '目标物料为空'}]" >
                                <el-input
                                    :disabled="action=='view'"
                                    v-model="dto.targetSkuCode"
                                    @focus="onClickProductCode"
                                    placeholder="">
                                    <template slot="suffix">
                                        <i
                                            @click="onClickProductCode"
                                            class="el-input__icon el-icon-more"></i>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="目标物料名称" prop="targetSkuName">
                                <el-input disabled  v-model="dto.targetSkuName"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="包装形式" prop="packageType" :rules="[{ required: true, message: '包装形式为空'}]">
                                <el-select
                                    :disabled="action=='view'"
                                    v-model="dto.packageType"
                                    filterable
                                    placeholder=""
                                    >
                                    <el-option
                                        v-for="item in PACKAGE_TYPE"
                                        :key="item.id"
                                        :label="item.enumValueCn"
                                        :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单位" prop="targetSkuUom">
                                <el-input disabled  v-model="dto.targetSkuUom"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="货主" prop="storerName">
                                <el-input disabled  v-model="dto.storerName"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">BOM明细</span>
                    &emsp;
                    <el-button @click="addGoods" :disabled="action=='view'" type="primary" icon="el-icon-plus" size="mini"></el-button>
                    <el-button @click="minusGoods" :disabled="canNotClick||action=='view'" type="primary" icon="el-icon-minus" size="mini"></el-button>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-table
                        :data="dto.skuList"
                        border
                        selectType="multiple"
                        showSelectCol="true"
                        style="width: 100%">
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="id"
                            label="源物料编码"
                            align="center"
                            width="180">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                源物料编码
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'skuList.' + scope.$index + '.id'"
                                :rules="[
                                    { required: true, message: '请输入选择物料' }
                                ]">
                                    <el-input :disabled="!dto.targetSkuCode || action==='view'"  @focus="chooseGoodsIconClick(scope.$index)" v-model="scope.row.code" :readonly="true"/>
                                    <el-input v-show="false" v-model="scope.row.id"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            align="center"
                            width="180"
                            label="源物料名称">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                源物料名称
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="uom"
                            align="center"
                            label="单位">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                单位
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="sourceSkuSpec"
                            align="center"
                            label="原物料规格">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                源物料规格
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="sourceSkuTechParam"
                            align="center"
                            label="原物料技术参数">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                源物料技术参数
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" 
                                >
                                    <el-link type="primary" @click="checktechParam(scope.row.sourceSkuTechParam)">查看</el-link>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column
                            prop="spec"
                            align="center"
                            width="180"
                            label="规格">
                        </el-table-column> -->
                        <el-table-column
                            prop="quantity"
                            width="180"
                            align="center"
                            label="数量">
                            <template slot="header" slot-scope="scope">
                                <span class="color-error">*</span>
                                数量
                            </template>
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" :prop="'skuList.' + scope.$index + '.quantity'"
                                    :rules="[{ pattern: CNST.REG_EXP.NATURAL, message: '请输入正确的数量' }, { required: true, message: '请输入数量' }]"
                                >
                                    <el-input :disabled="action=='view'" oninput = "value=value.replace(/[^\d]/g,'')" v-model="scope.row.quantity" @input="quantityChange(scope.$index, scope.row)" class="quantity"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <el-button v-show="action === 'add'" size="small" type="primary" @click="onSaveGoOn">保存并继续</el-button>
            <el-button size="small" type="primary" @click="handleOk">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </template>
        <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :handle-save="chooseGoods"
            :storerId="this.dto.storerId"
            :update-vis="updateGoodsSelDlgVis"/>
             <goods-sel-dlg
            :visible="goodsSelDlgViss"
            :handle-save="chooseProduct"
            :update-vis="updateGoodsSelDlgViss"/>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import saveGoOn from 'biz/mixins/saveGoOn'
import { times } from 'common/filters/times'
import { mapActions, mapState } from 'vuex';
const data = { id: undefined, code: undefined, uom: undefined, name: undefined, quantity: undefined}

export default {
    components: {
        GoodsSelDlg
    },
    mixins: [ EntityDialog, saveGoOn ],
    props: {
        state: Object,
        PACKAGE_TYPE:Array,
        checktechParam: Function
    },
    data () {
        return {
            goodsSelDlgVis: false,
            goodsSelDlgViss:false,
            currentGoodsIndex: 0,
            CNST,
            canNotClick:true
        }
    },
    watch: {
        'visible' (val){
            if(val&&(this.action=="edit"||this.action=="view")){
                api.goods.getBomDetail({targetSkuCode:this.dto.targetSkuCode,packageType:this.dto.packageType}).then(({head,body})=>{
                    if(head.code == 200){
                        this.dto.skuList = body
                        this.dto.skuList= this.dto.skuList.map((item, index) => {
                            return {
                                id:item.sourceSkuId,
                                code:item.sourceSkuCode,
                                name:item.sourceSkuName,
                                uom:item.sourceSkuUom,
                                sourceSkuSpec:item.sourceSkuSpec,
                                sourceSkuTechParam:item.sourceSkuTechParam,
                                quantity: item.qty,
                            }
                        })
                    }
                })
            }
        },
        'dto.skuList' (val){
            if(val&&val.length>1){
                this.canNotClick = false
            }else{
                this.canNotClick = true
            }
        },
        'dto.targetSkuCode': function (n, o) {
            if (this.action === 'add') {
                this.dto.skuList = [_.cloneDeep(data)]
            } else {
                if (o && n) {
                    this.dto.skuList = [_.cloneDeep(data)]
                }
            }
            /* if(!this.dto.targetSkuCode){
                this.dto.storerName = ''
                this.dto.targetSkuName = ''
                this.dto.targetSkuUom = ''
            } */
        }  
    },
    computed: {

    },
    beforeCreate () {
        this.allFields = [
            'id',
            'targetSkuSpec',
            'targetSkuId',
            'storerId',
            'storerName',
            'targetSkuCode',
            'targetSkuName',
            'targetSkuUom',
            {
                key: 'packageType',
                default: 20
            },
            {
                key: 'skuList',
                default: () => ([_.cloneDeep(data)])
            },
        ]
        this.disFields = []
    },
    methods: {
        // 选择物料图标点击回调
        chooseGoodsIconClick (index) {
            this.currentGoodsIndex = index;
            this.updateGoodsSelDlgVis(true)
        },
        // 物料弹框隐藏方法
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        updateGoodsSelDlgViss(vis){
            this.goodsSelDlgViss = vis
        },
        onClickProductCode (e) {
            // TODO 打开物料弹出框
            console.log(e);
            this.goodsSelDlgViss = true
        },
        // 选择物料返回
        chooseGoods (data) {
            debugger
            data.quantity = undefined
            data.id = data.id
            var idList = this.dto.skuList.map((item,index)=>{
                if(index!=this.currentGoodsIndex){
                    return item.id
                }
            })
            if(idList.indexOf(data.id)!=-1){
                return this.$message.error('该物料已被选择')
            }
            this.dto.skuList.splice(this.currentGoodsIndex, 1, data)
        },
        // 选择物料返回
        chooseProduct(product) {
            debugger
            if(!this.dto.targetSkuCode){
                delete this.dto.targetSkuName;
                delete this.dto.targetSkuId
                delete this.dto.targetSkuUom
            }
            this.dto.targetSkuName = product.name
            this.dto.targetSkuCode = product.code
            this.dto.targetSkuUom = product.uom
            this.dto.targetSkuId = product.id
            this.dto.targetSkuSpec = product.spec
            this.dto.storerName = product.storerName
            this.dto.storerId = product.storerId
        },
        // 合计
        getSummaries (param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                switch (index) {
                    case 5:
                    case 6:
                    case 7:
                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            if (sums[index] > 999999999999999) {
                                sums[index] = '数值过大'
                            }
                        } else {
                            sums[index] = ' ';
                        }
                        break;
                    default:
                        sums[index] = '';
                        break;
                }
            });
            return sums;
        },
        addGoods () {
            this.dto.skuList.push(_.cloneDeep(data))
        },
        minusGoods () {
            this.dto.skuList.pop()
        },
        toEnd () {

            const data = _.pick(this.dto, this.allFields.map(field => {
                if (typeof field === 'object') {
                    return field.key
                }
                return field
            }))
            data.skuList = data.skuList.map((item, index) => {
                return {
                    id:item.id,
                    code:item.code,
                    name:item.name,
                    uom:item.uom,
                    quantity: item.quantity,
                }
            })
            return data
        },
        onSaveGoOn () {
            this.saveAndGoOn(() => {
                ['id', 'targetSkuCode', 'targetSkuName','targetSkuUom','packageType'].forEach(key => {
                    this.dto[key] = undefined
                })
                this.dto.skuList = [_.cloneDeep(data)]
            })
        },
        //输入的数量发生变化
        quantityChange(index,row){
            row.totalWeight = times(row.quantity, row.grossWeight)
            row.totalVolumn = times(row.quantity, row.volume)
        }
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



