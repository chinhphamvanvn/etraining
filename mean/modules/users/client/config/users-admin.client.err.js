(function () {
  'use strict';

  angular
    .module('users.admin')
    .config(errHandle);

  errHandle.$inject = ['$qProvider'];

  // Handler err from request the Users module
  function errHandle($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }
}());
