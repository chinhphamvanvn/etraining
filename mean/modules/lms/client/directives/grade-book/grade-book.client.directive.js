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
                  scope.nodes = treeUtils.buildCourseTree(sections);
                  _.each(scope.nodes,function(root) {
                      root.childList = _.filter(treeUtils.buildCourseListInOrder(root.children),function(node) {
                         return node.data.hasContent && node.data.contentType=='test' && node.data.quiz ;
                      });
                      reloadChart();
                      _.each(root.childList,function(node) {
                          var section = node.data;
                          node.quiz = ExamsService.get({examId:node.data.quiz},function() {
                              node.quiz.correctCount  = 0;
                              _.each(node.quiz.questions,function(q) {
                                  q.mark = 0;
                              });
                              var attempts = AttemptsService.bySectionAndMember({editionId:scope.edition._id,memberId:scope.member._id,sectionId:section._id},function() {
                                  node.latestAttempt = _.max(attempts, function(attempt){return new Date(attempt.start).getTime()});
                                  _.each(node.latestAttempt.answers, function(answer) {
                                      var quizQuestion = _.find(node.quiz.questions,function(q) {
                                          return q.id == answer.question;
                                      });
                                      if (answer.isCorrect) {
                                          quizQuestion.mark = 1;
                                          node.quiz.correctCount++;
                                      } else
                                          quizQuestion.mark = 0;

                                      reloadChart();
                                  });
                              });
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
                  _.each(scope.nodes,function(root) {
                      _.each(root.childList,function(node) {
                          quizName.push(node.data.name);
                          var scheme = _.find(scope.gradescheme.marks,function(scheme) {
                             return scheme.quiz == node.data._id;
                          });
                          quizScore.push(scheme.weight);
                          sumQuizScore += quizScore[quizScore.length-1]
                          if (node.quiz && node.quiz.questions && node.quiz.questions.length>0)
                              studentScore.push(node.quiz.correctCount *scheme.weight/node.quiz.questions.length);
                          else
                              studentScore.push(0);
                          sumStudentScore += studentScore[studentScore.length-1]
                      });
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
