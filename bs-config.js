'use strict';
var fallback = require('connect-history-api-fallback');
var log = require('connect-logger');
/*
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 */
module.exports = {
  injectChanges: true,
  reloadDebounce: 2000,
  files: ['./**/*.{html,htm,css}', './js/bundle.js'],
  watchOptions: {
    ignored: 'node_modules'
  },
  server: {
    baseDir: '../',
    middleware: [
      //log({ format: '%date %status %method %url' }),
      fallback({
        index: '/MerchantGameDB/index.html',
        rewrites: [
          { from: /\/BETA/, to: '/MerchantGameDB/BETA/index.html'}
        ],
        htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'] // systemjs workaround
      })
    ]
  }
};