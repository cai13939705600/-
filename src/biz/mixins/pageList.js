
import PageBase from './pageBase'

/**
 * 列表页公共方法混入
 */
export default {
    mixins: [ PageBase ],
    data () {
        return {
            // 实体弹窗是否可见
            entityDlgVis: false,
            // 实体弹窗动作类型
            entityDlgActn: 'add',
            // 是否立即查询
            immediateQuery: true,
            // 表格高度
            tableH: null
        }
    },
    watch: {

    },
    mounted () {
        if (this.immediateQuery) {
            this.queryList()
        }
    },
    methods: {
        // 将查询条件转换为后台需要的格式
        queryToEnd () {
           // to do something
        },
        // 查询列表数据
        queryList ({ berforeUpdate } = {}) {
            this.dispatch('queryList', { berforeUpdate })
        },
        // 查询数据实体
        queryEntity (entity, berforeUpdate) {
            this.dispatch('queryEntity', { params: entity, berforeUpdate })
        },
        // 新建实体
        createEntity (entity, cb) {
            this.dispatch('createEntity', { entity, cb })
        },
        // 更新实体
        updateEntity (entity, cb) {
            this.dispatch('updateEntity', { entity, cb })
        },
        // 删除实体
        deleteEntity (entity, cb) {
            this.dispatch('deleteEntity', { entity, cb })
        },
        // 响应分页索引发生改变
        pageIndexChange (index) {
            this.updateState({ pageIndex: index })
            this.queryList()
        },
        // 响应分页尺寸发生改变
        pageSizeChange (size) {
            this.updateState({ pageIndex: 1, pageSize: size })
            this.queryList()
        },
        // 检索按钮响应事件
        handleSearch (query = {}, { berforeUpdate } = {}) {
            query = _.cloneDeep(query)
            jt.object.removeEmptyAttr(query)
            this.queryToEnd(query)
            this.updateState({ query, pageIndex: 1 })
            this.queryList({ berforeUpdate })
        },
        // 新增按钮响应事件
        handleAdd () {
            this.entityDlgVis = true
            this.entityDlgActn = 'add'
            this.updateState('entity')
        },
        // 查看按钮响应事件
        handleView (entity) {
            this.entityDlgVis = true
            this.entityDlgActn = 'view'
            this.queryEntity(entity)
        },
        // 编辑按钮响应事件
        handleEdit (entity, berforeUpdate = {}) {
            this.entityDlgVis = true
            this.entityDlgActn = 'edit'
            this.queryEntity(entity, berforeUpdate)
        },
        // 删除按钮响应事件
        handleDelete (entity, { berforeUpdate } = {}) {
            const msg = `确定删除该${this.moduleName}吗`
            const cb = () => {
                if (this.state.list.length === 1) {
                    this.updateState({ pageIndex: 1 })
                }
                this.queryList({ berforeUpdate })
            }
            this.confirm(msg, () => {
                this.deleteEntity(entity, cb)
            })
        },
        // 保存按钮响应事件
        handleSave (entity, cb, type) {
            if (!type) {
                type = entity.id ? 'edit' : 'add'
            }
            if (type === 'add') {
                // 新建
                this.createEntity(entity, cb)
            } else {
                // 更新
                this.updateEntity(entity, cb)
            }
        },
        // 更新实体弹框可见状态
        updateEntityDlgVis (vis) {
            this.entityDlgVis = vis
        },
        calcTableH () {
            const $search = this.$refs.exactSearch
            if (!$search) {
                return
            }
            const pageH = _.get(this.app, 'pageSize.height')
            const searchH = $search.$el.offsetHeight
            if (!pageH || !searchH) {
                return
            }
            const totalH = pageH - searchH - 89
            if (totalH > 200) {
                this.tableH = totalH
            }
        },
        // 导出
        handleExport () {
            this.exporting = true
            const fields = this.$refs.exactList.fields
            const enCols = []
            const zhCols = []
            for (let i = 0, len = fields.length; i < len; i++) {
                enCols.push(fields[i].key)
                zhCols.push(fields[i].name)
            }
            const query = _.cloneDeep(this.state.query)
            jt.object.removeEmptyAttr(query)
            const params = {
                isSyn: true,
                multiSheet: false,
                serverName: 'jd-wms/jd-wms/erp/export',
                headersJson: JSON.stringify({
                    enName: enCols,
                    showName: zhCols
                }),
                conditionJson: JSON.stringify({
                    ...query,
                    cols: enCols
                }),
                ...(this.getExtraExportParams ? this.getExtraExportParams() : {})
            }
            api.base.export(params).then(({ code, msg, result }) => {
                if (code === 200) {
                    const $link = this.$refs.exportLink
                    $link.href = result.data.replace(/^https?:/, '')
                    $link.click()
                } else {
                    this.$message.error(msg)
                }
                this.exporting = false
            })
        }
    }
}
