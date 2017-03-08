(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('cms')
    .directive('courseView', ['GroupsService','CoursesService','CompetenciesService','$q','_', courseView]);

  function courseView(GroupsService,CoursesService,CompetenciesService,$q,_) {
      
      return {
          scope: {
              course: "="
          },
          templateUrl:'/modules/cms/client/directives/view-course.directive.client.view.html',
          link: function (scope, element, attributes) {
              if (!scope.course.loaded) {
                  scope.course.loaded = true;
                  if (scope.course.group) 
                      scope.course.group = GroupsService.get({groupId:scope.course.group});
                  if (scope.course.competency) 
                      scope.competency = CompetenciesService.get({competencyId:scope.course.competency});
                   var allPromise = [];
                 _.each(scope.course.prequisites,function(courseId) {
                     allPromise.push(CoursesService.get({courseId:scope.course._id}).$promise);
                 });
                 $q.all(allPromise).then(function(prequisites) {
                     scope.course.prequisites = prequisites;
                 });
              }
          }
      }
  }
}());
