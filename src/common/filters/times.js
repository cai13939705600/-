//乘法过滤
function times (value1, value2) {
    let sum = value1 * value2
    if (Number.isNaN(sum)) {
        return ''
    }
    if (sum > 999999999999999) {
        return '数值过大'
    }
    sum = sum.toFixed('3')
    sum = sum.split('')
    while (true) {
        const lastIndex = sum.length - 1
        
        const last = sum[lastIndex]
        if (last === '0' || last === '.') {
            sum.pop()
           if ( last === '.') {
               break
           }
        } else {
            break;
        }
    }
    return sum.join('')
}
export {
    times
}