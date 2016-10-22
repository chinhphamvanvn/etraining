import { Mongo } from 'meteor/mongo'
import { MongoObservable } from 'meteor-rxjs';
import { Setting } from '/lib/models';

export const Settings = new Mongo.Collection<Setting>('settings');
export const SettingStream = new MongoObservable.Collection(Settings);


