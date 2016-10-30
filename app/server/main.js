import {installSetting,installLanguage} from './imports/install'; 


Meteor.startup(() => {
  installSetting();
  installLanguage();
});