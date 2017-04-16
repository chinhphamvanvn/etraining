(function() {
  'use strict';

  angular
    .module('shared')
    .service('examUtils', ['SubmissionsService', 'ExamsService', 'GroupsService', 'QuestionsService', 'treeUtils', '$q', '_',
      function(SubmissionsService, ExamsService, GroupsService, QuestionsService, treeUtils, $q, _) {
        function candidateScoreBySubmit(candidate, exam, submit) {
          return $q(function(resolve, reject) {
            var examScore = 0;
            var candidateScore = 0;
            var answer,
              questionIds;
            if (exam.questionSelection === 'auto') {
              var totalQuestions = 0;
              exam.questionCategories.map(function(category) {
                totalQuestions += category.numberQuestion
              });
              examScore = exam.questionScore * totalQuestions;

              questionIds = _.pluck(submit.answers, 'question');
              if (questionIds && questionIds.length) {
                QuestionsService.byIds({
                  questionIds: questionIds
                }, function(questions) {
                  _.each(questions, function(question) {
                    if (!question.optional && question.type !== 'ext') {
                      if (question.grouped) {
                        _.each(question.subQuestions, function(subQuestion) {
                          answer = _.find(submit.answers, function(obj) {
                            return obj.question === subQuestion._id;
                          });
                          if (answer && answer.isCorrect)
                            candidateScore += exam.questionScore / question.subQuestions.length;
                        });
                      } else {
                        answer = _.find(submit.answers, function(obj) {
                          return obj.question === question._id;
                        });
                        if (answer && answer.isCorrect)
                          candidateScore += exam.questionScore;
                      }
                    }
                  });
                  resolve(Math.floor(candidateScore * 100 / examScore));
                });
              }
            }
            if (exam.questionSelection === 'manual') {
              questionIds = _.pluck(exam.questions, 'id');
              if (questionIds && questionIds.length) {
                QuestionsService.byIds({
                  questionIds: questionIds
                }, function(questions) {
                  _.each(questions, function(question) {
                    var examQuestion = _.find(exam.questions, function(obj) {
                      return obj.id === question._id;
                    });
                    if (!question.optional && question.type !== 'ext') {
                      examScore += examQuestion.score;
                      if (question.grouped) {
                        _.each(question.subQuestions, function(subQuestion) {
                          answer = _.find(submit.answers, function(obj) {
                            return obj.question === subQuestion._id;
                          });
                          if (answer && answer.isCorrect)
                            candidateScore += examQuestion.score / question.subQuestions.length;
                        });
                      } else {
                        answer = _.find(submit.answers, function(obj) {
                          return obj.question === question._id;
                        });
                        if (answer && answer.isCorrect)
                          candidateScore += examQuestion.score;
                      }
                    }
                  });
                  resolve(Math.floor(candidateScore * 100 / examScore));
                });
              }
            }
          });
        }
        return {
          candidateProgress: function(candidate, exam) {
            return $q(function(resolve, reject) {
              var submits = SubmissionsService.byCandidate({
                candidateId: candidate._id
              }, function() {
                var firstSubmit = _.max(submits, function(submit) {
                  return new Date(submit.start).getTime();
                });
                var lastSubmit = _.min(submits, function(submit) {
                  return new Date(submit.start).getTime();
                });
                var progress = {
                  percentage: Math.floor(submits.length * 100 / exam.maxAttempt),
                  count: submits.length,
                  firstSubmit: firstSubmit,
                  lastSubmit: lastSubmit
                };
                resolve(progress);
              });
            });
          },
          pendingSubmit: function(candidate, exam) {
            return $q(function(resolve, reject) {
              var submits = SubmissionsService.byCandidate({
                candidateId: candidate._id
              }, function() {
                var now = new Date();
                var pendingSubmit = _.find(submits, function(submit) {
                  var start = new Date(submit.start);
                  return submit.status === 'pending' && start.getTime() + exam.duration * 60 * 1000 > now.getTime();
                });
                var progress = {
                  pending: pendingSubmit,
                  percentage: Math.floor(submits.length * 100 / exam.maxAttempt),
                  count: submits.length
                };
                resolve(progress);
              });
            });
          },
          questionRandom: function(category, level, number) {
            return $q(function(resolve, reject) {
              QuestionsService.byCategoryAndLevel({
                groupId: category,
                level: level
              }, function(questions) {
                if (!questions.length || number > questions.length) {
                  reject();
                } else {
                  var randomQuestions = [];
                  while (number) {
                    var index = Math.floor((Math.random() * questions.length));
                    randomQuestions.push(questions[index]);
                    number--;
                    questions.splice(index, 1);
                  }
                  resolve(randomQuestions);
                }
              });
            });
          },
          candidateScoreByBusmit: candidateScoreByBusmit,
          candidateScore: function(candidate, exam) {
            return $q(function(resolve, reject) {
              SubmissionsService.byExamAndCandidate({
                examId: exam._id,
                candidateId: candidate._id
              }, function(submits) {
                if (submits && submits.length) {
                  var latestSubmit = _.max(submits, function(submit) {
                    return new Date(submit.start).getTime();
                  });
                  candidateScoreByBusmit(candidate, exam, latestSubmit).then(function(score) {
                    resolve(score);
                  });
                } else {
                  resolve(0);
                }
              });
            });
          },
          countQuestionByLevel: function(questions) {
            var questionByLevel = {};

            questionByLevel.easy = _.filter(questions, function(question) {
              return question.level === 'easy';
            });
            questionByLevel.medium = _.filter(questions, function(question) {
              return question.level === 'medium';
            });
            questionByLevel.hard = _.filter(questions, function(question) {
              return question.level === 'hard';
            });

            return questionByLevel;
          }
        };
      }]
  );
}());
