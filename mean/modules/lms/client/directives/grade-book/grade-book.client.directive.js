(function () {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('lms')
    .directive('gradebook', ['EditionSectionsService','ExamsService','AttemptsService','QuestionsService', 'OptionsService',  'treeUtils','$translate',  '_', gradebook]);

  function gradebook(EditionSectionsService,ExamsService,AttemptsService, QuestionsService, OptionsService, treeUtils,$translate, _) {

      return {
          scope: {
              course: "=",
              edition: "=",
              member: "=",
              gradescheme: "="
          },
          templateUrl:'/modules/lms/client/directives/grade-book/grade-book.directive.client.view.html',
          link: function (scope, element, attributes) {
              var sections = EditionSectionsService.byEdition({editionId:scope.edition._id}, function() {
                  sections = _.filter(sections,function(section) {
                      return section.visible;
                  });
                  scope.examListCsv = [];
                  scope.headerArrCsv = [];
                  scope.nodes = treeUtils.buildCourseTree(sections);

                  scope.examList = treeUtils.buildCourseListInOrder(scope.nodes);
                  scope.examList = _.filter(scope.examList, function (node) {
                    return node.data.hasContent && node.data.contentType == 'test';
                  });
                  scope.headerArrCsv[0] = " ";
                  scope.inumber = 1;
                  scope.examObj = {};
                  _.each(scope.examList, function (node) {
                      scope.headerArrCsv[scope.inumber] = node.data.name;
                      scope.inumber++;
                  });
                  scope.examObj[0] = $translate.instant("PAGE.LMS.MY_COURSES.COURSE_GRADE.QUIZ_RATE");
                  _.each(scope.gradescheme.marks, function (mark,index) {
                      scope.examObj[index + 1] = mark.weight;
                  });
                  scope.examListCsv.push(scope.examObj);
                  scope.examObj = {};
                  scope.examObj[0] = $translate.instant("MODEL.GRADESCHEME.BENCHMARK");
                  scope.examObj[1] = scope.gradescheme.benchmark;
                  scope.examListCsv.push(scope.examObj);
                  scope.examObj = {};
                  scope.examObj[0] = $translate.instant("REPORT.STUDENT_MARK.MAX_SCORE");
                  scope.examObj1 = {};
                  scope.examObj1[0] = $translate.instant("PAGE.LMS.MY_EXAMS.SCOREBOOK.TITLE");
                  scope.inumber = 0;
                  scope.inumber1 = 0;

                  _.each(scope.examList, function (node,index) {
                      var mark = _.find(scope.gradescheme.marks, function(m) {
                          return node.id == m.quiz;
                      });
                      if (mark) {
                          node.weight = mark.weight;
                      } else {
                          node.weight = 0;
                      }

                      var section = node.data;
                      node.quiz = ExamsService.get({examId:node.data.quiz},function() {
                          scope.examObj[index + 1] = node.quiz.questions.length;
                          node.quiz.correctCount  = 0;
                          _.each(node.quiz.questions,function(q) {
                              q.mark = 0;
                          });
                          if(scope.inumber == scope.examList.length){
                              scope.examListCsv.push(scope.examObj);
                          } else {
                             scope.inumber++;
                          }
                          var attempts = AttemptsService.bySectionAndMember({editionId:scope.edition._id,memberId:scope.member._id,sectionId:section._id},function() {
                              node.latestAttempts = attempts;
                              scope.examDetail = "";
                              _.each(node.latestAttempts, function(latestAttempt) {
                                  latestAttempt.correctCount = 0;
                                  latestAttempt.questions = node.quiz.questions;
                                  _.each(latestAttempt.answers, function(answer) {
                                      var quizQuestion = _.find(latestAttempt.questions,function(q) {
                                          return q.id == answer.question;
                                      });
                                      if (answer.isCorrect) {
                                          quizQuestion.mark = 1;
                                          latestAttempt.correctCount++;
                                      } else
                                          quizQuestion.mark = 0;

                                      reloadChart();
                                  });
                                  scope.examDetail = scope.examDetail + " | " + latestAttempt.correctCount;
                              });
                              scope.examObj1[index + 1] = scope.examDetail;
                              if(scope.inumber1 == scope.examList.length){
                                  scope.examListCsv.push(scope.examObj1);
                              } else {
                                 scope.inumber1++;
                              }
                          });
                      });
                  });
              });

              var progress_chart_id = 'progress_chart';
              var progress_chart = c3.generate({
                  bindto: '#'+progress_chart_id,
                  data: {
                      x : 'x',
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

              function reloadChart() {
                  var quizName = ['x'];
                  var studentScore =[$translate.instant('REPORT.STUDENT_MARK.SCORE')];
                  var quizScore =[$translate.instant('REPORT.STUDENT_MARK.MAX_SCORE')];
                  var sumStudentScore = 0;
                  var sumQuizScore = 0;
                  _.each(scope.examList,function(node) {
                      quizName.push(node.data.name);
                      var scheme = _.find(scope.gradescheme.marks,function(scheme) {
                         return scheme.quiz == node.data._id;
                      });
                      if(scheme){
                        quizScore.push(scheme.weight);
                        sumQuizScore += quizScore[quizScore.length-1];
                        if (node.quiz && node.quiz.questions && node.quiz.questions.length>0){
                            var latestAttemptChart = _.max(node.latestAttempts, function(attempt){return new Date(attempt.start).getTime()});
                            studentScore.push(latestAttemptChart.correctCount *scheme.weight/node.quiz.questions.length);
                        }
                        else{
                            studentScore.push(0);
                        }
                        sumStudentScore += studentScore[studentScore.length-1]
                      }
                  });
                  quizName.push($translate.instant('REPORT.STUDENT_MARK.SUMMARY'));
                  studentScore.push(sumStudentScore);
                  quizScore.push(sumQuizScore);
                  progress_chart.load({
                      columns: [
                            quizName,
                            studentScore,
                            quizScore
                      ]
                  });
              }
          }
      }
  }
}());
