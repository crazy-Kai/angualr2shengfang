var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css')
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        proxy: {
            '/api/*': {
                target: 'http://120.26.216.119:10000',
                // target: 'http://10.1.1.103:8181',
                // target: 'http://120.26.216.119:20000',
                // target: 'http://10.1.3.99:8080',
                // target:'http://112.124.98.224:8080/',
                // target: 'http://192.168.3.127:8081',//吴剑
                // target: 'http://10.1.3.120:8081',//建勇
                // target: 'http://127.0.0.1:8081',
                // target: 'http://192.168.0.56:8080', //继山
                secure: false
            }
        }
    }
});