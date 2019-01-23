/* eslint-env node */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = new MiniCssExtractPlugin({
  filename: '[name].[hash].css',
  chunkFilename: '[id].[hash].css',
});
