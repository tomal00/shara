const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path')

const config = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        hot: true
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
    }
}

module.exports = merge(common, config)