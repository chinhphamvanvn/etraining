(function () {
    'use strict';

    angular
      .module('library')
      .controller('LibraryContentController', LibraryContentController);

    LibraryContentController.$inject = [ '$scope', '$state', '$stateParams', '$timeout', '$location', '$window', 'mediaResolve','Upload', 'Notification','LibraryMediaService', 'treeUtils','$q', '_'];

    function LibraryContentController( $scope, $state, $stateParams, $timeout, $location, $window, media, Upload, Notification, LibraryMediaService, treeUtils,$q, _) {
      var vm = this;
      vm.media = media;
      vm.save = save;
      
      var progressbar = $("#file_upload-progressbar"),
      bar         = progressbar.find('.uk-progress-bar'),
      settings    = {
          
          action: '/api/media/upload', // upload url
          param: 'newMediaContent',
          method: 'POST',


          loadstart: function() {
              bar.css("width", "0%").text("0%");
              progressbar.removeClass("uk-hidden");
          },

          progress: function(percent) {
              percent = Math.ceil(percent);
              bar.css("width", percent+"%").text(percent+"%");
          },

          allcomplete: function(response) {

              bar.css("width", "100%").text("100%");

              setTimeout(function(){
                  progressbar.addClass("uk-hidden");
              }, 250);
              var data = JSON.parse(response);
              vm.media.contentURL = data.downloadURL;
              vm.media.filename = data.filename;
          }
      };

      var select = UIkit.uploadSelect($("#file_upload-select"), settings),
      drop   = UIkit.uploadDrop($("#file_upload-drop"), settings);
     
      
      function save() {
          saveMedia()
          .then(saveImage)
          .then(function() {
              Notification.success({ message: '<i class="uk-icon-ok"></i> Library item saved successfully!' });
              $state.go('admin.workspace.library.content.list');
          },function(errorResponse) {
              Notification.error({ message: '<i class="uk-icon-ban"></i> Library item saved error!' });
             // $state.go('admin.workspace.library.content.list');
          });
          
      }
      
      function saveMedia() {
          return $q(function(resolve, reject) {
              if (vm.media._id) {
                  vm.media.$update(function () {
                      resolve();
                  },function() {
                      reject();
                  });
              } else {
                  vm.media.$save(function () {
                      resolve();
                  },function() {
                      reject();
                  });
              }
          });
      }
      
      function saveImage() {
          return $q(function(resolve, reject) {
              if (!vm.mediaImage) 
                  resolve();
              else {
                  Upload.upload({
                      url: '/api/media/'+vm.media._id+'/image',
                      data: {
                        newMediaImage: vm.mediaImage
                      }
                    }).then(function(response) {
                        resolve();
                    },function(errorResponse) {
                        resolve();
                    }); 
              }
          });
      }
    

    }
  }());

