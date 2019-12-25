/**
 * 格式化为树形数据 1-logN2
 * @param {array} list 列表数据
 * @param {number} [level = 1] level 级别
 */
export const formatTreeData = (list = [], level = 1) => {
    const map = {}
    // 通过父级ID 格式化map数据
    list.forEach(item => {
        const target = map[item.parentId];
        if (target) {
            target.push(item)
        } else {
            map[item.parentId] = [item]
        }
    })
    // 通过父级ID 插入父级中
    for (let key in map) {
        key = Number(key)
        if (map.hasOwnProperty(key)) {
            const item = map[key];
            list.forEach(data => {
                if (data.id === key) {
                    data.children = item
                }
            })
        }
    }
    // 分拣出最高层级数据
    return list.filter(item => item.level === level)
}
/**
 * 获取叶子节点
 * @param {object} tree 树状数据
 * @param {string} [property='children'] property 子属性数据key
 * @param {array} result 返回数据
 */
export const getTreeLeaf = (tree, property = 'children', result = []) => {
    if (tree instanceof Array) {
        tree.forEach(inner => {
            if (inner[property] instanceof Array && inner[property].length) {
                getTreeLeaf(inner[property], property, result)
            } else {
                result.push(inner)
            }
        })
    } else if (typeof tree === 'object') {
        if (inner[property] instanceof Array && inner[property].length) {
            getTreeLeaf(inner[property], property, result)
        } else {
            result.push(tree)
        }
    } else {
        console.log('其他数据类型:', tree)
    }
    return result
}
