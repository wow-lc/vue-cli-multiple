const path = require('path');

const resolve = dir => path.join(__dirname, dir);
const pageConfig = require('./src/pages/config');

const pages = {};
Object.keys(pageConfig).forEach((key) => {
  const { title } = pageConfig[key];
  pages[key] = {
    entry: `src/pages/${key}/main.js`,
    template: 'public/index.html',
    filename: `${key}.html`,
    title,
    chunks: ['chunk-vendors', 'chunk-common', `${key}`],
  };
});

module.exports = {
  pages,
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'));
  },
  productionSourceMap: false,
};
