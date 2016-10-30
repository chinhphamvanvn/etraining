import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export var Lang = function (doc) {
  _.extend(this, doc);
};
export var Langs = new Mongo.Collection('core-langs', {
  transform: function (doc) { return new Lang(doc); }
});

Langs.schema = new SimpleSchema({
  code: {type: String},
  description: {type: String}
});

Langs.attachSchema(Langs.schema);
