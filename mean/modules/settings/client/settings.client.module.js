(function (app) {
  'use strict';
 
  app.registerModule('settings');
  app.registerModule('settings.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
