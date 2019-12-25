import BasicList from 'biz/components/basicList'
import { mapState } from 'vuex'
/**
 * 列表页数据列表公共方法混入
 */
export default {
    components: {
        BasicList
    },
    props: {
        state: Object,
        tableH: Number,
        confirm: Function,
        updateState: Function,
        pageIndexChange: Function,
        pageSizeChange: Function,
        queryList: Function,
        handleAdd: Function,
        handleView: Function,
        handleEdit: Function,
        handleDelete: Function,
        handleSelectionChange: Function
    },
    data () {
        return {
            selRows: []
        }
    },
    methods: {
        selectionChange (rows) {
            this.selRows = rows
            this.handleSelectionChange && this.handleSelectionChange(rows)
        }
    },
    computed: {
        ...mapState('app', ['rcMap']),
    }
}
