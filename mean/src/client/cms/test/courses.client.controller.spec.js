describe("app module", function() {
  beforeEach(module("mean"));
  beforeEach(module("ngResource"));
  beforeEach(module("ngMessages"));
  beforeEach(module("ngSanitize"));
  beforeEach(module("ngFileUpload"));
  beforeEach(module("ui.router"));
  beforeEach(module("ui-notification"));
  beforeEach(module("ui.bootstrap"));
  beforeEach(module("pascalprecht.translate"));
  beforeEach(module("LocalStorageModule"));
  beforeEach(module("underscore"));
  beforeEach(module("datatables"));
  beforeEach(module("datatables.buttons"));
  beforeEach(module("kendo.directives"));
  beforeEach(module("ng.deviceDetector"));
  beforeEach(module("ngCsv"));
  beforeEach(module("ui.calendar"));
  beforeEach(module("easypiechart"));
  beforeEach(module("metricsgraphics"));

  describe("CoursesController", function() {
    beforeEach(module("cms"));
    var $controller, $scope, $state, $window, Authentication, $timeout, courseResolve, CoursesService, Notification, GroupsService,
      Upload, CompetenciesService, fileManagerConfig, $translate, _, CertificateTemplatesService;
    beforeEach(inject(function(_$controller_, _$rootScope_, _$state_, _$window_, _Authentication_, _$timeout_, _courseResolve_, _CoursesService_, _Notification_, _GroupsService_,
                               _Upload_, _CompetenciesService_, _fileManagerConfig_, _$translate_, _CertificateTemplatesServic_){
      $scope = $rootScope.$new();
      $state = _$state_;
      $window = _$window_;
      Authentication = _Authentication_;
      $timeout = _$timeout_;
      courseResolve = _courseResolve_;
      CoursesService = _CoursesService_;
      Notification = _Notification_;
      GroupsService = _GroupsService_;
      Upload = _Upload_;
      CompetenciesService = _CompetenciesService_;
      fileManagerConfig = _fileManagerConfig_;
      $translate = _$translate_;
      CertificateTemplatesService = _CertificateTemplatesServic_;
      spyOn($state, 'method');
      spyOn($window, 'method');
      spyOn(Authentication, 'method');
      spyOn($timeout, 'method');
      spyOn(courseResolve, 'method');
      spyOn(CoursesService, 'method');
      spyOn(Notification, 'method');
      spyOn(GroupsService, 'method');
      spyOn(Upload, 'method');
      spyOn(CompetenciesService, 'method');
      spyOn(fileManagerConfig, 'method');
      spyOn($translate, 'method');
      spyOn(CertificateTemplatesService, 'method');



      $controller = _$controller_('HomeController', { $scope: $scope, courseResolve: courseResolve});
    }));

    it("should assign CoursesController as test", function() {

      var vm = controller("CoursesController", { $scope: scope });

      expect(scope.test).toBe("any");
    });
  });
});
