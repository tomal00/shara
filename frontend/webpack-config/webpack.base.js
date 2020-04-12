const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    target: 'web',
    entry: {
        main: ['babel-polyfill', './src/index.tsx'],
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react",
                            "@babel/preset-typescript"
                        ],
                        plugins: ["@babel/plugin-proposal-class-properties", "react-hot-loader/babel"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    { loader: 'file-loader' },
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html'
        }),
        new CleanWebpackPlugin(),
        new FaviconsWebpackPlugin('./assets/favicon.png') // svg works too!

    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /node_modules/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.tsx'],
        alias: {
            Root: path.resolve(__dirname, '../src'),
            Components: path.resolve(__dirname, '../src/Components'),
            Containers: path.resolve(__dirname, '../src/Containers'),
            Themes: path.resolve(__dirname, '../src/Themes'),
            Types: path.resolve(__dirname, '../src/Types'),
            Assets: path.resolve(__dirname, '../assets')
        }
    },
}