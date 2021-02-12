const path = require('path');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/schedule.prismproject.jp/' : '',
  outputDir: path.resolve(__dirname, 'docs'),
  lintOnSave: false,
  transpileDependencies: [
    'vuetify',
  ],
  chainWebpack: (config) => {
    // HTML Title used for OpenGraph linters (social media links)
    config.plugin('html').tap((args) => {
      // eslint-disable-next-line no-param-reassign
      args[0].title = 'Prism Project Schedule';
      // eslint-disable-next-line no-param-reassign
      args[0].meta = {
        'og:title': 'Prism Project Schedule',
        'og:type': 'website',
        'og:description': 'PRISM project is a brand new multinational vTuber agency to melt boundaries around the world.',
        'og:image': 'https://vtubertools.github.io/schedule.prismproject.jp/img/icons/android-chrome-512x512.png',
      };
      return args;
    });
  },
};
