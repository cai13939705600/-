/**
 * 解密为Base64
 * @param {string} str 待解码的字符串
 * @returns {string}
 */
const decode = (str) => {
    try {
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''))
    } catch (e) {
        console.error('解码失败:', e);
        return ''
    }
}

/**
 * 加密为Base64
 * @param {string} str 待编码的字符串
 * @returns {string}
 */
const encode = () => {
    try {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1)
        }))
    } catch (e) {
        console.error('编码失败:', e);
        return ''
    }
}