import {Settings,Langs,Setting,Lang} from '/app/lib/collections'; 

class HomeComponent {
  constructor($scope,$translate) {

        Meteor.subscribe('settings', function() {
            let setting:Setting = Settings.findOne({'key':'site-language'});
            $translate.use(setting.value);
        });
    }
}

export default 
angular
	.module('homeComponent', [])
	.component('home', {
	  template: "{{lang}}",
	  controller:HomeComponent
	});

