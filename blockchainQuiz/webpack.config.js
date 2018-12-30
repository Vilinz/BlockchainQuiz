const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    index: './app/scripts/index.js',
    manager: './app/scripts/manager.js',
    user: './app/scripts/user.js',
    dataBase: './app/scripts/dataBase.js',
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new CopyWebpackPlugin([
      { from: './app/index.html', to: 'index.html' },
      { from: './app/manager.html', to: 'manager.html'},
      {from: './app/user.html', to: 'user.html'},
      {from: './app/dataBase.html', to: 'dataBase.html'}
    ])
  ],
  devServer: { // DevServer 相关配置
    disableHostCheck: true //  新增该配置项
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.css$/, use: [ 'style-loader', 'css-loader', 'sass-loader' ] },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
          plugins: ['transform-react-jsx', 'transform-object-rest-spread', 'transform-runtime']
        }
      }
    ]
  }
}

