<template>
    <basic-list
        class="basic-list--editable"
        :show-page="false"
        :show-select-col="true"
        :show-action-col="false"
        :fields="fields"
        :list="list"
        :selection-change="selectionChange">
        <template slot="hd-col--l">
            <el-button type="primary" size="mini" @click="onAdd">新增</el-button>
            <el-button type="primary" size="mini" @click="onDelete">删除</el-button>
            <goods-sel-dlg
                :visible="goodsSelDlgVis"
                :update-vis="updateGoodsSelDlgVis"/>
        </template>
    </basic-list>
</template>

<script>
import shortid from 'shortid'
import BasicList from 'biz/components/basicList'
import GoodsSelDlg from 'biz/components/goodsSelDlg'
export default {
    components: {
        BasicList,
        GoodsSelDlg
    },
    props: {
        action: String,
        visible: Boolean,
        rows: {
            type: Array,
            default () {
                return []
            }
        }
    },
    data () {
        return {
            list: this.toFront(),
            selRows: [],
            actRowIndex: null,
            goodsSelDlgVis: false,
            fields: [
                { key: 'attr02', name: '行状态' },
                { key: 'attr03', name: '物料编码' },
                { key: 'attr04', name: '物料简称' },
                { key: 'attr05', name: '物料名称' },
                { key: 'attr08', name: '规格' },
                { key: 'attr09', name: '货号' },
                { key: 'attr10', name: '单位' },
                { key: 'attr11', name: '应出数量' },
                { key: 'attr02', name: '分配数量' },
                { key: 'attr03', name: '拣货数量' },
                { key: 'attr04', name: '复核数量' },
                { key: 'attr05', name: '库存类型' },
                { key: 'attr08', name: '单价' },
                { key: 'attr09', name: '金额' },
                { key: 'attr10', name: '备注' }
            ]
        }
    },
    watch: {
        visible (newVal, oldVal) {
            if (!newVal) {
                this.list = []
            }
        },
        rows (newVal, oldVal) {
            this.list = this.toFront()
        }
    },
    methods: {
        updateGoodsSelDlgVis (vis) {
            this.goodsSelDlgVis = vis
        },
        showGoodsSelDlg (index, row) {
            this.actRowIndex = index
            this.updateGoodsSelDlgVis(true)
        },
        addItems (count = 1) {
            const fields = this.fields
            for (let i = 0; i < count; i++) {
                const item = {}
                for (let j = 0, len = fields.length; i < len; i++) {
                    item[fields[i].key] = undefined
                }
                item.uid = shortid.generate()
                this.list.push(item)
            }
        },
        selectionChange (rows) {
            this.selRows = rows
        },
        toFront () {
            const list = _.cloneDeep(this.rows)
            return list
        },
        toEnd () {

        },
        onEnterKeyUp (keyCode, index, row) {
            if (keyCode === 13) {
                this.showGoodsSelDlg(index, row)
            }
        },
        onAdd () {
            this.addItems()
        },
        onDelete () {
            if (!this.selRows.length) {
                this.$message.error('请选择需要删除的物料！')
            }
            const rows = this.selRows
            const map = {}
            for (let i = 0, len = rows.length; i < len; i++) {
                if (rows[i].id) {
                    map[rows[i].id] = true
                } else if (rows[i].uid) {
                    map[rows[i].uid] = true
                }
            }
            const list = this.list
            const items = []
            for (let i = 0, len = list.length; i < len; i++) {
                if (map[list[i].id] || map[list[i].uid]) {
                    continue
                }
                items.push(list[i])
            }
            this.list = items
        }
    }
}
</script>

<style lang="scss" scoped>
.basic-list {
    padding-top: 0;
}
</style>


