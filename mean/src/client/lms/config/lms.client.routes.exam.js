(function() {
  'use strict';

  angular
    .module('lms')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('workspace.lms.exams', {
        abstract: true,
        url: '/exams',
        template: '<ui-view/>'
      })
      .state('workspace.lms.exams.me', {
        url: '/me',
        templateUrl: '/src/client/lms/views/my-exams.client.view.html',
        controller: 'MyExamsListController',
        controllerAs: 'vm',
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.edit', {
        url: '/edit/:scheduleId/:examId',
        templateUrl: '/src/client/lms/views/exam-board/instructor/form-exam.client.view.html',
        controller: 'ExamsController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.view', {
        url: '/view/:scheduleId/:examId',
        templateUrl: '/src/client/lms/views/exam-board/instructor/view-exam.client.view.html',
        controller: 'ExamViewController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.preview', {
        url: '/preview/:examId/:scheduleId',
        templateUrl: '/src/client/lms/views/exam-board/instructor/preview-exam.client.view.html',
        controller: 'ExamsPreviewController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.grade', {
        url: '/grade/:examId/:scheduleId',
        templateUrl: '/src/client/lms/views/exam-board/instructor/grade-exam.client.view.html',
        controller: 'ExamsGradeController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.scoreboard', {
        url: '/scoreboard/:examId/:scheduleId',
        templateUrl: '/src/client/lms/views/exam-board/instructor/score.board-exam.client.view.html',
        controller: 'ExamsScoreboardController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule,
          userResolve: getUser,
          candidateResolve: getCandidate
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.scoreboard-candidate', {
        url: '/scoreboard-candidate/:examId/:scheduleId/:candidateId',
        templateUrl: '/src/client/lms/views/exam-board/instructor/score.book-exam.client.view.html',
        controller: 'ExamsScoreboardCandidateController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule,
          candidateResolve: getCandidate
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.study', {
        url: '/study/:examId/:scheduleId/:candidateId',
        templateUrl: '/src/client/lms/views/exam-board/study-exam.client.view.html',
        controller: 'ExamsStudyController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule,
          candidateResolve: getCandidate
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      })
      .state('workspace.lms.exams.score', {
        url: '/score/:examId/:scheduleId/:candidateId',
        templateUrl: '/src/client/lms/views/exam-board/scorebook-exam.client.view.html',
        controller: 'ExamsScorebookController',
        controllerAs: 'vm',
        resolve: {
          examResolve: getExam,
          scheduleResolve: getSchedule,
          candidateResolve: getCandidate
        },
        data: {
          roles: ['user'],
          courseRoles: ['teacher', 'student']
        }
      });
  }

  getExam.$inject = ['$stateParams', 'ExamsService'];

  function getExam($stateParams, ExamsService) {
    return ExamsService.get({
      examId: $stateParams.examId
    }).$promise;
  }

  getSchedule.$inject = ['$stateParams', 'SchedulesService'];

  function getSchedule($stateParams, SchedulesService) {
    return SchedulesService.get({
      scheduleId: $stateParams.scheduleId
    }).$promise;
  }

  getCandidate.$inject = ['$stateParams', 'ExamCandidatesService', 'localStorageService'];

  function getCandidate($stateParams, ExamCandidatesService, localStorageService) {
    if ($stateParams.candidateId)
      return ExamCandidatesService.get({
        candidateId: $stateParams.candidateId
      }).$promise;
    return ExamCandidatesService.byUserAndSchedule({
      scheduleId: $stateParams.scheduleId,
      userId: localStorageService.get('userId')
    }).$promise;
  }
  
  getUser.$inject = ['UsersService'];

  function getUser(UsersService) {
    return UsersService.me().$promise;
  }

}());
