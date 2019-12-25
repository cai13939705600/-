<template>
    <basic-dialog
        :visible="visible"
        :title="action === 'add' ? '新增出库单' : '编辑出库单'"
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
                    <span class="entity-dlg__hd-title">基础信息</span>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="业务单号" prop="loginName">
                                <el-input :disabled="action==='edit'" v-model="dto.loginName" placeholder="请输入业务单号"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="货主" prop="name">
                                <el-input v-model="dto.name" placeholder="这需要改成弹出框"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="单据类型" prop="mobile">
                                <el-input v-model="dto.mobile" placeholder="请选择"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="仓库" prop="remarks">
                                <el-input v-model="dto.remarks" placeholder="这需要改成弹出框"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="承运商" prop="mobile">
                                <el-input v-model="dto.mobile" placeholder="这需要改成弹出框"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="业务员" prop="loginName">
                                <el-input v-model="dto.loginName" placeholder="请输入业务员"/>
                            </el-form-item>
                        </el-col>
                         <el-col :span="6">
                            <el-form-item label="联系人" prop="remarks">
                                <el-input v-model="dto.remarks" placeholder="这需要改成弹出框"/>
                            </el-form-item>
                        </el-col>
                         <el-col :span="6">
                            <el-form-item label="联系电话" prop="remarks">
                                <el-input v-model="dto.remarks" placeholder="请输入联系电话"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item label="联系地址" prop="name">
                                <el-input v-model="dto.name" placeholder="请输入联系地址"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="备注" prop="mobile">
                                <el-input v-model="dto.mobile" placeholder="请输入备注"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">货品信息</span>
                    &emsp;
                    <el-button @click="addGoods" type="primary" icon="el-icon-plus" size="mini"></el-button>
                    <el-button @click="minusGoods" :disabled="dto.goods.length < 2" type="primary" icon="el-icon-minus" size="mini"></el-button>
                </div>
                <div class="entity-dlg__block-bd">
                    <el-table
                        :data="dto.goods"
                        border
                        show-summary
                        style="width: 100%">
                        <el-table-column
                            label="序号"
                            type="index"
                            width="50"
                            align="center">
                        </el-table-column>
                        <el-table-column
                            prop="id"
                            label="物料编码"
                            width="180">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" prop="mobile">
                                    <el-input v-model="scope.row.mobile" placeholder="请输入物料编码"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="物料名称">
                        </el-table-column>
                        <el-table-column
                            prop="amount1"
                            label="单位">
                        </el-table-column>
                        <el-table-column
                            prop="amount2"
                            label="规格">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" prop="mobile">
                                    <el-input v-model="scope.row.mobile" placeholder="请输入规格"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount3"
                            label="数量">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" prop="mobile"
                                    :rules="[{ pattern: CNST.REG_EXP.NATURAL, message: '请输入正确的数量' }]"
                                >
                                    <el-input v-model="scope.row.mobile" placeholder="请输入数量"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount3"
                            label="重量(kg)">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" prop="mobile"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '请输入正确的重量' }]"
                                >
                                    <el-input v-model="scope.row.mobile" placeholder="请输入重量"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount3"
                            label="体积（cm3)">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" prop="mobile"
                                    :rules="[{ pattern: CNST.REG_EXP.FLOAT_3_ABS, message: '请输入正确的体积' }]"
                                >
                                    <el-input v-model="scope.row.mobile" placeholder="请输入体积"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="amount3"
                            label="备注">
                            <template slot-scope="scope">
                                <el-form-item label="" label-width="0" prop="mobile">
                                    <el-input v-model="scope.row.mobile" placeholder="请输入备注"/>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <el-button v-show="action === 'add'" size="small" type="primary" @click="saveAndGoOn">保存并继续</el-button>
            <el-button size="small" type="primary" @click="handleOk">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </template>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'
import saveGoOn from 'biz/mixins/saveGoOn'
const data = { id: '12987122', name: '王小虎', amount1: '234', amount2: '3.2', amount3: 10 }

export default {
    components: {
    },
    mixins: [ EntityDialog, saveGoOn ],
    props: {

    },
    data () {
        return {
            CNST,
            rules: {
                loginName: [
                    { required: true, message: '请输入账号编号', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入账号名称', trigger: 'blur' },
                    // { max: 8, message: '账号名称不能大于8位', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { pattern: /^1[356789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                ]
            }
        }
    },
    beforeCreate () {
        this.allFields = [ 'loginName', 'name', 'mobile', 'remarks', 'id', {
            key: 'goods',
            default: [_.cloneDeep(data), _.cloneDeep(data)]
        } ]
        this.disFields = []
    },
    methods: {
        addGoods () {
            this.dto.goods.push(_.cloneDeep(data))
        },
        minusGoods () {
            this.dto.goods.pop()
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



