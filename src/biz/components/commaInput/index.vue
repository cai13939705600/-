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
            type: String|Array,
            default: ''
        },
        placeholder: {
            type: String,
            default: '多个单号用英文逗号分隔'
        }
    },
    data () {
        return {
            innnerValue: ''
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function (n) {
                if (n instanceof Array) {
                    this.innnerValue = n.join(',')
                } else {
                    this.innnerValue = n
                }
            }
        }
    },
    created () {
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
            this.$emit('input', this.innnerValue.split(','))
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
