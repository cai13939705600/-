<template>
    <el-form :model="state" ref="form" label-width="100px" class="demo-ruleForm">
        <basic-list
            class="mt20"
            :fields="fields"
            :loading="state.loading"
            :total="state.total"
            :list="state.list"
            :show-action-col="false"
            :indexColLabel="'行号'"
            :page-index="state.pageIndex"
            :page-size="state.pageSize"
            :page-index-change="pageIndexChange"
            :page-size-change="pageSizeChange"
            :setClmnsFlg="false">
            <template slot="hd-col--l">
                <el-button type="primary" size="mini" @click="onSave">保存</el-button>
            </template>
        </basic-list>
    </el-form>
</template>

<script>
import ExactList from 'biz/mixins/exactList'
import {setDate} from 'common/filters/setDate'
export default {
    mixins: [ ExactList ],
    props: {
        proxyActions: Function
    },
    inject: {
        getDetail: {
            default: () => {}
        }
    },
    data () {
        return {
            fields: [
                // { key: 'state', name: '序号', 
                //     render: (h, { index, row, col }) => {
                //          const en = this.DO_OPERATION_ITEM_STATE.map[
                //             Number( row.state )
                //         ]
                //         if (en) {
                //             return <span>{ en.enumValueCn }</span>
                //         } else {
                //             console.log('没有枚举:DO_OPERATION_ITEM_STATE', row.state, typeof row.state);
                //             return row.state
                //         }
                //     }
                // },
                { key: 'locationNo', name: '拣选库位' },
                { key: 'skuCode', name: '物料编码',width: 220 },
                { key: 'skuName', name: '物料名称',width: 220  },
                { key: 'skuSpec', name: '规格',width: 220  },
                { key: 'skuUom', name: '单位' },
                { key: 'availableQty', name: '可用数量' },
                { key: 'assignQty', name: '分配数量', width: 180,
                    render: (h, { index, row, col }) => {
                        return (
                            <el-form-item label-width="0" prop={'list.' + index + '.assignQty'} rules={[
                                { validator: this.validatePass, min: row.oldAssignQty, max: row.qty, trigger: 'blur' }
                            ]}>
                                <el-input v-model={row.assignQty} placeholder="请输入分配数量"></el-input>
                            </el-form-item>
                            )
                    }
                },
                { key: 'inventoryType', name: '库存类型',
                    render: (h, { index, row, col }) => {
                        switch (row.inventoryType) {
                            case 'ZP':
                                return <span>正品仓</span>
                            default:
                                return <span>残品仓</span>
                        }
                    }
                },
                { key: 'inboundDate', name: '入库日期', width: 180 ,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.inboundDate)}</span>
                    }
                },
                { key: 'madeDate', name: '生产日期', width: 180,
                    render: (h, { index, row, col }) => {
                       return <span>{setDate(row.madeDate)}</span>
                    }
                },
                { key: 'produceBatch', name: '生产批次' }
            ]
        }
    },
    methods: {
        onSave () {
            // console.log('每条出库明细分配数量总和是否小于等于应拣数量。')
            // console.log('提示语为 分配数量需小于等于应拣数量')
            if (!this.$refs.form) {
                return
            }
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                const list = this.state.list
                const detail = this.getDetail()
                // wmsStockList
                let params = {
                    id: detail.id,
                    doDetailId: String(this.state.doDetailId),
                    wmsStockList: list.filter(item => Number(item.assignQty)).map(item => {
                        return {
                            id: item.id,
                            assignQty: item.assignQty
                        }
                    })
                }
                if (!params.wmsStockList.length) {
                    return this.$message.error('请填写分配数量')
                }
                this.proxyActions({action: 'save', data: params})
            })
        },
        validatePass (rule, value, callback) {
            const min = rule.min
            const max = rule.max
            if (!/\S/.test(value)) {
                return callback();
            }
            if (!CNST.REG_EXP.NATURAL.test(value)) {
                return callback(new Error('请输入自然数'))
            }
            value = Number(value)
            if (value >= min && value <= max) {
                // 验证成功
                const sum = this.state.list.reduce((total, item) => {
                    const number = Number(item.assignQty)
                    if (Number.isNaN(number)){
                        return total
                    }
                    return total + number
                }, 0)
                const list = this.getDetail().doDetailList
                const detail = list.find(item => item.id === this.state.doDetailId)
                if (sum > detail.oldWaitAllocated) {
                    this.$message.error('所填分配数量不可大于待分配数量')
                } else {
                    detail.waitAllocated = detail.oldWaitAllocated - sum
                }
                return callback();
            } else {
                if (value < min) {
                    return callback(new Error('不能小于当前数量'));
                } else {
                    return callback(new Error('不能大于库存'));
                }
            }
        }
    }
}
</script>
<style lang="scss">
    .mt20 {
        margin-top: 20px;
    }
</style>

