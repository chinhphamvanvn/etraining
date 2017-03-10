'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  nodemailer = require('nodemailer'),
  User = mongoose.model('User'),
  Setting = mongoose.model('Setting'),
  Message = mongoose.model('Message'),
  UserLog = mongoose.model('UserLog');


var smtpTransport = nodemailer.createTransport(config.mailer.options);

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  async.waterfall([
       // Create new user
       function (done) {
           Setting.findOne({code:'REGISTER_GROUP'}).exec(function(err,setting) {
               if (!err && setting && setting.valueString)  {
                   done(err, setting.valueString);
               } else
                   done(null)
           })
       },
       function (defaultGroup,done) {
        // Init user and add missing fields
           var user = new User(req.body);
           user.provider = 'local';
           user.displayName = user.firstName + ' ' + user.lastName;
           if (!user.group)
               user.group = defaultGroup;
           // Then save the user
           user.save(function (err) {
             if (err) {
               return res.status(422).send({
                 message: errorHandler.getErrorMessage(err)
               });
             } else {
               // Remove sensitive data before login
               user.password = undefined;
               user.salt = undefined;
               UserLog.schema.statics.register(user);
               req.login(user, function (err) {
                 if (err) {
                   res.status(400).send(err);
                 } else {
                   res.json(user);
                   done(err, user);
                 }
               });
             }
           });
       },
       function (user, done) {
           Setting.findOne({code:'ALERT_USER_CREATE'}).exec(function(err,setting) {
               if (!err && setting && setting.valueBoolean)  {
                   User.find({roles:'admin'}).exec(function(err,users) {
                       _.each(users,function(recipient) {
                           var alert = new Message({title:'User account',content:'User ' + user.username +' has been created',level:'success',type:'alert',recipient: recipient._id});
                           alert.save();
                       });
                   });
               } 
           });
           done(err, user);
       },
       function (user, done) {

           var httpTransport = 'http://';
           if (config.secure && config.secure.ssl === true) {
             httpTransport = 'https://';
           }
           var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
           res.render(path.resolve('modules/users/server/templates/user-registeration-welcome-email'), {
             name: user.displayName,
             appName: config.app.title
           }, function (err, emailHTML) {
             done(err, emailHTML, user);
           });
         },
         // If valid email, send reset email using service
         function (emailHTML, user, done) {
           var mailOptions = {
             to: user.email,
             from: config.mailer.from,
             subject: 'Welcome to e-Training',
             html: emailHTML
           };
           smtpTransport.sendMail(mailOptions, function (err) {
             if (!err) {
               res.send({
                 message: 'An email has been sent to the provided email with further instructions.'
               });
             } else {
               return res.status(400).send({
                 message: 'Failure sending email'
               });
             }

             done(err);
           });
         }
     ], function (err) {
      if (err) {
          return next(err);
        }
      });
  
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          UserLog.schema.statics.login(user,false);
          res.status(400).send(err);
        } else {
          UserLog.schema.statics.login(user,true);
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  UserLog.schema.statics.logout(req.user);
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    if (req.query && req.query.redirect_to)
      req.session.redirect_to = req.query.redirect_to;

    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

    // info.redirect_to contains inteded redirect path
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          UserLog.schema.statics.login(user,false);
          return res.redirect('/authentication/signin');
        }
        UserLog.schema.statics.login(user,true);
        return res.redirect(info.redirect_to || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  // Setup info object
  var info = {};

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1)
    info.redirect_to = req.session.redirect_to;

  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // Email intentionally added later to allow defaults (sparse settings) to be applid.
            // Handles case where no email is supplied.
            // See comment: https://github.com/meanjs/mean/pull/1495#issuecomment-246090193
            user.email = providerUserProfile.email;

            // And save the user
            user.save(function (err) {
              UserLog.schema.statics.connectSocial(user,true);
              return done(err, user, info);
            });
          });
        } else {
          return done(err, user, info);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        UserLog.schema.statics.connectSocial(user,true);
        return done(err, user, info);
      });
    } else {
      UserLog.schema.statics.connectSocial(user,false);
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      UserLog.schema.statics.disconnectSocial(user,false);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      UserLog.schema.statics.connectSocial(user,true);
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
