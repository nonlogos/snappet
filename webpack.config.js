/* eslint-env node */
import path from 'path';
import moduleConfig from './webpack/module.config';
import plugins from './webpack/plugins.config';
import devServer from './webpack/devserver.config';

module.exports = function(env) {
  const mode = env === 'dev' ? 'development' : 'production';

  return {
    entry: ['webpack-hot-middleware/client', './client/index.js'],
    stats: {
      colors: true,
    },
    mode,
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    devServer: devServer(...arguments),
    devtool: 'cheap-module-source-map',
    output: {
      filename: '[name]-[hash].js',
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
    },
    module: moduleConfig(...arguments),
    plugins: plugins(...arguments),
  };
};
