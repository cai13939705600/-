import BasicDialog from 'biz/components/basicDialog'

const ACTIONS = {
    add: '新增',
    view: '查看',
    edit: '编辑'
}

export default {
    components: {
        BasicDialog
    },
    props: {
        moduleName: String,
        visible: {
            type: Boolean,
            default: false
        },
        // add | view | edit
        action: {
            type: String,
            default: 'add'
        },
        entity: {
            type: Object,
            default() {
                return {}
            }
        },
        updateVis: {
            type: Function,
            default: () => {
            }
        },
        updateState: {
            type: Function,
            default: () => {
            }
        },
        queryList: {
            type: Function,
            default: () => {
            }
        },
        handleSave: {
            type: Function,
            default: () => {
            }
        }
    },
    computed: {
        title() {
            return ACTIONS[this.action] + this.moduleName
        },
        showFt() {
            return this.action !== 'view'
        }
    },
    data() {
        return {
            dto: this.toFront(this.entity)
        }
    },
    watch: {
        entity(newVal) {
            this.dto = this.toFront(newVal)
        },
        visible: function (n) {
            if (n === true&&this.refs) { //角色模块 whl
                if(this.$refs.dataDialog.$refs.form){
                    this.$nextTick(() => {
                        this.$refs.dataDialog.$refs.form.clearValidate()
                    })
                }else {
                    this.$nextTick(() => {
                        this.$refs.form.clearValidate()
                    })
                }
            } 
        },
    },
    methods: {
        isDisabled(field) {
            if (this.action === 'add') {
                return false
            } else if (this.action === 'view') {
                return true
            } else {
                if (this.disFields.indexOf(field) !== -1) {
                    return true
                }
                return false
            }
        },

        getDefaultDto() {
            const fields = this.allFields || []
            const dto = {}
            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];
                if (typeof field === 'object') {
                    if (field.default instanceof Function) {
                        dto[field.key] = field.default()
                    } else {
                        dto[field.key] = field.default
                    }
                    continue
                }
                dto[field] = undefined
            }
            return dto
        },
        toFront(entity) {
            console.log('toFront entity',entity)
            return {
                ...this.getDefaultDto(),
                ..._.cloneDeep(entity)
            }
        },
        toEnd() {
            return _.pick(this.dto, this.allFields.map(field => {
                if (typeof field === 'object') {
                    return field.key
                }
                return field
            }))
        },
        handleClose() {
            this.updateVis(false)
        },

        handleClosed () {
            this.updateState('entity')
            if (this.$refs.form) {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate()
                })
            }
        },
        handleOk() {
            if (!this.$refs.form) {
                return
            }
            this.$refs.form.validate(valid => {
                console.log(this,'this');
                if (!valid) {
                    return
                }
                let params = this.toEnd()
                this.handleSave(params, () => {
                    this.handleClose()
                    this.queryList()
                }, this.action)
            })
        }
    }
}
