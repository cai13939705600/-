<template>
    <basic-dialog
        :visible="visible"
        :title="action=='add'?'新建批次规则':'修改批次规则'"
        :width="960"
        :show-ft="showFt"
        :update-vis="updateVis"
        :handle-close="handleClose"
        :handle-closed="handleClosed"
        :handle-ok="handleOk">
        <el-form
            ref="form"
            size="small"
            label-position="right"
            label-width="80px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="编码" prop="code">
                                <el-input v-model="dto.code"
                                    :disabled="isDisabled('code')"
                                    >
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="批次属性" prop="name">
                                <el-input v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                            <el-form-item label="描述" prop="remark">
                                <el-input v-model="dto.remark"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <el-table
                border
                ref="singleTable"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                type="index"
                label="序号"
                width="250">
                </el-table-column>
                <el-table-column
                property="batachLetter"
                label="批次字段"
                width="220">
                    <template slot-scope="scope">
                            <el-input :disabled="scope.row.batachLetter=='生产日期'||scope.row.batachLetter=='失效日期'||scope.row.batachLetter=='入库日期'||scope.row.batachLetter=='生产批次'" v-model="scope.row.batachLetter" />
                    </template>
                </el-table-column>
                <el-table-column
                property="enterControl"
                label="输入控制"
                width="220">
                <template slot-scope="scope">
                     <el-select prop="" clearable v-model="scope.row.Validate">
                        <el-option v-for="(item, key) of YES_FLAG.array" :key="key" :label="item.enumValueCn" :value="!!item.enumCode"/>
                    </el-select>
                </template>
                </el-table-column>
                <el-table-column
                property="attrs"
                label="属性格式">
                    <template slot-scope="scope">
                        <el-select disabled clearable v-model="scope.row.Type" v-if="scope.row.batachLetter=='生产日期'||scope.row.batachLetter=='失效日期'||scope.row.batachLetter=='入库日期'||scope.row.batachLetter=='生产批次'">
                            <el-option v-for="(item, key) of ATTR_FORMAT.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
                        </el-select>
                        <el-select  clearable v-model="scope.row.Type" v-if="scope.row.batachLetter!='生产日期'&&scope.row.batachLetter!='失效日期'&&scope.row.batachLetter!='入库日期'&&scope.row.batachLetter!='生产批次'">
                            <el-option v-for="(item, key) of ATTR_FORMAT.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
                        </el-select>
                     </template>
                </el-table-column>
            </el-table>
        </el-form>
        <div slot="ft" class="basic-dialog-ft" v-if="showFt">
            <el-button size="small" type="primary" @click="handleOk(action)" :loading="saving">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </div>
    </basic-dialog>
</template>

