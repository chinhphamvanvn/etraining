(function(window, angularDragula) {
  'use strict';

  var applicationModuleName = 'mean';

  var service = {
    applicationEnvironment: window.env,
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ngResource', 'ngMessages', 'ngSanitize', 'ngFileUpload', 'ui.router',
      'ui-notification', 'ui.bootstrap', 'pascalprecht.translate','ngAudio', 'LocalStorageModule', 'underscore', 'datatables', 'datatables.buttons',
      angularDragula(angular), 'kendo.directives', 'ng.deviceDetector', 'ngCsv', 'pdf',
      'ui.calendar', 'easypiechart', 'metricsgraphics'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }

  // Angular-ui-notification configuration
  angular.module('ui-notification').config(function(NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 2000,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      positionX: 'right',
      positionY: 'bottom'
    });
  });
}(window, window.angularDragula));
