const { entries } = Object;
import { orderBy } from './lodash'

export const removeEmptyAttr = (obj) => {
    if (_.isObject(obj)) {
        for (let [key, value] of entries(obj)) {
            switch (true) {
                case _.isArray(value):
                    if (_.isEmpty(value)){
                        delete obj[key]
                    } else {
                        removeEmptyAttr(value)
                    }
                    break;
                case _.isObject(value):
                    if (_.isEmpty(value)){
                        delete obj[key]
                    } else {
                        removeEmptyAttr(value)
                    }
                    break;
                case !value:
                    if (value !== 0) {
                        delete obj[key]
                    }
                default:
                    break;
            }
        }
        
    } else if (_.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            removeEmptyAttr(obj[i])
        }
    }
}

export const sortListByList = (list, list1) => {
    list.forEach((item, index) => {
        list1.every(item2 => {
            if (item.id === item2.id) {
                item2.sort = index
                return false
            }
            return true
        })
    });
    return orderBy(list1, ['sort', 'asc'])
}
