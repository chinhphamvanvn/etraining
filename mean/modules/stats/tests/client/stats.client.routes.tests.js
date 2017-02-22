(function () {
  'use strict';

  describe('Stats Route Tests', function () {
    // Initialize global variables
    var $scope,
      StatsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StatsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StatsService = _StatsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('stats');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/stats');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          StatsController,
          mockStat;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('stats.view');
          $templateCache.put('modules/stats/client/views/view-stat.client.view.html', '');

          // create mock Stat
          mockStat = new StatsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Stat Name'
          });

          // Initialize Controller
          StatsController = $controller('StatsController as vm', {
            $scope: $scope,
            statResolve: mockStat
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:statId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.statResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            statId: 1
          })).toEqual('/stats/1');
        }));

        it('should attach an Stat to the controller scope', function () {
          expect($scope.vm.stat._id).toBe(mockStat._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/stats/client/views/view-stat.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StatsController,
          mockStat;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('stats.create');
          $templateCache.put('modules/stats/client/views/form-stat.client.view.html', '');

          // create mock Stat
          mockStat = new StatsService();

          // Initialize Controller
          StatsController = $controller('StatsController as vm', {
            $scope: $scope,
            statResolve: mockStat
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.statResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/stats/create');
        }));

        it('should attach an Stat to the controller scope', function () {
          expect($scope.vm.stat._id).toBe(mockStat._id);
          expect($scope.vm.stat._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/stats/client/views/form-stat.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StatsController,
          mockStat;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('stats.edit');
          $templateCache.put('modules/stats/client/views/form-stat.client.view.html', '');

          // create mock Stat
          mockStat = new StatsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Stat Name'
          });

          // Initialize Controller
          StatsController = $controller('StatsController as vm', {
            $scope: $scope,
            statResolve: mockStat
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:statId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.statResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            statId: 1
          })).toEqual('/stats/1/edit');
        }));

        it('should attach an Stat to the controller scope', function () {
          expect($scope.vm.stat._id).toBe(mockStat._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/stats/client/views/form-stat.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
