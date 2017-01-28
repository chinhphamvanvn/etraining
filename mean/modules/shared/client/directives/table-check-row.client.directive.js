(function () {
  'use strict';

  angular
  .module('shared')
    .directive('tableCheckRow', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attr, ngModel) {

                    var $this = $(elem);

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function(newValue) {
                        if(newValue) {
                            $this.closest('tr').addClass('row_checked');
                        } else {
                            $this.closest('tr').removeClass('row_checked');
                        }
                    });

                }
            }
        }
    ])
}());