(function () {
  'use strict';

angular
    .module('shared.autosize', [])
    .directive('textareaAutosize', [
        '$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                link: function(scope, elem, attrs) {
                    autosize($(elem));
                    $timeout(function() {
                        scope.$apply(function () {
                            autosize.update($(elem))
                        });
                    })
                }
            }
        }
    ]);
}());