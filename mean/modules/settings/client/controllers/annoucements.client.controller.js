(function () {
  'use strict';

  // Annoucements controller
  angular
    .module('settings')
    .controller('AnnoucementsController', AnnoucementsController);

  AnnoucementsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'annoucementResolve','$translate'];

  function AnnoucementsController ($scope, $state, $window, Authentication, annoucement,$translate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.annoucement = annoucement;
    vm.error = null;
    vm.remove = remove;
    vm.save = save;
    
    var $basicValidate = $('#annoucement_form');
    
    $basicValidate
        .parsley()
        .on('form:validated',function() {
            $scope.$apply();
        })
        .on('field:validated',function(parsleyField) {
            if($(parsleyField.$element).hasClass('md-input')) {
                $scope.$apply();
            }
        });
    
    vm.tinymce_options = {
            skin_url: '/assets/skins/tinymce/material_design',
            plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table contextmenu paste"
            ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
            file_picker_callback : elFinderBrowser
        }

        function elFinderBrowser (callback, value, meta) {
            tinymce.activeEditor.windowManager.open({
                file: '/file_manager/fm_tinymce.html',// use an absolute path!
                title: 'File Manager',
                width: 920,
                height: 440,
                resizable: 'yes'
            }, {
                oninsert: function (file, elf) {
                    var url, reg, info;

                    // URL normalization
                    url = file.url;
                    reg = /\/[^/]+?\/\.\.\//;
                    while(url.match(reg)) {
                        url = url.replace(reg, '/');
                    }

                    // Make file info
                    info = file.name + ' (' + elf.formatSize(file.size) + ')';

                    // Provide file and text for the link dialog
                    if (meta.filetype == 'file') {
                        callback(url, {text: info, title: info});
                    }

                    // Provide image and alt text for the image dialog
                    if (meta.filetype == 'image') {
                        callback(url, {alt: info});
                    }

                    // Provide alternative source and posted for the media dialog
                    if (meta.filetype == 'media') {
                        callback(url);
                    }
                }
            });
            return false;
        }

    function remove() {
        UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
            vm.annoucement.$remove($state.go('admin.workspace.settings.annoucements.list'));
         });
    }

    function save() {

      // TODO: move create/update logic to service
      if (vm.annoucement._id) {
        vm.annoucement.$update(successCallback, errorCallback);
      } else {
        vm.annoucement.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('admin.workspace.settings.annoucements.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
