(function (app) {
  'use strict';
 
  app.registerModule('dashboard');
  app.registerModule('dashboard.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
