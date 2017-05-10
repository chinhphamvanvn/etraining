(function() {
  'use strict';

  // Focus the element on page load
  // Unless the user is on a small device, because this could obscure the page with a keyboard

  angular.module('shared')
    .directive('menuTreeView', ['GroupsService', '$timeout', 'menuService', 'treeUtils', '_', '$translate', menuTreeView]);

  function menuTreeView(GroupsService, $timeout, menuService, treeUtils, _, $translate) {
    return {
      scope: {
        treeId: '=',
        role: '=', // user, admin
        select: '=',
        menuItems: '=' // id of initial selected menu
      },
      templateUrl: '/src/client/shared/directives/menu-tree-view/menu-tree-view.client.view.html',
      link: function(scope, element, attributes) {
        var menu = menuService.getMenu('sidebar');
        var menuSections = _.filter(menu.items, function(item) {
          return (item.roles.indexOf('*') !== -1) || _.contains(item.roles, scope.role);
        });
        menuSections = _.sortBy(menuSections, function(menu) {
          return menu.position;
        });
        menuSections = _.map(menuSections, function(obj) {
          return {
            title: $translate.instant(obj.title),
            folder: true,
            expanded: true,
            key: obj.title,
            children: [],
            data: obj,
            selected: scope.menuItems && _.contains(scope.menuItems, obj.title)
          };
        });
        _.each(menuSections, function(section, index) {
          var subSections = _.filter(section.data.items, function(item) {
            return (item.roles.indexOf('*') !== -1) || _.contains(item.roles, scope.role);
          });
          subSections = _.sortBy(subSections, function(obj) {
            return obj.position;
          });
          subSections = _.map(subSections, function(obj) {
            return {
              title: $translate.instant(obj.title),
              folder: false,
              expanded: true,
              key: obj.title,
              children: [],
              data: obj,
              selected: scope.menuItems && _.contains(scope.menuItems, obj.title)
            };
          });
          if (subSections.length)
            section.children = subSections;
        });
        $timeout(function() {
          $('#' + scope.treeId).fancytree({
            checkbox: true,
            titlesTabbable: true,
            selectMode: 3,
            clickFolderMode: 3,
            imagePath: '/assets/icons/others/',
            extensions: ['wide'],
            autoScroll: true,
            generateIds: true,
            disabled: scope.disabled,
            source: menuSections,
            toggleEffect: {
              effect: 'blind',
              options: {
                direction: 'vertical',
                scale: 'box'
              },
              duration: 200
            },
            select: function(event, data) {
              scope.$apply(function() {
                var nodeIds = _.map(data.tree.getSelectedNodes(), function(obj) {
                  return obj.key;
                });
                if (scope.select)
                  scope.select(nodeIds);
              });
            }
          });
        });
        scope.$watch('menuItems', function() {
          _.each(menuSections, function(section) {
            section.selected = scope.menuItems && _.contains(scope.menuItems, section.key);
            _.each(section.children, function(obj) {
              obj.selected = scope.menuItems && _.contains(scope.menuItems, section.key);
            });
          });
          var tree = $('#' + scope.treeId).fancytree('getTree');
          tree.reload(menuSections);
        });
      }
    };
  }
}());
