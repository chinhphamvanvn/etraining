(function () {
  'use strict';

  angular
    .module('settings')
    .controller('AlertSettingsController', AlertSettingsController);

  AlertSettingsController.$inject = ['$scope', '$rootScope','$state', 'Authentication', 'SettingsService', '$timeout', '$window','$q', '_'];
  
  function AlertSettingsController($scope, $rootScope, $state, Authentication, SettingsService,$timeout,$window, $q, _) {
      var vm = this;
      vm.settings = SettingsService.query(function() {
          vm.alertUserCreate = _.find(vm.settings,function(setting) {
              return setting.code == 'ALERT_USER_CREATE';
          });
 
          vm.alertUserDelete = _.find(vm.settings,function(setting) {
              return setting.code == 'ALERT_USER_DELETE';
          });
          vm.alertMemberEnroll = _.find(vm.settings,function(setting) {
              return setting.code == 'ALERT_MEMBER_ENROLL';
          });
          vm.alertMemberWithdraw = _.find(vm.settings,function(setting) {
              return setting.code == 'ALERT_MEMBER_WIDTHDRAW';
          });
          vm.alertMemberComplete = _.find(vm.settings,function(setting) {
              return setting.code == 'ALERT_MEMBER_COMPLETE';
          });
          vm.alertThreadNew = _.find(vm.settings,function(setting) {
              return setting.code == 'ALERT_THREAD_NEW';
          });
          vm.alertReplyNew = _.find(vm.settings,function(setting) {
              return setting.code == 'ALERT_REPLY_NEW';
          });
          vm.alertCourseMaterialUpdate = _.find(vm.settings,function(setting) {
              return setting.code == 'ALERT_COURSE_MATERIAL_UPDATE';
          });
      }) 
      vm.saveSetting = saveSetting;

      
      function saveSetting() {
          var allPromise = [];
          _.each(vm.settings,function(setting) {
              allPromise.push(setting.$update().$promise);
          });

          $q.all(allPromise).then(function(response) {
              Notification.success({ message: '<i class="uk-icon-check"></i> Setting saved successfully!'     });
          },function(errorResponse) {
              Notification.error({ message: errorResponse.data.message, title: '<i class="uk-icon-ban"></i> Setting update error!' });
          });  
      }
   
   
  }
}());
