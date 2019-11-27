const merge = require('webpack-merge');
const common = require('./webpack.base.js');

const config = {
    mode: 'production'
}

module.exports = merge(common, config)