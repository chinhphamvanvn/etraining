(function() {
  'use strict';

  angular
    .module('shared')
    .directive('tableCheckAll', [
      '$window',
      '$timeout',
      function($window, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, elem, attr) {
            $(elem)
              .on('ifChecked', function() {
                var $checkRow = $(elem).closest('table').find('.check_row');
                $checkRow.iCheck('check');
              })
              .on('ifUnchecked', function() {
                var $checkRow = $(elem).closest('table').find('.check_row');
                $checkRow.iCheck('uncheck');
              });

          }
        };
      }
    ]);
}());
