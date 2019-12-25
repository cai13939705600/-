// 现在
const now = new Date()
// 时分秒时差
const secondDifference = (+now) % 86400000
// 时区时差
const timeZoneDifference = 28800000
// 今天零点
const todayZero = new Date(+now - secondDifference - timeZoneDifference);
// 今天最后一瞬间
const todayLast = new Date(+todayZero + 86399999)
// 今天周几
let dayNow = now.getDay()
// 周日改为7
dayNow = (dayNow === 0) ? (dayNow = 7) : dayNow
// 本周第一天
const weekFirst = new Date(todayZero - ((dayNow - 1) * 86400000))
// 本周最后一天
const weekLast = new Date(+weekFirst + 604799999)

export default {
    pickerOptions: {
        shortcuts: [{
            text: '今天',
            onClick(picker) {
                picker.$emit('pick', [todayZero, todayLast]);
            }
        },{
            text: '本周',
            onClick(picker) {
                picker.$emit('pick', [weekFirst, weekLast]);
            }
        },
        // {
        //     text: '最近一周',
        //     onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - 604800000);
        //         picker.$emit('pick', [start, end]);
        //     }
        // }, {
        //     text: '最近一个月',
        //     onClick(picker) {
        //         const end = new Date();
        //         const start = new Date();
        //         start.setTime(start.getTime() - 2592000000);
        //         picker.$emit('pick', [start, end]);
        //     }
        // },
        {
            text: '上个月',
            onClick(picker) {
                const now = new Date();
                let year = now.getFullYear()
                let mouth = now.getMonth()
                // 本月第一天
                const mouthFirst = new Date(`${year}/${mouth + 1}/1`)
                // 上月最后一瞬间
                const prevMouthLast = new Date(mouthFirst - 1)
                // 如果是一月份
                if (mouth === 0) {
                    year--
                    mouth = 12
                }
                const start = new Date(`${year}/${mouth}/1`)
                picker.$emit('pick', [start, prevMouthLast]);
            }
        }, {
            text: '最近三个月',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 7776000000);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近半年',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 15552000000);
                picker.$emit('pick', [start, end]);
            }
        }]
    }
}

