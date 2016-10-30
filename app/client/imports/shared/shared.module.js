import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngComponentRouter  from 'ngcomponentrouter'
import angularTranslate from 'angular-translate'
import angularTranslateLoader from 'angular-translate-loader-static-files'
import {name as UnderscoreModule } from '/app/client/imports/shared/util/underscore.module';


export default  angular.module('SharedModule', 
							[
								angularMeteor,
								ngComponentRouter,
								angularTranslate,
								angularTranslateLoader,
								UnderscoreModule]) ;

