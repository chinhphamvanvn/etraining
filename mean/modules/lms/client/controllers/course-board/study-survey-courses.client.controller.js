(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesStudySurveyController', CoursesStudySurveyController);

CoursesStudySurveyController.$inject = ['$scope', '$state', '$window', 'QuestionsService','ExamsService','AnswersService', 'OptionsService','EditionSectionsService','Authentication','CourseAttemptsService', 'editionResolve', 'CoursesService', 'Notification', 'sectionResolve','memberResolve','$timeout', '$interval','$translate', '$q','_'];

function CoursesStudySurveyController($scope, $state, $window, QuestionsService,ExamsService,AnswersService,OptionsService,EditionSectionsService, Authentication, CourseAttemptsService,edition, CoursesService, Notification, section,member,$timeout, $interval,$translate ,$q, _) {
    var vm = this;
    vm.edition = edition;
    vm.member = member;
    vm.section = section;
    if (vm.member.enrollmentStatus=='completed') {
        vm.alert = $translate.instant('ERROR.COURSE_STUDY.COURSE_ALREADY_COMPLETE');
        return;
    }
    if (vm.section.survey) {
        vm.survey = ExamsService.get({examId:vm.section.survey},function() {
            vm.attempts = CourseAttemptsService.byCourseAndMember({editionId:vm.edition._id,memberId:vm.member._id},function() {
                var attemptCount = _.filter(vm.attempts,function(att) {
                    return att.section == vm.section._id && att.status=='completed';
                }).length;
                if (attemptCount >= vm.survey.maxAttempt && vm.survey.maxAttempt > 0) {
                    vm.alert = $translate.instant('ERROR.COURSE_SURVEY.MAX_ATTEMPT_EXCEED');
                } else {
                    vm.attempt = _.find(vm.attempts,function(att) {
                        return att.section == vm.section._id && att.status=='initial';
                    });
                    if (!vm.attempt) {
                        vm.attempt = new CourseAttemptsService();
                        vm.attempt.section = vm.section._id;
                        vm.attempt.edition = vm.edition._id;
                        vm.attempt.member = vm.member._id;
                        vm.attempt.status = 'initial';
                        vm.attempt.$save();
                    }
                 
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
                }
            });
        })
    } else
        vm.alert = $translate.instant('ERROR.COURSE_SURVEY.QUESTION_NOT_FOUND');
    
    vm.nextQuestion = nextQuestion;
    vm.prevQuestion = prevQuestion;
    vm.saveNext = saveNext;
    vm.savePrev = savePrev;
    vm.submitQuiz = submitQuiz;
    vm.selectOption = selectOption;
 
    
    function selectOption(option,question) {
        if (vm.question.type=='sc') {
            _.each(question.options,function(obj) {
               obj.selected = false; 
            });
            option.selected = true;
        }
    }
    
    function selectQuestion(index) {
        vm.question = vm.questions[index];
        if (!vm.question.answer) {
            vm.question.answer =  new AnswersService();
        }
        if (!vm.question.options) {
            vm.question.options =  OptionsService.byQuestion({questionId:vm.question._id}, function(){
                _.each(vm.question.options ,function(option) {
                    option.selected = _.contains(vm.question.answer.options,option._id)
                });
            });
        } 
        
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
                vm.attempt.answers = _.map(vm.questions,function(obj) {
                    return obj.answer._id;
                });
                vm.attempt.$update(function() {
                    $scope.$parent.nextSection();
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
       answer.exam =  vm.survey._id;
       if (vm.question.type=='mc' || vm.question.type=='sc')  {
           var selectedOptions = _.filter(vm.question.options,function(option) {
               return option.selected;
           });
           answer.options = _.pluck(selectedOptions,'_id');
           answer.isCorrect =  _.filter(vm.question.options,function(option) {
               return option.isCorrect && !option.selected;
           }).length==0;
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
   
   vm.nextSection = $scope.$parent.nextSection;
   vm.prevSection = $scope.$parent.prevSection;
   
}
}());