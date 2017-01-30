(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('cms')
    .directive('courseView', ['GroupsService','CoursesService','_', courseView]);

  function courseView(GroupsService,CoursesService,_) {
      
      return {
          scope: {
              course: "="
          },
          templateUrl:'/modules/cms/client/directives/view-course.directive.client.view.html',
          link: function (scope, element, attributes) {
              if (scope.course.group)
                  scope.group = GroupsService.get({groupId:scope.course.group});
             scope.prequisites = [];
             _.each(scope.course.prequisites,function(course) {
                 scope.prequisites.push(CoursesService.get({courseId:scope.course._id}))
             });
          }
      }
  }
}());
