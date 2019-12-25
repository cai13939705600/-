<template>
    <div class="edit-cell" @click.self="handleInnerClick" v-clickoutside="handleOuterClick">
        <template v-if="status === 1">
            <slot name="in-edit"></slot>
        </template>
        <template v-else>
            <slot name="no-edit">{{noEditVal}}</slot>
        </template>
    </div>
</template>

<script>
export default {
    name: 'EditCell',
    props: {
        editable: {
            type: Boolean,
            default: true
        },
        noEditVal: {
            type: [String, Number, Boolean],
            default: ''
        }
    },
    data () {
        return {
            // 当前状态(1: 编辑状态，2：非编辑状态)
            status: 2
        }
    },
    methods: {
        handleInnerClick (e) {
            if (!this.editable) {
                return
            }
            this.status = 1
        },
        handleOuterClick () {
            this.status = 2
        }
    }
}
</script>

<style lang="scss" scoped>
.edit-cell {
    cursor: pointer;
}
</style>

