(function(UIkit) {
  'use strict';

  angular
    .module('shared')
    // add width/height properities to Image
    .directive('printPage', [
      '$rootScope',
      '$timeout',
      function($rootScope, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, elem, attrs) {
            var message = attrs.printMessage;
            $(elem).on('click', function(e) {
              e.preventDefault();
              UIkit.modal.confirm(message || 'Do you want to print this page?', function() {
                // hide sidebar
                $rootScope.primarySidebarActive = false;
                $rootScope.primarySidebarOpen = false;
                // wait for dialog to fully hide
                $timeout(function() {
                  window.print();
                }, 300);
              }, {
                labels: {
                  'Ok': 'print'
                }
              });
            });
          }
        };
      }
    ]);
}(window.UIkit));
