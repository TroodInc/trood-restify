const path = require('path')
const webpack = require('webpack')


const ENV_PROD = 'production'
const ENV_DEV = 'development'

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.replace(' ', '') : ENV_PROD
const env = {
  prod: NODE_ENV === ENV_PROD,
  dev: NODE_ENV === ENV_DEV,
}
const nodeModulesRegexp = /node_modules/

module.exports = {
  devtool: !env.prod ? 'inline-source-map' : false,
  entry: './src/',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'trood-restify',
    globalObject: 'this',
  },
  externals: {
    mobx: "mobx"
  },
  mode: env.prod ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: nodeModulesRegexp,
      },
    ]
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    extensions: ['.js', '.json'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        PROD: JSON.stringify(env.prod),
        DEV: JSON.stringify(env.dev),
        NODE_ENV: `"${NODE_ENV}"`,
      },
    }),
    new webpack.ExtendedAPIPlugin(),
  ],
}
