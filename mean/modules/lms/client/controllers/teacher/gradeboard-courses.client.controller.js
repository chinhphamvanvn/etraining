(function () {
  'use strict';

// Courses controller
  angular
    .module('lms')
    .controller('CoursesGradeboardController', CoursesGradeboardController);

  CoursesGradeboardController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve', 'courseResolve', 'memberResolve', 'gradeResolve', 'userResolve', 'Notification', 'CourseEditionsService', 'CertificatesService', 'CourseMembersService', 'EditionSectionsService', 'treeUtils', 'ExamsService', 'AttemptsService', 'QuestionsService', '$q', '$translate', '_'];

  function CoursesGradeboardController($scope, $state, $window, Authentication, $timeout, edition, course, member, gradescheme, user, Notification, CourseEditionsService, CertificatesService, CourseMembersService, EditionSectionsService, treeUtils, ExamsService, AttemptsService, QuestionsService, $q, $translate, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;
    vm.member = member;
    vm.certify = certify;
    vm.user = user;
    vm.gradescheme = gradescheme;
    vm.csvHeader = [];
    vm.csvArray = [];

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
    }).then(function () {// Get result of exam for each student
      var nodes = treeUtils.buildCourseTree(vm.sections);
      vm.nodes = treeUtils.buildCourseListInOrder(nodes);
      vm.nodes = _.filter(vm.nodes, function (node) {
        return node.data.hasContent && node.data.contentType == 'test';
      });

      vm.nodes.reduce(function(prev, curr) {
        // Get info of exam and save curr.quiz
        return prev.then(function() {
          return ExamsService.get({examId: curr.data.quiz}, function() {}).$promise.then(function(quiz) {curr.quiz = quiz});
        });
      }, $q.resolve()).then(function() {
        // Get score for each student
        return vm.members.reduce(function(prev, curr) {
          var totalScore = 0;
          var nodes = angular.copy(vm.nodes);
          return prev.then(function() {
            return nodes.reduce(function(prevNode, currNode) {
              return AttemptsService.bySectionAndMember({
                editionId: vm.edition._id,
                memberId: curr._id,
                sectionId: currNode.data._id
              }, function() {}).$promise.then(function(attempts) {
                currNode.quiz.correctCount = 0;
                var latestAttempt = _.max(attempts, function (attempt) {
                  return new Date(attempt.start).getTime();
                });

                _.each(latestAttempt.answers, function (answer) {
                  if (answer.isCorrect) {
                    currNode.quiz.correctCount++;
                  }
                });

                currNode.quiz.correctPercent = Math.floor((currNode.quiz.correctCount * 100) / currNode.quiz.questions.length);

                var mark = _.find(vm.gradescheme.marks, function(m) {
                  return currNode.id == m.quiz;
                });

                if (mark) {
                  currNode.weight = mark.weight;
                  totalScore += (currNode.weight / 100) * currNode.quiz.correctPercent;
                } else {
                  currNode.weight = 0;
                }

                curr.totalScore = totalScore;
              });
            }, $q.resolve()).then(function() {
              curr.examList = nodes;
            });
          });
        }, $q.resolve());
      }).then(function() {// Export to csv
        var pass        = $translate.instant('COMMON.PASS'),
            fall        = $translate.instant('COMMON.FAIL'),
            displayName = $translate.instant('MODEL.USER.DISPLAY_NAME'),
            totalScore  = $translate.instant('PAGE.LMS.MY_COURSES.GRADE_SCHEME_SHORT'),
            result      = $translate.instant('PAGE.LMS.MY_COURSES.COURSE_GRADE.EXAM_RESULT');
        vm.csvArray = [];
        vm.csvHeader = [];

        vm.csvHeader.push(displayName);
        vm.examList.map(function(exam) {
          vm.csvHeader.push(exam.data.name);
        });
        vm.csvHeader.push(totalScore);
        vm.csvHeader.push(result);

        vm.members.map(function(member) {
          var csvObj = {};
          csvObj[0 + 'name'] = member.member.displayName;
          member.examList.map(function(exam, index) {
            csvObj['exam_' + index] = exam.quiz.correctPercent;
          });
          csvObj.totalScore = member.totalScore;
          csvObj.result = (member.totalScore >= vm.gradescheme.benchmark) ? pass : fall;
          vm.csvArray.push(csvObj);
        });
        console.log(vm.csvArray);
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
