<template>
    <basic-dialog
        :visible="visible"
        :title="title"
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
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">物料信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="物料编号" prop="code">
                                <el-input v-model="dto.code"
                                    :disabled="isDisabled('code')"
                                    @keyup.enter.native="handleEnterKeyUp"
                                    @blur="handleCodeBlur">
                                    <i class="el-icon-more" slot="suffix" @click="handleEnterKeyUp"></i>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="物料名称" prop="name">
                                <el-input v-model="dto.name" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="物料简称" prop="shortName">
                                <el-input v-model="dto.shortName" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="规格" prop="spec">
                                <el-input v-model="dto.spec" :disabled="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">条码信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="action === 'add' ? 24 : 8">
                            <el-form-item label="物料条码" required>
                                <el-form-item prop="barcode">
                                    <el-input v-model="dto.barcode" :placeholder="action === 'add' ? '多个条形码英文逗号分隔即可' : ''"/>
                                </el-form-item>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <goods-sel-dlg
            :visible="goodsSelDlgVis"
            :params="{code: dto.code}"
            :update-vis="updateGoodsSelDlgVis"
            :handle-save="handleSelectGoods"/>
        <div slot="ft" class="basic-dialog-ft" v-if="showFt">
            <el-button size="small" type="primary" @click="handleOk" :loading="saving">保存</el-button>
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
        confirm: Function
    },
    data () {
        return {
            goodsSelDlgVis: false,
            rules: {
                code: [
                    { required: true, message: '请输入物料编号', trigger: 'change' }
                ],
                barcode: [
                    { validator: this.validateBarcode, trigger: 'change' }
                ]
            }
        }
    },
    beforeCreate () {
        this.allFields = [ 'id', 'skuId', 'code', 'name', 'shortName', 'spec', 'barcode' ]
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
                ..._.pick(row, [ 'code', 'name', 'shortName', 'spec' ]),
                skuId: row.id
            })
        },
        handleCodeBlur () {
            if (this.dto.code && this.dto.code !== this.actGoods.code) {
                api.sku.queryDetlByCode({ skuCode: this.dto.code }).then(({ head, body }) => {
                    if (head.code === '200') {
                        Object.assign(this.dto, {
                            ..._.pick(body, ['code', 'name', 'shortName', 'spec' ]),
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
        async handleOk () {
            const valid = await this.$refs.form.validate().catch(() => {})
            if (!valid) {
                return
            }
            this.updateState({ saving: true })
            const { head, body } = await api.sku.queryBarcodeExist({
                skuId: this.dto.skuId,
                barcode: this.dto.barcode
            })
            if (head.code !== '200') {
                this.$message.error(head.subMessage)
                this.updateState({ saving: false })
                return
            }
            if (head.subCode === '432') {
                this.confirm(`存在条码${body.join(',')}被多个物料使用，是否确认保存？`, () => {
                    this.doSave()
                }, () => {
                    this.updateState({ saving: false })
                })
            } else if (head.subCode === '433') {
                this.confirm('当前物料维护了多个条码， 是否确认保存？', () => {
                    this.confirm(`存在条码${body.join(',')}被多个物料使用，是否确认保存？`, () => {
                        this.doSave()
                    }, () => {
                        this.updateState({ saving: false })
                    })
                }, () => {
                    this.updateState({ saving: false })
                })
            } else if (head.subCode === '434') {
                this.confirm('当前物料维护了多个条码， 是否确认保存？', () => {
                    this.doSave()
                }, () => {
                    this.updateState({ saving: false })
                })
            } else {
                this.doSave()
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



