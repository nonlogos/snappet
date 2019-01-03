import webpack from 'webpack';
import htmlWebpackPlugin from 'html-webpack-plugin';
import compressionPlugin from 'compression-webpack-plugin';
import StyleExtHtmlWebpackPlugin from 'style-ext-html-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import extractSass from './extract-sass';
import html from './html.config';

const pluginsConfig = (env, options) => {
  const plugins = [
    extractSass,
    new htmlWebpackPlugin(html),
    new ManifestPlugin({
      filename: 'asset-manifest.json',
    }),
  ];

  if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  // Prod configs handling
  if (env === 'prod') {
    plugins.push(
      new webpack.LoaderOptionsPlugin({
        minmize: true,
        debug: false,
      })
    );
    plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      })
    );
    plugins.push(
      new compressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js(\?.*)?$/i,
        threshold: 10240,
        minRatio: 0.8,
      })
    );
  } else {
    plugins.push(new webpack.NamedModulesPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }
  // plugins.push(new StyleExtHtmlWebpackPlugin());
  return plugins;
};

export default pluginsConfig;
