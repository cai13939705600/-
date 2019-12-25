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
            label-width="100px"
            :model="dto"
            :rules="rules"
            @submit.native.prevent>
            <div class="entity-dlg__block">
                <div class="entity-dlg__block-bd">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="周转规则编码" prop="code">
                                <el-input v-model="dto.code" :disabled="this.action === 'edit'||this.action == 'view'"
                                          ref="code"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="周转规则名称" prop="name">
                                <el-input clearable v-model="dto.name" :disabled="this.action == 'view'"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="批次规则" prop="lotAttrRuleName">
                                <el-input
                                    clearable :disabled="action=='view'"
                                    v-model="dto.lotAttrRuleName"
                                    placeholder="请选择">
                                    <template slot="suffix">
                                        <i
                                            @click="onClickProductCode"
                                            class="el-input__icon el-icon-more"></i>
                                    </template>
                                </el-input>
                                <!--<el-input v-show="false" v-model="dto.lotAttrRuleId" placeholder="请选择"></el-input>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="16">
                            <el-form-item label="描述" prop="description">
                                <el-input clearable v-model="dto.description" type="textarea"
                                          :disabled="this.action == 'view'"
                                          :rows="3" maxlength="100"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="entity-dlg__block">
                <el-table v-if="action=='add'"
                          :data="woTurnoverRuleDetailList"
                          style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="lotattName"
                        label="批次字段"
                        width="190"
                    >
                    </el-table-column>
                    <el-table-column
                        property="sortWay"
                        label="排序"
                        width="215">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.sortWay" placeholder="请选择"
                                       :disabled="scope.row.lotattType=='30'">
                                <el-option
                                    v-for="item in sortWayArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        property="seqNum"
                        label="顺序号"
                        width="215">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.seqNum" :min="1" :max="100" :step-strictly="true"
                                             :precision="0"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column
                        property="accurateMatchFlag"
                        label="是否精准匹配"
                        width="215">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.accurateMatchFlag" placeholder="请选择"
                                       :disabled="scope.row.lotattType=='30'">
                                <el-option
                                    v-for="item in ifExactArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>

                <!--修改-->
                <el-table v-if="action=='edit'||action=='view'"
                          :data="woTurnoverRuleDetailListEdit"
                          style="width: 100%">
                    <el-table-column
                        type="index"
                        label="序号"
                        width="80"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="lotattName"
                        label="批次字段"
                        width="190"
                    >
                    </el-table-column>
                    <el-table-column
                        property="sortWay"
                        label="排序"
                        width="215">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.sortWay" placeholder="请选择"
                                       :disabled="action=='view'||scope.row.lotattType=='30'">
                                <el-option
                                    v-for="item in sortWayArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        property="seqNum"
                        label="顺序号"
                        width="215">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.seqNum" :min="1" :max="100" :disabled="action=='view'"
                                             :step-strictly="true" :precision="0"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column
                        property="accurateMatchFlag"
                        label="是否精准匹配"
                        width="215">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.accurateMatchFlag" placeholder="请选择"
                                       :disabled="action=='view'||scope.row.lotattType=='30'">
                                <el-option
                                    v-for="item in ifExactArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
        </el-form>
        <template slot="ft">
            <el-button v-if="action=='add'" class="ml-20" size="small" type="primary" @click="onSave">保存</el-button>
            <el-button v-if="action=='edit'" class="ml-20" size="small" type="primary" @click="onEdit">保存</el-button>
            <el-button class="ml-20" size="small" @click="handleClose">取消</el-button>
        </template>
        <BatchRuleDlg
            :visible="batchRuleDlgVis"
            :handle-save="chooseProduct"
            :update-vis="updateShipperSelDlgVis"/>
    </basic-dialog>
</template>

