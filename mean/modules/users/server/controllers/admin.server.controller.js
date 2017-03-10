'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  async = require('async'),
  nodemailer = require('nodemailer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs'),
  multer = require('multer'),
  UserLog = mongoose.model('UserLog'),
  Setting = mongoose.model('Setting'),
  Message = mongoose.model('Message'),
  validator = require('validator');


var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};


exports.bulkCreate = function (req, res) {
    // For security measurement we remove the roles from the req.body object
    var users = req.body.users;
    var promises = [];
    _.each(users,function(user) {
        user.provider = 'local';
        user.roles = ['user'];
        if (!user.password)
            user.password = config.defaultPassword;
        user.displayName = user.firstName + ' ' + user.lastName;
        
        var promise =  new Promise(function (resolve, reject) {
            var newUser = new User(user);
            console.log(newUser);
            newUser.save(function (err) {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {     
                   resolve();
                }            
            });
        });
        promises.push(promise);
    });
    
    Promise.all(promises).then(
            function () 
            {
                res.json({success:true});
            },
            function (err) 
            {
                return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                  });
            });

}


exports.create = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  var user = new User(req.body);
  user.provider = 'local';
  if (!user.password)
      user.password = config.defaultPassword;
  user.displayName = user.firstName + ' ' + user.lastName;

  async.waterfall([
       // Create new user
       function (done) {
          // Then save the user
          user.save(function (err) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {     
               res.json(user);
               done(err,user);
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
               done(err, user);
           });
          
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
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.phone = req.body.phone;
  user.position = req.body.position;
  user.facebook = req.body.facebook;
  user.twitter = req.body.twitter;
  user.banned = req.body.banned;
  user.group = req.body.group;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
        UserLog.schema.statics.updateProfile(user,false);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    UserLog.schema.statics.updateProfile(user,true);
    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  async.waterfall([
                   // Create new user
                   function (done) {
                      // Then save the user
                       user.remove(function (err) {
                           if (err) {
                             return res.status(422).send({
                               message: errorHandler.getErrorMessage(err)
                             });
                           }
                           res.json(user);
                           done(err,user);
                         });
                   },
                   function (user, done) {
                       Setting.findOne({code:'ALERT_USER_DELETE'}).exec(function(err,setting) {
                           if (!err && setting && setting.valueBoolean)  {
                               User.find({roles:'admin'}).exec(function(err,users) {
                                   _.each(users,function(recipient) {
                                       var alert = new Message({title:'User account',content:'User ' + user.username +' has been deleted',level:'danger',type:'alert',recipient: recipient._id});
                                       alert.save();
                                   });
                               });
                           } 
                           done(err,user);
                       })
                       
                   },
                   function (user, done) {

                       var httpTransport = 'http://';
                       if (config.secure && config.secure.ssl === true) {
                         httpTransport = 'https://';
                       }
                       var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
                       res.render(path.resolve('modules/users/server/templates/user-removal-notification-email'), {
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
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').populate('group').exec(function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(users);
  });
};

exports.userByGroup = function (req, res) {
    User.find({group:req.group._id}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').populate('group').exec(function (err, users) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.json(users);
    });
  };

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};


exports.logs = function(req, res) {
    var user = req.model;
    UserLog.find({user:user._id}).sort('-created').limit( 10 ).exec(function(err, logs) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(logs);
      }
    });
  };
  

  /**
   * Update profile picture
   */
  exports.changeProfilePicture = function (req, res) {
    var user = req.model;
    var existingImageUrl;
    // Filtering to upload only images
    var multerConfig = config.uploads.profile.image;
    multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
    var upload = multer(multerConfig).single('newProfilePicture');

    if (user) {
      existingImageUrl = user.profileImageURL;
      uploadImage()
        .then(updateUser)
        .then(deleteOldImage)
        .then(function () {
          UserLog.schema.statics.updateProfileAvatar(user,true);
          res.json(user);
        })
        .catch(function (err) {
          UserLog.schema.statics.updateProfileAvatar(user,false);
          res.status(422).send(err);
        });
    } else {
      res.status(401).send({
        message: 'User not exist'
      });
    }

    function uploadImage () {
      return new Promise(function (resolve, reject) {
        upload(req, res, function (uploadError) {
          if (uploadError) {
            reject(errorHandler.getErrorMessage(uploadError));
          } else {
            resolve();
          }
        });
      });
    }

    function updateUser () {
      return new Promise(function (resolve, reject) {
        user.profileImageURL = config.uploads.profile.image.urlPaath + req.file.filename;
        user.save(function (err, theuser) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    function deleteOldImage () {
      return new Promise(function (resolve, reject) {
        if (existingImageUrl !== User.schema.path('profileImageURL').defaultValue) {
          fs.unlink(existingImageUrl, function (unlinkError) {
            if (unlinkError) {
              console.log(unlinkError);
              resolve();
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }
  };
