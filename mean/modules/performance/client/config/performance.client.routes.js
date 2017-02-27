(function () {
  'use strict';

  // Setting up route
  angular
    .module('performance.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
    .state('admin.workspace.performance', {
        url: '/performance',
        abstract:true,
        template: '<ui-view/>',
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.performance.question', {
        url: '/question',
        abstract:true,
        template: '<ui-view/>',
        data: {
          roles: [ 'admin']
        }
      })
       .state('admin.workspace.performance.question.list', {
        url: '/list',
        templateUrl: '/modules/performance/client/views/list-questions.client.view.html',
        controller: 'QuestionsBankController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.performance.question.edit', {
        url: '/edit/:questionId',
        templateUrl: '/modules/performance/client/views/form-question.client.view.html',
        controller: 'QuestionController',
        controllerAs: 'vm',
        resolve : {
            questionResolve:getQuestion,
        },        
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.performance.question.view', {
        url: '/view/:questionId',
        templateUrl: '/modules/performance/client/views/view-question.client.view.html',
        controller: 'QuestionController',
        controllerAs: 'vm',
        resolve : {
            questionResolve:getQuestion,
        },        
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.performance.exams', {
        url: '/exams',
        templateUrl: '/modules/performance/client/views/list-exams.client.view.html',
        controller: 'ExamsScheduleController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })
  }
  
  getQuestion.$inject = ['$stateParams', 'QuestionsService'];

  function getQuestion($stateParams, QuestionsService) {
    return QuestionsService.get({
        questionId: $stateParams.questionId
    }).$promise;
  }


}());
