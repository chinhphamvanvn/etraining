(function() {
  'use strict';

  // Open-text question

  angular.module('lms')
    .directive('groupQuestion', ['QuestionsService', 'fileManagerConfig', '_', groupQuestion]);

  function groupQuestion(QuestionsService, fileManagerConfig, _) {
    return {
      scope: {
        question: '=',
        answer: '=',
        shuffle: '=',
        subIndex: '=',
        mode: '=' // edit, view, study, result
      },
      templateUrl: '/src/client/lms/directives/questions/group-question/group-question.directive.client.view.html',
      link: function(scope, element, attributes) {
        scope.tinymce_options = fileManagerConfig;
        scope.$watch('question', function() {
          if (scope.question._id && scope.question.subQuestions && scope.question.subQuestions.length) {
            scope.question.subQuestions = QuestionsService.byIds({questionIds: scope.question.subQuestions}, function() {
              _.each(scope.question.subQuestions, function(q, index) {
                q.order = index + 1;
              });
              enterMode();
            });            
          }
          else {
            scope.question.subQuestions = [];
            enterMode();
          }
        });

        function enterMode() {
          switch (scope.mode) {
            case 'edit':
              scope.addQuestion = addQuestion;
              scope.removeQuestion = removeQuestion;
              scope.moveDown = moveDown;
              scope.moveUp = moveUp;
              break;
            case 'study':
              scope.$watch('subIndex', function() {
                if (typeof scope.subIndex !='undefined') {
                  scope.subQuestion = scope.question.subQuestions[+scope.subIndex];
                  scope.subAnswer = _.find(scope.answer.subAnswers, function(obj) {
                    return obj.question === scope.subQuestion._id;
                  });
                }
              });              
              break;
            case 'view':
              break;
            case 'result':
              markAnswerOption();
              break;
          }
        }
        
        function markAnswerOption() {
          _.each(scope.question.subQuestions, function(question) {
            question.answer = _.find(scope.answer.subAnswers, function(obj) {
              return obj.question === question._id;
            });
          });
        }

        function addQuestion(type) {
          var question = new QuestionsService();
          question.type = type;          
          question.$save(function() {           
            if (scope.question.subQuestions.length === 0)
              question.order = scope.question.subQuestions.length + 1;
            else
              question.order = _.max(scope.question.subQuestions, function(o) { return o.order;}).order + 1;
            scope.question.subQuestions.push(question);
          });
        }

        function removeQuestion(question) {          
          QuestionsService.delete({
            questionId: question._id
          }, function() {
            scope.question.subQuestions = _.reject(scope.question.subQuestions, function(obj) {
              return obj._id === question._id;
            });
            _.each(scope.question.subQuestions, function(obj, index) {
              obj.order = index +1;
            });
          });
        }
        
        function moveUp(question) {
          var prevQuestion = _.find(scope.question.subQuestions, function(q) {
            return q.order < question.order;
          });
          if (prevQuestion) {
            var order = question.order;
            question.order = prevQuestion.order;
            prevQuestion.order = order;
          }
        }

        function moveDown(question) {
          var nextQuestion = _.find(scope.question.subQuestions, function(q) {
            return q.order > question.order;
          });
          if (nextQuestion) {
            var order = question.order;
            question.order = nextQuestion.order;
            nextQuestion.order = order;
          }
        }
      
      }
    };
  }
}());
