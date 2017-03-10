(function() {
    'use strict';

// Courses controller
angular
    .module('lms')
    .controller('CoursesMaterialController', CoursesMaterialController);

CoursesMaterialController.$inject = ['$scope', '$state', '$window', 'Authentication', '$timeout', 'editionResolve','courseResolve','memberResolve', 'Notification', 'CourseEditionsService', 'CourseMaterialsService','$translate', '_'];

function CoursesMaterialController($scope, $state, $window, Authentication, $timeout, edition, course, member, Notification, CourseEditionsService,CourseMaterialsService ,$translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.edition = edition;
    vm.member = member;
    vm.course = course;
    vm.materials = CourseMaterialsService.byCourse({editionId:vm.edition._id},function(){
        _.map(vm.materials,function(material) {
            var namefile = material.filename.split('.');
            if(namefile[1] == 'png' || namefile[1] == 'jpeg' || namefile[1] == 'jpg' || namefile[1] == 'gif') {
                material.fileType = 'image'
            } else {
                if(namefile[1] == 'mp4' || namefile[1] == 'mp3' || namefile[1] == 'wmv'){
                    material.fileType = 'video'
                } else {
                    material.fileType = 'file'
                }
            }
        });
    });
    
    vm.edit =  edit;
    vm.remove = remove;
    vm.download = download;

    var progressbar = $("#file_upload-progressbar"),
    bar         = progressbar.find('.uk-progress-bar'),
    settings    = {

        action: '/api/materials/upload', // upload url
        param: 'newCourseMaterial',
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
            UIkit.modal.prompt($translate.instant('MODEL.MATERIAL.NAME')+':', '', function(val){
                var material = new CourseMaterialsService();
                material.edition = vm.edition._id;
                material.name = val;
                material.downloadURL = data.downloadURL;
                material.filename = data.filename;
                material.$save(function() {
                    var namefile = material.filename.split('.');
                    if(namefile[1] == 'png' || namefile[1] == 'jpeg' || namefile[1] == 'jpg' || namefile[1] == 'gif') {
                        material.fileType = 'image'
                    } else {
                        if(namefile[1] == 'mp4' || namefile[1] == 'mp3' || namefile[1] == 'wmv'){
                            material.fileType = 'video'
                        } else {
                            material.fileType = 'file'
                        }
                    }
                    vm.materials.push(material);
                })
            });
            
        }
    };

    var select = UIkit.uploadSelect($("#file_upload-select"), settings),
    drop   = UIkit.uploadDrop($("#file_upload-drop"), settings);
    
    function edit(material) {
        UIkit.modal.prompt($translate.instant('MODEL.MATERIAL.NAME')+':', '', function(val){
            material.name = val;
            material.$update();
        });
    }
    
    function remove(material) {
        material.$remove(function() {
            vm.materials = _.reject(vm.materials,function(m) {
                return m._id == material._id;
            })
        })
    }
    
    function download(material) {
        
    }
}
}());