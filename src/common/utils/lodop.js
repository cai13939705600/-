import Vue from 'vue'
const targetMap = {}
let Lodop
function initLodop(params) {
    try {
        Lodop = getCLodop()
        Lodop.On_Return_Remain = true
        Lodop.On_Return = (sessionId, value) => {
            const target = targetMap[sessionId]
            if (target) {
                if (value) {
                    target.resolve(value)
                } else {
                    target.reject('当前设备不支持C-Lodop')
                }
                delete targetMap[sessionId]
            }
        }
    } catch (e) {
       //Vue.prototype.$message.success('CLodop初始化失败')
    }
}
initLodop()
// 主板号缓存变量
let machineCode;
/**
 * 获取 主板设备号
 * @returns {Promise}
 */
export const getSystemInfo = (key) => {
    initLodop()
    return new Promise((resolve, reject) => {
        if (machineCode) { return resolve(machineCode) }
        const sessionId = Lodop.GET_SYSTEM_INFO(key);
        targetMap[sessionId] = { resolve, reject }
    })
}
// 主板号缓存变量
let protNo;
export const getValue = (key) => {
    initLodop()
    return new Promise((resolve, reject) => {
        if (protNo) { return resolve(protNo) }
        const sessionId = Lodop.GET_VALUE(key);
        targetMap[sessionId] = { resolve, reject }
    })
}
/**
 * 获取主板号
 * @returns {Promise}
 */
export const getBOIS = () => {
    return getSystemInfo('BaseBoard.SerialNumber')
}
/**
 * 获取端口
 * @returns {Promise}
 */
export const getPort = () => {
    return getValue('AO_PRINT_BridgePort')
}
/**
 * 获取打印机
 * @returns {object[]}
 */
export const getPrinters = () => {
    try {
        const { getPrinters } = printService;
        const Print = getPrinters();
        const printers = !_.isEmpty(Print) ? Print.list : []
        return printers 
    } catch (e) {
        Vue.prototype.$message.success('C-Lodop打印机获取失败')
        return []
    }
}
