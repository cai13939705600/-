/**
 * 基础服务接口
 */

const address = {
    prefix: '/ba/rest/api/geoInfo',
    items: [
        { key: 'getConcatenatedAddress', url: '/search' }
    ]
}

export default req.generate({
    ...address
})
