const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PostCompile = require('post-compile-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const resolve = (p) => {
  return path.join(__dirname, '..', p);
};

module.exports = {
  entry: {
    popup: resolve('app/index.tsx'),
    background: resolve('app/background'),
    contentscript: resolve('app/contentscript'),
    inject: resolve('app/inject'),
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        exclude: /node_modules\/(?!(normalize\.css)\/).*/,
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('app/index.html'),
      chunks: ['popup'],
    }),
    new CopyPlugin([
      {
        from: resolve('chrome/manifest.json'),
        to: resolve('dist'),
      },
      {
        from: resolve('chrome/assets'),
        to: resolve('dist'),
      },
    ]),
  ],
};
