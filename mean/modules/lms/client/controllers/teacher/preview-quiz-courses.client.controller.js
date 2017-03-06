(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesPreviewQuizController', CoursesPreviewQuizController);

CoursesPreviewQuizController.$inject = ['$scope', '$state', '$window', 'QuestionsService','ExamsService','AnswersService', 'OptionsService','EditionSectionsService','Authentication','AttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve','$timeout', '$interval','$translate', '$q','_'];

function CoursesPreviewQuizController($scope, $state, $window, QuestionsService,ExamsService,AnswersService,OptionsService,EditionSectionsService, Authentication, AttemptsService,edition, CoursesService, Notification, section,$timeout, $interval,$translate ,$q, _) {
    var vm = this;
    vm.edition = edition;
    vm.section = section;
   
    if (vm.section.quiz) {
        vm.quiz = ExamsService.get({examId:vm.section.quiz},function() {
            vm.remainTime = vm.quiz.duration*60 ;
            vm.intervalToken = $interval(updateClock,1000);
            
            var questionIds = _.pluck(vm.qzui.questions,'id');
            vm.questions = QuestionsService.byIds({questionIds:questionIds},function() {
               vm.index = 0;
               if (vm.questions.length>0)
                   selectQuestion(vm.index)
               else
                   vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');
            });
        });
  
    } else
        vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');
    
    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;
    vm.saveNext = saveNext;
    vm.savePrev = savePrev;  
    
    function updateClock() {
        vm.remainTime--;
        function pad(num) {
            return ("0"+num).slice(-2);
        }
        var hh = Math.floor(vm.remainTime / 3600);
        var mm = Math.floor((vm.remainTime - hh*3600 ) /60);
        var ss = Math.floor(vm.remainTime - hh*3600 - mm* 60);
        vm.timeString =  pad(hh)+":"+pad(mm)+":"+pad(ss);
    }
    
    function selectQuestion(index) {
        vm.question = vm.questions[index];
        vm.options =  OptionsService.byQuestion({questionId:vm.question._id}, function(){
        });
        if(!vm.question.options || vm.question.options.length == 0){
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
    function prevQuestion() {
        if (vm.index > 0 ) {
            vm.index--;
            selectQuestion(vm.index);
        }
    }
   
   
   function saveNext() {
     nextQuestion();
   }
   
   function savePrev() {
      prevQuestion();
   }
   
   
}
}());