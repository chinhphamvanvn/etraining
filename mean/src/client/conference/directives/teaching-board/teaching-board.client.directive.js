(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('conference')
    .directive('teachingBoard', ['conferenceSocket', 'pdfDelegate', '$timeout', '$location', '_', teachingBoard]);

  function teachingBoard(conferenceSocket, pdfDelegate, $timeout, $location, _) {
    return {
      scope: {
        connected: '=',
        member: '='
      },
      templateUrl: '/src/client/conference/directives/teaching-board/teaching-board.client.view.html',
      link: function(scope, element, attributes) {
        scope.studentChannels = [];
        scope.showPresentation = false;
        scope.pdfUrl = '/assets/img/Intro.pdf';
        scope.zoom = 90;   
        scope.hidePresentation = function() {
          $timeout(function() {
            scope.showPresentation = false;
          }, 5000);
        }
        scope.pdfSwitchPage = function(offset) {
          var info = {
            currPage: 0,
            totalPages: pdfDelegate.$getByHandle('my-pdf-container').getPageCount()
          };
          if (offset == 1) {
            pdfDelegate.$getByHandle('my-pdf-container').next();
          } else {
            pdfDelegate.$getByHandle('my-pdf-container').prev();
          }
          getPageInfo();
          info.currPage = pdfDelegate.$getByHandle('my-pdf-container').getCurrentPage();
          sendMessage({
            id: 'presentation',
            event: 'switchPage',
            object: info
          });
        }
        function getPageInfo() {
          scope.currPage = pdfDelegate.$getByHandle('my-pdf-container').getCurrentPage();
          scope.totalPages = pdfDelegate.$getByHandle('my-pdf-container').getPageCount();
        }
        scope.zoomOut = function() {
          pdfDelegate.$getByHandle('my-pdf-container').zoomOut();
          scope.zoom = (scope.zoom === 50) ? 50 : (scope.zoom - 10);
        }

        scope.zoomIn = function() {
          pdfDelegate.$getByHandle('my-pdf-container').zoomIn();
          scope.zoom += 10;
        }
        scope.uploadPresentation = function(file) {
          if (!file) {
            return;
          }
        /*  $meeting.uploadPresentation({file:file},function(result) {
              if (result.status && result.data.status) {
                  console.log('url', result.data.url);
                   $scope.pdfUrl = result.data.url;
                   $scope.$apply();
                   pdfDelegate
                      .$getByHandle('my-pdf-container')
                      .load(result.data.url);
                  sendMessage({id:'presentation',event:'insertSlide',object:result.data.url});
              }
          })*/
        }
        conferenceSocket.onChannelList(function() {});
      }
    }
  }
}());
