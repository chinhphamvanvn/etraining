(function () {
  'use strict';

  angular
  .module('shared')
    .directive('singleCard', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    var $md_card_single = $(elem),
                        w = angular.element($window);

                    function md_card_content_height() {
                        var content_height = w.height() - ((48 * 2) + 12);
                        $md_card_single.find('.md-card-content').innerHeight(content_height);
                    }

                    $timeout(function() {
                        md_card_content_height();
                    },100);

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_card_content_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
}());