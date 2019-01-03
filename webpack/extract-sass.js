/* eslint-env node */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const devMode = process.env.NODE_ENV !== 'production';

const ExtractSass = new MiniCssExtractPlugin({
  filename: devMode ? '[name].css' : '[name].[hash].css',
  chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
});

export default ExtractSass;
