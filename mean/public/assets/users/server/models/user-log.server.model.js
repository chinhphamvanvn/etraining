'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * UserLog Schema
 */
var UserLogSchema = new Schema({
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  tag: {
      type: String,
      trim: true
  },
  type: {
      type: String,
      enum: ['success', 'info', 'warning', 'danger'],
      default: 'info'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var UserLog = mongoose.model('UserLog',UserLogSchema);

UserLogSchema.statics.register = function (user) {
    var log = new UserLog({title:'Authentication',tag:'REGISTER', content:'Register successfilly',type: 'success', user: user._id});
    log.save();
};

UserLogSchema.statics.login = function (user, success) {
    if (success) {
        var log = new UserLog({title:'Authentication', tag:'LOGIN',content:'Login successfilly',type: 'success', user: user._id});
        log.save();
    } else {
        var log = new UserLog({title:'Authentication', tag:'LOGIN_FAIL',content:'Login failed',type: 'warning', user: user._id});
        log.save();
    }
    
};

UserLogSchema.statics.logout = function (user) {
    var log = new UserLog({title:'Authentication', tag:'LOGOUT',content:'Logout',type: 'info', user: user._id});
    log.save();
};

UserLogSchema.statics.connectSocial = function (user,success) {
    if (success) {
        var log = new UserLog({title:'Profile', tag:'UPDATE',content:'Connect social account successfilly',type: 'success', user: user._id});
        log.save();
    } else {
        var log = new UserLog({title:'Profile', tag:'UPDATE_FAIL',content:'Connect social account failed',type: 'warning', user: user._id});
        log.save();
    }
};

UserLogSchema.statics.disconnectSocial = function (user,success) {
    if (success) {
        var log = new UserLog({title:'Profile', tag:'UPDATE',content:'Disconnect social account successfilly',type: 'success', user: user._id});
        log.save();
    } else {
        var log = new UserLog({title:'Profile', tag:'UPDATE_FAIL',content:'Disconnect social account failed',type: 'warning', user: user._id});
        log.save();
    }
};

UserLogSchema.statics.updateProfile = function (user,success) {
    if (success) {
        var log = new UserLog({title:'Profile', tag:'UPDATE', content:'Update profile successfilly',type: 'success', user: user._id});
        log.save();
    } else {
        var log = new UserLog({title:'Profile',  tag:'UPDATE_FAIL', content:'Update profile failed',type: 'warning', user: user._id});
        log.save();
    }
};

UserLogSchema.statics.updateProfileAvatar = function (user,success) {
    if (success) {
        var log = new UserLog({title:'Profile',  tag:'UPDATE', content:'Update profile avatar successfilly',type: 'success', user: user._id});
        log.save();
    } else {
        var log = new UserLog({title:'Profile',  tag:'UPDATE_FAIL', content:'Update profile avatar failed',type: 'warning', user: user._id});
        log.save();
    }
};

UserLogSchema.statics.forgotPassword = function (user) {
    var log = new UserLog({title:'Authentication',  tag:'FORGOT',content:'Request reset password',type: 'warning', user: user._id});
    log.save();
};

UserLogSchema.statics.changePassword = function (user,success) {
    if (success) {
        var log = new UserLog({title:'Authentication', tag:'CHANGE_PASS',content:'Change password successfilly',type: 'success', user: user._id});
        log.save();
    } else {
        var log = new UserLog({title:'Authentication', tag:'CHANGE_PASS_FAIL',content:'Change password failed',type: 'warning', user: user._id});
        log.save();
    }
};

