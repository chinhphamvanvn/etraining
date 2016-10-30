import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export var Setting = function (doc) {
  _.extend(this, doc);
};
export var Settings = new Mongo.Collection('core-settings', {
  transform: function (doc) { return new Setting(doc); }
});

Settings.schema = new SimpleSchema({
  key: {type: String},
  value: {type: String,optional: true},
  group: {type: String},
  pack: {type: String,optional: true},
  order: {type: Number, defaultValue: 1}
});

Settings.attachSchema(Settings.schema);

if (Meteor.isServer) {
	Meteor.publish("settings", function () {
  		return Settings.find({});
});
}



