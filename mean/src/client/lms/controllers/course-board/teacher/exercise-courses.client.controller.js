(function() {
  'use strict';

  angular
    .module('lms')
    .filter('byClass', ['_', function(_) {
      return function(students, classroomId) {
        if (!classroomId)
          return students;
        return _.filter(students, function(student) {
          if (!student.classroom)
            return false;
          if (student.classroom._id === classroomId)
            return true;
          return false;
        });

      };
    }]);

  angular
    .module('lms')
    .controller('CoursesExerciseController', CoursesExerciseController);

  CoursesExerciseController.$inject = ['$scope', '$state', '$window', 'Authentication', '$filter', 'editionResolve', 'courseResolve', 'memberResolve', 'Notification', 'CourseMembersService', 'FeedbacksService', 'ClassroomsService', 'ExercisesService', 'EditionSectionsService', 'AttemptsService', 'QuestionsService', '$translate', '_'];

  function CoursesExerciseController($scope, $state, $window, Authentication, $filter, edition, course, member, Notification, CourseMembersService, FeedbacksService, ClassroomsService, ExercisesService, EditionSectionsService, AttemptsService, QuestionsService, $translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.member = member;
    vm.course = course;
    vm.selectClass = selectClass;
    vm.selectExercise = selectExercise;

    vm.classConfig = {
      create: false,
      maxItems: 1,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title'
    };
    vm.classOptions = [];

    vm.classes = ClassroomsService.byCourse({
      courseId: vm.course._id
    }, function() {
      vm.classOptions = _.map(vm.classes, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj._id
        };
      });
      _.each(vm.classes, function(classroom) {
        var now = new Date();
        var startDate = classroom.startDate ? new Date(classroom.startDate) : null;
        var endDate = classroom.endDate ? new Date(classroom.endDate) : null;
        if (startDate) {
          if (startDate.getTime() > now.getTime())
            classroom.titleClass = 'uk-text-warning';
          else if (endDate) {
            if (endDate.getTime() > now.getTime())
              classroom.titleClass = 'uk-text-success';
            else
              classroom.titleClass = '';
          } else
            classroom.titleClass = 'uk-text-success';
        } else {
          if (endDate) {
            if (endDate.getTime() > now.getTime())
              classroom.titleClass = 'uk-text-success';
            else
              classroom.titleClass = '';
          } else
            classroom.titleClass = '';
        }
      });
    });

    function selectClass() {
      if (vm.classroomId) {
        vm.classroom = _.find(vm.classes, function(obj) {
          return obj._id === vm.classroomId;
        });
      }
    }

    vm.exerciseConfig = {
      create: false,
      maxItems: 1,
      valueField: 'value',
      labelField: 'title',
      searchField: 'title'
    };
    vm.exerciseOptions = [];
    EditionSectionsService.byEdition({
      editionId: vm.edition._id
    }, function(sections) {
      vm.sections = _.filter(sections, function(section) {
        return section.visible && section.hasContent && section.contentType === 'exercise';
      });
      vm.exerciseOptions = _.map(vm.sections, function(obj) {
        return {
          id: obj._id,
          title: obj.name,
          value: obj.exercise
        };
      });
    });

    CourseMembersService.byCourse({
      courseId: vm.course._id
    }, function(members) {
      vm.members = _.filter(members, function(member) {
        return member.role === 'student';
      });
    });

    function selectExercise() {
      if (vm.exerciseId) {
        var section = _.find(vm.sections, function(obj) {
          return obj.exercise === vm.exerciseId;
        });
        var members = $filter('byClass')(vm.members, vm.classroomId);
        _.each(members, function(member) {
          AttemptsService.bySectionAndMember({
            editionId: vm.edition._id,
            memberId: member._id,
            sectionId: section._id
          }, function(attempts) {
            member.attempt = _.find(attempts, function(att) {
              return att.status === 'completed';
            });
            if (member.attempt) {
              member.feedbacks = FeedbacksService.byAttempt({
                attemptId: member.attempt._id
              });
            }
          });
        });


      }
    }
  }
}());
