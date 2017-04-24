(function($) {
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
            elem.on("click", function(e){
              alert('Clicked !');
              var $checkRow = $(elem).closest('table').find('.check_row');
              $(elem)
              .on('ifChecked', function() {
                $checkRow.iCheck('check');
              })
              .on('ifUnchecked', function() {
                $checkRow.iCheck('uncheck');
              });
            });
                      }
        };
      }
    ]);
}(window.jquery));
