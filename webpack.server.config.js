var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseWebpackConfig, {
  target: 'node',
  entry: {
    app: './src/entry-server.js'
  },
  devtool: 'source-map',
  output: {
    filename: 'server.bundle.js',
    libraryTarget: 'commonjs2'
  },
  externals: Object.keys(require('./package.json').dependencies),
  // externals: nodeExternals({
  //   // do not externalize dependencies that need to be processed by webpack.
  //   // you can add more file types here e.g. raw *.vue files
  //   // you should also whitelist deps that modifies `global` (e.g. polyfills)
  //   whitelist: /\.css$/
  // }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env': 'production'
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new VueSSRServerPlugin()
  ],
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: "all"
    }
  }
})
