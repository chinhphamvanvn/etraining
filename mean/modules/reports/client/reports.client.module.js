(function (app) {
  'use strict';
 
  app.registerModule('reports');
  app.registerModule('reports.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
