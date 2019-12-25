const webpack = require('webpack')
const path = require('path')
const LodashWebpackPlugin = require('lodash-webpack-plugin')

function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

const NODE_ENV = process.env.NODE_ENV

const PUBLIC_PATH = process.env.VUE_APP_PUBLIC_PATH

module.exports = {
    baseUrl: PUBLIC_PATH,
    assetsDir: 'static',
    lintOnSave: false,
    devServer: {
        historyApiFallback: true,
        https: false,
        hot: true,
        port: 80,
        disableHostCheck: true,
        proxy: {
            '/api': {

                target: 'http://192.168.219.38',//正式
                //target: 'http://192.168.137.32:8081',//黄信赫
                //target: 'http://192.168.191.1:8080',
                changeOrigin: true,
                pathRewrite: {
                   '^/api': ''
                }
            }
        }
    },
    transpileDependencies: [ resolve('/node_modules/element-ui/src') ],
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/biz/styles/theme/index.scss";`
            }
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('common', resolve('src/common'))
            .set('biz', resolve('src/biz'))

        config.module
            .rule('svg')
            .exclude
            .add(resolve('src/biz/components/svgIcon'))
            .end()

        config.module
            .rule('svg-icon')
            .test(/\.svg$/)
            .include
            .add(resolve('src/biz/components/svgIcon'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .tap(options => {
                return {
                    symbolId: 'svg-icon-[name]'
                }
            })
            .end()
    },
    configureWebpack: config => {
        const plugins = [
            new LodashWebpackPlugin({
                shorthands: true,
                cloning: true,
                paths: true
            }),
            new webpack.ProvidePlugin({
                _: 'common/utils/lodash',
                jt: 'common/utils/jt',
                CNST: 'biz/constants',
                req: 'biz/utils/req',
                oauth: 'biz/utils/oauth',
                api: 'biz/services'
            })
        ]
        if (NODE_ENV === 'production') {
            const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
            plugins.push(new BundleAnalyzerPlugin())

            // 开启gzip压缩
            const CompressionWebpackPlugin = require('compression-webpack-plugin')
            const productionGzipExtensions = ['js', 'css']
            plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }))
        }
        return { plugins }
    }
}
