const common = require('./production')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

common.entry = [path.resolve(__dirname, '../src/polyfill.ts'), path.resolve(__dirname, '../src/index.tsx')]
common.module.rules[0].use.options.presets[0][1].targets = 'defaults'
common.module.rules[0].use.options.presets[0][1].useBuiltIns = 'entry'
common.module.rules[1].use = ['css-loader']
common.output.chunkFilename = 'chunks/[name].[contenthash].js'
common.output.clean = false
common.output.filename = '[name].[contenthash].js'
common.plugins[0] = new HtmlWebpackPlugin({
  attributes: {
    nomodule: (v) => (v.tagName === 'script' ? true : undefined)
  },
  template: path.resolve(__dirname, '../docs/index.html')
})
common.plugins.pop()
// common.plugins = common.plugins.slice(0, 2)

module.exports = common
