(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('showMorePagination', [showMorePagination]);

  function showMorePagination() {
    return {
      scope: {
        currPage: '=',
        itemsPerPage: '=',
        totalItems: '=',
        items: '='
      },
      templateUrl: '/modules/shared/client/directives/show-more/show-more.client.directive.html',
      link: function(scope, element, attributes) {
        scope.showmore = function() {
          if (scope.items.length >= scope.totalItems.length) return;
          scope.currPage++;
          scope.offset = scope.currPage * scope.itemsPerPage;
          scope.items = scope.totalItems.slice(0, scope.offset);
        };
      }
    };
  }
}());
