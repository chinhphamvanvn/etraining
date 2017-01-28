(function () {
    'use strict';
    

    angular
      .module('lms')
      .controller('CourseGradebooksListController', CourseGradebooksListController);

    CourseGradebooksListController.$inject = ['$scope', '$state', '$filter', '$compile','Authentication', 'UsersService','GroupsService', 'courseResolve', '$timeout', '$location', '$window', 'DTOptionsBuilder','DTColumnDefBuilder', 'Notification','$q','CourseMembersService','ClassroomsService', '$translate','treeUtils', '_'];

    function CourseGradebooksListController($scope,$state, $filter, $compile, Authentication, AdminService, GroupsService, course, $timeout, $location, $window,DTOptionsBuilder, DTColumnDefBuilder, Notification, $q, CourseMembersService,ClassroomsService, $translate,treeUtils, _) {
      var vm = this;
      vm.course = course;
      vm.classroom = new ClassroomsService();
      vm.users = AdminService.query(function() {
          vm.displayUsers = vm.users;
      });
      vm.selectTeachers = selectTeachers;
      vm.selectStudents = selectStudents
      vm.suspend = suspend;
      vm.activate = activate;
      vm.remove = remove;
      vm.addClassroom = addClassroom;
      vm.displayUsers = [];
      vm.dtTeacherOptions = DTOptionsBuilder.newOptions()
          .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'p><'uk-width-medium-1-3'f>>>" +
        "<'uk-overflow-container'tr>" +
        "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'l>>>");
      vm.dtStudentOptions = DTOptionsBuilder.newOptions()
         .withDOM("<'uk-overflow-container'tr>" +
        "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-5-10'p><'uk-width-medium-5-10'f>><'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'l>>>");
    
      $timeout(function() {

          var $class_start = $('#uk_class_start'),
          $class_end = $('#uk_class_end');
    
          var start_date = UIkit.datepicker($class_start, {
              format: 'DD.MM.YYYY'
          });
        
          var end_date = UIkit.datepicker($class_end, {
              format: 'DD.MM.YYYY'
          });
          $class_start.on('change', function() {
              end_date.options.minDate = $class_start.val();
              vm.classroom.startDate = moment($class_start.val(),'DD.MM.YYYY');
          });
    
          $class_end.on('change', function() {
              start_date.options.maxDate = $class_end.val();
              vm.classroom.endDate = moment($class_end.val(),'DD.MM.YYYY');
          });
      },1000);
    
      
      vm.groups = [];
      vm.groups = GroupsService.listOrganizationGroup( function() {
          var tree = treeUtils.buildTree(vm.groups);
          $timeout(function() {
              $("#orgTree").fancytree({
                  checkbox: true,
                  titlesTabbable: true,
                  selectMode:2,
                  clickFolderMode:3,
                  imagePath: "/assets/icons/others/",
                  autoScroll: true,
                  generateIds: true,
                  source: tree,
                  toggleEffect: { effect: "blind", options: {direction: "vertical", scale: "box"}, duration: 200 },
                  select: function(event, data) {
                      // Display list of selected nodes
                      vm.groups = _.map( data.tree.getSelectedNodes(), function(obj) {
                          return obj.data._id;
                      });
                      vm.displayUsers = _.filter(vm.users,function(user) {
                          if (vm.groups.length==0)
                              return user;
                          if (user.group) {
                              var exist = _.contains(vm.groups,user.group._id) ;
                              if (exist)
                                  return user;
                              else
                                  return null;
                          } else
                              return null;
                      });  
                      $scope.$apply();
                  }
              });
          });
     }); 
        
      CourseMembersService.byCourse({courseId:vm.course._id},function(data) {
          vm.teachers = _.filter(data,function(item) {
              return item.role=='teacher';
          });
          vm.students = _.filter(data,function(item) {
              return item.role=='student';
          });
      });
      
      vm.classConfig = {
          create: false,
          maxItems: 1,
          valueField: 'value',
          labelField: 'title'
      };
      vm.classOptions = [];
      
      vm.classes = ClassroomsService.byCourse({courseId:vm.course._id},function() {
          vm.classOptions = _.map(vm.classes, function(obj) {
              return {
                  id: obj._id,
                  title: obj.name,
                  value: obj._id
              }
          });
          _.each(vm.classes,function(classroom) {
             var now = new Date();
             var startDate = classroom.startDate  ? new Date(classroom.startDate):null;
             var endDate = classroom.endDate  ? new Date(classroom.endDate):null;
             if (startDate) {
                 if (startDate.getTime() > now.getTime())
                     classroom.titleClass ='uk-accordion-title-warning';
                 else if (endDate) {
                     if (endDate.getTime() > now.getTime())
                         classroom.titleClass ='uk-accordion-title-primary';
                     else
                         classroom.titleClass ='uk-accordion-title-success';
                 } else
                     classroom.titleClass ='uk-accordion-title-primary';
             } else {
                 if (endDate) {
                     if (endDate.getTime() > now.getTime())
                         classroom.titleClass ='uk-accordion-title-primary';
                     else
                         classroom.titleClass ='uk-accordion-title-success';
                 } else
                     classroom.titleClass ='';
             }
          });
      });
      
      function remove(member) {
          UIkit.modal.confirm('Are you sure?', function() {
              member.$remove(function() {
                  if (member.role=='teacher')
                      vm.teachers = _.reject(vm.teachers,function(item) {
                          return item._id==member._id;
                      });
                  if (member.role=='student')
                      vm.students = _.reject(vm.students,function(item) {
                          return item._id==member._id;
                      });
              });
          });
      }
      
     function selectTeachers() {
         _.each(vm.displayUsers,function(user) {
             if (user.selectedAsTeacher) {
                 user.selectedAsTeacher = false;
                 var exist = _.find(vm.teachers,function(teacher) {
                     return teacher.member._id == user._id;
                 });
                 if (!exist) {
                     var member = new CourseMembersService();
                     member.member = user._id;
                     member.registerAgent = Authentication.user._id;
                     member.course = vm.course._id;
                     member.status = 'active';
                     member.role = 'teacher';
                     member.registered = new Date();
                     member.$save(function() {
                         vm.teachers.push(member);
                     })
                 }
             }
         })
     }
     
     function selectStudents() {
         _.each(vm.displayUsers,function(user) {
             if (user.selectedAsStudent) {
                 user.selectedAsStudent = false;
                 var exist = _.find(vm.students,function(student) {
                     return student.member._id == user._id && student.enrollmentStatus!='completed';
                 });
                 if (!exist) {
                     var member = new CourseMembersService();
                     member.course = vm.course._id;
                     member.member = user._id;
                     if (vm.selectedClass)
                         member.classroom = vm.selectedClass;
                     member.registerAgent = Authentication.user._id;
                     member.status = 'active';
                     member.enrollmentStatus ='registered';
                     member.role = 'student';
                     member.registered = new Date();
                     member.$save(function() {
                         Notification.success({ message: '<i class="uk-icon-check"></i> Member '+member.user.displayName + 'enroll successfully!'});
                         vm.students.push(member);
                     }, function(errorResponse) {
                         Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Member '+user.displayName + 'failed to enroll successfully!' });
                     });
                 }
             }
         })
     }
     
     function addClassroom() {
         vm.classroom.course = vm.course._id;
         vm.classroom.$save(function() {
             Notification.success({ message: '<i class="uk-icon-check"></i> Class saved successfully!'});
             vm.classes.push(vm.classroom);
             vm.classroom =  new ClassroomsService();
         }, function(errorResponse) {
             Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Class saved failed!' });
         });
     }
     
     function suspend(member) {
         if (member.status=='withdrawn') {
             Notification.error({ message: '<i class="uk-icon-ban"></i> Cannot suspend withdraw member!' });
             return;
         }
         if (member.enrollmentStatus=='completed') {
             Notification.error({ message: '<i class="uk-icon-ban"></i> Cannot suspend member which completed the course!' });
             return;
         }
         member.status = 'suspended';
         member.$update(
           function() {
             Notification.success({ message: '<i class="uk-icon-check"></i> Member suspend successfully!'})},
           function() {
             Notification.success({ message: '<i class="uk-icon-check"></i> Member suspend failed!' });
         })
     }
     
     function activate(member) {
         if (member.status=='withdrawn') {
             Notification.error({ message: '<i class="uk-icon-ban"></i> Cannot activate withdraw member!' });
             return;
         }
         if (member.enrollmentStatus=='completed') {
             Notification.error({ message: '<i class="uk-icon-ban"></i> Cannot activate member which completed the course!' });
             return;
         }
         member.status = 'active';
         member.$update(
           function() {
             Notification.success({ message: '<i class="uk-icon-check"></i> Member activate successfully!'})},
           function() {
             Notification.success({ message: '<i class="uk-icon-check"></i> Member activate failed!' });
         })
     }     
  }
    
    

  }());
