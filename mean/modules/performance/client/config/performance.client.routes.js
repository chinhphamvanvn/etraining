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
      .state('admin.workspace.performance.schedules', {
        url: '/schedule',
        abstract:true,
        template: '<ui-view/>',
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.performance.schedules.list', {
        url: '/list',
        templateUrl: '/modules/performance/client/views/list-schedules.client.view.html',
        controller: 'ScheduleListController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.performance.schedules.edit', {
        url: '/edit/:scheduleId',
        templateUrl: '/modules/performance/client/views/form-schedule.client.view.html',
        controller: 'SchedulesController',
        controllerAs: 'vm',
        resolve: {
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['admin'],
        }
      })
      .state('admin.workspace.performance.schedules.view', {
        url: '/view/:scheduleId',
        templateUrl: '/modules/performance/client/views/view-schedule.client.view.html',
        controller: 'SchedulesViewController',
        controllerAs: 'vm',
        resolve: {
            scheduleResolve: getSchedule
        },
        data: {
          roles: ['admin'],
        }
      })
      .state('admin.workspace.performance.schedules.candidate', {
        url: '/candidate/:scheduleId',
        templateUrl: '/modules/performance/client/views/list-exam-candidates.client.view.html',
        controller: 'ExamCandidatesController',
        controllerAs: 'vm',
        resolve: {
            scheduleResolve: getSchedule
        },
        data: {
          roles: ['admin'],
        }
      })
      .state('admin.workspace.performance.competency', {
        url: '/competency',
        abstract:true,
        template: '<ui-view/>',
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.performance.competency.list', {
        url: '/list',
        templateUrl: '/modules/performance/client/views/list-competencies.client.view.html',
        controller: 'CompetencyListController',
        controllerAs: 'vm',
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.performance.competency.edit', {
        url: '/edit/:competencyId',
        templateUrl: '/modules/performance/client/views/form-competency.client.view.html',
        controller: 'CompetencyController',
        controllerAs: 'vm',
        resolve : {
            competencyResolve:getCompetency,
        },        
        data: {
          roles: [ 'admin']
        }
      })
      .state('admin.workspace.performance.competency.view', {
        url: '/view/:competencyId',
        templateUrl: '/modules/performance/client/views/view-competency.client.view.html',
        controller: 'CompetencyController',
        controllerAs: 'vm',
        resolve : {
            competencyResolve:getCompetency,
        },        
        data: {
          roles: [ 'admin']
        }
      });
    
  }
  
  getQuestion.$inject = ['$stateParams', 'QuestionsService'];

  function getQuestion($stateParams, QuestionsService) {
    return QuestionsService.get({
        questionId: $stateParams.questionId
    }).$promise;
  }
  
  getCompetency.$inject = ['$stateParams', 'CompetenciesService'];

  function getCompetency($stateParams, CompetenciesService) {
    return CompetenciesService.get({
        competencyId: $stateParams.competencyId
    }).$promise;
  }
  
  getSchedule.$inject = ['$stateParams', 'SchedulesService'];

  function getSchedule($stateParams, SchedulesService) {
    return SchedulesService.get({
        scheduleId: $stateParams.scheduleId
    }).$promise;
  }
  



}());
