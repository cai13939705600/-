import { merge } from 'biz/store/helper'

/**
 * 存放系统所有枚举
 */
/**
 * 存放系统所有枚举
 */
const ENUM_TYPES = [
    'DO_STATE',
    // 启停状态
    'VALID_FLAG',
    'STOCK_DIFF_STATUS',
    'STOCK_DIFF_TYPE',
    'PICK_STATE',
    'LOCATION_USE', // 库位用途
    'LOCATION_CONSTRAINT', // 库位限制
    'LOCATION_CYCLE_CLASS', // 库位ABC类型
    'ASN_STATE', // 入库单状态
    'ASN_TYPE', // 入库单类型
    'PUTAWAY_STATE', // 上架任务状态
    "ASN_SEARCH_DATE_TYPE",//ASN查询时间类型
    'BILL_CATEGORY_TYPE',
    'YES_FLAG',
    'ATTR_FORMAT',
    "STOCK_COU_STATUS",
    "USER_TYPE",//账号类型
    "ROLE_TYPE",//角色类型
    "STOCK_COU_MODE",
    "STOCK_COU_SHOW_MODE",
    "STOCK_COU_TYPE",
    "IF_AUTO_ALLOCATE",//是否自动分配
    'GET_METHOD',//领料方式
    'PACKAGE_TYPE',//包装形式
    'PROJECT_TYPE',//项目类型
    'PROJECT_CATEGORY',//项目类别
    'MATERIAL_USAGE',//项目物资用途
    'SMALL_TYPE',//项目小类
    'VOLTAGE_CLASSES',//电压等级
    'APPLY_COMPANY',//申请单位
    'APPLY_COMPANY',//建设单位
    'SUPPLIES_ACCOUNT',//物资账
    'CONSTRUCTION_NATURE',//建设性质
    'MONEY_SOURCE',//资金来源
    'YES_FLAG',//是否差异
    'STOCK_COU_SOURCE'//盘点来源
]

let DEFAULTS = {
    'SELLING_PLATFORM': {
        'array': [{
            'enumCode': 1,
            'enumName': '店铺平台对应运单类型',
            'enumType': 'SELLING_PLATFORM',
            'enumValue': '[0,1]',
            'enumValueCn': 'TB',
            'id': 81,
            'rwType': 0
        }, {
            'enumCode': 2,
            'enumName': '店铺平台对应运单类型',
            'enumType': 'SELLING_PLATFORM',
            'enumValue': '[0,1]',
            'enumValueCn': 'TMALL',
            'id': 82,
            'rwType': 0
        }, {
            'enumCode': 3,
            'enumName': '店铺平台对应运单类型',
            'enumType': 'SELLING_PLATFORM',
            'enumValue': '[0,2]',
            'enumValueCn': 'JD',
            'id': 83,
            'rwType': 0
        }, {
            'enumCode': 4,
            'enumName': '店铺平台对应运单类型',
            'enumType': 'SELLING_PLATFORM',
            'enumValue': '[0,3]',
            'enumValueCn': 'PDD',
            'id': 84,
            'rwType': 0
        }, {
            'enumCode': 5,
            'enumName': '店铺平台对应运单类型',
            'enumType': 'SELLING_PLATFORM',
            'enumValue': '[0,1,2,3]',
            'enumValueCn': 'OTHERS',
            'id': 85,
            'rwType': 0
        }],
        'map': {
            'TB': {
                'enumCode': 1,
                'enumName': '店铺平台对应运单类型',
                'enumType': 'SELLING_PLATFORM',
                'enumValue': '[0,1]',
                'enumValueCn': 'TB',
                'id': 81,
                'rwType': 0
            },
            'TMALL': {
                'enumCode': 2,
                'enumName': '店铺平台对应运单类型',
                'enumType': 'SELLING_PLATFORM',
                'enumValue': '[0,1]',
                'enumValueCn': 'TMALL',
                'id': 82,
                'rwType': 0
            },
            'JD': {
                'enumCode': 3,
                'enumName': '店铺平台对应运单类型',
                'enumType': 'SELLING_PLATFORM',
                'enumValue': '[0,2]',
                'enumValueCn': 'JD',
                'id': 83,
                'rwType': 0
            },
            'PDD': {
                'enumCode': 4,
                'enumName': '店铺平台对应运单类型',
                'enumType': 'SELLING_PLATFORM',
                'enumValue': '[0,3]',
                'enumValueCn': 'PDD',
                'id': 84,
                'rwType': 0
            },
            'OTHERS': {
                'enumCode': 5,
                'enumName': '店铺平台对应运单类型',
                'enumType': 'SELLING_PLATFORM',
                'enumValue': '[0,1,2,3]',
                'enumValueCn': 'OTHERS',
                'id': 85,
                'rwType': 0
            }
        }
    }
}

for (let i = 0, len = ENUM_TYPES.length; i < len; i++) {
    DEFAULTS[ENUM_TYPES[i]] = { array: [], map: {} }
}

/**
 * 枚举值管理
 */
export default merge({
    namespaced: true,
    actions: {
        async 'queryEnums' ({ commit, state }, enumTypes = []) {
            if (_.isString(enumTypes)) {
                enumTypes = [enumTypes]
            }
            enumTypes = enumTypes.filter(function (item) {
                console.log(item);
                return _.isEmpty(state[item].array)
            })
            if (_.isEmpty(enumTypes)) {
                return
            }
            const { head = {}, body = {} } = await api.base.getEnum({ enumTypes })
            if (head.code === '200') {
                const payload = {}
                for (let key in body) {
                    const array = body[key]
                    if (key === 'DO_STATE') {
                        array.push(array.shift())
                    }
                    const map = {}
                    for (let i = 0, len = array.length; i < len; i++) {
                        map[array[i].enumCode] = array[i]
                    }
                    payload[key] = { array, map }
                }
                commit('update', payload)
            } else {
                this._vm.$message.error(head.message)
            }
        }
    }
}, DEFAULTS)
