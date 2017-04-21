(function(tinymce, FastClick) {
  'use strict';

  angular
    .module('core').constant('variables', {
      header_main_height: 48,
      easing_swiftOut: [0.4, 0, 0.2, 1],
      bez_easing_swiftOut: $.bez([0.4, 0, 0.2, 1])
    });

  angular
    .module('core').constant('fileManagerConfig', {
      skin_url: '/assets/skins/tinymce/material_design',
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste'
      ],
      toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
      file_picker_callback: function(callback, value, meta) {
        tinymce.activeEditor.windowManager.open({
          file: '/file_manager/fm_tinymce.html', // use an absolute path!
          title: 'File Manager',
          width: 920,
          height: 440,
          resizable: 'yes'
        }, {
          oninsert: function(file, elf) {
            var url,
              reg,
              info;
            // URL normalization
            url = file.url;
            reg = /\/[^/]+?\/\.\.\//;
            while (url.match(reg)) {
              url = url.replace(reg, '/');
            }
            // Make file info
            info = file.name + ' (' + elf.formatSize(file.size) + ')';
            // Provide file and text for the link dialog
            if (meta.filetype === 'file') {
              callback(url, {
                text: info,
                title: info
              });
            }
            // Provide image and alt text for the image dialog
            if (meta.filetype === 'image') {
              callback(url, {
                alt: info
              });
            }
            // Provide alternative source and posted for the media dialog
            if (meta.filetype === 'media') {
              callback(url);
            }
          }
        });
        return false;
      },
      csv_template: '/assets/csv/template_csv.csv',
      excel_template_list_question: '/assets/excel/template_excel_list_question.xlsx',
      excel_template_list_user: '/assets/excel/template_excel_list_user.xlsx',
      ceritficate_template_images: [
        {
          name: 'certificate',
          image: '/assets/img/certificate/certi1.png'
        },
        {
          name: 'certificate2',
          image: '/assets/img/certificate/certi2.png'
        },
        {
          name: 'certificate3',
          image: '/assets/img/certificate/certi3.png'
        },
        {
          name: 'certificate4',
          image: '/assets/img/certificate/certi4.png'
        }
      ]
    });

  angular
    .module('core')
    .run(windowConfig);

  windowConfig.$inject = ['$rootScope', '$state', '$stateParams', '$http', '$window', '$timeout', 'variables'];

  function windowConfig($rootScope, $state, $stateParams, $http, $window, $timeout, variables) {
    FastClick.attach(document.body);


    // modernizr
    $rootScope.Modernizr = Modernizr;

    // get window width
    var w = angular.element($window);
    $rootScope.largeScreen = w.width() >= 1220;
    $rootScope.$state = $state;
    w.on('resize', function() {
      $rootScope.largeScreen = w.width() >= 1220;
      return $rootScope.largeScreen;
    });

    // show/hide main menu on page load
    $rootScope.primarySidebarOpen = $rootScope.largeScreen;
    $rootScope.pageLoading = true;

    // wave effects
    $window.Waves.init();

  }
}(window.tinymce, window.FastClick));
