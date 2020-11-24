const webpack = require('webpack')
const dotenv = require('dotenv')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
    })
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
  output: {
    filename: 'bundle.js'
  }
}
