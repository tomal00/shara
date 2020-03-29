const lodash = require('lodash');
const CopyPkgJsonPlugin = require('copy-pkg-json-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

function srcPaths(src) {
  return path.join(__dirname, src);
}

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';

// #region Common settings
const commonConfig = {
  devtool: isEnvDevelopment ? 'source-map' : false,
  mode: isEnvProduction ? 'production' : 'development',
  output: { path: srcPaths('dist') },
  node: { __dirname: false, __filename: false },
  resolve: {
    alias: {
      Root: srcPaths('src'),
      Components: srcPaths('src/renderer/Components'),
      Main: srcPaths('src/main'),
      Models: srcPaths('src/models'),
      Public: srcPaths('public'),
      Renderer: srcPaths('src/renderer'),
      Utils: srcPaths('src/utils'),
      Types: srcPaths('src/Types'),
    },
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|svg|ico|icns|ttf|bat)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.join(__dirname, 'node_modules/screenshot-desktop/lib/win32/screenCapture_1.3.2.bat'),
        to: 'screenCapture_1.3.2.bat'
      },
      {
        from: path.join(__dirname, 'node_modules/screenshot-desktop/lib/win32/screenCapture_1.3.2.exe'),
        to: 'screenCapture_1.3.2.exe'
      },
      {
        from: path.join(__dirname, 'node_modules/screenshot-desktop/lib/win32/app.manifest'),
        to: 'app.manifest'
      },
    ])
  ]
};
// #endregion

const mainConfig = lodash.cloneDeep(commonConfig);
mainConfig.entry = './src/main/main.ts';
mainConfig.target = 'electron-main';
mainConfig.output.filename = 'main.bundle.js';
mainConfig.plugins = [
  ...mainConfig.plugins,
  new CopyPkgJsonPlugin({
    remove: ['scripts', 'devDependencies', 'build'],
    replace: {
      main: './main.bundle.js',
      scripts: { start: 'electron ./main.bundle.js' },
      postinstall: 'electron-builder install-app-deps',
    },
  }),
];

const rendererConfig = lodash.cloneDeep(commonConfig);
rendererConfig.entry = './src/renderer/renderer.tsx';
rendererConfig.target = 'electron-renderer';
rendererConfig.output.filename = 'renderer.bundle.js';
rendererConfig.plugins = [
  ...mainConfig.plugins,
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './public/index.html'),
  }),
];



module.exports = [mainConfig, rendererConfig];
