(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesPreviewSurveyController', CoursesPreviewSurveyController);

CoursesPreviewSurveyController.$inject = ['$scope', '$state', '$window', 'QuestionsService','ExamsService','AnswersService', 'OptionsService','EditionSectionsService','Authentication','AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve','$timeout', '$interval','$translate', '$q','_'];

function CoursesPreviewSurveyController($scope, $state, $window, QuestionsService,ExamsService,AnswersService,OptionsService,EditionSectionsService, Authentication, AttemptsService,edition, CoursesService, Notification, section,$timeout, $interval,$translate ,$q, _) {
    var vm = this;
    vm.edition = edition;
    vm.section = section;
   
    if (vm.section.survey) {
        vm.survey = ExamsService.get({examId:vm.section.survey},function() {            
            var allPromise = [];
            _.each(vm.survey.questions,function(q,index) {
                allPromise.push(QuestionsService.get({questionId:q.id}).$promise);
             });
            $q.all(allPromise).then(function(questions) {
               vm.questions = questions; 
               vm.index = 0;
               if (vm.questions.length>0)
                   selectQuestion(vm.index)
               else
                   vm.alert = $translate.instant('ERROR.COURSE_SURVEY.QUESTION_NOT_FOUND');
            });
        });
  
    } else
        vm.alert = $translate.instant('ERROR.COURSE_SURVEY.QUESTION_NOT_FOUND');
    
    vm.nextQuestion = nextQuestion;
    vm.saveNext = saveNext;

    
    function selectQuestion(index) {
        vm.question = vm.questions[index];
        vm.options =  OptionsService.byQuestion({questionId:vm.question._id}, function(){
        });
        if(!vm.question.options || vm.question.options.length == 0) {
          vm.question.options = vm.options;
          _.map(vm.question.options, function(item) {
            item.isCorrect = false;
          });
        }
    }
    
    function nextQuestion() {
        if (vm.index +1 <vm.questions.length) {
            vm.index++;
            selectQuestion(vm.index);
        }
    }

   
   function saveNext() {
     nextQuestion();
   }
   

   
   
}
}());