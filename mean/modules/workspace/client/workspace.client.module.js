(function (app) {
  'use strict';
 
  app.registerModule('workspace');
  app.registerModule('workspace.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
