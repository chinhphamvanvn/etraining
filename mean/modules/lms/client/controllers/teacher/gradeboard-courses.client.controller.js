(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesGradeboardController', CoursesGradeboardController);

CoursesGradeboardController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve','memberResolve','gradeResolve', 'userResolve','Notification', 'CourseEditionsService', 'CertificatesService','CourseMembersService','$translate', '_'];

function CoursesGradeboardController($scope, $state, $window, Authentication, $timeout, edition, course, member, gradescheme, user, Notification, CourseEditionsService,CertificatesService, CourseMembersService ,$translate, _) {
    var vm = this;
    vm.course = course;
    vm.edition = edition;
    vm.member = member;
    vm.certify = certify;
    vm.user = user;
    
    vm.members = CourseMembersService.byCourse({courseId:vm.course._id},function() {
        vm.members = _.filter(vm.members,function(m) {
            return m.role=='student';
        });
        _.each(vm.members,function(member) {
            CertificatesService.byMember({memberId:member._id},function(certificate) {
                member.certificate =  certificate;
            },function() {
                member.certificate = null;
            })
        })
    } );
    vm.gradescheme = gradescheme;
    
    function certify(member) {
        var certificate = new CertificatesService();
        certificate.member = member._id;
        certificate.course = vm.course._id;
        certificate.edition = vm.edition._id;
        certificate.issueDate = new Date();
        certificate.authorizer = vm.user._id;
        certificate.$save();
    }
}
}());