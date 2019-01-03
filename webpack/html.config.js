/* eslint-env node */

const htmlConfig = {
  title: 'starter',
  template: 'client/index.ejs',
  apiEndpoint: process.env.API_ENDPOINT || 'https://localhost:3100',
};

export default htmlConfig;
