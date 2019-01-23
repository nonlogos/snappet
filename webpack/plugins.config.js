const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const compressionPlugin = require('compression-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const extractSass = require('./extract-sass');
const html = require('./html.config');

module.exports = (env, options) => {
  const plugins = [
    extractSass,
    new htmlWebpackPlugin(html),
    new ManifestPlugin({
      filename: 'asset-manifest.json',
    }),
  ];
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      statsOptions: { source: false },
    })
  );
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
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      })
    );
  } else {
    plugins.push(new webpack.NamedModulesPlugin());
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return plugins;
};
