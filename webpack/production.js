const common = require('./common')
const path = require('path')
const BundleStatsWebpackPlugin = require('bundle-stats-webpack-plugin').BundleStatsWebpackPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

process.env.NODE_ENV = 'production'

common.mode = 'production'
common.module.rules[0].use.options.presets.unshift([
  '@babel/preset-env',
  {
    corejs: 3,
    targets: 'supports es6-module and last 1 version',
    useBuiltIns: 'usage'
  }
])
common.module.rules[1].use[2].options.postcssOptions.plugins.push([
  'postcss-preset-env',
  {
    browsers: 'defaults',
    features: {
      'focus-within-pseudo-class': false
    },
    stage: 0
  }
])
common.optimization = {
  minimizer: ['...', new CssMinimizerPlugin()]
}
common.output.chunkFilename = 'chunks/[name].[contenthash].mjs'
common.output.clean = true
common.output.publicPath = '/asymmetric-cipher'
common.plugins.unshift(
  new HtmlWebpackPlugin({
    attributes: {
      type: (v) => (v.tagName === 'script' ? 'module' : undefined)
    },
    template: path.resolve(__dirname, '../public/index.html')
  })
)
common.plugins.push(
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css'
  }),
  new BundleStatsWebpackPlugin({
    baseline: true,
    compare: false
  })
)
common.resolve.alias['react'] = path.resolve(__dirname, '../node_modules/preact/compat')
common.resolve.alias['react-dom'] = path.resolve(__dirname, '../node_modules/preact/compat')

module.exports = common
