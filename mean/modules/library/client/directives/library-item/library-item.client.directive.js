(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('library')
    .directive('libraryItem', ['GroupsService','CoursesService','_', libraryItem]);

  function libraryItem(GroupsService,CourseEditionsService,_) {

      return {
          scope: {
              media: "=",
              sort: "="
          },
          templateUrl:'/modules/library/client/directives/library-item/library-item.directive.client.view.html',
          link: function (scope, element, attributes) {
          }
      }
  }
}());
