/**
 * module对象合并
 * @param {Array|Object} sps 需要合并的父对象
 * @param {Object} overrides 一些新增的属性和方法
 * @param {Object} defaults 默认状态
 */
export function merge (sps, overrides, defaults) {
    if (arguments.length === 0) {
        return {}
    }
    if (arguments.length === 1) {
        overrides = sps
        sps = []
    } else if (arguments.length === 2) {
        defaults = overrides
        overrides = sps
        sps = []
    } else if (arguments.length === 3) {
        if (!_.isArray(sps)) {
            sps = [sps]
        }
    }
    let sb = {}
    if (defaults) {
        // 添加默认state
        sb.state = function () {
            return _.cloneDeep(defaults)
        }
        // 默认添加reset|update函数
        sb.mutations = {
            reset (state, payload) {
                if (_.isEmpty(payload) || _.isObject(payload)) {
                    Object.assign(state, { ..._.cloneDeep(defaults), ...(payload || {}) })
                } else if (_.isArray(payload)) {
                    for (let i = 0; i < payload.length; i++) {
                        state[payload[i]] = _.cloneDeep(defaults[payload[i]])
                    }
                } else if (_.isString(payload)) {
                    state[payload] = _.cloneDeep(defaults[payload])
                }
            },
            update (state, payload) {
                if (_.isArray(payload)) {
                    for (let i = 0; i < payload.length; i++) {
                        state[payload[i]] = _.cloneDeep(defaults[payload[i]])
                    }
                } else if (_.isString(payload)) {
                    state[payload] = _.cloneDeep(defaults[payload])
                } else if (_.isObject(payload)) {
                    Object.assign(state, payload)
                }
            }
        }
    }
    sps.push(overrides)
    return _.merge(sb, ...sps)
}

/**
 * 列表页module合并
 * @param {Array|Object} sps 需要合并的父对象
 * @param {Object} overrides 一些新增的属性和方法
 * @param {Object} defaults 默认状态
 */
export function pageListMerge (sps, overrides, defaults) {
    if (arguments.length === 2) {
        defaults = overrides
    }
    defaults = {
        // 加载状态
        loading: false,
        // 查询条件
        query: {},
        // 当前页码
        pageIndex: 1,
        // 每页展示条数
        pageSize: 20,
        // 总条数
        total: 0,
        // 列表数据
        list: [],
        ...defaults
    }
    return merge(sps, overrides, defaults)
}

/**
 * 辅助生产增|删|改|查等通用action
 * @param {Object} config
 */
export function generateActions (config) {
    const actions = {}
    const items = config.items
    for (let i = 0, len = items.length; i < len; i++) {
        switch (items[i].key) {
            case 'queryEntity':
                actions.queryEntity = async function ({ commit }, { params, berforeUpdate }) {
                    const cb = params.callbackSuccess
                    const errCb = params.callbackError
                    delete params.callbackSuccess
                    delete params.callbackError
                    const { head, body } = await (items[i].caller || config.caller)[items[i].callee](params)
                    if (head.code === '200') {
                        berforeUpdate && berforeUpdate(body)
                        commit('update', { entity: body || {} })
                        cb && cb()
                    } else {
                        this._vm.$message.error(head.subMessage)
                    }
                }
                break
            case 'queryList':
                actions.queryList = async function ({ commit, state }, { berforeUpdate }) {
                    commit('update', { loading: true })
                    let { head, body } = await (items[i].caller || config.caller)[items[i].callee]({
                        ...state.query,
                        page: {
                            current: state.pageIndex,
                            size: state.pageSize
                        }
                    })
                    if (berforeUpdate) {
                        body = berforeUpdate(body)
                    }
                    const payload = { loading: false }
                    if (head.code === '200') {
                        payload.list = _.get(body, 'records') || []
                        payload.total = _.get(body, 'total') || 0
                    } else {
                        if (items[i].showMsg !== false) {
                            this._vm.$message.error(head.subMessage)
                        }
                    }
                    console.log('payload', payload);
                    commit('update', payload)
                }
                break
            default:
                actions[items[i].key] = async function ({ commit }, { entity, params, cb, errCb }) {
                    const { head, body } = await (items[i].caller || config.caller)[items[i].callee](entity || params)
                    if (head.code === '200') {
                        if (items[i].showMsg !== false && head.subMessage) {
                            this._vm.$message.success(head.subMessage)
                        }
                        if (items[i].mutation) {
                            commit(items[i].mutation, body)
                        }
                        cb && cb(head, body)
                    } else {
                        errCb && errCb(head, body)
                        if (items[i].showMsg !== false && head.subMessage) {
                            this._vm.$message.error(head.subMessage)
                        }
                    }
                }
        }
    }
    return actions
}
