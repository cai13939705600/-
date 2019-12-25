//日期时间过滤时分秒
function setDate (value) {
    if(value){
        let value1 = value.substr(0,10);
        return value1
    } else{
        return
    }
}
export {
    setDate
}