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
            :model="formData"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-hd">
                    <span class="entity-dlg__hd-line"></span>
                    <span class="entity-dlg__hd-title">批量修改</span>
                </div>
                <div>
                    <h4 class="total_count">共计选中库位{{ editRows.length }}条</h4>
                </div>
                <div class="entity-dlg__block-bd">
                    <div class="form-item" v-for="(data, index) in formData.list" :key="data.key">
                        <div class="select-container">
                            <el-form-item
                                label=""
                                :prop="'list.' + index +'.type'"
                                :rules="{ 
                                    required: true,
                                    message: '请选择类别',
                                    trigger: 'blur'
                                }">
                                <el-select
                                    v-model="data.type"
                                    @change="typeChange(data)"
                                    placeholder="请选择"
                                    >
                                    <el-option
                                        v-for="item in data.parts"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.id"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="input-container">
                            <el-form-item
                                v-if="data.type === 3"
                                label=""
                                :prop="'list.' + index +'.value'"
                                :rules="{
                                    required: true,
                                    message: '请输入内容',
                                    trigger: 'blur'
                                }">
                                <el-input
                                    v-model="data.value"
                                    placeholder="请输入内容"
                                    />
                            </el-form-item>
                            <el-form-item
                                v-if="data.type === 2"
                                label=""
                                props="value"
                                :rules="{
                                    required: true,
                                    message: '请选择分类',
                                    trigger: 'blur'
                                }">
                                <el-select
                                    v-model="data.value"
                                    placeholder="请选择">
                                    <el-option
                                    v-for="item in LOCATION_CYCLE_CLASS.array"
                                    :key="item.enumCode + ''"
                                    :label="item.enumValueCn"
                                    :value="item.enumCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                v-if="data.type === 1"
                                label=""
                                :rules="{
                                    required: true,
                                    message: '请输入内容',
                                    trigger: 'blur'
                                }">
                                <el-select
                                    v-model="data.value"
                                    placeholder="请选择库区"
                                    filterable
                                    clearable
                                    >
                                    <el-option
                                        v-for="library in libraries"
                                        :key="library.id"
                                        :label="library.name"
                                        :value="library.id"
                                        >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                        <div class="button-container">
                            <el-button
                                class="button-part-plus"
                                :disabled="formData.list.length >= 3"
                                @click="addPart"
                                size="small"
                                type="primary"
                                icon="el-icon-plus"></el-button>
                            <el-button
                                class="button-part-minus"
                                :disabled="formData.list.length <= 1"
                                @click="removePart(index)"
                                size="small"
                                type="danger"
                                icon="el-icon-minus"></el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-form>
        <template slot="ft">
            <!-- <el-button class="ml-20" size="small" type="primary" @click="validator(true)">保存并继续</el-button> -->
            <el-button class="ml-20" size="small" type="primary" @click="validateForm">保存</el-button>
            <el-button class="ml-20" size="small" @click="handleClose">取消</el-button>
        </template>
    </basic-dialog>
</template>

