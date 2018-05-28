var path = require('path')
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const { VueLoaderPlugin } = require('vue-loader')


module.exports = {
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  // devtool: '#eval-source-map',
  plugins: [
    new VueLoaderPlugin(),
    // new HtmlWebpackPlugin(),
    // new UglifyJsPlugin()
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.mode = 'production'
  
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // new HTMLWebpackPlugin({
    //   title: 'Code Splitting'
    // })
  ])

  module.exports.optimization = {
    splitChunks: {
      // include all types of chunks
      chunks: "all"
    }
  }
} else {
  module.exports.mode = 'development'
  module.exports.devtool = '#source-map'
}
