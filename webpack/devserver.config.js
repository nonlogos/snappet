import fs from 'fs';

/* eslint-env node */

const devServer = () => {
  return {
    hot: true,
    port: 3000,
    host: 'localhost',
    historyApiFallback: true,
    compress: false,
    debug: true,
    disableHostCheck: true,
    stats: {
      colors: true,
    },
  };
};

export default devServer;
