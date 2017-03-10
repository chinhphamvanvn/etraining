(function () {
  'use strict';

  angular
  .module('shared')
    .directive('ukHtmlEditor',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function() {
                        UIkit.htmleditor(elem[0], {
                            'toolbar': '',
                            'height': '240'
                        });
                    });
                }
            }
        }
    ]);
}());