(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('courseCard', ['OptionsService','QuestionsService','_', courseCard]);

  function courseCard(OptionsService,QuestionsService,_) {
      
      return {
          scope: {
              course: "=",
          },
          templateUrl:'/modules/lms/client/directives/course-card/course.card.directive.client.view.html',
          link: function (scope, element, attributes) {
              
          }
      }
  }
}());
