(function(c3) {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('gradebook', ['EditionSectionsService', 'ExamsService', 'AttemptsService', 'QuestionsService', 'OptionsService', 'courseUtils', 'treeUtils', '$translate', '$q', '_', gradebook]);

  function gradebook(EditionSectionsService, ExamsService, AttemptsService, QuestionsService, OptionsService, courseUtils, treeUtils, $translate, $q, _) {
    return {
      scope: {
        course: '=',
        edition: '=',
        member: '=',
        gradescheme: '='
      },
      templateUrl: '/src/client/lms/directives/grade-book/grade-book.client.view.html',
      link: function(scope, element, attributes) {
        scope.sumStudentScore = 0;
        scope.sumQuizScore = 0;

        var progress_chart_id = 'progress_chart';
        var progress_chart = c3.generate({
          bindto: '#' + progress_chart_id,
          data: {
            x: 'x',
            columns: [
              ['x'],
              [$translate.instant('REPORT.STUDENT_MARK.SCORE')],
              [$translate.instant('REPORT.STUDENT_MARK.MAX_SCORE')]
            ],
            type: 'bar',
            labels: true
          },
          bar: {
            width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
            }
          },
          axis: {
            x: {
              type: 'category' // this needed to load string x value
            }
          },
          grid: {
            y: {
              show: true
            }
          },
          color: {
            pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
          }
        });

        EditionSectionsService.byEdition({
          editionId: scope.edition._id
        }, function(sections) {
          sections = _.filter(sections, function(section) {
            return section.visible;
          });
          scope.quizSectionNodes = treeUtils.buildCourseTree(sections);
          scope.quizSectionNodes = treeUtils.buildCourseListInOrder(scope.quizSectionNodes);
          scope.quizSectionNodes = _.filter(scope.quizSectionNodes, function(node) {
            return node.data.hasContent && node.data.contentType === 'test';
          });
          _.each(scope.quizSectionNodes, function(node) {
            var mark = _.find(scope.gradescheme.marks, function(obj) {
              return obj.quiz === node.id;
            });
            node.weight = mark.weight;
            if (node.data.quiz) {
              AttemptsService.bySectionAndMember({
                editionId: scope.edition._id,
                memberId: scope.member._id,
                sectionId: node.id
              }, function(attempts) {
                node.attempts = attempts;
                reloadChart();
                ExamsService.get({
                  examId: node.data.quiz
                }, function(exam) {
                  node.quiz = exam;
                  _.each(node.attempts, function(attempt) {
                    courseUtils.memberScoreByAttempt(scope.member, attempt, exam, scope.edition)
                      .then(function(result) {
                        attempt.weightPercent = result.weightPercent;
                      });
                  });
                });
              });
            }
          });
        });

        function reloadChart() {
          scope.sumQuizScore = 0;
          var quizChartData = {};
          var allPromises = [];
          _.each(scope.quizSectionNodes, function(node) {
            quizChartData[node.id] = {
              quizName: node.data.name
            };
            var scheme = _.find(scope.gradescheme.marks, function(scheme) {
              return scheme.quiz === node.data._id;
            });
            if (!scheme || !scheme.weight) {
              quizChartData[node.id].quizScore = 0;
            } else
              quizChartData[node.id].quizScore = scheme.weight;
            scope.sumQuizScore += quizChartData[node.id].quizScore;
            if (node.data.quiz) {
              allPromises.push(courseUtils.memberScoreBySection(scope.member, node.data, scope.edition));
            } else {
              quizChartData[node.id].studentScore = 0;
            }
          });
          $q.all(allPromises).then(function(sectionScores) {
            scope.sumStudentScore = 0;
            _.each(sectionScores, function(score) {
              quizChartData[score.sectionId].studentScore = score.weightPercent;
              scope.sumStudentScore += score.weightPercent;
            });
            var quizName = ['x'];
            var studentScore = [$translate.instant('REPORT.STUDENT_MARK.SCORE')];
            var quizScore = [$translate.instant('REPORT.STUDENT_MARK.MAX_SCORE')];
            _.each(quizChartData, function(chartEntry) {
              quizName.push(chartEntry.quizName);
              studentScore.push(chartEntry.studentScore);
              quizScore.push(chartEntry.quizScore);
            });
            quizName.push($translate.instant('REPORT.STUDENT_MARK.SUMMARY'));
            studentScore.push(scope.sumStudentScore);
            quizScore.push(scope.sumQuizScore);
            progress_chart.load({
              columns: [
                quizName,
                studentScore,
                quizScore
              ]
            });
          });
        }

        scope.getExportHeader = function() {
          var header = [' '];
          _.each(scope.quizSectionNodes, function(node) {
            header.push(node.data.name);
          });
          return header;
        };

        scope.getExportData = function() {
          var data = [];
          var quizWeightRow = [$translate.instant('PAGE.LMS.MY_COURSES.COURSE_GRADE.QUIZ_RATE')];
          var quizAttemptRow = [$translate.instant('PAGE.LMS.MY_EXAMS.SCOREBOOK.TITLE')];
          var quizStudentScoreRow = [$translate.instant('REPORT.STUDENT_MARK.SCORE')];
          _.each(scope.quizSectionNodes, function(node) {
            var mark = _.find(scope.gradescheme.marks, function(obj) {
              return obj.quiz === node.id;
            });
            quizWeightRow.push(mark.weight);
            if (node.quiz) {
              var attemptDetail = '';
              _.each(node.attempts, function(attempt) {
                attemptDetail += attempt.weightPercent + '|';
              });
              quizAttemptRow.push(attemptDetail);
            } else {
              quizWeightRow.push(0);
              quizAttemptRow.push('');
            }
          });
          data.push(quizWeightRow);
          data.push(quizAttemptRow);
          data.push([$translate.instant('REPORT.STUDENT_MARK.SCORE'), scope.sumStudentScore]);
          data.push([$translate.instant('REPORT.STUDENT_MARK.MAX_SCORE'), scope.sumQuizScore]);
          return data;
        };
      }
    };
  }
}(window.c3));
