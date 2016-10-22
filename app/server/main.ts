import { Meteor } from 'meteor/meteor';

import {initSetting} from '/server/imports/bootstrap/collection';
import '/server/imports/publications/setting.pub';

Meteor.startup(() => {
    initSetting();
});