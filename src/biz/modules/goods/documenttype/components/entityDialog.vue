<template>
    <basic-dialog
        :visible="visible"
        :title="'新增单据类型'"
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
            label-width="112px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="单据编号" prop="code">
                                <el-input 
                                 :disabled="isDisabled('code')"
                                v-model="dto.code"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单据名称" prop="name">
                                <el-input v-model="dto.name"/>
                            </el-form-item>
                        </el-col>
                         <el-col :span="8">
                            <el-form-item label="单据大类" prop="billCategory">
                                 <el-select clearable filterable v-model="dto.billCategory" placeholder="请选择单据大类">
                                    <el-option v-for="(item, key) of BILL_CATEGORY_TYPE.array" :key="key" :label="item.enumValueCn" :value="item.enumCode"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8" v-if="dto.billCategory!=20">
                            <el-form-item
                                label="是否退货入库"
                                prop="thrkFlag"
                                >
                                <el-select
                                    clearable
                                    v-model="dto.thrkFlag"
                                    >
                                    <el-option :value="1" label="是"/>
                                    <el-option :value="0" label="否"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="dto.remark"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <div slot="ft" class="basic-dialog-ft">
            <el-button v-if="action!='edit'" size="small" type="primary" @click="handleOk(1)">保存并继续</el-button>
            <el-button size="small" type="primary" @click="handleOk(2)">保存</el-button>
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
        BILL_CATEGORY_TYPE:{
             type: Object,
            default: () => {}
        },
        action:String
    },
    data () {
        return {
            goodsSelDlgVis: false,
            rules: {
                code: [
                    { required: true, message: '请输入单据编号', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入单据名称',trigger: 'change' }
                ],
                billCategory: [
                    { required: true, message: '请选择单据大类',trigger: 'change' }
                ]
            }
        }
    },
    beforeCreate () {
        this.allFields = [ 'id', 'code', 'name', 'billCategory',{ key: 'thrkFlag', default:0 }, 'remark' ]
        this.disFields = [ 'code' ]
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
            const params = _.pick(this.dto, ['id', 'skuId', 'barcode','thrkFlag'])
            this.handleSave(params, () => {
                this.handleClose()
                this.queryList()
            }, this.action)
        },
        async handleOk (e) {
            if(this.action=='edit'){
                api.sku.editBillType({
                    id:this.dto.id,
                    code: this.dto.code,
                    name: this.dto.name,
                    thrkFlag:this.dto.thrkFlag,
                    billCategory: this.dto.billCategory,
                    remark:this.dto.remark
                }).then(({head, body})=>{
                    if(head.code==200){
                        this.$message.success(head.subMessage);
                         this.handleClose()
                    }else{
                        this.$message.error(head.subMessage);
                    }
                })
            }else{
                const valid = await this.$refs.form.validate().catch(() => {})
                if (!valid) {
                    return
                }
                this.updateState({ saving: true })
                const { head, body,  } = await api.sku.BillTypeController({
                    code: this.dto.code,
                    name: this.dto.name,
                    thrkFlag:this.dto.thrkFlag,
                    billCategory: this.dto.billCategory,
                    remark:this.dto.remark
                })
                if(head.code == '200'){
                    if(e==2){
                        this.handleClose()
                        this.queryList()
                    }
                    this.$message.success(head.subMessage);
                }else{
                    this.$message.error(head.subMessage);
                }
            }
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



