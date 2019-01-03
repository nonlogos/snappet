/* eslint-env node */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
const devMode = process.env.NODE_ENV !== 'production';

const moduleConfig = () => {
  return {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'eslint-loader',
            options: { emitError: true },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: [
          {
            loader: 'file-loader',
            options: { name: '[name].[ext]' },
          },
        ],
      },
    ],
  };
};

export default moduleConfig;
