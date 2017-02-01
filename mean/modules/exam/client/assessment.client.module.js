(function (app) {
  'use strict';
 
  app.registerModule('assessment');
  app.registerModule('assessment.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
