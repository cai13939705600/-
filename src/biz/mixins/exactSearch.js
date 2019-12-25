import BasicSearch from 'biz/components/basicSearch'

/**
 * 列表页查询表单公共方法混入
 */
export default {
    components: {
        BasicSearch
    },
    props: {
        updateState: Function,
        handleSearch: Function
    },
    data () {
        return {
            query: this.getDefaultQuery()
        }
    },
    methods: {
        handleReset () {
            this.query = this.getDefaultQuery()
            this.handleSearch({ ...this.query })
        },
        getDefaultQuery () {
            const fields = this.fields
            const query = {}
            for (let i = 0; i < fields.length; i++) {
                if (_.isObject(fields[i])) {
                    query[fields[i].key] = fields[i].default
                } else {
                    query[fields[i]] = undefined
                }
            }
            return query
        }
    }
}
