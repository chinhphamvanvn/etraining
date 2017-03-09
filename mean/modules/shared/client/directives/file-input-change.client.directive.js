(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('fileInputChange', fileInputChange);

  function fileInputChange() {
      return {
          scope: {
              fileread: "="
          },
          link: function (scope, element, attributes) {
              element.bind("change.uk.fileinput", function (event,file) {
                  scope.fileread = file;
              });
          }
      }
  }
}());
