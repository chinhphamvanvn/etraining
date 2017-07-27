'use strict';

module.exports = {
  client: {
    lib: {
      //css: 'public/dist/vendor*.min.css',
      js: 'public/dist/vendor*.min.js'
    },
    font: [],
    css: 'public/assets/css/main.min.css',
    js: 'public/dist/application*.min.js'
  },
  tests: {
    client: ['test/client/**/*.js'],
    server: ['test/server/**/*.js'],
    e2e: ['test/e2e/**/*.js']
  }
};
