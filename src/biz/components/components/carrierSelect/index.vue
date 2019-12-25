<template>
    <div>
        <el-select
            v-model="innerValue"
            filterable
            remote
            v-bind="$attrs"
            placeholder="请输入承运商名称"
            @change="onChange">
            <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
        </el-select>
    </div>
</template>

<script>
export default {
    name: 'carrier-Select',
    props: {
        value: {
            type: Number | Array,
            default: undefined
        }
    },
    data () {
        return {
            innerValue: '',
            loading: false,
            list: []
        }
    },
    created () {
        this.getCarrierList()
    },
    mounted () {
        this.innerValue = this.value
    },
    beforeDestroy () {
    },
    watch: {
        value: function (n) {
            this.innerValue = n
        }
    },
    methods: {
        getCarrierList () {
            api.carrier.getCarrierList({
                name: ''
            }).then(({ head = {}, body = {} }) => {
                if (head.code === '200') {
                    this.list = body;
                }
            })
        },
        onChange () {
            this.$emit('input', this.innerValue);
        },
        getCarrier (id) {
            if (this.list.length){
                const list = this.list.filter((carrier) => carrier.id === id)
                if (list.length) {
                    return list[0];
                }
            }
            return undefined;
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