<script>
import { cloneDeep } from 'common/utils/lodash'
import EntityDialog from 'biz/mixins/entityDialog'
import SearchSelect from '../../mixin/searchSelect'
export default {
    mixins: [ EntityDialog, SearchSelect],
    props: {
        editRows: {
            type: Array,
            default: () => []
        },
        libraries: {
            type: Array,
            default: () => ([])
        },
        changeValue: {
            type: Function,
            default: () => {}
        },
        handleSave: {
            type: Function,
            default: () => {}
        },
        LOCATION_CYCLE_CLASS: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            rules: {
            },
            formData: {
                // 当前选择的要素
                list: [],
            },
            // 全部要素
            parts: [
                {
                    label: '库区名称',
                    key: 'zone',
                    id: 1,
                },{
                    label: 'ABC分类',
                    key: 'cycleClass',
                    id: 2,
                },{
                    label: '备注',
                    key: 'remark',
                    id: 3,
                }
            ],
        }
    },
    beforeCreate () {
        this.allFields = [
        ]
        this.disFields = []
    },
    created () {
    },
    mounted () {
    },
    watch: {
        'visible': function (n) {
            if (n) {
                this.initList()
            }
        }
    },
    methods: {
        // 初始化列表
        initList () {
            this.formData.list = [{
                type: undefined,
                value: '',
                parts: cloneDeep(this.parts)
            }];
        },
        // 添加新要素
        addPart() {
            // 判断是否还有没有选择的要素
            if (this.formData.list.length < this.parts.length) {
                this.formData.list.push({
                    type: undefined,
                    value: '',
                    parts: this.noChooseParts(),
                    key: Date.now()
                })
                this.resetParts()
            }
        },
        // 删除要素
        removePart(index) {
            if (this.formData.list.length > 1){
                this.formData.list.splice(index, 1)
            }
            this.resetParts()
        },
        // 类型切换回调
        typeChange(data) {
            this.$nextTick(() => {
                this.resetParts()
            })
            // 清空当前输入的值
            data.value = ''
        },
        // 返回未选择的要素
        noChooseParts (i) {
            // 过滤已经选择的数据
            return this.parts.filter((part) => {
                // 遍历选择的数据
                for (let index = 0, len = this.formData.list.length; index < len; index++) {
                    const element = this.formData.list[index];
                    if (index === i) { continue }
                    if (element.type === part.id) {
                        return false;
                    }
                }
                return true;
            })
        },
        // 重置未选择的要素
        resetParts () {
            this.formData.list.forEach((element, index) => {
                element.parts = this.noChooseParts(index)
            });
        },
        // 验证form表单
        validateForm () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.handleSave(this.paramsTransform(), () => {
                        this.initList()
                    })
                } else {
                    return false;
                }
            });
        },
        // 转换数据格式
        paramsTransform () {
            const data = this.formData.list;
            const result = {};
            data.forEach(item => {
                switch (item.type) {
                    case 1:
                        // 库区
                        this.libraries.forEach(lib => {
                            console.log('lib', lib);
                            
                            if (lib.id === item.value) {
                                result.zoneId = lib.id
                                // result.zoneCode = lib.code
                            }
                        })
                        break;
                    case 2:
                        // ABC
                        this.LOCATION_CYCLE_CLASS.array.forEach(cycle => {
                            console.log(cycle.enumCode, data);
                            
                            if (cycle.enumCode === item.value) {
                                result.cycleClass = item.value;
                            }
                        })
                        break;
                    case 3:
                        // 备注
                        result.remark = item.value;
                    default:
                        break;
                }
            })
            result.idList = this.editRows
            return result;
        }
    }
}
</script>
<style scoped>
    .result_count {
        line-height: 32px;
    }
    .ml-20 {
        margin-left: 20px;
    }
    .tips-sub {
        position: absolute;
        right: 29px;
        bottom: 78px;
        color: #FE9700;
        font-size: 12px;
    }
    .total_count {
        text-indent: 36px;
        margin-bottom: 16px;
    }
    .button-part-plus,
    .button-part-minus {
        background-color: white !important;
        border-color: white !important;
        font-size: 14px;
        transform: scale(1.2);
        padding-left: 10px;
        padding-right: 10px;
        margin-left: 0;
    }
    .button-part-plus {
        color: #409EFF !important;
    }
    .button-part-minus {
        color: #FF5B5B !important;
    }
    .form-item {
        display: flex;
    }
    .form-item >>> .el-form-item__content {
        margin-left: 0 !important;
    }
    .button-container >>> .el-icon-plus,
    .button-container >>> .el-icon-minus {
        font-weight: 700;
    }
    .select-container {
        width: 190px;
        margin-left: 14px;
        flex: 1;
    }
    .input-container {
        width: 662px;
        margin-left: 20px;
        flex: 6;
    }
    .button-container {
        margin-left: 20px;
        flex: 1;
    }
</style>



