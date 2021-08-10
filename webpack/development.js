const common = require('./common')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

process.env.NODE_ENV = 'development'

common.devServer = {
  disableHostCheck: true,
  hot: true,
  historyApiFallback: true,
  open: true,
  overlay: true
}
common.devtool = 'source-map'
common.mode = 'development'
common.module.rules[0].use.options.plugins = ['react-refresh/babel']
common.plugins.push(new HtmlWebpackPlugin({ template: path.resolve(__dirname, '../public/index.html') }))
common.plugins.push(new MiniCssExtractPlugin())
common.plugins.push(new ReactRefreshWebpackPlugin())

module.exports = common
