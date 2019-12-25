import { pageListMerge, generateActions } from 'biz/store/helper'

// 默认状态
const DEFAULTS = {
    query: {  },
    entity: {},
    logLoading: false,
    logList: [],
    units: [],
    saving: false
}

export default pageListMerge({
    namespaced: true,
    actions: {
        ...generateActions({
            caller: api.goods,
            items: [
                { key: 'queryList', callee: 'queryGoodsList' },
                { key: 'start', callee: 'startGoods' },
                { key: 'stop', callee: 'stopGoods' }
            ]
        }),
        async createEntity ({ commit }, { entity, cb }) {
            commit('update', { saving: true })
            const { head  } = await api.goods.addGoods(entity)
            if (head.code == 200) {
                this._vm.$message.success(head.subMessage)
                cb && cb()
            } else {
               this._vm.$message.error(head.subMessage)
            }
            commit('update', { saving: false })
        },
        async updateEntity ({ commit }, { entity, cb }) {
            commit('update', { saving: true })
            const { head } = await api.goods.updateGoods(entity)
            if (head.code == 200) {
                this._vm.$message.success(head.subMessage)
                cb && cb()
            } else {
                this._vm.$message.error(head.subMessage)
            }
            commit('update', { saving: false })
        },
        async queryLogList ({ commit }, goodsId) {
            if (!goodsId) {
                commit('update', { logList: [] })
                return
            }
            commit('update', { logLoading: true })
            const { head } = await api.goods.queryLogs({ goodsId })
            const payload = { logLoading: false }
            if (head.code == 200) {
                payload.logList = _.get(result, 'data') || []
            }
            commit('update', payload)
        },
        async queryUnits ({ commit, state }, goodsId) {
            if (!_.isEmpty(state.units)) {
                return
            }
            const { code, result } = await api.goods.queryUnits()
            if (code == 200) {
                const units = _.get(result, 'data') || []
                commit('update', { units })
            }
        }
    }
}, DEFAULTS)
