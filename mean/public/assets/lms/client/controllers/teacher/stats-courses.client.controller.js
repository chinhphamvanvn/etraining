(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesStatsController', CoursesStatsController);

CoursesStatsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve', 'OptionsService', 'QuestionsService', 'Notification', 'AttemptsService', 'ExamsService', 'EditionSectionsService', '$translate', '_'];

function CoursesStatsController($scope, $state, $window, Authentication, $timeout, edition, course,OptionsService, QuestionsService, Notification, AttemptsService,ExamsService ,EditionSectionsService, $translate, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;
    vm.sections = EditionSectionsService.surveyByCourse({editionId:vm.edition._id}, function( ) {
        _.each(vm.sections,function(section) {
             section.attempts =  AttemptsService.bySection({sectionId:section._id,editionId:vm.edition._id},function() {
                 section.attempts = _.filter(section.attempts,function(obj) {
                     return obj.status =='completed';
                 })
                 _.each(section.survey.questions,function(question) {
                    question.detail = QuestionsService.get({questionId:question.id});
                    question.options = OptionsService.byQuestion({questionId:question.id},function() {
                        _.each(question.options,function(option) {
                            option.count = 0;
                            _.each(section.attempts,function(attempt) {
                                _.each(attempt.answers,function(answer) {
                                    if (_.contains(answer.options,option._id))
                                        option.count++;
                                });
                            });
                            if (section.attempts.length)
                                option.percentage = Math.floor(option.count * 100 /section.attempts.length); 
                        });
                    }) 
                 });
             });
        });
    });
}
}());