<script>
import GoodsSelDlg from 'biz/components/goodsSelDlg'
import EntityDialog from 'biz/mixins/entityDialog'
export default {
    components: {
        GoodsSelDlg
    },
    mixins: [ EntityDialog ],
    props: {
        saving: Boolean,
        confirm: Function,
        YES_FLAG:Object,
        ATTR_FORMAT:Object
    },
    data () {
        return {
            goodsSelDlgVis: false,
            rules: {
                code: [
                    { required: true, message: '请输入物料编号', trigger: 'change' }
                ],
                name: [
                    {  required: true, message: '请输入批次属性',trigger: 'change' }
                ]
            },
            tableData: [
                
            ]
        }
    },
    beforeCreate () {
        this.allFields = [ 'id', 'code', 'name', 'remark',{ key: 'lotatt01Name', default:'生产日期' } ,'lotatt01Validate', 'lotatt01Type',{ key: 'lotatt02Name', default:'失效日期' } ,'lotatt02Validate', 'lotatt02Type',{ key: 'lotatt03Name', default:'入库日期' } ,'lotatt03Validate', 'lotatt03Type',{ key: 'lotatt04Name', default:'生产批次' } ,'lotatt04Validate', 'lotatt04Type','lotatt05Name' ,'lotatt05Validate', 'lotatt05Type','lotatt06Name' ,'lotatt06Validate', 'lotatt06Type'
        ,'lotatt07Name' ,'lotatt07Validate', 'lotatt07Type','lotatt08Name' ,'lotatt08Validate', 'lotatt08Type','lotatt09Name' ,'lotatt09Validate', 'lotatt09Type','lotatt10Name' ,'lotatt10Validate', 'lotatt10Type'
        ]
        this.disFields = [ 'code' ]
        
    },
    watch:{
        'dto' (val){
            console.log(val)
            this.tableData=[
            {
                    batachLetter: this.dto.lotatt01Name,
                    Validate: this.dto.lotatt01Validate,
                    Type: 10
                },
                {
                    batachLetter: this.dto.lotatt02Name,
                    Validate: this.dto.lotatt02Validate,
                    Type: 10
                },
                {
                    batachLetter: this.dto.lotatt04Name,
                    Validate: this.dto.lotatt04Validate,
                    Type: 30
                },
                {
                    batachLetter: this.dto.lotatt03Name,
                    Validate: this.dto.lotatt03Validate,
                    Type: 10
                },
                {
                    batachLetter: this.dto.lotatt05Name||'lotatt05Name',
                    Validate: this.dto.lotatt05Validate,
                    Type: this.dto.lotatt05Type
                },
                {
                    batachLetter: this.dto.lotatt06Name||'lotatt06Name',
                    Validate: this.dto.lotatt06Validate,
                    Type: this.dto.lotatt06Type
                },
                {
                    batachLetter: this.dto.lotatt07Name||'lotatt07Name',
                    Validate: this.dto.lotatt07Validate,
                    Type: this.dto.lotatt07Type
                },
                {
                    batachLetter: this.dto.lotatt08Name||'lotatt08Name',
                    Validate: this.dto.lotatt08Validate,
                    Type: this.dto.lotatt08Type
                },
                {
                    batachLetter: this.dto.lotatt09Name||'lotatt09Name',
                    Validate: this.dto.lotatt09Validate,
                    Type: this.dto.lotatt09Type
                },
                {
                    batachLetter: this.dto.lotatt10Name||'lotatt10Name',
                    Validate: this.dto.lotatt10Validate,
                    Type: this.dto.lotatt10Type
                },
            ]
        }
    },
    mounted(){
        
    },
    methods: {
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        validateBarcode (rule, value, callback) {
            const action = this.action
            if (!value) {
                return callback(new Error('请输入物料条码'))
            }
            if (value.indexOf('，') !== -1) {
                return callback(new Error('请使用英文逗号分隔'))
            }
            if (action === 'add') {
                const count = value.split(',').length
                if (count > 20) {
                    return callback(new Error('新增时最多输入20个条码'))
                }
            } else {
                if (value.indexOf(',') !== -1) {
                    return callback(new Error('编辑时只能输入一个条码'))
                }
            }
            callback()
        },
        handleEnterKeyUp () {
            this.updateGoodsSelDlgVis(true)
        },
        handleSelectGoods (row) {
            Object.assign(this.dto, {
                ..._.pick(row, [ 'code', 'name', 'shortName', 'skuNo1', 'brandName', 'spec' ]),
                skuId: row.id
            })
        },
        handleCodeBlur () {
            if (this.dto.code && this.dto.code !== this.actGoods.code) {
                api.sku.queryDetlByCode({ skuCode: this.dto.code }).then(({ head, body }) => {
                    if (head.code === '200') {
                        Object.assign(this.dto, {
                            ..._.pick(body, ['code', 'name', 'shortName', 'skuNo1', 'brandName', 'spec' ]),
                            skuId: body.id
                        })
                    }
                })
            }
        },
        doSave () {
            const params = _.pick(this.dto, ['id', 'skuId', 'barcode'])
            this.handleSave(params, () => {
                this.handleClose()
                this.queryList()
            }, this.action)
        },
        async handleOk (act) {
            debugger
            var that =this
            var attrName = ''
            var attrValidate = ''
            var attrType = ''
            this.tableData.forEach((e,index)=>{
                if(index<9){
                    attrName = "lotatt0" + (index+1) +"name"
                    attrValidate = "lotatt0" + (index+1) +"Validate"
                    attrType = "lotatt0" + (index+1) +"Type"
                }else{
                    attrName = "lotatt" + (index+1) +"name"
                    attrValidate = "lotatt" + (index+1) +"Validate"
                    attrType = "lotatt" + (index+1) +"Type"
                }
                that.dto[attrName ]=  e.batachLetter ||''
                that.dto[attrValidate] =(e.Validate + '')|| ''
                if(that.dto[attrValidate] =='undefined'){
                    that.dto[attrValidate]=''
                }
                that.dto[attrType] =  e.Type || ''
            })
            const valid = await this.$refs.form.validate().catch(() => {})
            if (!valid) {
                return
            }
            api.goods.addOrEdit(this.dto).then(({head,body}) =>{
                if(head.code == 200){
                    this.$message.success(head.message)
                    this.handleClose()
                    this.queryList()
                }else if(head.code == 201){
                   return  this.$message.error(head.subMessage);
                }else{
                    return  this.$message.error(head.subMessage);
                }
            })
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



