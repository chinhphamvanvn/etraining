(function () {
  'use strict';

// Courses controller
  angular
    .module('lms')
    .controller('CoursesGradeboardController', CoursesGradeboardController);

  CoursesGradeboardController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve', 'courseResolve', 'memberResolve', 'gradeResolve', 'userResolve', 'Notification', 'CourseEditionsService', 'CertificatesService', 'CourseMembersService', 'EditionSectionsService', 'treeUtils', 'ExamsService', 'AttemptsService', 'QuestionsService', '$translate', '_'];

  function CoursesGradeboardController($scope, $state, $window, Authentication, $timeout, edition, course, member, gradescheme, user, Notification, CourseEditionsService, CertificatesService, CourseMembersService, EditionSectionsService, treeUtils, ExamsService, AttemptsService, QuestionsService, $translate, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;
    vm.member = member;
    vm.certify = certify;
    vm.user = user;
    vm.gradescheme = gradescheme;

    function examPromise() {
      return EditionSectionsService.byEdition({editionId: vm.edition._id}, function (sections) {
      }).$promise;
    }

    function membersPromise() {
      return CourseMembersService.byCourse({courseId: vm.course._id}, function () {
      }).$promise;
    }

    membersPromise().then(function (members) {
        vm.members = _.filter(members, function (m) {
          return m.role == 'student';
        });

        _.each(vm.members, function (member) {
          CertificatesService.byMember({memberId: member._id}, function (certificate) {
            member.certificate = certificate;
          }, function () {
            member.certificate = null;
          })
        })
    }).then(function () {
      return examPromise();
    }).then(function (sections) { // Get examList information
      vm.sections = sections;

      var nodes = treeUtils.buildCourseTree(sections);
      vm.examList = treeUtils.buildCourseListInOrder(nodes);

      vm.examList = _.filter(vm.examList, function (node) {
        return node.data.hasContent && node.data.contentType == 'test';
      });

      _.each(vm.examList, function (node) {
        node.min = '0';
        node.max = '100';
        var mark = _.find(vm.gradescheme.marks, function (m) {
          return m.quiz == node.data._id;
        });
        if (mark) {
          node.checked = true;
          node.weight = mark.weight;
          node.max = node.weight;
        } else {
          node.weight = 0;
          node.checked = false;
        }
        vm.total += node.weight;
      });
    }).then(function () {// Get result of exam
      var sections = _.filter(vm.sections,function(section) {
        return section.visible;
      });
      vm.nodes = treeUtils.buildCourseTree(sections);

      _.each(vm.members, function (member) {
        var nodes = angular.copy(vm.nodes);
        _.each(nodes, function (root) {
          root.childList = _.filter(treeUtils.buildCourseListInOrder(root.children), function (node) {
            return node.data.hasContent && node.data.contentType == 'test' && node.data.quiz;
          });

          _.each(root.childList, function (node) {
            var section = node.data;
            node.quiz = ExamsService.get({examId: node.data.quiz}, function () {
              node.quiz.correctCount = 0;
              _.each(node.quiz.questions, function (q) {
                q.mark = 0;
              });
              var attempts = AttemptsService.bySectionAndMember({
                editionId: vm.edition._id,
                memberId: member._id,
                sectionId: section._id
              }, function () {
                var latestAttempt = _.max(attempts, function (attempt) {
                  return new Date(attempt.start).getTime()
                });
                _.each(latestAttempt.answers, function (answer) {
                  var quizQuestion = _.find(node.quiz.questions, function (q) {
                    return q.id == answer.question;
                  });
                  if (answer.isCorrect) {
                    quizQuestion.mark = 1;
                    node.quiz.correctCount++;
                  } else
                    quizQuestion.mark = 0;
                });
                node.quiz.correctPercent = Math.floor((node.quiz.correctCount*100)/node.quiz.questions.length);
              });
            });
          });
        });
        member.quizList = nodes;
      });
    });

    function certify(member) {
      var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Processing...<br/><img class=\'uk-margin-top\' src=\'/assets/img/spinners/spinner.gif\' alt=\'\'>');
      var certificate = new CertificatesService();
      certificate.member = member._id;
      certificate.course = vm.course._id;
      certificate.edition = vm.edition._id;
      certificate.issueDate = new Date();
      certificate.authorizer = vm.user._id;
      certificate.$save(function () {
        member.certificate = certificate;
        modal.hide();
      });
    }
  }
}());
