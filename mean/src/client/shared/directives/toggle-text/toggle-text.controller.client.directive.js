/**
 * Created by thanhvk on 3/28/2017.
 */
(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('toggleText', ['$translate', toggleText]);

  function toggleText($translate) {
    return {
      scope: {
        text: '=',
        numberOfWord: '=',
        className: '='
      },
      templateUrl: '/src/client/shared/directives/toggle-text/toggle-text.view.client.directive.html',
      link: function(scope, element, attributes) {
        if (!scope.text || (scope.numberOfWord === 0)) return;

        scope.more = $translate.instant('ACTION.MORE');
        scope.hide = $translate.instant('ACTION.HIDE');
        scope.words = scope.text.split(' ');

        var longText = scope.text,
          sortText = scope.words.slice(0, scope.numberOfWord).join(' ');

        sortText = (scope.words.length > scope.numberOfWord) ? (sortText + '...') : sortText;
        scope.expand = false;
        scope.currText = sortText;

        scope.toggleText = function() {
          scope.expand = !scope.expand;

          scope.currText = scope.expand ? longText : sortText;
        };
      }
    };
  }
}());
