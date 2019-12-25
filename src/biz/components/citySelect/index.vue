<template>
    <el-select
        v-model="innerValue"
        filterable
        placeholder="请选择"
        @change="selectChange(innerValue)"
        :disabled="!parentId && level !== 1"
        v-bind="$attrs">
        <el-option
            v-for="(item, index) in list"
            :key="item.code + ':' + index"
            :label="item.name"
            :value="isId ? item.id : item.name">
        </el-option>
    </el-select>
</template>

<script>
/**
    @property {number} [required] ID
    @property {number} level 级别 1-省、2-市、3-区、4-街道
    @property {string} parent-id 父级ID 级别>2 必须
*/
export default {
    name: 'city-select',
    props: {
        level: {
            type: Number,
            default: 1
        },
        parentId: {
            type: String | Number,
            default: undefined
        },
        value: {
            type: String | Number,
            default: ''
        },
        isCn: {
            type: Boolean,
            default: false
        },
        isId: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            innerValue: '',
            list: [],
        }
    },
    created () {
        this.innerValue = this.value
    },
    watch: {
        value: function (n) {
            this.innerValue = n;
            return n;
        },
        parentId: function (n) {
            this.list = [];
            //this.selectChange(undefined)
            if (n) {
                this.getConcatenatedAddress()
            }
        }
    },
    mounted () {
        this.getConcatenatedAddress()
    },
    methods: {
        selectChange (innerValue) {
            this.$emit('input', innerValue)
        },
        getConcatenatedAddress ( ) {
            const level = this.level;
            if ((level > 1 && this.parentId) || level === 1) {
                let data = {}
                if (this.isId){
                    data.level = this.level
                    data.parentId = this.parentId
                } else {
                    data.level = this.level
                    data.parentName = this.parentId
                }
                api.address.getConcatenatedAddress(data).then(({ head = {}, body = {} }) => {
                    if (head.code === '200') {
                        this.list = body;
                    }
                })
            }
        },
        getName (id) {
            const list = this.list.filter(item => item.id = id)
            if (list.length){
                return list[0].name;
            }
            return undefined;
        }
    }
}
</script>

