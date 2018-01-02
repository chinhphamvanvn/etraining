(function(app) {
  'use strict';

  app.registerModule('library');
  app.registerModule('library.routes', ['ui.router', 'core.routes']);
}(ApplicationConfiguration));
