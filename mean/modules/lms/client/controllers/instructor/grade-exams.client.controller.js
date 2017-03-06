(function () {
    'use strict';

    angular
      .module('lms')
      .controller('ExamsGradeController', ExamsGradeController);

    ExamsGradeController.$inject = ['$scope', '$state', '$filter', '$compile','Authentication', 'Notification', '$timeout', '$location', '$window', 'examResolve','scheduleResolve','GroupsService','QuestionsService', '$translate', '_'];

    function ExamsGradeController($scope,$state, $filter, $compile, Authentication, Notification, $timeout, $location, $window, exam, schedule, GroupsService, QuestionsService, $translate, _) {
      var vm = this;
      vm.update = update;
      vm.schedule = schedule;
      vm.exam = exam;
      $scope.Math = window.Math;
      if (vm.exam.questionSelection=='manual') {
          vm.selectedQuestions = [];
          var selectedIds = _.pluck(vm.exam.questions,'id');
          if (selectedIds.length)
              vm.selectedQuestions = QuestionsService.byIds({questionIds:_.pluck(vm.exam.questions,'id')},function() {
                  _.each(vm.selectedQuestions,function(question) {
                      var examQuestion = _.find(vm.exam.questions,function(q) {
                          return q.id == question._id;
                      });
                      question.score = examQuestion.score;
                      question.order = examQuestion.order;
                  });
              });
      }
      
      function update() {
          vm.exam.questions = _.map(vm.selectedQuestions,function(q) {
              return {id:q._id,order:q.order,score:q.score}
          });
         vm.exam.$update( function() {
             Notification.success({ message: '<i class="uk-icon-check"></i> Exam saved successfully!'});
             $state.go('workspace.lms.exams.view',{examId:vm.exam._id,scheduleId:vm.schedule._id})
           },
           function() {
             Notification.success({ message: '<i class="uk-icon-check"></i> Exam saved failed!' });
         });
     }
    }
      

  }());
