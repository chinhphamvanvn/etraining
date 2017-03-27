(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('programProgressBook', ['_', programProgressBook]);

  function programProgressBook( _) {

      return {
          scope: {
              program: "=",
              member: "=",
          },
          templateUrl:'/modules/lms/client/directives/program-progress-book/program-progress-book.directive.client.view.html',
          link: function (scope, element, attributes) {
             
              
          }
      }
  }
}());
