
export default {
    props: {
        action: {
            type: String,
            default: 'add'
        },
        dto: {
            type: Object,
            default: () => { return {} }
        }
    },
    data () {
        return {
            model: this.toFront(this.dto)
        }
    },
    watch: {
        dto (newVal) {
            this.model = this.toFront(newVal)
        }
    },
    methods: {
        isDisabled (field) {
            if (this.action === 'add') {
                return false
            } else if (this.action === 'view') {
                return true
            } else {
                return this.disFields.indexOf(field) !== -1
            }
        },
        getDefaultModel () {
            const fields = this.allFields || []
            const model = {}
            for (let i = 0, len = fields.length; i < len; i++) {
                model[fields[i]] = undefined
            }
            return model
        },
        toFront (dto) {
            return {
                ...this.getDefaultModel(),
                ..._.pick(dto, this.allFields)
            }
        },
        toEnd () {
            return _.pick(this.model, this.allFields)
        },
        validate () {
           return this.$refs.form.validate()
        },
        reset () {
            this.$refs.form.resetFields()
        }
    }
}
