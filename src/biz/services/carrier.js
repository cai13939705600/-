/**
 * 基础服务接口
 */

const carrier = {
    prefix: '/rest/api/carrier',
    items: [
        { key: 'getCarrierList', url: '/fuzzySearch' }
    ]
}

export default req.generate({
    ...carrier
})
