'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'ember-quickstart',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  ENV.firebase = {
    apiKey: 'AIzaSyCcScjcjOBdZQVeydvlWfUA8Xh_U0YzxjQ',
    authDomain: 'clarus-movie-list.firebaseapp.com',
    databaseURL:
      'https://clarus-movie-list-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'clarus-movie-list',
    storageBucket: 'clarus-movie-list.firebasestorage.app',
    messagingSenderId: '753026870643',
    appId: '1:753026870643:web:ff670cf0ef3ee770642906',
  };

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
