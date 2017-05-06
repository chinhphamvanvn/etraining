(function(UIkit) {
  'use strict';

  // Courses controller
  angular
    .module('lms')
    .controller('CoursesStudyExerciseController', CoursesStudyExerciseController);

  CoursesStudyExerciseController.$inject = ['$scope', '$state', '$window', 'QuestionsService', 'ExercisesService', 'AnswersService', 'OptionsService', 'FeedbacksService', 'Authentication', 'AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve', 'memberResolve', '$timeout', '$interval', '$translate', '$q', '_'];

  function CoursesStudyExerciseController($scope, $state, $window, QuestionsService, ExercisesService, AnswersService, OptionsService, FeedbacksService, Authentication, AttemptsService, edition, CoursesService, Notification, section, member, $timeout, $interval, $translate, $q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;
    vm.completeCourse = false; // Value base $scope.$parent.endCourse
    vm.startExercise = false;

    startStudy();

    function startStudy() {
      vm.startExercise = true;
      if (vm.section.exercise) {
        vm.exercise = ExercisesService.get({
          exerciseId: vm.section.exercise
        }, function() {
          vm.attempts = AttemptsService.byMember({
            memberId: vm.member._id
          }, function() {
            vm.attempt = _.find(vm.attempts, function(att) {
              return att.section._id === vm.section._id;
            });
            var questionIds = _.pluck(vm.exercise.questions, 'id');
            vm.questions = QuestionsService.byIds({
              questionIds: questionIds
            }, function() {
              vm.questions = _.sortBy(vm.questions, function(question) {
                return new Date(question.created).getTime();
              });
              if (!vm.attempt) {
                vm.attempt = new AttemptsService();
                vm.attempt.section = vm.section._id;
                vm.attempt.edition = vm.edition._id;
                vm.attempt.course = vm.edition.course;
                vm.attempt.member = vm.member._id;
                vm.attempt.status = 'initial';
                vm.attempt.$save();
              } 
              if (vm.attempt.status !=='initial')
                vm.alert = $translate.instant('ERROR.COURSE_EXERCISE.SUBMIT');
            });

          });
        });
      }
    }
    vm.saveHomework = saveHomework;
    vm.submitHomework = submitHomework;

    function submitHomework() {
      saveHomework(function() {
        UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
          vm.attempt.status = 'completed';
          vm.attempt.end = new Date();
          vm.attempt.$update(function() {
            if (!$scope.$parent.endCourse) {
              $scope.$parent.nextSection();
            } else {
              vm.completeCourse = true;
            }
          });
        });
      });
    }


    function saveHomework(callback) {
      var allPromises = [];
      _.each(vm.questions, function(question) {
        if (question.answer._id)
          allPromises.push(question.answer.$update().$promise);
        else
          allPromises.push(question.answer.$save().$promise);
      });
      $q.all(allPromises).then(function() {
        vm.attempt.answers = _.map(vm.questions, function(obj) {
          return obj.answer._id;
        });
        vm.attempt.$update(function() {
          if (callback)
            callback();
        });        
      })
    }

    vm.nextSection = $scope.$parent.nextSection;
    vm.prevSection = $scope.$parent.prevSection;

  }
}(window.UIkit));
