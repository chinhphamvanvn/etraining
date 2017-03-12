(function () {
  'use strict';

  angular
  .module('shared')
    .service('examUtils', ['SubmissionsService','ExamsService','GroupsService','QuestionsService','treeUtils', '$q','_',
        function (SubmissionsService,ExamsService,GroupsService,QuestionsService,treeUtils, $q,_) {
            function candidateScoreByBusmit(candidateId,examId,submissionId) {
                return $q(function(resolve, reject) {
                    ExamsService.get({examId:examId},function(exam) {
                        SubmissionsService.get({submissionId:submissionId},function(submit) {
                            if (exam.questionSelection=='auto') {
                               var correct =  _.filter(submit.answers, function(answer) {
                                    return (answer.isCorrect) ;
                                }).length;
                               resolve(Math.floor(correct * 100 / exam.questionNumber));
                            }
                            if (exam.questionSelection=='manual') {
                                var total = 0;
                                var score = 0;
                                _.each(exam.questions,function(question) {
                                    total += question.score;
                                   var answer = _.find(submit.answers,function(obj) {
                                        return obj.question == question.id;
                                    });
                                    if (answer && answer.isCorrect)
                                        score += question.score;
                                })
                                resolve(Math.floor(score * 100 / total));
                             }
                        });
                    }); 
                });                    
            }
            return {
                candidateProgress: function(candidateId,examId) {
                    return $q(function(resolve, reject) {
                        var exam = ExamsService.get({examId:examId}, function() {
                            var submits = SubmissionsService.byCandidate({candidateId:candidateId},function() {
                                var firstSubmit = _.max(submits, function(submit){return new Date(submit.start).getTime()});
                                var lastSubmit = _.min(submits, function(submit){return new Date(submit.start).getTime()});
                                var progress  =  { percentage: Math.floor(submits.length * 100 / exam.maxAttempt),
                                        count:submits.length,
                                        firstSubmit:firstSubmit,
                                        lastSubmit:lastSubmit};
                                resolve(progress);
                            });
                        });
                    });                    
                },
                pendingSubmit: function(candidateId,examId) {
                    return $q(function(resolve, reject) {
                        var exam = ExamsService.get({examId:examId}, function() {
                            var submits = SubmissionsService.byCandidate({candidateId:candidateId},function() {
                                var now = new Date();
                                var pendingSubmit = _.find(submits,function(submit) {
                                    var start = new Date(submit.start);
                                    return submit.status=='pending' && start.getTime() + exam.duration * 60 * 1000 > now.getTime();
                                })
                                var progress  =  {pending:pendingSubmit, percentage: Math.floor(submits.length * 100 / exam.maxAttempt),count:submits.length};
                                resolve(progress);
                            });
                        });
                    });                    
                },
                questionRandom:function(category,level,number) {
                    return $q(function(resolve, reject) {
                        QuestionsService.byCategoryAndLevel({groupId:node.data._id,level:level},function(questions) {
                            if (!questions.length)
                                resolve([]);
                            else {
                                var randomQuestions = [];
                                while (number) {
                                    var index = Math.floor( (Math.random()*questions.length));
                                    randomQuestions.push(questions[index]);
                                    number--;
                                }
                                resolve(randomQuestions);
                            }
                        });
                     /*   var questions = [];
                        GroupsService.listQuestionGroup(function(groups) {
                            var nodes = treeUtils.buildGroupTree(groups);
                            var parentNode = treeUtils.findGroupNode(nodes,category);
                            var childNodes = treeUtils.buildGroupListInOrder([parentNode]);
                            var allPromises = [];
                            _.each(childNodes,function(node) {
                                allPromises.push(QuestionsService.byCategoryAndLevel({groupId:node.data._id,level:level}));
                            });
                            $q.all(allPromises).then(function(questionsList) {
                               _.each(questionsList,function(qList) {
                                   questions = questions.concat(qList);
                               });
                               if (!questions.length)
                                   resolve([]);
                               else {
                                   var randomQuestions = [];
                                   while (number) {
                                       var index = Math.floor( (Math.random()*questions.length));
                                       randomQuestions.push(questions[index]);
                                       number--;
                                   }
                                   resolve(randomQuestions);
                               }
                               
                            });
                        });*/
                    });
                },
                candidateScoreByBusmit:candidateScoreByBusmit,
                candidateScore : function (candidateId,examId) {
                    return $q(function(resolve, reject) {
                        SubmissionsService.byExamAndCandidate({examId:examId,candidateId:candidateId},function(submits) {
                            if (submits && submits.length) {
                                var latestSubmit = _.max(submits, function(submit){return new Date(submit.start).getTime()});
                                candidateScoreByBusmit(candidateId,examId,latestSubmit._id).then(function(score) {
                                    resolve(score);
                                }) 
                            }
                            else
                                resolve(0);                            
                        }); 
                    });                    
                }
                
            };
        }]
    )
}());