<script>
    import EntityDialog from 'biz/mixins/entityDialog'
    import saveGoOn from 'biz/mixins/saveGoOn'
    import BatchRuleDlg from 'biz/components/batchRuleDlg'

    export default {
        mixins: [EntityDialog, saveGoOn],
        components: {
            BatchRuleDlg
        },
        props: {
            logisticsCompany: Object,
            //YES_FLAG:Object,
            //ATTR_FORMAT:Object
            action: String,
            actionStr: String
        },
        data() {
            return {
                rules: {
                    code: [
                        {required: true, message: '请输入周转规则编码'}
                    ],
                    name: [
                        {required: true, message: '请输入周转规则名称'}
                    ],
                    lotAttrRuleName: [
                        {required: true, message: '请选择批次规则'}
                    ],
                },
                woTurnoverRuleDetailList: [],//模态框的列表数据
                woTurnoverRuleDetailListEdit: [],//模态框的列表数据
                pageIndex: 0,
                pageSize: 10,
                total: 0,
                //排序方式下拉框
                sortWayArr: [
                    {
                        label: '从小到大',
                        value: "1"
                    },
                    {
                        label: '从大到小',
                        value: "2"
                    }
                ],
                //是否精准匹配 下拉
                ifExactArr: [
                    {
                        label: '是',
                        value: "1"
                    },
                    {
                        label: '否',
                        value: "0"
                    }
                ],
                batchRuleDlgVis: false,//当前模态框的显示隐藏
                selectRuleDlgVis: false,
                repeatSeqNum: null,//新建是否重复
                repeatSeqNumEdit: null,//修改是否重复
            }
        },
        beforeCreate() {
            this.allFields = [
                'id', 'code', 'name', 'lotAttrRuleName', 'lotAttrRuleId', 'woTurnoverRuleDetailList', 'description',
            ]
            this.disFields = ['logisticCode', 'expressCode']
        },
        methods: {
            //判断重复方法
            isRepeat(arr) {
                var hash = {};
                for (var i in arr) {
                    if (hash[arr[i]])
                        return true;
                    hash[arr[i]] = true;
                }
                return false;
            },
            onClickProductCode(e) {
                // TODO 打开弹出框
                if (this.action == 'view') {
                    return false
                }
                // this.selectRuleDlgVis = true
                this.batchRuleDlgVis = true
            },
            updateShipperSelDlgVis(vis) {
                this.batchRuleDlgVis = vis
            },
            // 模态框批次规则id
            chooseProduct(product) {
                /*if(this.query.storerName){
                    delete this.query.storerId;
                }*/
                // this.query.name = product.name
                this.dto.lotAttrRuleId = product.id
                this.dto.lotAttrRuleName = product.name
                let obj = {} //获取有数值的属性
                let arr = []
                for (let key in product) {
                    if (product[key]) {
                        obj[key] = product[key]
                        obj.lotattIndex = 1
                    }
                }
                this.woTurnoverRuleDetailList = obj
                for (let i = 0; i < 10; i++) {
                    let index = '0' + i
                    if (obj['lotatt' + index + 'Validate'] && obj['lotatt' + index + 'Name']) {
                        arr.push({
                            lotattName: obj['lotatt' + index + 'Name'],
                            lotattIndex: i,
                            lotattType: obj['lotatt' + index + 'Type'] ? obj['lotatt' + index + 'Type'] + '' : '',// 生产日期 10  数字格式 20   文本30
                            lotattValidate: obj['lotatt' + index + 'Validate'],//批次属性
                            sortWay: obj['lotatt' + index + 'sortWay'] ? obj['lotatt' + index + 'sortWay'] + '' : '1',
                            seqNum: 1,
                            accurateMatchFlag: '0',//精准匹配
                        })
                    }
                }
                if (this.action == 'add') {
                    this.woTurnoverRuleDetailList = arr
                } else if (this.action == 'edit') {
                    this.woTurnoverRuleDetailListEdit = arr
                }
                this.toFront(this.entity)
                this.selectRuleDlgVis = false
            },
            toFront(entity) {
                const res = {
                    ...this.getDefaultDto(),
                    ..._.cloneDeep(entity)
                }
                return res
            },
            toEnd() {
                const res = _.pick(this.dto, this.allFields)
                return res
            },
            //新建 保存
            onSave() {
                this.$refs.form.validate((valid) => {
                    let _this = this
                    if (!valid) {
                        return false;
                    }
                    let repeatArr = []
                    let itemObj = {}
                    let sendArr=[] //入参数组
                    for (let i = 0; i < this.woTurnoverRuleDetailList.length; i++) {
                        if (!this.woTurnoverRuleDetailList[i].seqNum) {
                            this.$message({
                                message: this.woTurnoverRuleDetailList[i].lotattName + '顺序号第' + (i + 1) + '项有误',
                                type: 'error'
                            })
                            return false
                        }
                        repeatArr.push(this.woTurnoverRuleDetailList[i].seqNum)
                        itemObj=_.omit(this.woTurnoverRuleDetailList[i], 'lotattType','lotattValidate')
                        sendArr.push(itemObj)
                    }
                    this.repeatSeqNum = this.isRepeat(repeatArr)
                    if (this.repeatSeqNum) {
                        this.$message({
                            message: '顺序号有重复',
                            type: 'error'
                        });
                        return false
                    }
                    this.dto = Object.assign(this.dto, {
                        woTurnoverRuleDetailList: sendArr
                    })
                    api.turnoverRule.turnoverRuleInsert({
                        ...this.dto
                    }).then(({head = {}, body = {}}) => {
                        if (head.code === '200') {
                            _this.$message({
                                message: head.subMessage,
                                type: 'success'
                            });
                            this.queryList()
                        } else {
                            _this.$message({
                                message: head.subMessage,
                                type: 'error'
                            });
                        }
                        this.handleClose()
                        this.woTurnoverRuleDetailList = []
                    })
                });
            },
            //修改保存
            onEdit() {
                let param = {
                    id: this.dto.id,
                    code: this.dto.code,
                    name: this.dto.name,
                    lotAttrRuleName: this.dto.lotAttrRuleName,
                    lotAttrRuleId: this.dto.lotAttrRuleId,
                    description: this.dto.description,
                }
                this.$refs.form.validate((valid) => {
                    let _this = this
                    if (!valid) {
                        return false;
                    }
                    let repeatArr = []
                    let itemObj = {}
                    let sendArr=[] //入参数组
                    for (let i = 0; i < this.woTurnoverRuleDetailListEdit.length; i++) {
                        if (!this.woTurnoverRuleDetailListEdit[i].seqNum) {
                            this.$message({
                                message: this.woTurnoverRuleDetailListEdit[i].lotattName + '顺序号第' + (i + 1) + '项有误',
                                type: 'error'
                            })
                            return false
                        }
                        repeatArr.push(this.woTurnoverRuleDetailListEdit[i].seqNum)
                        itemObj=_.omit(this.woTurnoverRuleDetailListEdit[i], 'lotattType','lotattValidate')
                        sendArr.push(itemObj)
                    }
                    this.repeatSeqNumEdit = this.isRepeat(repeatArr)
                    if (this.repeatSeqNumEdit) {
                        this.$message({
                            message: '顺序号有重复',
                            type: 'error'
                        });
                        return false
                    }
                    param = Object.assign(param, {
                        woTurnoverRuleDetailList: sendArr
                    })
                    api.turnoverRule.turnoverRuleUpdate(
                        param
                    ).then(({head = {}, body = {}}) => {
                        if (head.code === '200') {
                            _this.$message({
                                message: head.subMessage,
                                type: 'success'
                            });
                            this.queryList()
                        } else {
                            _this.$message({
                                message: head.subMessage,
                                type: 'error'
                            });
                        }
                        this.handleClose()
                    })
                });
            },
        },
        watch: {
            'dto'(val) {
                // console.log(val.woTurnoverRuleDetailList)
                this.woTurnoverRuleDetailList = [
                    {
                        lotattName: this.dto.lotatt01Name || 'lotatt01Name',
                        Validate: this.dto.lotatt01Validate,
                        Type: this.dto.lotatt01Type
                    },
                    {
                        lotattName: this.dto.lotatt02Name || 'lotatt02Name',
                        Validate: this.dto.lotatt02Validate,
                        Type: this.dto.lotatt02Type
                    },
                    {
                        lotattName: this.dto.lotatt03Name || 'lotatt03Name',
                        Validate: this.dto.lotatt03Validate,
                        Type: this.dto.lotatt03Type
                    },
                    {
                        lotattName: this.dto.lotatt04Name || 'lotatt04Name',
                        Validate: this.dto.lotatt04Validate,
                        Type: this.dto.lotatt04Type
                    },
                    {
                        lotattName: this.dto.lotatt05Name || 'lotatt05Name',
                        Validate: this.dto.lotatt05Validate,
                        Type: this.dto.lotatt05Type
                    },
                    {
                        lotattName: this.dto.lotatt06Name || 'lotatt06Name',
                        Validate: this.dto.lotatt06Validate,
                        Type: this.dto.lotatt06Type
                    },
                    {
                        lotattName: this.dto.lotatt07Name || 'lotatt07Name',
                        Validate: this.dto.lotatt07Validate,
                        Type: this.dto.lotatt07Type
                    },
                    {
                        lotattName: this.dto.lotatt08Name || 'lotatt08Name',
                        Validate: this.dto.lotatt08Validate,
                        Type: this.dto.lotatt08Type
                    },
                    {
                        lotattName: this.dto.lotatt09Name || 'lotatt09Name',
                        Validate: this.dto.lotatt09Validate,
                        Type: this.dto.lotatt09Type
                    },
                    {
                        lotattName: this.dto.lotatt10Name || 'lotatt10Name',
                        Validate: this.dto.lotatt10Validate,
                        Type: this.dto.lotatt10Type
                    },
                ]
                this.woTurnoverRuleDetailListEdit = val.woTurnoverRuleDetailList
            },
        },

    }
</script>



