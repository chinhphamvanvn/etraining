import angular from 'angular';
import { name as SharedModule} from './imports/shared/shared.module';
import { name as CoreModule } from './imports/core/core.module';

 
angular.module('eTraining', [SharedModule,CoreModule
])
.config(function($locationProvider,$translateProvider) {
  'ngInject';
  	$locationProvider.html5Mode(true);
  	$translateProvider.useStaticFilesLoader({   
	  prefix: '/i18n/',             
	  suffix: '.json'                           
	});                                         
	$translateProvider.preferredLanguage('en'); 
	$translateProvider.useLocalStorage();
})
.value('$routerRootComponent', 'app')
.component('app', {
    template: '<ng-outlet></ng-outlet>',
    $routeConfig: [
    	{path: '/',    name: 'Home',   component: 'home', useAsDefault: true}
  ]
  })
.run(function ($log) {
	'ngInject';
    $log.debug('Application started');
});