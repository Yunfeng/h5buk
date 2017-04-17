var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
  devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项
  entry:  {
    main: __dirname + "/app/main.js"
  }
  ,//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/wwwroot",//打包后的文件存放的地方
    //publicPath: "/assets/",
    filename: "[name]-[hash].js"//打包后输出文件的文件名
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },    
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,  
        loader: 'vue-loader'
      },
    ]
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },

  externals: {
        "jquery": "jQuery",
        "wx": "wx"
    },

  plugins: [
    new webpack.BannerPlugin("Copyright Buk inc."),
    new HtmlWebpackPlugin({
      template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin("[name]-[hash].css"),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]

}