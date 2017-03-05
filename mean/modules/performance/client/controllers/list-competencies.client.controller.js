(function () {
  'use strict';

  angular
    .module('performance')
    .controller('CompetencyListController', CompetencyListController);

  CompetencyListController.$inject = ['$scope', '$rootScope','$state', 'Authentication','GroupsService','CompetenciesService', '$timeout', '$window', 'treeUtils','$translate', '_'];
  
  function CompetencyListController($scope, $rootScope, $state, Authentication, GroupsService, CompetenciesService, $timeout, $window, treeUtils,$translate, _) {
    var vm = this;
    vm.authentication = Authentication;
    vm.finishEditCompetencyTree = finishEditCompetencyTree;
    vm.createCompetency = createCompetency;
    vm.remove = remove;
    vm.selectGroup = selectGroup;
    
    function selectGroup(groups) {
        vm.groups = groups;
        vm.competencies  = [];
        _.each(vm.groups,function(group) {
            CompetenciesService.byGroup({groupId:group},function(skills) {
                vm.competencies = vm.competencies.concat(skills); 
            })
        })
    }
    
    function finishEditCompetencyTree() {
        $window.location.reload();
    }
    
    
    function createCompetency(type) {
        if (!vm.groups) {
            UIkit.modal.alert($translate.instant('ERROR.COMPETENCY.EMPTY_COMPETENCY_GROUP'));
            return;
        }
        var skill =  new CompetenciesService();
        skill.group = vm.groups[0];
        skill.gradeModel = type;
        skill.$save(function() {
            $state.go('admin.workspace.performance.competency.edit',{competencyId:skill._id})
        });
        
         
    }
    
    function remove(skill) {
        UIkit.modal.confirm($translate.instant('COMMON.CONFIRM_PROMPT'), function() {
                skill.$remove(function() {
                    vm.competencies = _.reject(vm.competencies ,function(competency) {
                        return competency._id == skill._id;
                    })
                });
            });
    }
   
  }
}());
