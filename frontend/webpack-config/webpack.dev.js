const merge = require('webpack-merge');
const common = require('./webpack.base.js');
const path = require('path')
const fs = require('fs')

const config = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: '../dist',
        hot: true,
        historyApiFallback: true,
        https: true,
        key: fs.readFileSync(path.join(__dirname, '../../tls/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../../tls/cert.pem'))
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
    }
}

module.exports = merge(common, config)