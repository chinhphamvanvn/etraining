(function () {
  'use strict';

  angular
    .module('shared')
    .service('courseUtils', ['EditionSectionsService', 'AttemptsService', 'GradeSchemesService', 'treeUtils', '$q', '_',
      function (EditionSectionsService, AttemptsService, GradeSchemesService, treeUtils, $q, _) {
        var memberScoreBySection = function (memberId, sectionId, editionId) {
          return $q(function (resolve, reject) {
            var correctCount = 0;
            var correctPercent = 0;
            var score = 0;
            AttemptsService.bySectionAndMember({
              editionId: editionId,
              memberId: memberId,
              sectionId: sectionId
            }, function (attempts) {
              if (attempts.length === 0) {
                return resolve({score: 0, correctPercent: 0});
              }

              var latestAttempt = _.max(attempts, function (attempt) {
                return new Date(attempt.start).getTime()
              });

              _.each(latestAttempt.answers, function (answer) {
                if (answer.isCorrect) {
                  correctCount++;
                }
              });
              GradeSchemesService.byEdition({editionId: editionId}, function (gradescheme) {
                var scheme = _.find(gradescheme.marks, function (scheme) {
                  return scheme.quiz == sectionId;
                });
                var weight = scheme ? scheme.weight : 0;

                score = (latestAttempt.answers.length !== 0) ? Math.floor(correctCount * weight / latestAttempt.answers.length) : 0;
                correctPercent = (latestAttempt.answers.length !== 0) ? Math.floor(correctCount * 100 / latestAttempt.answers.length) : 0;
                resolve({score: score, correctPercent: correctPercent});
              });
            });
          });
        };
        return {
          memberProgress: function (memberId, editionId) {
            return $q(function (resolve, reject) {
              var sections = EditionSectionsService.byEdition({editionId: editionId}, function () {
                var attempts = AttemptsService.byMember({memberId: memberId}, function () {
                  var total = 0;
                  var complete = 0;
                  _.each(sections, function (section) {
                    if (section.hasContent) {
                      var read = _.find(attempts, function (attempt) {
                        return attempt.section == section._id && attempt.status == 'completed';
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
          courseTime: function (courseId) {
            return $q(function (resolve, reject) {
              var time = 0;
              AttemptsService.byCourse({courseId: courseId}, function (attempts) {
                _.each(attempts, function (attempt) {
                  if (attempt.status == 'completed') {
                    var start = new Date(attempt.start);
                    var end = new Date(attempt.end);
                    time += Math.floor((end.getTime() - start.getTime()) / 1000);
                  }
                });
                resolve(time);
              })
            });
          },
          memberTime: function (memberId) {
            return $q(function (resolve, reject) {
              var time = 0;
              AttemptsService.byMember({memberId: memberId}, function (attempts) {
                _.each(attempts, function (attempt) {
                  if (attempt.status == 'completed') {
                    var start = new Date(attempt.start);
                    var end = new Date(attempt.end);
                    time += Math.floor((end.getTime() - start.getTime()) / 1000);
                  }
                });
                resolve(time);
              });
            });
          },
          memberScoreBySection: memberScoreBySection,
          memberScoreByCourse: function (memberId, editionId) {
            return $q(function (resolve, reject) {
              var allPromises = [];
              EditionSectionsService.byEdition({editionId: editionId}, function (sectionsList) {
                var sections = treeUtils.buildCourseTree(sectionsList);
                sections = treeUtils.buildCourseListInOrder(sections);
                sections = _.filter(sections, function (section) {
                  return section.data.hasContent && section.data.contentType == 'test';
                });

                _.each(sections, function (section) {
                  allPromises.push(memberScoreBySection(memberId, section.id, editionId));
                });
                $q.all(allPromises).then(function (scores) {
                  var courseScore = {
                    scores: scores
                  };
                  var totalScore = 0;
                  _.each(scores, function (score) {
                    totalScore += score.score;
                  });
                  courseScore.totalScore = totalScore;
                  resolve(courseScore)
                })
              });
            });
          }
        };
      }]
    )
}());
