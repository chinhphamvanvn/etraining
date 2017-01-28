(function (app) {
  'use strict';
 
  app.registerModule('performance');
  app.registerModule('performance.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
