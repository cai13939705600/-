import ROUTES from './routes'
import ENUMS from './enums'
import PRINT_ENUMS from './printEnums'
import OPTIONS from './options';

const REG_EXP = {
    // 检测邮箱
    EMAIL: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    // 检测11位手机号
    MOBILE: /^1\d{10}$/,
    // 检测浮点数
    FLOAT: /^\d+(\.\d+)?$/,
    // 检测整数
    NUMBER: /^\d+$/,
    // 检测中文
    CHINESE: /^[\u4e00-\u9fa5]+$/,
    // 检测 自然数
    NATURAL: /^[1-9]\d{0,14}$|^0$/,
    // 检测正三位浮点数
    FLOAT_3_ABS: /^(([1-9][0-9]*)|(([0]\.\d{1,3}|[1-9][0-9]*\.\d{1,3})))$|^0$/,
    // 检测 基本电话
    TEL: /^[\d-]*$/,
    // 检测手机号与电话
    TEL_MOBILE: /(^1\d{10}$)|(^[\d-]*$)/,
}

export {
    ROUTES,
    ENUMS,
    REG_EXP,
    PRINT_ENUMS,
    OPTIONS
}
