import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    entity: {},
    saving: false
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.sku,
            items: [
                { key: 'deleteEntity', callee: 'deleteBarcode' },
                { key: 'queryList', callee: 'queryBarcodes' }
            ]
        }),
        async saveEntity ({ commit }, { entity, cb }) {
            const { head } = await api.sku.saveBarcode(entity)
            if (head.code === '200') {
                this._vm.$message.success(head.subMessage)
                cb && cb()
            } else {
                this._vm.$message.error(head.subMessage)
            }
            commit('update', { saving: false })
        }
    }
}, DEFAULTS)
