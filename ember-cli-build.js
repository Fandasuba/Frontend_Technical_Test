'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    cssModules: {
      enabled: true,
      extension: 'scss',
      intermediateOutputPath: 'assets/pods.scss',
      postcssOptions: {
        syntax: require('postcss-scss'),
      },
    },
    sassOptions: {
      extension: 'scss',
    },
  });

  return app.toTree();
};
