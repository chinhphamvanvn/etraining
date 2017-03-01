(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesQuizSectionController', CoursesQuizSectionController);

CoursesQuizSectionController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'courseResolve', 'sectionResolve','editionResolve','quizResolve', 'Notification','QuestionsService','ExamsService', 'EditionSectionsService','$q','_'];

function CoursesQuizSectionController($scope, $state, $window, Authentication, $timeout, course, section, edition, quiz, Notification, QuestionsService, ExamsService, EditionSectionsService, $q, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.edition = edition;
    vm.section = section;
    vm.quiz = quiz;
    vm.addQuestion = addQuestion;
    vm.removeQuestion = removeQuestion;
    vm.moveUp = moveUp;
    vm.moveDown = moveDown;
    vm.update = update;
    vm.questions = [];

    _.each(vm.quiz.questions,function(q) {
        var question = QuestionsService.get({questionId:q.id},function() {
            question.order = q.order;
            vm.questions.push(question);
        });
    });

    function moveUp(question) {
        var prevQuestion = _.find(vm.questions,function(q) {
            return q.order < question.order;
        });
        if (prevQuestion) {
            var order = question.order;
            question.order = prevQuestion.order;
            prevQuestion.order = order;
        }
    }

    function moveDown(question) {
        var nextQuestion = _.find(vm.questions,function(q) {
            return q.order > question.order;
        });
        if (nextQuestion) {
            var order = question.order;
            question.order = nextQuestion.order;
            nextQuestion.order = order;
        }
    }

    function update() {
        vm.quiz.questions = _.map(vm.questions,function(obj) {
            return {id:obj._id,score:1,order:obj.order};
        });
        var allPromise = [];
        vm.section.html = null;
        vm.section.video = null;
        vm.section.quiz = vm.quiz._id;
        allPromise.push(vm.section.$update().$promise);
        allPromise.push(vm.quiz.$update().$promise);
        _.each(vm.questions,function(question) {
            allPromise.push(question.$update().$promise);
            _.each(question.options,function(option) {
                allPromise.push(option.$update().$promise);
            });
        });
        $q.all(allPromise).then(function() {
            $state.go('workspace.lms.courses.section.view.quiz',{courseId:vm.course._id,sectionId:vm.section._id});
        });
    }

    function addQuestion(type) {
        var question = new QuestionsService();
        question.type=type;
        question.$save(function() {
            if (vm.questions.length==0)
                question.order = vm.questions.length +1;
            else
                question.order =  _.max(vm.questions, function(o){return o.order;}).order+1;
            vm.questions.push(question);
        })
    }

    function removeQuestion(question) {
        if (question._id)  {
            QuestionsService.delete({questionId:question._id},function() {
                vm.questions = _.reject(vm.questions,function(o) {
                    return o._id == question._id;
                })
            })
        } else
            vm.questions = _.reject(vm.questions,function(o) {
                return o.order == question.order && !o._id;
            })
    }

}
}());
