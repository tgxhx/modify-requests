const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const resolve = (p) => {
  return path.join(__dirname, '..', p);
};

module.exports = {
  entry: {
    options: resolve('src/options/index.tsx'),
    background: resolve('src/background'),
    contentscript: resolve('src/contentscript'),
    inject: resolve('src/inject'),
  },
  output: {
    path: resolve('dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        exclude: /node_modules\/(?!([normalize|jsoneditor]\.css)\/).*/,
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
      template: resolve('src/options/index.html'),
      filename: 'options.html',
      chunks: ['options'],
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
