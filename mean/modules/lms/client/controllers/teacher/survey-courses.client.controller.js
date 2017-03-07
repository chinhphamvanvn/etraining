(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesSurveyController', CoursesSurveyController);

CoursesSurveyController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve', 'OptionsService', 'QuestionsService', 'Notification', 'AttemptsService', 'ExamsService', 'EditionSectionsService', '$translate', '_'];

function CoursesSurveyController($scope, $state, $window, Authentication, $timeout, edition, course,OptionsService, QuestionsService, Notification, AttemptsService,ExamsService ,EditionSectionsService, $translate, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;
    vm.memberListCsv = [];
    vm.headerArrCsv = [$translate.instant("PAGE.LMS.MY_COURSES.TEACHER_BOARD.COURSE_OUTLINE.SURVEY"),$translate.instant("PAGE.LMS.MY_COURSES.TEACHER_BOARD.SURVEY_CANDIDATE_COUNT"),$translate.instant("PAGE.LMS.MY_COURSES.TEACHER_BOARD.COURSE_OUTLINE.SURVEY.SESSION_INFO"),$translate.instant("PAGE.LMS.MY_COURSES.COURSE_SURVEY.OPTION"),$translate.instant("PAGE.LMS.MY_COURSES.TEACHER_BOARD.SURVEY_CANDIDATE_CHECK_COUNT"),$translate.instant("PAGE.LMS.MY_COURSES.TEACHER_BOARD.SURVEY_CANDIDATE_PERCENT")];

    vm.sections = EditionSectionsService.surveyByCourse({editionId:vm.edition._id}, function( ) {
        _.each(vm.sections,function(section) {
             section.attempts =  AttemptsService.bySection({sectionId:section._id,editionId:vm.edition._id},function() {
                 section.attempts = _.filter(section.attempts,function(obj) {
                     return obj.status =='completed';
                 });
                 var itemSurvey1 = {
                    servey: section.name,
                    total: section.attempts.length,
                    question: "",
                    choose: "",
                    number: "",
                    percent: ""
                };
                var numberinit = 0;

                 _.each(section.survey.questions,function(question) {
                    question.detail = QuestionsService.get({questionId:question.id});
                    question.options = OptionsService.byQuestion({questionId:question.id},function() {
                        numberinit++;
                        if(itemSurvey1.servey){
                            vm.memberListCsv.push(itemSurvey1);
                            itemSurvey1 = {};
                        }
                        var itemSurvey2 = {
                            servey: "",
                            total: "",
                            question: question.detail.title,
                            choose: "",
                            number: "",
                            percent: ""
                        }
                        vm.memberListCsv.push(itemSurvey2);
                        _.each(question.options,function(option) {
                            option.count = 0;
                            _.each(section.attempts,function(attempt) {
                                _.each(attempt.answers,function(answer) {
                                    if (_.contains(answer.options,option._id))
                                        option.count++;
                                });
                            });
                            if (section.attempts.length){
                                option.percentage = Math.floor(option.count * 100 /section.attempts.length); 
                            }

                            var itemSurvey = {
                                servey: "",
                                total: "",
                                question: "",
                                choose: option.content,
                                number: option.count +" / "+ section.attempts.length,
                                percent: option.percentage + " % "
                            }
                            vm.memberListCsv.push(itemSurvey);

                        });
                        if(numberinit == section.survey.questions.length){
                            var itemSurvey3 = {
                                servey: "",
                                total: "",
                                question: "",
                                choose: "",
                                number: "",
                                percent: ""
                            }
                            vm.memberListCsv.push(itemSurvey3);
                            vm.memberListCsv.push(itemSurvey3);
                        }
                    });

                 });
            });
        });
    });
}
}());