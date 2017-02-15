(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesStudyQuizController', CoursesStudyQuizController);

CoursesStudyQuizController.$inject = ['$scope', '$state', '$window', 'QuestionsService','ExamsService','AnswersService', 'OptionsService','EditionSectionsService','Authentication','CourseAttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve','memberResolve','$timeout', '$interval','$translate', '$q','_'];

function CoursesStudyQuizController($scope, $state, $window, QuestionsService,ExamsService,AnswersService,OptionsService,EditionSectionsService, Authentication, CourseAttemptsService,edition, CoursesService, Notification, section,member,$timeout, $interval,$translate ,$q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;
    if (vm.section.quiz) {
        vm.quiz = ExamsService.get({examId:vm.section.quiz},function() {
            vm.attempts = CourseAttemptsService.byCourseAndMember({editionId:vm.edition._id,memberId:vm.member._id},function() {
                var attemptCount = _.filter(vm.attempts,function(att) {
                    return att.section == vm.section._id
                }).length;
                if (attemptCount > vm.quiz.maxAttempt && vm.quiz.maxAttempt > 0) {
                    vm.alert = $translate.instant('ERROR.COURSE_STUDY.MAX_ATTEMPT_EXCEED');
                } else {
                    vm.attempt = new CourseAttemptsService();
                    vm.attempt.section = vm.section._id;
                    vm.attempt.edition = vm.edition._id;
                    vm.attempt.member = vm.member._id;
                    vm.attempt.status = 'initial';
                    vm.attempt.$save();
                    vm.remainTime = vm.quiz.duration*60 ;
                    vm.timeoutToken = $timeout(function() {
                        vm.attempt.status ='completed';
                        vm.attempt.end = new Date();
                        vm.attempt.answers = _.pluck(vm.questions,'answer._id');
                        vm.attempt.$update();
                    },vm.remainTime*1000);
                    vm.intervalToken = $interval(updateClock,1000);
                    
                    var allPromise = [];
                    _.each(vm.quiz.questions,function(q,index) {
                        allPromise.push(QuestionsService.get({questionId:q.id}).$promise);
                     });
                    $q.all(allPromise).then(function(questions) {
                       vm.questions = questions; 
                       vm.index = 0;
                       if (vm.questions.length>0)
                           selectQuestion(vm.index)
                       else
                           vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');
                    });
                }
            });
        })
    } else
        vm.alert = $translate.instant('ERROR.COURSE_STUDY.QUESTION_NOT_FOUND');
    
    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;
    vm.saveNext = saveNext;
    vm.savePrev = savePrev;
    vm.submitQuiz = submitQuiz;
  
    
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
        if (!vm.question.answer) {
            vm.question.answer =  new AnswersService();
        }
        vm.options =  OptionsService.byQuestion({questionId:vm.question._id}, function(){
            _.each(vm.options,function(option) {
                var selected = vm.question.answer.option == option._id;
                var checked =  _.contains(vm.question.answer.options,option._id);
                option.selected = selected || checked;
            });
        });
        if (vm.question.answer.option || vm.question.answer.options)
            vm.question.attempted = true;
        else
            vm.question.attempted = false;
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
    
    function submitQuiz() {
        save(function() {
            UIkit.modal.confirm('Are you sure?', function(){ 
                vm.attempt.status ='completed';
                vm.attempt.end = new Date();
                vm.attempt.answers = _.pluck(vm.questions,'answer._id');
                vm.attempt.$update(function() {
                    $interval.cancel(vm.intervalToken);
                    $timeout.cancel(vm.timeoutToken);
                });
            });
        })
        
    }
   
   function saveNext() {
       save(function() {
           nextQuestion();
       })
   }
   
   function savePrev() {
       save(function() {
           prevQuestion();
       })
   }
   
   function save(callback) {
       var answer = vm.question.answer ;
       answer.question =  vm.question._id;
       answer.exam =  vm.quiz._id;
       if (vm.question.type=='sc' ) {
           var selectedOption = _.find(vm.options,function(option) {
               return option.selected;
           });
           if (!selectedOption) {
               Notification.error({message:'You must selected one option', title: '<i class="glyphicon glyphicon-remove"></i> Save answer error!' });
               return;
           }
           else
               answer.option = selectedOption._id;
       } 
       if (vm.question.type=='mc')  {
           var selectedOptions = _.filter(vm.options,function(option) {
               return option.selected;
           });
           if (selectedOptions.length)
               answer.options = _.pluck(selectedOptions,'_id');
       }
       if (answer._id) 
           answer.$update(function() {
               callback();
           });
       else
           answer.$save(function() {
               callback();
           })
   }
   
}
}());