<template>
    <basic-dialog
        :visible="visible"
        :title="'确认拣货'"
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
                            <el-form-item label="物料名称" prop="name">
                                <el-input :disabled="true" v-model="dto.name" placeholder="物料名称"/>
                                <el-input v-show="false" v-model="dto.id" placeholder="物料ID"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="应拣数量" prop="total">
                                <el-input :disabled="true" v-model="dto.total" placeholder="应拣数量"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="拣货数量" prop="pickedQty">
                                <el-input v-model="dto.pickedQty" placeholder="默认=应拣数量"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <el-button size="small" type="primary" @click="handleOk">保存</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </template>
    </basic-dialog>
</template>

<script>
import EntityDialog from 'biz/mixins/entityDialog'

export default {
    components: {
    },
    mixins: [ EntityDialog ],
    props: {

    },
    data () {
        return {
            CNST,
            rules: {
                pickedQty: [
                    { required: true, message: '请输入拣货数量' },
                    { pattern: CNST.REG_EXP.NATURAL, message: '请输入正确的数字' },
                    { validator: this.validatePass, trigger: 'change' }
                ]
            }
        }
    },
    beforeCreate () {
        this.allFields = ['id', 'pickedQty']
        this.disFields = []
    },
    methods: {
        validatePass (rule, value, callback) {
            // 已拣货数量
            const min = 0 // this.dto.already
            // 最大拣货数量 总数减去
            // const max = this.dto.total - min
            const max = this.dto.pickedQty
            if (!/\S/.test(value)) {
                return callback(new Error('请填写数量'));
            }
            value = Number(value)
            if (value >= min && value <= max) {
                return callback();
            } else {
                if (value < min) {
                    return callback(new Error(`最小值为${min}`));
                } else {
                    return callback(new Error(`不能大于${max}`));
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



