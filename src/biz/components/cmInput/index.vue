
<script>
export default {
    props: {
        value: {
            type: String
        },
        pattern: {
            type: String
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            midVal: ''
        }
    },
    watch: {
        value (newVal, oldVal) {
            if (newVal !== this.midVal) {
                this.midVal = newVal
            }
        },
        midVal (newVal, oldVal) {
            console.log('newVal, oldVal', newVal, oldVal);
            if (newVal !== this.value) {
                this.$emit('input', newVal)
            }
        }
    },
    computed: {
        exclReg () {
            const pattern = this.pattern
            return new RegExp(`[^${pattern}]`, 'g')
        }
    },
    render () {
        return (
            <el-input clearable v-model={this.midVal} onInput={this.onInput} disabled={this.disabled}/>
        )
    },
    methods: {
        onInput (val) {
            if (this.exclReg && this.exclReg.test(val)) {
                val = val.replace(this.exclReg, '')
            }
            this.midVal = val
        }
    }
}
</script>
