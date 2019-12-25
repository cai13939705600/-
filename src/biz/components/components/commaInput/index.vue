<template>
    <div>
        <el-input 
            v-bind="$attrs"
            v-on="$listeners"
            @blur="onBlur"
            v-model="innnerValue"
            :placeholder="placeholder">
        </el-input>
    </div>
</template>

<script>
import { trim } from 'common/utils/lodash'
export default {
    name: 'comma-input',
    props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请输入内容'
        }
    },
    data () {
        return {
            innnerValue: ''
        }
    },
    created () {
    },
    mounted () {
        this.innnerValue = this.value
    },
    beforeDestroy () {
    },
    methods: {
        onBlur() {
            this.innnerValue = trim(
                this.innnerValue
                    // 替换中文逗号,并且删除多余逗号
                    .replace(/(，+)|(,{2,})/g, ',')
                    // 删除 开始的逗号
                    .replace(/(^,)|(,$)/g, '')
            )
            console.log(this.innnerValue, 'this.innnerValue');
            
            this.$emit('input', this.innnerValue)
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
