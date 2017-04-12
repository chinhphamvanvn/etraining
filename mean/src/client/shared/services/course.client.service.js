(function() {
  'use strict';

  angular
    .module('shared')
    .service('courseUtils', ['EditionSectionsService', 'AttemptsService', 'GradeSchemesService', 'ExamsService', 'QuestionsService', 'treeUtils', '$q', '_',
      function(EditionSectionsService, AttemptsService, GradeSchemesService, ExamsService, QuestionsService, treeUtils, $q, _) {
        function memberScoreByAttempt(member, attempt, exam, edition) {
          return $q(function(resolve, reject) {
            var rawScore = 0;
            var rawPercent = 0;
            var examScore = 0;
            var weightPercent = 0;
            var answer;
            QuestionsService.byIds({
              questionIds: _.pluck(exam.questions, 'id')
            }, function(questions) {
              _.each(questions, function(question) {
                if (!question.optional) {
                  if (question.grouped) {
                    examScore += question.subQuestions.length;
                    _.each(question.subQuestions, function(subQuestion) {
                      answer = _.find(attempt.answers, function(obj) {
                        return obj.question === subQuestion._id;
                      });
                      if (answer && answer.isCorrect)
                        rawScore++;
                    });
                  } else {
                    examScore += 1;
                    answer = _.find(attempt.answers, function(obj) {
                      return obj.question === question._id;
                    });
                    if (answer && answer.isCorrect)
                      rawScore++;
                  }
                }
              });
              rawPercent = rawScore * 100 / examScore;
              GradeSchemesService.byEdition({
                editionId: edition._id
              }, function(gradescheme) {
                var scheme = _.find(gradescheme.marks, function(scheme) {
                  return scheme.quiz === attempt.section._id;
                });
                var weight = scheme ? scheme.weight : 0;
                weightPercent = rawPercent * weight / 100;
                resolve({
                  attemptId: attempt._id,
                  examId: exam._id,
                  examScore: examScore,
                  rawScore: rawScore,
                  rawPercent: rawPercent,
                  weightPercent: weightPercent
                });
              });
            });
          });
        }
        function memberScoreBySection(member, section, edition) {
          return $q(function(resolve, reject) {
            AttemptsService.bySectionAndMember({
              editionId: edition._id,
              memberId: member._id,
              sectionId: section._id
            }, function(attempts) {
              if (attempts.length === 0) {
                return resolve({
                  rawScore: 0,
                  rawPercent: 0,
                  weightPercent: 0,
                  sectionId: section._id
                });
              }
              var latestAttempt = _.max(attempts, function(attempt) {
                return new Date(attempt.start).getTime();
              });
              ExamsService.get({
                examId: section.quiz
              }, function(exam) {
                memberScoreByAttempt(member, latestAttempt, exam, edition).then(function(result) {
                  result.sectionId = section._id;
                  resolve(result);
                });
              });
            });
          });
        }
        return {
          memberScoreByAttempt: memberScoreByAttempt,
          memberScoreBySection: memberScoreBySection,
          memberProgress: function(member, edition) {
            return $q(function(resolve, reject) {
              var sections = EditionSectionsService.byEdition({
                editionId: edition._id
              }, function() {
                var attempts = AttemptsService.byMember({
                  memberId: member._id
                }, function() {
                  var total = 0;
                  var complete = 0;
                  _.each(sections, function(section) {
                    if (section.hasContent) {
                      var read = _.find(attempts, function(attempt) {
                        return attempt.section === section._id && attempt.status === 'completed';
                      });
                      total++;
                      if (read)
                        complete++;
                    }
                  });
                  resolve(Math.floor(complete * 100 / total));
                });
              });
            });
          },
          courseTime: function(course) {
            return $q(function(resolve, reject) {
              var time = 0;
              AttemptsService.byCourse({
                courseId: course._id
              }, function(attempts) {
                _.each(attempts, function(attempt) {
                  if (attempt.status === 'completed') {
                    var start = new Date(attempt.start);
                    var end = new Date(attempt.end);
                    time += Math.floor((end.getTime() - start.getTime()) / 1000);
                  }
                });
                resolve(time);
              });
            });
          },
          memberTime: function(member) {
            return $q(function(resolve, reject) {
              var time = 0;
              AttemptsService.byMember({
                memberId: member._id
              }, function(attempts) {
                _.each(attempts, function(attempt) {
                  if (attempt.status === 'completed') {
                    var start = new Date(attempt.start);
                    var end = new Date(attempt.end);
                    time += Math.floor((end.getTime() - start.getTime()) / 1000);
                  }
                });
                resolve(time);
              });
            });
          },
          memberScoreByCourse: function(member, edition) {
            return $q(function(resolve, reject) {
              var allPromises = [];
              EditionSectionsService.byEdition({
                editionId: edition._id
              }, function(sectionsList) {
                var sections = treeUtils.buildCourseTree(sectionsList);
                sections = treeUtils.buildCourseListInOrder(sections);
                sections = _.filter(sections, function(section) {
                  return section.data.hasContent && section.data.contentType === 'test';
                });
                _.each(sections, function(section) {
                  allPromises.push(memberScoreBySection(member, section, edition));
                });
                $q.all(allPromises).then(function(scores) {
                  var courseScore = {
                    scores: scores,
                    totalPercent: 0
                  };
                  _.each(scores, function(score) {
                    courseScore.totalPercent += score.weightPercent;
                  });
                  resolve(courseScore);
                });
              });
            });
          }
        };
      }]
  );
}());
