export default {
    methods: {
        saveAndGoOn (cb) {
            if (!this.$refs.form) {
                return
            }
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return
                }
                let params = this.toEnd()
                this.handleSave(params, () => {
                    this.$refs.form.resetFields()
                    this.queryList()
                    cb && cb();
                }, this.action)
            })
        }
    }
}