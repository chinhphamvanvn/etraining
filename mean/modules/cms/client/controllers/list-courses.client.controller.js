(function () {
    'use strict';

    angular
      .module('cms')
      .controller('CmsCoursesListController', CmsCoursesListController);

    CmsCoursesListController.$inject = ['$scope', '$state', '$filter', '$compile','Authentication', 'CoursesService', '$timeout', '$location', '$window', 'GroupsService', 'DTOptionsBuilder','DTColumnBuilder', 'Notification','$q','treeUtils', '$translate', '_'];

    function CmsCoursesListController($scope,$state, $filter, $compile, Authentication, CoursesService, $timeout, $location, $window, GroupsService,DTOptionsBuilder, DTColumnBuilder, Notification, $q, treeUtils, $translate, _) {
      var vm = this;
      vm.remove = remove;
      vm.finishEditCourseTree =  finishEditCourseTree;
      vm.selectGroup = selectGroup;
      vm.courses = [];
      
      vm.dtOptions = DTOptionsBuilder.fromFnPromise(loadCourse).withOption('createdRow', function(row, data, dataIndex) {
              // Recompiling so we can bind Angular directive to the DT
              $compile(angular.element(row).contents())($scope);
          })
      .withPaginationType('full_numbers')
       .withDOM("<'dt-uikit-header'<'uk-grid'<'uk-width-medium-2-3'l><'uk-width-medium-1-3'f>>>" +
          "<'uk-overflow-container'tr>" +
          "<'dt-uikit-footer'<'uk-grid'<'uk-width-medium-3-10'i><'uk-width-medium-7-10'p>>>")
      .withButtons([                                 
                    {
                        extend:    'colvis',
                        text:      '<i class="uk-icon-file-pdf-o"></i> '+$translate.instant("ACTION.COLUMN"),
                        titleAttr: 'COL'
                    }
                ]);
      
      vm.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.COURSE.LOGO')).notSortable()
        .renderWith(function(data, type, full, meta) {
            return '<img class="img_thumb" src=\''+ data.logoURL + '\'  alt="" add-image-prop/>';
        }), 
          DTColumnBuilder.newColumn('name').withTitle($translate.instant('MODEL.COURSE.NAME')).withClass('withfix'),
          DTColumnBuilder.newColumn('code').withTitle($translate.instant('MODEL.COURSE.CODE')),
          DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.COURSE.DIFFICULTY'))
          .renderWith(function(data, type, full, meta) {
              if (data.level=='easy')
                  return $translate.instant('COMMON.DIFFICULTY.EASY');
              if (data.level=='medium')
                  return $translate.instant('COMMON.DIFFICULTY.MEDIUM');
              if (data.level=='hard')
                  return $translate.instant('COMMON.DIFFICULTY.HARD');
          }),
          DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.COURSE.GROUP'))
          .renderWith(function(data, type, full, meta) {
              if (data.group)
                  return data.group.name;
              else
                  return '';
          }).withClass('withfix'),
          DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.COURSE.MODEL'))
          .renderWith(function(data, type, full, meta) {
              if (data.model=='self-paced')
                  return $translate.instant('COMMON.COURSE_MODEL.SELF_STUDY');
              if (data.model=='group')
                  return $translate.instant('COMMON.COURSE_MODEL.GROUP_STUDY');
          }),
          DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.COURSE.ENROLL_STATUS')).notVisible()
          .renderWith(function(data, type, full, meta) {
              if (!data.enrollStatus)
                  return '<span class="uk-badge uk-badge-danger">Nok</span>';
              else
                  return '<span class="uk-badge uk-badge-success">Ok</span>';
          }),
          DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.COURSE.ENROLL_POLICY')).notVisible()
          .renderWith(function(data, type, full, meta) {
              if (data.enrollPolicy=='open')
                  return $translate.instant('COMMON.ENROLL_POLICY.OPEN');
              if (data.enrollPolicy=='censor')
                  return $translate.instant('COMMON.ENROLL_POLICY.CENSOR');
          }),
          DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.COURSE.PRESENT_MODE')).notVisible()
          .renderWith(function(data, type, full, meta) {
              if (data.displayMode=='open')
                  return $translate.instant('COMMON.PRESENT_MODE.ALL');
              if (data.displayMode=='login')
                  return $translate.instant('COMMON.PRESENT_MODE.LOGIN');
              if (data.displayMode=='enroll')
                  return $translate.instant('COMMON.PRESENT_MODE.ENROLLED');
          }),
          DTColumnBuilder.newColumn(null).withTitle($translate.instant('MODEL.COURSE.STATUS')).notVisible()
          .renderWith(function(data, type, full, meta) {
              if (data.status=='available')
                  return '<span class="uk-badge uk-badge-success">Available</span>';
              if (data.status=='draft')
                  return '<span class="uk-badge uk-badge-default">Draft</span>';
              if (data.status=='suspended')
                  return '<span class="uk-badge uk-badge-danger">Suspended</span>';
          }),       ,
          DTColumnBuilder.newColumn(null).withTitle($translate.instant('COMMON.ACTION')).notSortable()
          .renderWith(function(data, type, full, meta) {
              var action =
                  '<a class="md-btn md-btn-primary md-btn-mini md-btn-wave-light" ui-sref="admin.workspace.cms.course-members({courseId:\''+data._id+'\'})" > '+$translate.instant('ACTION.ENROLL')+'</a>' +
                  '<a  ui-sref="admin.workspace.cms.courses.edit({courseId:\''+data._id+'\'})" data-uk-tooltip="{pos:\'bottom\'}" title="'+$translate.instant('ACTION.EDIT') +'"><i class="md-icon material-icons">edit</i></a>' +
                  '<a ui-sref="admin.workspace.cms.courses.view({courseId:\''+data._id+'\'})" data-uk-tooltip="{pos:\'bottom\'}" title="'+$translate.instant('ACTION.VIEW') +'"><i class="md-icon material-icons">info_outline</i></a>' ;            
              return action;
          })
      ];
      vm.dtInstance = {};
      

      
     function finishEditCourseTree() {
         $window.location.reload();
     }
     
     function selectGroup(groups) {
         vm.groups = groups;
         if (groups && groups.length)
             vm.dtInstance.reloadData(function() {}, true);
     }
     
      function remove(id) {
          if (id == vm.course._id)
              return;
          UIkit.modal.confirm('Are you sure?', function(){
              CoursesService.remove({courseId:id},function () {
                  vm.reload = true;
                  vm.dtInstance.reloadData(function() {}, true);
                  Notification.success({ message: '<i class="uk-icon-check"></i> User deleted successfully!' });
                });
           });
      }
      
      function loadCourse() {        
          // perform some asynchronous operation, resolve or reject the promise when appropriate.
          return $q(function(resolve, reject) {
              var allPromise  = [];
              _.each(vm.groups,function(group) {
                 allPromise.push(CoursesService.byGroup({groupId:group}).$promise); 
              });
              var courseList = [];
              $q.all(allPromise).then(function(coursesArray) {
                  _.each(coursesArray,function(courses) {
                      courseList = courseList.concat(courses);
                  });
                  resolve(courseList);
              });
          });
      }
    }
    

  }());
