(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesGradebookController', CoursesGradebookController);

CoursesGradebookController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve','memberResolve','gradeResolve', 'Notification','AnswersService', 'OptionsService', 'QuestionsService', 'ExamsService','EditionSectionsService', 'CourseAttemptsService','treeUtils','$translate', '_'];

function CoursesGradebookController($scope, $state, $window, Authentication, $timeout, edition, course, member, gradescheme, Notification,AnswersService, OptionsService, QuestionsService, ExamsService, EditionSectionsService,CourseAttemptsService ,treeUtils, $translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.member = member;
    vm.course = course;
    vm.gradescheme = gradescheme;
    
    
    vm.sections = EditionSectionsService.byEdition({editionId:vm.edition._id}, function() {
        vm.sections = _.filter(vm.sections,function(section) {
            return section.visible;
        });
        vm.nodes = treeUtils.buildCourseTree(vm.sections);
        _.each(vm.nodes,function(root) {
            root.childList = _.filter(treeUtils.buildCourseListInOrder(root.children),function(node) {
               return node.data.hasContent && node.data.contentType=='test' ; 
            });
            reloadChart();
            _.each(root.childList,function(node) {
                var section = node.data;
                node.quiz = ExamsService.get({examId:node.data.quiz},function() {
                    node.quiz.correctCount  = 0;
                    _.each(node.quiz.questions,function(q) {
                        q.mark = 0;
                    });
                    var attempts = CourseAttemptsService.bySectionAndMember({editionId:vm.edition._id,memberId:vm.member._id,sectionId:section._id},function() {
                        var latestAttempt = _.max(attempts, function(attempt){return new Date(attempt.start).getTime()});
                        _.each(latestAttempt.answers, function(answer) {
                            QuestionsService.get({questionId:answer.question},function(question) {
                                OptionsService.byQuestion({questionId:answer.question},function(options) {
                                    _.each(options,function(option) {
                                        var selected = answer.option == option._id;
                                        var checked =  _.contains(answer.options,option._id);
                                        option.selected = selected || checked;
                                    });
                                    var correctOptions = _.filter(options, function(option) {
                                       return option.isCorrect; 
                                    });
                                    var selectedOptions = _.filter(options, function(option) {
                                        return option.selected; 
                                     });
                                    var quizQuestion = _.find(node.quiz.questions,function(q) {
                                        return q.id == answer.question;
                                    });
                                    if (_.difference(correctOptions,selectedOptions).length==0) {
                                        quizQuestion.mark = quizQuestion.score;
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
        _.each(vm.nodes,function(root) {
            _.each(root.childList,function(node) {
                quizName.push(node.data.name);
                var scheme = _.find(vm.gradescheme.marks,function(scheme) {
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
                  quizScore,
            ]
        });
    }
}
}());