const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/i,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-typescript'],
            sourceType: 'unambiguous'
          }
        }
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['tailwindcss']
              }
            }
          }
        ]
      },
      {
        generator: {
          filename: 'assets/[name].[hash][ext]'
        },
        test: /\.(gif|jpe?g|png|svg|woff|woff2)$/i,
        type: 'asset/resource'
      }
    ]
  },
  output: {
    filename: '[name].[contenthash].mjs',
    path: path.resolve(__dirname, '../docs'),
    publicPath: './'
  },
  plugins: [new HtmlWebpackInjectAttributesPlugin()],
  resolve: {
    alias: {
      // '@queelag/core': path.resolve(__dirname, '../node_modules/@queelag/core'),
      // '@queelag/react-core': path.resolve(__dirname, '../node_modules/@queelag/react-core'),
      // mobx: path.resolve(__dirname, '../node_modules/mobx'),
      'mobx-react': path.resolve(__dirname, '../node_modules/mobx-react'),
      // nanoid: path.resolve(__dirname, '../node_modules/nanoid'),
      react: path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom')
      // superstruct: path.resolve(__dirname, '../node_modules/superstruct'),
      // tslib: path.resolve(__dirname, '../node_modules/tslib')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
}
