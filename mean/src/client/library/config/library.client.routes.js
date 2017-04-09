(function() {
  'use strict';

  // Setting up route
  angular
    .module('library.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('admin.workspace.library', {
        url: '/library',
        abstract: true,
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.library.content', {
        url: '/content',
        abstract: true,
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.library.content.list', {
        url: '/list',
        templateUrl: '/src/client/library/views/list-contents.client.view.html',
        controller: 'LibraryContentsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.library.content.create', {
        url: '/create/:group',
        templateUrl: '/src/client/library/views/form-content.client.view.html',
        controller: 'LibraryContentController',
        controllerAs: 'vm',
        resolve: {
          mediaResolve: newMedia
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workspace.library.content.edit', {
        url: '/edit/:mediumId',
        templateUrl: '/src/client/library/views/form-content.client.view.html',
        controller: 'LibraryContentController',
        controllerAs: 'vm',
        resolve: {
          mediaResolve: getMedia
        },
        data: {
          roles: ['admin']
        }
      })
      .state('workspace.library', {
        url: '/library',
        templateUrl: '/src/client/library/views/library.client.view.html',
        controller: 'LibraryController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        }
      })
      .state('workspace.search', {
        url: '/search?keyword',
        templateUrl: '/src/client/library/views/library.client.view.html',
        controller: 'LibrarySearchController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        }
      })
    ;
  }

  getMedia.$inject = ['$stateParams', 'LibraryMediaService'];

  function getMedia($stateParams, LibraryMediaService) {
    return LibraryMediaService.get({
      mediumId: $stateParams.mediumId
    }).$promise;
  }

  newMedia.$inject = ['$stateParams', 'LibraryMediaService'];

  function newMedia($stateParams, LibraryMediaService) {
    var media = new LibraryMediaService();
    media.group = $stateParams.group;
    return media;
  }

}());
