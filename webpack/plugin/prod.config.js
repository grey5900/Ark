/**
 * Created by isaac on 16/7/25.
 */
require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');

var funcs = require('../func');
var createSourceLoader = funcs.createSourceLoader;
var projectRootPath = path.resolve(__dirname, '../..');
var assetsPath = path.resolve(__dirname, '../../static/dist/plugins');

var baseConfig = require('./base.config');
var prodConfig = Object.assign({}, baseConfig);

prodConfig.entry = './src/plugins/index.js';
prodConfig.output = {
  filename: 'index-prod.min.js',
  path: assetsPath
};
prodConfig.module.loaders.unshift(createSourceLoader({
  happy: {id: 'jsx'},
  test: /\.jsx?$/,
  loaders: 'babel',
}));
prodConfig.plugins = [
  new CleanPlugin([assetsPath], {root: projectRootPath}),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    },
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false
  }),

  // ignore dev config
  new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

  // optimizations
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
];

module.exports = prodConfig;
