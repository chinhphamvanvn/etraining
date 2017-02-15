(function() {
    'use strict';

angular
    .module('lms')
    .filter('parentPost',['_', function (_) {
        return function (items ) {
            return _.filter(items,function(item) {
                return !item.parent;
            });
        }
    }]);

angular
.module('lms')
.filter('childPost',['_', function (_) {
    return function (items,post ) {
        return _.filter(items,function(item) {
            return item.parent && item.parent == post._id;
        });
    }
}]);

// Courses controller
angular
    .module('lms')
    .controller('CoursesForumController', CoursesForumController);

CoursesForumController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout','courseResolve','memberResolve', 'Notification', 'ForumTopicsService', 'ForumsService','ForumPostsService','$translate', '_'];

function CoursesForumController($scope, $state, $window, Authentication, $timeout, course, member, Notification, ForumTopicsService,ForumsService ,ForumPostsService, $translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.course = course;
    vm.member = member;
    vm.expand =  expand;
    vm.collapse =  collapse;
    vm.createTopic = createTopic;
    vm.editTopic = editTopic;
    vm.removeTopic = removeTopic;
    vm.replyTopic = replyTopic;
    vm.editPost = editPost;
    vm.removePost = removePost;
    vm.replyPost = replyPost;
    
    vm.createForum =  createForum;
    vm.forum = ForumsService.byCourse({courseId:vm.course._id},function() {
        vm.topics = ForumTopicsService.byForum({forumId:vm.forum._id});
    },function() {
        vm.alert = $translate.instant('ERROR.COURSE_FORUM_UNAVAILABLE');
    })
    
    function expand(topic) {
        topic.expand = true;
        topic.posts = ForumPostsService.byTopic({topicId:topic._id},function() {
            console.log(topic.posts);
        });
    }
    
    function collapse(topic) {
        topic.expand = false;
        topic.posts =[];
    }
    
    function editTopic(topic) {
        UIkit.modal.prompt($translate.instant('MODEL.TOPIC.CONTENT')+':', '', function(val){
            topic.content = val;
            topic.$update(function() {
                },function(errorResponse) {
                    Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Forum topic updated  error!' });
                });
            });
    }
    
    function removeTopic(topic) {
        UIkit.modal.confirm('Are you sure?', function(){ 
            topic.$remove(function() {
                $window.location.reload();
                },function(errorResponse) {
                    Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Forum topic removed  error!' });
                });
            });
    }

    function replyTopic(topic) {
        UIkit.modal.prompt($translate.instant('MODEL.POST.CONTENT')+':', '', function(val){
            var post = new ForumPostsService();
            post.content = val;
            post.topic = topic._id;
            post.$save(function() {
                expand(topic);
                },function(errorResponse) {
                    Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Forum podyrf created  error!' });
                });
            });
    }
    
    function editPost(post) {
        UIkit.modal.prompt($translate.instant('MODEL.POST.CONTENT')+':', '', function(val){
            post.content = val;
            post.$update(function() {
                },function(errorResponse) {
                    Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Forum post updated  error!' });
                });
            });
    }
    
    function removePost(post) {
        UIkit.modal.confirm('Are you sure?', function(){ 
            post.$remove(function() {
                $window.location.reload();
                },function(errorResponse) {
                    Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Forum post removed  error!' });
                });
            });
    }
    
    function replyPost(parentPost) {
        UIkit.modal.prompt($translate.instant('MODEL.POST.CONTENT')+':', '', function(val){
            var post = new ForumPostsService();
            post.content = val;
            post.topic = parentPost.topic;
            post.parent = parentPost;
            post.$save(function() {
                var topic = _.find(vm.topics,function(obj) {
                   return obj._id == parentPost.topic; 
                });
                expand(topic);
                },function(errorResponse) {
                    Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Forum podyrf created  error!' });
                });
            });
    }
    
    function createForum() {
        var forum = new ForumsService();
        forum.course = vm.course._id;
        forum.name = vm.course.name;
        forum.$save(function() {
            $window.location.reload();
        },function(errorResponse) {
            Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Forum activation  error!' });
        })
    }
    
    function createTopic() {
        UIkit.modal.prompt($translate.instant('MODEL.TOPIC.CONTENT')+':', '', function(val){
            var topic = new ForumTopicsService();
            topic.content = val;
            topic.forum = vm.forum._id;
            topic.$save(function() {
                $window.location.reload();
                },function(errorResponse) {
                    Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Forum topic created  error!' });
                });
            });
            
    }
    
}
}());