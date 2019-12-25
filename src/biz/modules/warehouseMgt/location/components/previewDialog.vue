<template>
    <el-dialog
        @close="perviewDialogClose(false)"
        :visible="visible"
        :width="'90%'"
        :append-to-body="true"
        :custom-class="'overflow-y'"
        title="库位预览">
        <table class="passageway-table" v-for="passageway in list" :key="passageway.name">
            <thead>
                <tr>
                    <th class="passageway-title" :colspan="passageway.list[0] && passageway.list[0].length">{{ passageway.name }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cell in passageway.list" :key="cell.name">
                    <td v-for="row in cell" :key="row.name">
                        {{ row.name }}
                    </td>
                </tr>
            </tbody>
        </table>
    </el-dialog>
</template>

<script>
import { cloneDeep } from 'common/utils/lodash'
import EntityDialog from 'biz/mixins/entityDialog'
export default {
    mixins: [ EntityDialog ],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        perviewDialogClose: {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            list: []
        }
    },
    beforeCreate () {
    },
    created () {
    },
    watch: {
    },
    methods: {
        /**
         * @interface Data
         * @property {string} name 数据
         * @property {Data[]|undefined} 数据
         */
        /**
         * 生成数组数据
         * @param {number} start 开始数字
         * @param {number} count 数量
         * @param {string} perfix 前缀
         * @returns {Data[]}
         */
        generatorArray (start, count, perfix = '') {
            let result = [];
            let counter = start;
            let total = start + count;
            while (counter < total){
                result.push({
                    name: perfix + counter
                })
                counter++;
            }
            return result;
        },
        generatorData(data) {
            // 创建层
            let result = this.generatorArray(data.startLevel, data.levelNum, '层').map(cell => {
                // 创建列
                return [cell, ...this.generatorArray(data.startBay, data.bayNum, '列')]
            });
            // 如果填写过通道那么继续
            if (
                (data.startAisil >= 0 && data.aisilNum)
            ) {
                result = this.generatorArray(data.startAisil, data.aisilNum, '通道').map(passageway => {
                    passageway.list = cloneDeep(result)
                    return passageway
                })
            } else {
                result = [{
                    name: '通道',
                    list: result
                }]
            }
            console.log('通道', data);
            
            this.list = result;
            console.log('result', result);
            
        }
    }
}
</script>
<style>
    .overflow-y .el-dialog__body{
        overflow-y: auto;
        max-height: 500px;
    }
</style>
<style scoped>
    .passageway-table {
        width: 100%;
        text-align: center;
        border-collapse: collapse;
        line-height: 30px;
    }
    .passageway-table tr td:nth-child(1) {
        background-color: #EBEEF5;
        font-weight: 500;
    }
    .passageway-table tr {
        border-bottom: 1px solid #EBEEF5;
    }
    .passageway-table td {
        min-width: 40px;
    }
    .passageway-title {
        height: 30px;
        line-height: 30px;
        font-size: 18px;
        color: #4186f6;
        text-align: center;
        border-bottom: 1px dashed #4186f6;
    }
</style>



