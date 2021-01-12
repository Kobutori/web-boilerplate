const path = require('path')
const webpack = require('webpack')
const globule = require('globule')
const {CleanWebPackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


const targetTypes = { pug : 'html'}
const

const opts = {
  srcDir: path.join(__dirname, 'src'),
  destDir: path.join(__dirname, 'public')
}

const convertExtensions = {
  pug: 'html',
  sass: 'css',
  js: 'js'
}

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false }
          }
        ]
      },
      {
        test:/\.pug$/,
        use: {
          loader: 'pug-loader',
          options; {
            pretty: true
          }
        }
      }
    ]
  }

};