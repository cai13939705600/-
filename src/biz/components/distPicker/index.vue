<template>
    <el-cascader
        clearable
        :disabled="disabled"
        :props="{value: 'name', label: 'name', children: 'districts'}"
        :options="options"
        v-model="midVal"
        @active-item-change="onActiveItemChange">
    </el-cascader>
</template>

<script>
export default {
    props: {
        level: {
            type: Number,
            default: 4
        },
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            distMap: {},
            options: [],
            midVal: []
        }
    },
    watch: {
        value (newVal, oldVal) {
            if (_.isArray(newVal) && !_.isEqual(newVal, this.midVal)) {
                this.midVal = newVal
                if (newVal.length === 1) {
                    return
                }
                let start = 0
                if (!_.isEmpty(this.options)) {
                    start = 1
                }
                const fn = () => {
                    const adname = start === 0 ? undefined : newVal[start - 1]
                    this.queryDist(start + 1, adname, () => {
                        start++
                        if (newVal[start] && this.distMap[newVal[start - 1]]) {
                            fn()
                        }
                    })
                }
                fn()
            }
        },
        midVal (newVal, oldVal) {
            if (!_.isEqual(newVal, this.value)) {
                this.$emit('input', newVal)
            }
        }
    },
    mounted () {
        this.queryDist(1)
    },
    methods: {
        queryDist (level, name, cb) {
            console.log('区域选择',level,name);
            const id = level === 1 ? undefined : this.distMap[name].id
            api.address.getConcatenatedAddress({ level, parentId: id }).then(({ head, body }) => {
                if (head.code === '200') {
                    const data = body || []
                    this.addToMap(data)
                    if (level === 1) {
                        this.options = data
                    } else if (level === this.level) {
                        const items = []
                        for (let i = 0, len = data.length; i < len; i++) {
                            items.push(_.omit(data[i], 'districts'))
                        }
                        this.distMap[name].districts.push(...items)
                    } else {
                        this.distMap[name].districts.push(...data)
                    }
                    cb && cb()
                }
            })
        },
        addToMap (data) {
            const map = this.distMap
            for (let i = 0, len = data.length; i < len; i++) {
                map[data[i].name] = data[i]
            }
        },
        onActiveItemChange (val) {
            const level = val.length + 1
            const name = val[level - 2]
            if (this.distMap[name] && _.isEmpty(this.distMap[name].districts)) {
                this.queryDist(level, name)
            }
        }
    }
}
</script>

