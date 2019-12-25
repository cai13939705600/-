
export default {
    props: {
        libraries: {
            type: Array,
            default: () => ([])
        },
        changeValue: {
            type: Function,
            default: () => {}
        }
    },
    data () {
        return {
            loading: false
        }
    }
}
