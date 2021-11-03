const path = require('path');

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production' ? '/schedule.prismproject.jp/' : '',
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
        'og:image': 'https://schedule.prismproject.jp/img/card.png',
        'twitter:card': 'summary_large_image',
        'twitter:site': '@PRISMproj',
        'twitter:title': 'Prism Project Schedule',
        'twitter:description': 'PRISM project is a brand new multinational vTuber agency to melt boundaries around the world.',
        'twitter:image': 'https://schedule.prismproject.jp/img/card.png',
      };
      return args;
    });
  },
  pwa: {
    workboxOptions: {
      exclude: [
        'CNAME',
        /(.*).css.map/g,
        /(.*).js.map/g,
      ],
    },
  },
};
